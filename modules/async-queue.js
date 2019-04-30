/*
MIT License

Copyright (c) 2016 Axel Rauschmayer
Copyright (c) 2019 Brecht Savelkoul

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

export default class AsyncQueue {
  constructor() {
    this.promises = [] // dequeues > enqueues
    this.results = [] // enqueues > dequeues
    this.ended = false
  }
  [Symbol.asyncIterator]() {
    return this
  }
  enqueue(value) {
    if (this.ended) {
      throw new Error('Queuing ended')
    }
    if (this.promises.length > 0) {
      if (this.results.length > 0) {
        throw new Error('Illegal internal state')
      }
      var promise = this.promises.shift()
      return promise.resolve({value})
    } else {
      this.results.push(value)
    }
  }
  /**
     * @returns a Promise for an IteratorResult
     */
  next() {
    if (this.results.length > 0) {
      const value = this.results.shift()
      return Promise.resolve({value})
    }
    if (this.ended) {
      if (this.promises.length > 0) {
        throw new Error('Illegal internal state')
      }
      return Promise.resolve({done: true})
    }
    // Wait for new values to be enqueued
    return new Promise((resolve, reject) => {
      this.promises.push({resolve, reject})
    })
  }
  end() {
    while (this.promises.length > 0) {
      this.promises.shift().resolve({done: true})
    }
    this.ended = true
  }
}