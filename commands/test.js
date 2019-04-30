import TestQueue from '../modules/test-queue.js'
import assert from 'dat://dterm.hashbase.io/modules/assert.js'
import glob from 'dat://dterm.hashbase.io/modules/dat-glob.js'
import html from 'dat://dterm.hashbase.io/shared/nanohtml-v1.2.4.js'
import isGlob from 'dat://dterm.hashbase.io/shared/is-glob-v4.0.1.js'
import joinPath from 'dat://dterm.hashbase.io/modules/join-path.js'
import parsePath from 'dat://dterm.hashbase.io/modules/dterm-parse-path.js'

export default async function* (opts, ...patterns) {
  var cwd = parsePath(window.location.pathname)
  var pattern, file

  for (pattern of patterns) {
    pattern = pattern.startsWith('/') ? pattern : joinPath(cwd.path, pattern)

    if (!isGlob(pattern)) {
      yield* test(cwd, pattern)
      continue
    }
    for await (file of glob(cwd.archive, pattern)) {
      yield* test(cwd, file)
    }
  }
}

async function* test (cwd, path) {
  var mod = await import(`dat://${cwd.key}/${path}?nocache=${Date.now()}`)

  for (var prop in mod) {
    if (typeof mod[prop] === 'function') {
      let t = new TestQueue()
      let description = new String('# ' + prop)
      description.toHTML = () => html`<h1>${prop}</h1>`
      t.enqueue(description)
      mod[prop](t)
      yield* t
    }
  }
}
