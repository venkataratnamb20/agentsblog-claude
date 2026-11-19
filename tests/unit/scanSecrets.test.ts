import { describe, expect, it } from 'vitest';
import { scanText } from '../../.claude/hooks/lib/secrets.mjs';

// Fake secrets are assembled at runtime so no secret-looking literal sits in the source.
const awsKey = 'AKIA' + 'IOSFODNN7EXAMPLE';
const privateKey = '-----BEGIN ' + 'RSA PRIVATE KEY-----';

describe('scanText', () => {
  it('reports the line number and pattern name, never the value', () => {
    const text = `first line\nid = ${awsKey}\nlast line`;
    const findings = scanText(text);
    expect(findings).toEqual([{ line: 2, name: 'aws-access-key' }]);
    expect(JSON.stringify(findings)).not.toContain(awsKey);
  });

  it('finds several secrets on different lines', () => {
    const findings = scanText(`${privateKey}\nok\n${awsKey}`);
    expect(findings.map((f) => `${f.line}:${f.name}`)).toEqual([
      '1:private-key',
      '3:aws-access-key',
    ]);
  });

  it('returns nothing for clean text', () => {
    expect(scanText('const a = 1;\nexport default a;\n')).toEqual([]);
  });

  it('handles Windows line endings', () => {
    expect(scanText(`a\r\n${awsKey}\r\n`)).toEqual([{ line: 2, name: 'aws-access-key' }]);
  });

  it('does not let a line opt out of the scan', () => {
    expect(scanText(`${awsKey} // secret-scan-ignore`)).toEqual([
      { line: 1, name: 'aws-access-key' },
    ]);
  });
});
