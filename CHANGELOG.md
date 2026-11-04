# 2.0.0 (2026-11-04)

Breaking changes:

- The constructor takes an options object: `new VisibleMemoryUsage({ fps, memoryType, maxMemory, stream })`.
- `showMemoryUsage()` and `hideMemoryUsage()` are renamed to `start()` and `stop()`. Both return the instance.
- Default `fps` is now `30` instead of `60`.
- Build output files are renamed. Use the package name to import, not file paths.

Other changes:

- `--max-old-space-size` is no longer required. Without it the V8 heap size limit is used.
- The flag is also read from `NODE_OPTIONS`.
- Add `maxMemory` option to set the size of the full bar.
- Add `stream` option to draw the bar to something other than `process.stdout`.
- Add `isRunning` property.
- Memory is now measured in MiB (1024 \* 1024 bytes), the same unit `--max-old-space-size` uses.
- The bar no longer keeps the process alive.
- Nothing is drawn when the output is not a terminal, instead of throwing.
- The line no longer wraps when it reaches the terminal width.
- Add `exports` field to `package.json` with separate types for ESM and CommonJS.
- Replace Rollup with esbuild.

# 1.3.0 (2023-06-10)

Remove the downloads tag from `README.md`.

# 1.2.0 (2023-04-30)

Change usage example with ESM `import`.

# 1.1.0 (2023-04-30)

- Add Rollup config
- Add ESLint
- Add the support for ESM
- Add TypeScript definition file
