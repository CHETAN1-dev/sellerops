from sqlalchemy import text
from sqlalchemy.orm import Session

from app.ai.sql_validator import validate_sql

def execute_ai_sql(
    db: Session,
    sql: str,
    upload_ids: list[int],
):
    # 1️⃣ Validate SQL
    validate_sql(sql)

    # 2️⃣ Inject upload scope
    scoped_sql = f"""
    SELECT * FROM (
        {sql.rstrip(';')}
    ) AS scoped_query
    WHERE upload_id = ANY(:upload_ids)
    """

    # 3️⃣ Execute safely
    result = db.execute(
        text(scoped_sql),
        {"upload_ids": upload_ids},
    )

    return result.mappings().all()
