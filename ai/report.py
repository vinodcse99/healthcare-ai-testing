"""Summarise human review of AI-generated tests from review_log.csv."""
import csv
import collections
import pathlib

log = pathlib.Path(__file__).resolve().parent.parent / "review_log.csv"
counts = collections.Counter(row["status"] for row in csv.DictReader(log.open()))
total = sum(counts.values())
print(f"Generated: {total}")
for status in ("accepted", "edited", "rejected", "pending"):
    n = counts.get(status, 0)
    pct = f"{100 * n / total:.0f}%" if total else "0%"
    print(f"  {status:9s} {n:3d} ({pct})")
reviewed = total - counts.get("pending", 0)
if reviewed:
    useful = counts.get("accepted", 0) + counts.get("edited", 0)
    print(f"Useful after review: {100 * useful / reviewed:.0f}% of {reviewed} reviewed")
