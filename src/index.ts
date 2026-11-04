import { getHeapStatistics } from 'node:v8'

export type MemoryType =
  'rss' | 'heapTotal' | 'heapUsed' | 'external' | 'arrayBuffers'

export interface VisibleMemoryUsageOptions {
  /** How many times per second the bar is redrawn, from 1 to 60. Default: 30. */
  fps?: number
  /** Which `process.memoryUsage()` value to show. Default: `'rss'`. */
  memoryType?: MemoryType
  /**
   * Memory in MB that fills the whole bar. Default: the `--max-old-space-size`
   * value if it's set, otherwise the V8 heap size limit.
   */
  maxMemory?: number
  /** Where to draw the bar. Default: `process.stdout`. */
  stream?: NodeJS.WriteStream
}

const MB = 1024 * 1024
const MEMORY_TYPES: readonly MemoryType[] = [
  'rss',
  'heapTotal',
  'heapUsed',
  'external',
  'arrayBuffers'
]
const COLORS = ['\x1b[32m', '\x1b[33m', '\x1b[31m'] // green, yellow, red
const RESET = '\x1b[0m'
const BAR = '|'

function getDefaultMaxMemory(): number {
  const args = [...process.execArgv, process.env.NODE_OPTIONS ?? '']
  const match = /--max-old-space-size=(\d+)/.exec(args.join(' '))
  return match ? Number(match[1]) : getHeapStatistics().heap_size_limit / MB
}

export class VisibleMemoryUsage {
  readonly fps: number
  readonly memoryType: MemoryType
  readonly maxMemory: number
  private readonly stream: NodeJS.WriteStream
  private timer?: NodeJS.Timeout

  constructor(options: VisibleMemoryUsageOptions = {}) {
    const {
      fps = 30,
      memoryType = 'rss',
      maxMemory = getDefaultMaxMemory(),
      stream = process.stdout
    } = options

    if (!(fps >= 1 && fps <= 60)) {
      throw new RangeError(`"fps" must be between 1 and 60, got ${fps}`)
    }
    if (!MEMORY_TYPES.includes(memoryType)) {
      throw new TypeError(
        `"memoryType" must be one of ${MEMORY_TYPES.join(', ')}, got ${String(memoryType)}`
      )
    }
    if (!(maxMemory > 0)) {
      throw new RangeError(
        `"maxMemory" must be a positive number, got ${maxMemory}`
      )
    }

    this.fps = fps
    this.memoryType = memoryType
    this.maxMemory = maxMemory
    this.stream = stream
  }

  get isRunning(): boolean {
    return this.timer !== undefined
  }

  /** Starts drawing the bar. Does nothing if it's already running or the stream is not a terminal. */
  start(): this {
    if (this.isRunning || !this.stream.isTTY) return this

    this.render()
    this.timer = setInterval(() => this.render(), 1000 / this.fps)
    // Don't keep the process alive just to draw the bar.
    this.timer.unref()
    return this
  }

  /** Stops drawing and clears the bar from the terminal. */
  stop(): this {
    if (!this.isRunning) return this

    clearInterval(this.timer)
    this.timer = undefined
    this.writeLine('')
    return this
  }

  private render(): void {
    const used = process.memoryUsage()[this.memoryType] / MB
    const label = ` ${Math.round(used)}/${Math.round(this.maxMemory)} MB`
    // Leave the last column empty so the terminal doesn't wrap the line.
    const width = Math.max((this.stream.columns ?? 80) - label.length - 1, 0)
    const filled = Math.min(Math.round((used / this.maxMemory) * width), width)

    let bar = ''
    for (let i = 0; i < COLORS.length; i++) {
      const start = Math.floor((width * i) / COLORS.length)
      const end = Math.floor((width * (i + 1)) / COLORS.length)
      const colored = Math.min(Math.max(filled - start, 0), end - start)

      if (colored > 0) bar += COLORS[i] + BAR.repeat(colored) + RESET
      bar += BAR.repeat(end - start - colored)
    }

    this.writeLine(bar + label)
  }

  private writeLine(text: string): void {
    this.stream.cursorTo(0)
    this.stream.write(text)
    this.stream.clearLine(1)
  }
}
