Add a new example report to the dashboard: $ARGUMENTS

Steps:
1. Create a new JSON file at `public/data/example/reports/{report-key}.json` following the structure of existing reports (dashboard_key: "example", report_key, title, description, type, widgets array)
2. Add the report key to the `reports` array in `public/data/example/dashboard.json`
3. If the report needs new datasets, add them to the `datasets` array in `public/data/example/dashboard.json`
4. Update the reports table in `docs/guide.md` with the new report
5. Verify with `npx next build`
