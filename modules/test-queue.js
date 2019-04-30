import AsyncQueue from '../modules/async-queue.js'
import assert from 'dat://dterm.hashbase.io/modules/assert.js'
import html from 'dat://dterm.hashbase.io/shared/nanohtml-v1.2.4.js'

export default class TestQueue extends AsyncQueue {
  constructor () {
    super()

    this.count = 0
  }

  ok (condition, msg) {
    if (this.ended) {
      throw new Error('test queue has ended')
    }
    this.count++

    if (condition) {
      var info = new String(msg)
      info.toHTML = () => html`<div class="info">${msg}</div>`
      this.enqueue(info)
    } else {
      this.enqueue(new Error(msg))
    }
    if (this.count === this.plan) {
      this.end()
    }
  }

  plan (n) {
    assert(typeof n === 'number', 'plan must be number')
    this.plan = n
  }
}
