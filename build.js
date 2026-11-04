import { execSync } from 'node:child_process'
import { copyFileSync, rmSync } from 'node:fs'
import { build } from 'esbuild'

rmSync('dist', { recursive: true, force: true })

const shared = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18'
}

await Promise.all([
  build({ ...shared, format: 'esm', outfile: 'dist/index.js' }),
  build({ ...shared, format: 'cjs', outfile: 'dist/index.cjs' })
])

execSync('tsc -p tsconfig.build.json', { stdio: 'inherit' })
copyFileSync('dist/index.d.ts', 'dist/index.d.cts')
