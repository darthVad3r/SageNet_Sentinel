import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const statsPath = resolve(
  process.cwd(),
  process.argv[2] ?? 'dist/ai-automation-landing/stats.json'
);
const raw = readFileSync(statsPath, 'utf8');
const stats = JSON.parse(raw);

const outputs = stats.outputs ?? {};
const mainChunkName = Object.entries(outputs).find(
  ([, output]) => output.entryPoint === 'src/main.ts'
)?.[0];

if (!mainChunkName) {
  console.error('Could not find the main entry chunk in stats output.');
  process.exit(1);
}

const mainChunk = outputs[mainChunkName];
const staticImports = (mainChunk.imports ?? [])
  .filter((item) => item.kind === 'import-statement')
  .map((item) => item.path);

const initialChunks = [mainChunkName, ...staticImports];
const uniqueInitialChunks = [...new Set(initialChunks)];

console.log(`Stats file: ${statsPath}`);
console.log(`Main chunk: ${mainChunkName}`);
console.log('Initial chunks and top contributors:');

for (const chunkName of uniqueInitialChunks) {
  const chunk = outputs[chunkName];

  if (!chunk) {
    continue;
  }

  const inputs = Object.entries(chunk.inputs ?? {})
    .map(([name, value]) => ({
      name,
      bytes: value.bytesInOutput ?? 0,
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 10);

  console.log(`\n- ${chunkName} (${chunk.bytes ?? 0} bytes)`);

  for (const input of inputs) {
    console.log(`  ${String(input.bytes).padStart(7, ' ')}  ${input.name}`);
  }
}
