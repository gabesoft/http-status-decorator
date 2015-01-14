var Boom  = require('boom')
  , codes = {
        400 : 'badRequest'
      , 401 : 'unauthorized'
      , 403 : 'forbidden'
      , 404 : 'notFound'
      , 405 : 'methodNotAllowed'
      , 406 : 'notAcceptable'
      , 407 : 'proxyAuthRequired'
      , 408 : 'clientTimeout'
      , 409 : 'conflict'
      , 410 : 'resourceGone'
      , 411 : 'lengthRequired'
      , 412 : 'preconditionsFailed'
      , 413 : 'entityTooLarge'
      , 414 : 'uriTooLong'
      , 415 : 'unsupportedMediaType'
      , 416 : 'rangeNotSatisfiable'
      , 417 : 'expectationFailed'
      , 422 : 'badData'
      , 429 : 'tooManyRequests'
      , 500 : 'internal'
      , 501 : 'notImplemented'
      , 502 : 'badGateway'
      , 503 : 'serverTimeout'
      , 504 : 'gatewayTimeout'
    };

function capitalize (text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

module.exports.register = function (server, options, next) {
    server.decorate('reply', 'boom', function (err) {
        if (typeof err === 'string') {
            return this(Boom.internal(err));
        } else if (err instanceof Error) {
            return this(Boom.wrap(err, err.statusCode, err.message));
        } else {
            return this(Boom.create(err.statusCode, err.message, err));
        }
    });

    server.decorate('reply', 'boomCreate', function () {
        return this(Boom.create.apply(Boom, arguments));
    });

    server.decorate('reply', 'boomWrap', function () {
        return this(Boom.wrap.apply(Boom, arguments));
    });

    Object.keys(codes).forEach(function (code) {
        var fn = codes[code];
        server.decorate('reply', fn, function () {
            return this(Boom[fn].apply(Boom, arguments));
        });
    });

    server.decorate('reply', 'created', function (data, uri) {
        return this(data).created(uri);
    });

    server.decorate('reply', 'noContent', function () {
        return this().code(204);
    });

    return next();
};

module.exports.register.attributes = {
    pkg : require('../package.json')
};
