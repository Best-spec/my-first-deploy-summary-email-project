# 📁 services/inquiry/summarizer.py
from .constants import category_mapping
import pandas as pd
from collections import defaultdict

def calculate_inquiry_summary(df):
    if df.empty:
        return [], []

    reverse_mapping = {
        q.strip().lower(): cat
        for cat, questions in category_mapping.items()
        for q in questions
    }

    df["normalized"] = df["question"].str.strip().str.lower()
    df["category"] = df["normalized"].map(reverse_mapping).fillna("Other")

    pivot = pd.pivot_table(df, index="language", columns="category", aggfunc="size", fill_value=0)
    pivot = pivot.reindex(columns=category_mapping.keys(), fill_value=0)

    pivot["Total Language"] = pivot.sum(axis=1)
    pivot = pivot.reset_index()

    output = pivot.to_dict(orient="records")

    total_row = {"language": "Total inquiry"}
    for cat in category_mapping:
        total_row[cat] = pivot[cat].sum()
    total_row["Total Language"] = pivot["Total Language"].sum()
    output.append(total_row)

    data_chart = {
        "name": "All Language Inquiry",
        **{cat: pivot[cat].sum() for cat in category_mapping}
    }

    return output, [data_chart]