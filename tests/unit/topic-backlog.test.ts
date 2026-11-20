import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Acceptance tests for the topic backlog (Asana task 1220688744221501): 20 or more scored ideas across
// all five pillars, and the top 10 feed the editorial calendar.
const read = (path: string) =>
  existsSync(path) ? readFileSync(path, 'utf8').replace(/\r\n/g, '\n') : '';

const doc = read('docs/prd/topic-backlog.md');
const PILLARS = [
  'Architectures',
  'Tools and MCP',
  'Memory and RAG',
  'Multi-agent',
  'Evals and safety',
];

interface Idea {
  id: string;
  title: string;
  pillar: string;
  value: number;
  demand: number;
  effort: number;
  score: string;
  status: string;
  source: string;
  keyword: string;
}

const section = (heading: string) => doc.split(`## ${heading}`)[1]?.split('\n## ')[0] ?? '';
const cells = (line: string) =>
  line
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim());

function parseIdeas(): Idea[] {
  return section('Backlog')
    .split('\n')
    .filter((line) => /^\| T\d\d \|/.test(line))
    .map((line) => {
      const [id, title, pillar, value, demand, effort, score, status, source, keyword] =
        cells(line);
      return {
        id: id ?? '',
        title: title ?? '',
        pillar: pillar ?? '',
        value: Number(value),
        demand: Number(demand),
        effort: Number(effort),
        score: score ?? '',
        status: status ?? '',
        source: source ?? '',
        keyword: keyword ?? '',
      };
    });
}

const ideas = parseIdeas();

describe('the backlog table', () => {
  it('has 20 or more ideas with unique ids and titles', () => {
    expect(ideas.length).toBeGreaterThanOrEqual(20);
    expect(new Set(ideas.map((idea) => idea.id)).size).toBe(ideas.length);
    expect(new Set(ideas.map((idea) => idea.title)).size).toBe(ideas.length);
  });

  it.each(PILLARS)('has at least three ideas in the %s pillar', (pillar) => {
    expect(ideas.filter((idea) => idea.pillar === pillar).length).toBeGreaterThanOrEqual(3);
  });

  it('uses only the five pillars or Roundup', () => {
    for (const idea of ideas) expect([...PILLARS, 'Roundup'], idea.id).toContain(idea.pillar);
  });

  it('scores value, demand and effort as whole numbers from 1 to 5', () => {
    for (const idea of ideas) {
      for (const n of [idea.value, idea.demand, idea.effort]) {
        expect(Number.isInteger(n) && n >= 1 && n <= 5, `${idea.id}: ${n}`).toBe(true);
      }
    }
  });

  it('computes every score as value times demand divided by effort, to one place', () => {
    for (const idea of ideas) {
      const expected = ((idea.value * idea.demand) / idea.effort).toFixed(1);
      expect(idea.score, idea.id).toBe(expected);
    }
  });
});

describe('the scoring rules are honest about demand', () => {
  const rules = section('Scoring');

  it('states the formula and the 1 to 5 scales', () => {
    expect(rules).toMatch(/value.*demand.*effort/is);
    expect(rules).toContain('1 to 5');
  });

  it('says search demand is a judgement that has not been measured', () => {
    expect(rules.toLowerCase()).toContain('not measured');
    expect(doc).not.toMatch(
      /\d[\d,.]*\s*k?\s*(searches|volume|monthly|\/mo\b|per month)|\bKD\s*\d/i,
    );
  });

  it('names the source and the review status', () => {
    expect(doc).toContain('1220688744221501');
    expect(doc).toMatch(/Status: (draft|approved)/);
  });
});

describe('the top 10 and the planned posts', () => {
  const top = section('Top 10')
    .split('\n')
    .filter((line) => /^\| \d+ \|/.test(line))
    .map(cells);

  it('lists ten ranked ideas that exist in the backlog', () => {
    expect(top.map((row) => row[0])).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    const ids = new Set(ideas.map((idea) => idea.id));
    for (const row of top) expect(ids.has(row[1] ?? ''), row[1]).toBe(true);
  });

  it('holds the ten highest scores, highest first', () => {
    const scores = top.map((row) => Number(row[3]));
    expect([...scores].sort((a, b) => b - a)).toEqual(scores);
    const all = ideas.map((idea) => Number(idea.score)).sort((a, b) => b - a);
    expect(scores).toEqual(all.slice(0, 10));
  });

  it('includes planned posts 1 to 10 and reconciles them with the top 10', () => {
    for (let n = 1; n <= 10; n++) {
      const found = ideas.some((idea) => new RegExp(`planned post ${n}\\b`).test(idea.status));
      expect(found, `post ${n}`).toBe(true);
    }
    expect(section('Reconciliation with the planned posts').length).toBeGreaterThan(0);
  });
});

// Added after the SEO review: complete rows, coverage of the pillars file, a real tie-break, and a
// reconciliation that names what it compares.
const pillarsDoc = read('docs/prd/content-pillars.md');

function pillarIdeaCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const block of pillarsDoc.split('### Pillar ').slice(1)) {
    if (!/^\d+: /.test(block)) continue;
    const name = block.split('\n')[0]?.split(': ')[1]?.trim() ?? '';
    const ideas = block.split('**Topic ideas**')[1]?.split('**Target keywords**')[0] ?? '';
    counts[name] = ideas.split('\n').filter((line) => line.startsWith('- ')).length;
  }
  return counts;
}

describe('every backlog row is complete', () => {
  it('has a real source plan and a candidate keyword on every row', () => {
    for (const idea of ideas) {
      expect(idea.source.length, `${idea.id} source`).toBeGreaterThan(8);
      expect(idea.source, `${idea.id} source`).not.toMatch(/^none yet\.?$/i);
      expect(idea.keyword.length, `${idea.id} keyword`).toBeGreaterThan(2);
    }
  });

  it('covers every idea listed in the pillars file', () => {
    const wanted = pillarIdeaCounts();
    expect(Object.keys(wanted).sort()).toEqual([...PILLARS].sort());
    for (const pillar of PILLARS) {
      const own = ideas.filter((idea) => idea.pillar === pillar).length;
      const roundups =
        pillar === 'Evals and safety' ? ideas.filter((i) => i.pillar === 'Roundup') : [];
      expect(own + roundups.length, pillar).toBeGreaterThanOrEqual(wanted[pillar] ?? 99);
    }
  });
});

describe('the top 10 matches the backlog and the tie-break', () => {
  const top = section('Top 10')
    .split('\n')
    .filter((line) => /^\| \d+ \|/.test(line))
    .map(cells);

  it('uses each idea once and copies its title and score from the backlog', () => {
    expect(new Set(top.map((row) => row[1])).size).toBe(10);
    for (const row of top) {
      const idea = ideas.find((candidate) => candidate.id === row[1]);
      expect(row[2], `${row[1]} title`).toBe(idea?.title);
      expect(row[3], `${row[1]} score`).toBe(idea?.score);
    }
  });

  it('breaks ties by lower effort, then lower ID', () => {
    const ranked = [...ideas].sort(
      (a, b) =>
        Number(b.score) - Number(a.score) || a.effort - b.effort || a.id.localeCompare(b.id),
    );
    expect(top.map((row) => row[1])).toEqual(ranked.slice(0, 10).map((idea) => idea.id));
  });

  it('says plainly that near scores are ties that Venkat decides', () => {
    const text = section('Top 10').toLowerCase();
    expect(text).toContain('tie');
    expect(text).toContain('decision for venkat');
  });
});

describe('the reconciliation and the SEO findings', () => {
  const recon = section('Reconciliation with the planned posts');
  const topIds = section('Top 10')
    .split('\n')
    .map((line) => /^\| \d+ \| (T\d\d) \|/.exec(line)?.[1])
    .filter((id): id is string => Boolean(id));

  it('names every planned post outside the top 10 and every unplanned idea inside it', () => {
    for (const idea of ideas) {
      const planned = /planned post (\d+)/.exec(idea.status)?.[1];
      const inTop = topIds.includes(idea.id);
      if (planned && !inTop) expect(recon, `Post ${planned}`).toContain(`Post ${planned}`);
      if (!planned && inTop) expect(recon, idea.id).toContain(idea.id);
    }
  });

  it('records the overlaps, the ratings most at risk and the keyword validation', () => {
    const overlaps = section('Overlaps');
    for (const id of ['T01', 'T11', 'T18', 'T30', 'T04', 'T21', 'T22']) {
      expect(overlaps, id).toContain(id);
    }
    expect(section('Ratings most at risk').toLowerCase()).toContain('keyword tool');
    expect(recon.toLowerCase()).toContain('keyword validation');
  });

  it('says the approved launch order stands', () => {
    expect(recon).toMatch(/launch order of posts 1 to 3 is approved/i);
  });
});
