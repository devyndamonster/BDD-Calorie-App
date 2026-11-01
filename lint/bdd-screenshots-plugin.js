import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const PNG_SIGNATURE = '89504e470d0a1a0a'
const DEFAULT_MIN_HEIGHT = 100

function findPngs(dir) {
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return []
  }
  return entries.flatMap((entry) =>
    entry.isDirectory() ? findPngs(join(dir, entry.name)) : entry.name.endsWith('.png') ? [join(dir, entry.name)] : [],
  )
}

// The PNG header stores the image height as a big-endian uint32 at byte 20.
function pngHeight(file) {
  const header = readFileSync(file).subarray(0, 24)
  if (header.subarray(0, 8).toString('hex') !== PNG_SIGNATURE) return null
  return header.readUInt32BE(20)
}

const minHeight = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require BDD screenshots to be at least a minimum height, so tests capture a larger parent component instead of a tiny element.',
    },
    schema: [
      {
        type: 'object',
        properties: { minHeight: { type: 'number' }, directory: { type: 'string' } },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0] ?? {}
    const min = options.minHeight ?? DEFAULT_MIN_HEIGHT
    const root = context.cwd ?? process.cwd()
    const directory = join(root, options.directory ?? 'features/__screenshots__')

    return {
      Program(node) {
        for (const file of findPngs(directory)) {
          const height = pngHeight(file)
          if (height !== null && height < min) {
            context.report({
              node,
              message: `Screenshot ${relative(root, file).replaceAll('\\', '/')} is ${height}px tall (minimum ${min}px). Capture a larger parent component instead.`,
            })
          }
        }
      },
    }
  },
}

export default {
  meta: { name: 'bdd-screenshots' },
  rules: { 'min-height': minHeight },
}
