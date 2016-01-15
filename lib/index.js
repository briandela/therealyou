'use strict';

exports.register = function (server, options, next) {

    server.ext('onRequest', function (request, reply) {

        if (request.headers['x-forwarded-for']) {

            request.info.remoteAddress = request.headers['x-forwarded-for'].split(',')[0].trim();
        }

        if (request.headers['x-forwarded-port']) {

            request.info.remotePort = request.headers['x-forwarded-port'];
        }

        return reply.continue();
    });

    return next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
