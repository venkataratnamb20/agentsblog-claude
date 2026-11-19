// Remove generated output.
import { rmSync } from 'node:fs';

for (const dir of ['dist', 'build', 'coverage', '.astro']) {
  rmSync(dir, { recursive: true, force: true });
}
