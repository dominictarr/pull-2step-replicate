var handshake = require('pull-handshake')
var pull      = require('pull-stream')

module.exports = function sendAll (set, done) {
  return handshake(function (cb) {
    cb(null, Math.random())
  }, function (me, you) {
    var later
    //if I picked the low number,
    //send my numbers first.
    var iSendFirst = me < you

    return {
      source: 
      iSendFirst ?
          pull.values(set)
        : later = pull.defer()
      ,
      sink: pull.collect(function (err, ary) {
        var missing = []
        if(err) return done(err)

        if(!iSendFirst)//recieve items
          later.resolve(pull.values(set.filter(function (e) {
            return !~ary.indexOf(e)
          })))

        ary.forEach(function (e) {
          if(!~set.indexOf(e)) {
            missing.push(e)
            set.push(e)
          }
        })
        done(null, set, missing, ary, iSendFirst)
      })
    }
  })
}

