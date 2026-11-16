"""Turn manual test cases (CSV) into DRAFT Playwright tests using an LLM.

Nothing generated is trusted: drafts land in generated_tests/ and are logged as
'pending' in review_log.csv. A human reviews each one, edits it if needed, then
sets status to accepted / edited / rejected. Run ai/report.py for the stats.

Setup:  pip install anthropic   and   export ANTHROPIC_API_KEY=...
Usage:  python ai/generate_tests.py
"""
import csv
import os
import pathlib
import re

import anthropic

ROOT = pathlib.Path(__file__).resolve().parent.parent
MODEL = os.getenv("MODEL", "claude-sonnet-4-6")
client = anthropic.Anthropic()

page_objects = "\n\n".join(p.read_text() for p in sorted((ROOT / "pages").glob("*.ts")))

SYSTEM = (
    "You write Playwright + TypeScript tests. Use ONLY the page object methods "
    "shown below; do not invent methods or selectors. Import from '@playwright/test' "
    "and '../pages/<Name>'. Tag each test with { tag: '@regression' }. "
    "Return ONLY the TypeScript file content, no explanations, no markdown fences.\n\n"
    "PAGE OBJECTS:\n" + page_objects
)


def strip_fences(text: str) -> str:
    return re.sub(r"^```(?:typescript|ts)?\n|\n```$", "", text.strip())


def main() -> None:
    out_dir = ROOT / "generated_tests"
    out_dir.mkdir(exist_ok=True)
    log_path = ROOT / "review_log.csv"
    existing = set()
    if log_path.exists():
        with log_path.open() as f:
            existing = {row["id"] for row in csv.DictReader(f)}

    with (ROOT / "manual_cases" / "manual_cases.csv").open() as f:
        cases = list(csv.DictReader(f))

    new_file = not log_path.exists()
    with log_path.open("a", newline="") as log:
        writer = csv.writer(log)
        if new_file:
            writer.writerow(["id", "title", "status", "reviewer_notes"])
        for case in cases:
            if case["id"] in existing:
                continue
            prompt = (
                f"Manual test case {case['id']}: {case['title']}\n"
                f"Steps: {case['steps']}\nExpected: {case['expected']}\n"
                "Write one Playwright spec file for this case."
            )
            resp = client.messages.create(
                model=MODEL,
                max_tokens=1500,
                system=SYSTEM,
                messages=[{"role": "user", "content": prompt}],
            )
            code = strip_fences(resp.content[0].text)
            (out_dir / f"{case['id']}.spec.ts").write_text(code + "\n")
            writer.writerow([case["id"], case["title"], "pending", ""])
            print(f"Draft created: generated_tests/{case['id']}.spec.ts (review before use)")


if __name__ == "__main__":
    main()
