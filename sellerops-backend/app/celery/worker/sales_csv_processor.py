import pandas as pd
from pathlib import Path

from app.celery.celery_app import celery_app
from app.db.database import SessionLocal
from app.db.models.chat_message import ChatMessage
from app.db.models.sale import Sale
from app.db.models.upload import Upload


@celery_app.task(
    name="process_sales_csv",
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=5,
    retry_kwargs={"max_retries": 3},
)
def process_sales_csv(self, upload_id: int):
    print("✅ CELERY TASK STARTED")

    db = SessionLocal()
    upload = None

    try:
        upload = db.query(Upload).filter(Upload.id == upload_id).first()
        if not upload:
            raise Exception("Upload not found")

        upload.status = "processing"
        db.commit()

        file_path = Path(upload.file_path)
        if not file_path.exists():
            raise FileNotFoundError(f"CSV file not found: {file_path}")

        df = pd.read_csv(file_path, encoding="latin1")

        df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

        structured_df = df.rename(columns={
            "ordernumber": "order_id",
            "orderdate": "order_date",
            "productline": "product_category",
            "productcode": "sku",
            "quantityordered": "units_sold",
            "sales": "revenue",
            "country": "country",
            "status": "order_status",
        })[
            [
                "order_id",
                "order_date",
                "sku",
                "product_category",
                "units_sold",
                "revenue",
                "country",
                "order_status",
            ]
        ]

        structured_df["order_date"] = pd.to_datetime(
            structured_df["order_date"]
        ).dt.date

        structured_df["units_sold"] = structured_df["units_sold"].astype(int)
        structured_df["revenue"] = structured_df["revenue"].astype(float)

        records = [
            Sale(
                upload_id=upload_id,
                order_id=row.order_id,
                order_date=row.order_date,
                sku=row.sku,
                product_category=row.product_category,
                units_sold=row.units_sold,
                revenue=row.revenue,
                country=row.country,
                order_status=row.order_status,
            )
            for row in structured_df.itertuples(index=False)
        ]

        db.bulk_save_objects(records)
        db.commit()

        upload.status = "completed"
        db.commit()

        db.add(
            ChatMessage(
                chat_id=upload.chat_id,
                role="assistant",
                content=(
                    "✅ CSV processed successfully!\n\n"
                    f"📊 Records inserted: {len(records)}\n"
                    f"📄 File: {upload.original_filename}"
                ),
            )
        )
        db.commit()

        print(f"✅ INSERTED {len(records)} RECORDS")

        return {"records_inserted": len(records), "status": "SUCCESS"}

    except Exception as e:
        db.rollback()

        if upload:
            upload.status = "failed"
            db.commit()

            db.add(
                ChatMessage(
                    chat_id=upload.chat_id,
                    role="assistant",
                    content=(
                        "❌ Failed to process CSV.\n\n"
                        f"Error: {str(e)}"
                    ),
                )
            )
            db.commit()

        raise e  # IMPORTANT: allows Celery retry

    finally:
        db.close()
