# visible-memory-usage

[![npm version](https://img.shields.io/npm/v/visible-memory-usage.svg)](https://www.npmjs.com/package/visible-memory-usage)
[![license](https://img.shields.io/npm/l/visible-memory-usage.svg)](https://www.npmjs.com/package/visible-memory-usage)

Shows the memory usage of a Node.js process as a bar in the terminal. The bar
is green for the first third, yellow for the second and red for the last. Can
be useful when you are looking for a memory leak.

![Example](https://github.com/davidmarjanidze/visible-memory-usage/blob/main/example.gif?raw=true)

## Installation

```console
npm i -D visible-memory-usage
```

Requires Node.js 18 or newer.

## Usage

```js
import { VisibleMemoryUsage } from 'visible-memory-usage'

const memoryUsage = new VisibleMemoryUsage().start()

// Later, when you want to remove the bar:
memoryUsage.stop()
```

CommonJS works too:

```js
const { VisibleMemoryUsage } = require('visible-memory-usage')
```

By default the full bar equals the `--max-old-space-size` value, so you can
run your app like this:

```console
node --max-old-space-size=512 app.js
```

If the flag is not set, the V8 heap size limit is used instead. You can also
set your own value with the `maxMemory` option.

## API

### `new VisibleMemoryUsage(options?)`

All options are optional.

| Option       | Type                 | Default                                 | Description                                                                                                             |
| ------------ | -------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `fps`        | `number`             | `30`                                    | How many times per second the bar is redrawn. From `1` to `60`. Lower values use less CPU.                              |
| `memoryType` | `string`             | `'rss'`                                 | Which value of `process.memoryUsage()` to show: `'rss'`, `'heapTotal'`, `'heapUsed'`, `'external'` or `'arrayBuffers'`. |
| `maxMemory`  | `number`             | `--max-old-space-size` or V8 heap limit | Memory in MB that fills the whole bar.                                                                                  |
| `stream`     | `NodeJS.WriteStream` | `process.stdout`                        | Where to draw the bar, for example `process.stderr`.                                                                    |

The constructor throws if an option has an invalid value.

### `start()`

Starts drawing the bar. Returns the instance. Calling it again while the bar is
running does nothing. If the stream is not a terminal (for example when output
is piped to a file), nothing is drawn.

The bar does not keep the process alive. When your app has nothing else to do,
it exits as usual.

### `stop()`

Stops drawing and clears the bar. Returns the instance.

### `isRunning`

`true` while the bar is being drawn.

## License

ISC
