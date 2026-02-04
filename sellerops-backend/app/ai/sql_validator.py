import re

FORBIDDEN_KEYWORDS = [
    "insert",
    "update",
    "delete",
    "drop",
    "alter",
    "truncate",
    "create",
    "grant",
    "revoke",
]

def validate_sql(sql: str) -> None:
    """
    Raises ValueError if SQL is unsafe
    """
    sql_lower = sql.lower().strip()

    # 1️⃣ Must be SELECT only
    if not sql_lower.startswith("select"):
        raise ValueError("Only SELECT queries are allowed")

    # 2️⃣ Block dangerous keywords
    for keyword in FORBIDDEN_KEYWORDS:
        if re.search(rf"\b{keyword}\b", sql_lower):
            raise ValueError(f"Forbidden SQL keyword detected: {keyword}")

    # 3️⃣ Must reference sales table
    if "from sales" not in sql_lower:
        raise ValueError("Query must use sales table only")

    # 4️⃣ Prevent multi-statements
    if ";" in sql_lower[:-1]:
        raise ValueError("Multiple SQL statements are not allowed")
