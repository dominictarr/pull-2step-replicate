var tape = require('tape')
var pull = require('pull-stream')
var sendAll = require('../')

tape('simple protocol - sends', function (t) {
  var set =  [1, 9, 3, 5, 2]
  var n = 2
  function done () {
    t.end()
  }

  var B = sendAll(set, function (err, set, missing, received) {
    t.notOk(err)
    //the total set, once differences have been added.
    t.deepEqual(set, [1, 9, 3, 5, 2, 7, 8])
    //the missing items which where added.
    t.deepEqual(missing, [7, 8], 'missing')
    //the recieved items. we already had 9.
    t.deepEqual(received, [7, 9, 8])
    if(!--n) done()
  })

  pull(B.source, pull.collect(function (err, ary) {
    t.deepEqual(ary.slice(1), [1, 9, 3, 5, 2], 'B.source')
    if(!--n) done()
  }))

  console.log('source', B.source)
  pull(pull.values([1, 7, 9, 8]), B.sink)

})

tape('simple protocol - recieves', function (t) {
  var set =  [1, 9, 3, 5, 2]
  var n = 2
  function done () {
    t.end()
  }

  var B = sendAll(set, function (err, set, missing, received) {
    t.notOk(err)
    t.deepEqual(set, [1, 9, 3, 5, 2, 7, 8])
    t.deepEqual(missing, [7, 8], 'sent')
    t.deepEqual(received, [7, 9, 8])

    if(!--n) done()
  })

  pull(B.source, pull.collect(function (err, ary) {
    t.deepEqual(ary.slice(1), [1, 3, 5, 2], 'recieved from b')

    if(!--n) done()
  }))


  pull(pull.values([0, 7, 9, 8]), B.sink)
})

tape('simple protocol - duplex', function (t) {
  var _a, _b
  function next () {
    if(!(_a && _b)) return
    t.deepEqual(_a.sort(), _b.sort())
    t.end()
  }
  var A =  sendAll([1, 7, 3, 5, 2], function (err, set) {
    _a = set
    next()
  })
  var B =  sendAll([1, 9, 5, 2], function (err, set) {
    _b = set
    next()
  })
  pull(A, B, A)

})
