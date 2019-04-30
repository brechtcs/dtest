export function first (t) {
  t.ok(true, 'arf')
  t.ok(false, 'barf')
  t.ok(true, 'dit')
  t.ok(true, 'dat')
  t.end()
}

export function second (t) {
  t.ok(false, 'nee')
  t.ok(true, 'ja')
  t.end()
}