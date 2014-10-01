# kwest-cookies [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

Cookies middleware for [kwest](https://github.com/Janpot/kwest) module.

## Installation

    $ npm install --save kwest-cookies

## Use

```js
var redirect = require('kwest-cookies'),
    kwest    = require('kwest'),
    tough    = require('tough-cookie'),
    request  = kwest().use(cookies({
      jar: new tough.CookieJar()
    }));

// With a global jar
request('http://www.example.com')
// Or per request
request({
  uri: 'http://www.example.com'),
  jar: new tough.CookieJar()
});

```


[travis-url]: http://travis-ci.org/Janpot/kwest-cookies
[travis-image]: http://img.shields.io/travis/Janpot/kwest-cookies.svg?style=flat

[depstat-url]: https://david-dm.org/Janpot/kwest-cookies
[depstat-image]: http://img.shields.io/david/Janpot/kwest-cookies.svg?style=flat
