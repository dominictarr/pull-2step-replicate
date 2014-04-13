# pull-2step-replicate

A very simple replication protocol, based on
[pull-handshake](https://github.com/dominictarr/pull-handshake)

This is not really intended as a realistic replication algorithm.
The intension of this module is to measure a baseline against which
other replication techniques can be compared.

1. two nodes connect via a stream.
2. send the other side a random number between 0 and 1.
3. receive other side's random number. If my number is smallest,
   send all my data.
4. receive other side's data. If my number was larger, 
   I didn't send anything in step 3, compare the data that I received
   with my own data, and send anything that the other side did not have.

``` js
var twoStep = require('pull-2step-replicate')
var pull = require('pull-stream')


var A = twoStep([1, 2, 3, 7]) //needs to send 2, 3
var B = twoStep([2, 5, 6, 7]) //needs to send 5, 6

pull(A, B, A) //connect as a duplex stream.
```

## License

MIT
