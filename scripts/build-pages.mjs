import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const config = JSON.parse(await readFile(path.join(root, 'apps.json'), 'utf8'));
const now = new Date();
const output = path.join(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

let published = 0;
for (const [name, app] of Object.entries(config.apps)) {
  const active = (!app.activated_at || now >= new Date(app.activated_at)) && (!app.expires_at || now < new Date(app.expires_at));
  if (!active) continue;
  if (!/^[\w-]+$/.test(name) || path.isAbsolute(app.path) || app.path.split(/[\\/]/).includes('..')) {
    throw new Error(`Unsafe app name or path in apps.json: ${name}`);
  }
  const source = path.resolve(root, app.path);
  if (!source.startsWith(`${root}${path.sep}`)) throw new Error(`App path escapes repository: ${name}`);
  await cp(source, path.join(output, name), { recursive: true });
  published++;
  console.log(`Published /${name}/`);
}

if (!published) {
  await writeFile(path.join(output, 'index.html'), '<!doctype html><meta charset="utf-8"><title>Mini apps</title><p>No mini apps are currently active.</p>');
  console.log('No active apps; published an empty landing page.');
}
