'use strict';

var tough    = require('tough-cookie'),
    Promise  = require('bluebird'),
    defaults = require('merge-defaults');


function kwestCookies(globalOptions) {
  globalOptions = defaults(globalOptions || {}, {
    jar: false
  });

  return function (request, next) {
    var options = defaults({
      jar: request.jar
    }, globalOptions);

    if (!options.jar) {
      return next(request);
    }

    var href = request.getUrl(),
        jar  = options.jar,
        getCookieString = Promise.promisify(jar.getCookieString.bind(jar)),
        setCookieString = Promise.promisify(jar.setCookie.bind(jar));


    return getCookieString(href)
      .then(function (cookies) {
        request.setHeader('cookie', cookies);
        return next(request);
      })
      .then(function (response) {
        var cookiesToset = response.getHeader('set-cookie');
        
        if (!cookiesToset) {
          return response;
        }

        var setCookiePromise;
        if (Array.isArray(cookiesToset)) {
          setCookiePromise = Promise.map(cookiesToset, function(cookie) {
            return setCookieString(cookie, href);
          });
        } else {
          setCookiePromise = setCookieString(cookiesToset, href);
        }
        return setCookiePromise
          .catch(function ignore() {})
          .return(response);
      });
  };
}

module.exports = kwestCookies;
