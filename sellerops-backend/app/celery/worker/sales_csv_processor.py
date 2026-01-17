import pandas as pd
from pathlib import Path

from app.celery.celery_app import celery_app
from app.db.database import SessionLocal
from app.db.models.models import Sale



@celery_app.task(
    name="process_sales_csv",
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=5,
    retry_kwargs={"max_retries": 3},
)
def process_sales_csv(self, file_path: str):
    """
    Process sales CSV → structured → PostgreSQL
    """

    print("✅ CELERY TASK STARTED")

    file_path = Path(file_path)
    if not file_path.exists():
        raise FileNotFoundError(f"CSV file not found: {file_path}")

    # 1️⃣ Read CSV
    df = pd.read_csv(file_path, encoding="latin1")

    # 2️⃣ Normalize columns
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )

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

    # 4️⃣ Type cleaning
    structured_df["order_date"] = pd.to_datetime(
        structured_df["order_date"]
    ).dt.date

    structured_df["units_sold"] = structured_df["units_sold"].astype(int)
    structured_df["revenue"] = structured_df["revenue"].astype(float)

    # 5️⃣ Insert into PostgreSQL
    db = SessionLocal()
    try:
        records = [
            Sale(
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

    except Exception as e:
        db.rollback()
        raise e

    finally:
        db.close()

    print(f"✅ INSERTED {len(records)} RECORDS")

    return {
        "records_inserted": len(records),
        "status": "SUCCESS",
    }
