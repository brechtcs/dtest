export function plan (t) {
  t.plan(3)
  t.ok(true, 'first')
  t.ok(false, 'second')
  t.ok(true, 'third')
}