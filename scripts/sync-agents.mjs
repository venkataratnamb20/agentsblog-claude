// Copy shared skills from .agents/skills to .claude/skills (no symlinks; works on Windows).
import { cpSync } from 'node:fs';

cpSync('.agents/skills', '.claude/skills', { recursive: true });
console.log('synced .agents/skills -> .claude/skills');
