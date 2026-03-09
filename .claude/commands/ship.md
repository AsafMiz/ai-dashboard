Branch, commit, push, and merge all current changes to main.

Steps:
1. Run `git status` and `git diff` to see all changes
2. Create a feature branch in kebab-case based on the changes (e.g. `add-logo-support`)
3. Stage all relevant files (avoid .env or credentials)
4. Commit with a descriptive imperative message summarizing the changes
5. Push the branch to origin
6. Merge into main with `git merge --no-ff`
7. Push main
8. Delete the local feature branch

If there are no changes, say so and stop.
