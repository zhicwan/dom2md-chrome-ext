import { build, context, type BuildOptions } from 'esbuild';

const isWatch = process.argv.includes('--watch');

const shared: BuildOptions = {
  bundle: true,
  sourcemap: false,
  target: 'chrome88',
  logLevel: 'info',
};

const configs: BuildOptions[] = [
  {
    ...shared,
    entryPoints: ['src/devtools.ts'],
    outfile: 'dist/devtools.js',
    format: 'iife',
    bundle: false,
  },
  {
    ...shared,
    entryPoints: ['src/sidebar.ts'],
    outfile: 'dist/sidebar.js',
    format: 'esm',
  },
];

async function run(): Promise<void> {
  if (isWatch) {
    const contexts = await Promise.all(configs.map(c => context(c)));
    await Promise.all(contexts.map(ctx => ctx.watch()));
    console.log('Watching for changes…');
  } else {
    await Promise.all(configs.map(c => build(c)));
  }
}

run().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
