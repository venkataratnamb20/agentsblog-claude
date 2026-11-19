// @ts-check
// The single definition of every project target. The Makefile and make.ps1 only call scripts/task.mjs,
// so what a target does is written here once. Decision: docs/adr/0002-task-runner.md.

/**
 * @typedef {{ description: string, npm?: string[], unavailable?: string }} Task
 */

const E2E_TASK = 'Automated test suite: unit, integration, E2E & visual regression';

/** @type {Record<string, Task>} */
export const TASKS = {
  setup: { description: 'Install dependencies from the lockfile', npm: ['ci'] },
  dev: { description: 'Start the dev server', npm: ['run', 'dev'] },
  lint: { description: 'Lint with ESLint (zero warnings allowed)', npm: ['run', 'lint'] },
  format: { description: 'Format all files with Prettier', npm: ['run', 'format'] },
  typecheck: { description: 'Type-check the site with astro check', npm: ['run', 'typecheck'] },
  test: { description: 'Run the unit tests', npm: ['test'] },
  'test-e2e': {
    description: 'Run the end-to-end tests',
    unavailable: `it needs Playwright, which is not installed yet (available after the task "${E2E_TASK}")`,
  },
  'test-bdd': {
    description: 'Run the BDD feature tests',
    unavailable: `it needs Cucumber, which is not installed yet (available after the task "${E2E_TASK}")`,
  },
  coverage: { description: 'Run the tests with the coverage thresholds', npm: ['run', 'coverage'] },
  build: { description: 'Build the static site', npm: ['run', 'build'] },
  preview: { description: 'Preview the built site locally', npm: ['run', 'preview'] },
  audit: {
    description: 'Audit dependencies for high-severity issues',
    npm: ['audit', '--audit-level=high'],
  },
  release: {
    description: 'Cut a release (use the release skill)',
    unavailable:
      'releases use the release skill and need Venkat\'s approval (available after the task "Production deployment & DNS cutover")',
  },
  clean: { description: 'Remove generated output', npm: ['run', 'clean'] },
};

/**
 * Help text: one line per target, unavailable targets marked.
 * @returns {string}
 */
export function describeTasks() {
  const width = Math.max(...Object.keys(TASKS).map((name) => name.length));
  return Object.entries(TASKS)
    .map(([name, task]) => {
      const note = task.unavailable ? ' (not available yet)' : '';
      return `  ${name.padEnd(width)}  ${task.description}${note}`;
    })
    .join('\n');
}
