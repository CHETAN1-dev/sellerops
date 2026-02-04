from typing import List, Dict

def generate_human_answer(
    question: str,
    sql: str,
    rows: List[Dict],
) -> str:
    if not rows:
        return "I couldn’t find any data matching your question."

    lines = []
    for i, row in enumerate(rows, start=1):
        lines.append(
            f"{i}. Product {row['sku']} generated ₹{row['total_revenue']:,.2f} in revenue"
        )

    answer = (
        f"Here are the insights based on your data:\n\n"
        + "\n".join(lines)
    )

    return answer
