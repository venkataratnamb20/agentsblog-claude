// Enforces Conventional Commits (feat:, fix:, docs:, test:, refactor:, chore:, build:, ci:, ...).
// Used by the local commit-msg hook (.husky/commit-msg) and by CI on PR commits and titles.
export default { extends: ['@commitlint/config-conventional'] };
