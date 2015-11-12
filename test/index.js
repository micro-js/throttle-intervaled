var throttle = require('..')
var test = require('tape')

test('should call function', function (t) {
  t.plan(2)

  var count = counter()
  var interval = 50
  var fn = throttle(count, interval)
  fn()
  t.equal(count.invoked, 0)
  setTimeout(function () {
    t.equal(count.invoked, 1)
  }, 100)

})

test('should throttle the function', function (t) {
  t.plan(1)

  var count = counter()
  var interval = 100
  var total = 500
  var fn = throttle(count, interval)
  var inter = setInterval(fn, 20)
  setTimeout(function () {
    clearInterval(inter)
    t.equal(count.invoked, total / interval)
  }, total + 5)

})

test('should fire the function on an interval', function (t) {

  var count = counter()
  var interval = 100
  var total = 500
  var fn = throttle(count, interval)
  var start = +new Date()
  fn()
  randomCall()

  var timeout
  function randomCall () {
    timeout = setTimeout(function () {
      fn()
      if (timeout) randomCall()
    }, Math.floor(Math.random() * 20) + 15)
  }

  setTimeout(function () {
    timeout = null
    count.log.forEach(function (time) {
      t.ok(Math.abs((time - start) % interval) < 8)
    })
    t.equal(count.log.length, 5)
    t.end()
  }, total + 5)
})

function counter () {
  function count () {
    count.invoked++
    count.log.push(+new Date())
  }
  count.invoked = 0
  count.log = []
  return count
}