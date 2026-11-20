import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Acceptance tests for the editorial calendar (Asana task 1220688744221503): posts 1 to 10 with dated,
// owned stages, and a two-post buffer before the holiday gap.
const read = (path: string) =>
  existsSync(path) ? readFileSync(path, 'utf8').replace(/\r\n/g, '\n') : '';

const doc = read('docs/prd/editorial-calendar.md');
const workflow = read('docs/guidelines/post-workflow.md');

// Publish dates are the due dates on the Asana post tasks, read on 20 Nov 2026.
const PUBLISH: Record<number, string> = {
  1: '2026-12-14',
  2: '2026-12-14',
  3: '2026-12-14',
  4: '2027-01-04',
  5: '2027-01-11',
  6: '2027-01-18',
  7: '2027-01-25',
  8: '2027-02-01',
  9: '2027-02-08',
  10: '2027-02-15',
};
const GAP_START = '2026-12-21';
const GAP_END = '2027-01-01';

const section = (heading: string) => doc.split(`## ${heading}`)[1]?.split('\n## ')[0] ?? '';
const cells = (line: string) =>
  line
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim());
const day = (iso: string) => Date.parse(`${iso}T00:00:00Z`);

interface Row {
  post: number;
  publish: string;
  brief: string;
  draft: string;
  edit: string;
  seo: string;
  approval: string;
  distribute: string;
}

function parseRows(): Row[] {
  return section('Calendar')
    .split('\n')
    .filter((line) => /^\| \d+ \| \d{4}-/.test(line))
    .map(cells)
    .map(([post, publish, brief, draft, edit, seo, approval, distribute]) => ({
      post: Number(post),
      publish: publish ?? '',
      brief: brief ?? '',
      draft: draft ?? '',
      edit: edit ?? '',
      seo: seo ?? '',
      approval: approval ?? '',
      distribute: distribute ?? '',
    }));
}

const rows = parseRows();
const stageDates = (row: Row) => [
  row.brief,
  row.draft,
  row.edit,
  row.seo,
  row.approval,
  row.publish,
  row.distribute,
];

describe('the calendar table', () => {
  it('has one row for each of posts 1 to 10, with the Asana publish dates', () => {
    expect(rows.map((row) => row.post)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    for (const row of rows) expect(row.publish, `post ${row.post}`).toBe(PUBLISH[row.post]);
  });

  it('uses only weekdays, none before 23 Nov 2026', () => {
    for (const row of rows) {
      for (const date of stageDates(row)) {
        const weekday = new Date(day(date)).getUTCDay();
        expect(Number.isNaN(day(date)) || weekday === 0 || weekday === 6, date).toBe(false);
        expect(day(date), date).toBeGreaterThanOrEqual(day('2026-11-23'));
      }
    }
  });

  it('puts the stages in order, publish on the date, distribution within four days after', () => {
    for (const row of rows) {
      const before = [row.brief, row.draft, row.edit, row.seo, row.approval, row.publish];
      for (let i = 1; i < before.length; i++) {
        expect(day(before[i] ?? ''), `post ${row.post} stage ${i}`).toBeGreaterThan(
          day(before[i - 1] ?? ''),
        );
      }
      const gap = (day(row.distribute) - day(row.publish)) / 86_400_000;
      expect(gap, `post ${row.post} distribution`).toBeGreaterThanOrEqual(0);
      expect(gap, `post ${row.post} distribution`).toBeLessThanOrEqual(4);
    }
  });
});

describe('capacity and the holiday gap', () => {
  it('gives no stage two due dates on one day for the same owner, except Venkat approvals', () => {
    for (const key of ['brief', 'draft', 'edit', 'seo', 'distribute'] as const) {
      const dates = rows.map((row) => row[key]);
      expect(new Set(dates).size, key).toBe(dates.length);
    }
  });

  it('has no stage due date inside the holiday gap, 21 Dec 2026 to 1 Jan 2027', () => {
    for (const row of rows) {
      for (const date of stageDates(row)) {
        const inside = day(date) >= day(GAP_START) && day(date) <= day(GAP_END);
        expect(inside, `post ${row.post}: ${date}`).toBe(false);
      }
    }
  });

  it('has posts 4 to 6 technically edited before the gap', () => {
    for (const row of rows.filter((r) => r.post >= 4 && r.post <= 6)) {
      expect(day(row.edit), `post ${row.post}`).toBeLessThan(day(GAP_START));
    }
  });

  it('keeps two edited posts ahead of every publish date from post 4 to post 8', () => {
    for (const row of rows.filter((r) => r.post >= 4 && r.post <= 8)) {
      const ahead = rows.filter((r) => r.post > row.post && day(r.edit) <= day(row.publish));
      expect(ahead.length, `ahead of post ${row.post}`).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('the document states its rules, assumptions and risks', () => {
  it('has every required section, a draft status and its sources', () => {
    for (const heading of [
      'Rules',
      'Assumptions',
      'Calendar',
      'Owners per stage',
      'Buffer check',
      'Risks and decisions for Venkat',
    ]) {
      expect(section(heading).length, heading).toBeGreaterThan(0);
    }
    expect(doc).toMatch(/Status: draft/);
    expect(doc).toContain('1220688744221503');
    expect(doc).toContain('docs/guidelines/post-workflow.md');
    expect(doc).toContain('docs/prd/topic-backlog.md');
  });

  it('marks the holiday gap as an assumption, because no document defines it', () => {
    const assumptions = section('Assumptions');
    expect(assumptions).toMatch(/holiday gap/i);
    expect(assumptions).toContain('21 Dec 2026');
    expect(assumptions).toContain('1 Jan 2027');
    expect(assumptions.toLowerCase()).toContain('no document defines');
  });
});

describe('the document keeps the approved plan and names its risks', () => {
  it('keeps the approved plan: posts 4 to 10 as planned, posts 1 to 3 on 14 Dec', () => {
    expect(doc).toMatch(/posts 4 to 10 as planned/i);
    expect(doc).toContain('Venkat, 20 Nov 2026');
    expect(doc).toContain('14 Dec 2026');
  });

  it('names the risks and the decisions it leaves to Venkat', () => {
    const risks = section('Risks and decisions for Venkat');
    expect(risks).toContain('15 Feb 2027');
    expect(risks.toLowerCase()).toContain('no slack');
    expect(risks).toMatch(/draft-to-publish/i);
    expect(risks).toMatch(/holiday gap/i);
    expect(risks).toContain('Decision for Venkat');
    expect(risks).toMatch(/posted or sent/);
  });

  it('says the Asana subtasks are created after Venkat approves the calendar', () => {
    expect(doc).toMatch(/subtasks .{0,40}created after Venkat approves/i);
  });
});

describe('owners per stage match the post workflow', () => {
  const owners = section('Owners per stage')
    .split('\n')
    .filter((line) => /^\| \d \|/.test(line))
    .map(cells);

  it('names the same seven stages and owner roles as the workflow document', () => {
    expect(owners.map((row) => row[0])).toEqual(['1', '2', '3', '4', '5', '6', '7']);
    for (const row of owners) {
      const flow = workflow.split('\n').find((line) => line.startsWith(`| ${row[0]} |`)) ?? '';
      const role = (flow.split('|')[3] ?? '').split(',')[0]?.trim() ?? '';
      expect(role.length, `stage ${row[0]}`).toBeGreaterThan(0);
      expect(row[2] ?? '', `stage ${row[0]}`).toContain(role);
    }
  });
});
