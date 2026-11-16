# Healthcare AI Testing

AI-assisted test automation for a sample healthcare web app (clinic portal), built with Playwright and TypeScript.

## What this project shows
- Page Object Model, auth setup with saved session state, cross-browser projects (Chromium, Firefox, WebKit)
- UI and API tests, tagged @smoke and @regression
- CI: smoke tests on pull requests, full regression nightly, HTML report as an artifact
- AI workflow: an LLM drafts Playwright tests from manual test cases; a human reviews every draft; results are tracked

## Architecture
manual_cases/manual_cases.csv -> ai/generate_tests.py (LLM draft) -> generated_tests/ -> human review -> tests/ -> GitHub Actions -> report

## Run it
    npm install
    npx playwright install
    npm test              # starts the sample app automatically
    npm run test:smoke
    npm run report

## AI test generation
    pip install anthropic
    export ANTHROPIC_API_KEY=your_key
    python ai/generate_tests.py     # drafts into generated_tests/
    # review each draft, move good ones into tests/, set status in review_log.csv
    python ai/report.py             # accepted / edited / rejected summary

## Results
Add your own measured numbers here after you run it (for example: drafts generated, % useful after review).

## Notes
The sample app is in-memory and uses no real patient data.
