# therealyou

[![Build Status](https://travis-ci.org/briandela/therealyou.svg?branch=master)](https://travis-ci.org/briandela/therealyou) [![Coverage Status](https://coveralls.io/repos/briandela/therealyou/badge.svg?branch=master&service=github)](https://coveralls.io/github/briandela/therealyou?branch=master) [![npm version](https://badge.fury.io/js/therealyou.svg)](http://badge.fury.io/js/therealyou) [![Dependencies Up To Date](https://david-dm.org/briandela/therealyou.svg?style=flat)](https://david-dm.org/briandela/therealyou)

hapi.js plugin for setting the `request.info.remoteAddress` and `request.info.remotePort` based on the X-Forwarded-For and X-Forwarded-Port headers

#### X-Forwarded-For ####

see: [https://en.wikipedia.org/wiki/X-Forwarded-For](https://en.wikipedia.org/wiki/X-Forwarded-For)

The general format of the `x-forwarded-for` header is:

```
X-Forwarded-For: client, proxy1, proxy2
```

This plugin sets `request.info.remoteAddress` to the first value of the `x-forwarded-for` header if it is set.

For example, if the header was

```
'x-forwarded-for': '192.16.184.5, 192.16.184.6, 192.16.184.2'
```

then `remote.info.remoteAddress` would be set to `192.16.184.5`

#### X-Forwarded-Port ####

This plugin sets `request.info.remotePort` to the value of the `x-forwarded-port` header

### Usage

``` javascript
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection();

server.register(require('therealyou'), function (err) {

    // Assuming no err, start server

    server.start(function () {
        // ..
    });
});
```

## License

MIT
