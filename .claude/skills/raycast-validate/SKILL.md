---
name: raycast-validate
description: Run all Raycast Store submission checks (build, lint, test, manifest validation)
disable-model-invocation: true
---

Run the full validation suite for Raycast Store submission:

1. Run `npm run build` and report any errors
2. Run `npm run lint` and report any warnings/errors
3. Run `npm test` and report results
4. Verify package.json has all required fields: name, title, description, author, license, icon, categories
5. Check that icon exists at `assets/command-icon.png`
6. Report overall pass/fail status with a summary table
