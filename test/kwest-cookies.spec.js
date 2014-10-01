var kwestCookies = require('../index'),
    mock      = require('kwest-mock'),
    assert    = require('chai').assert,
    tough = require('tough-cookie');

describe('kwest-redirect', function () {

  it('should work when no cookie set', function (done) {
    var jar = new tough.CookieJar();

    var cookieKwest = mock(function (request, respond) {
      return respond({
        statusCode: 200
      });
    }).use(kwestCookies({
      jar: jar
    }));

    cookieKwest('http://www.example.com')
      .then(function (res) {
        done();
      })
      .catch(done);

  });

  it('should work when one cookie set', function (done) {
    var jar = new tough.CookieJar();
    var areCookiesSet = false;

    var cookieKwest = mock(function (request, respond) {
      if (!areCookiesSet) {
        areCookiesSet = true;
        return respond({
          statusCode: 200,
          headers: {
            'set-cookie': 'hello=world'
          }
        });
      } else {
        assert.strictEqual(
          request.getHeader('cookie'),
          'hello=world'
        );
        return respond({
          statusCode: 200
        });
      }
    }).use(kwestCookies({
      jar: jar
    }));

    cookieKwest('http://www.example.com')
      .then(function (res) {
        return cookieKwest('http://www.example.com');
      })
      .then(function (res) {
        done();
      })
      .catch(done);

  });

  it('should add multiple cookies', function (done) {
    var jar = new tough.CookieJar();
    var areCookiesSet = false;

    var cookieKwest = mock(function (request, respond) {
      if (!areCookiesSet) {
        areCookiesSet = true;
        return respond({
          statusCode: 200,
          headers: {
            'set-cookie': [
              'hello=world',
              'test=success'
            ]
          }
        });
      } else {
        assert.strictEqual(
          request.getHeader('cookie'),
          'hello=world; test=success'
        );
        return respond({
          statusCode: 200
        });
      }
    }).use(kwestCookies({
      jar: jar
    }));

    cookieKwest('http://www.example.com')
      .then(function (res) {
        return cookieKwest('http://www.example.com');
      })
      .then(function (res) {
        done();
      })
      .catch(done);

  });

});
