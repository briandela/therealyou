'use strict';

const Lab = require('lab');
const Hapi = require('hapi');
const Code = require('code');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;
const before = lab.before;

describe('x-forwarded-for', function () {

    let server;

    before(function (done) {

        server = new Hapi.Server();
        server.connection();

        server.route({
            method: 'GET',
            path: '/',
            handler: function (request, reply) {

                return reply(request.info.remoteAddress);
            }
        });

        server.register(require('..'), done);
    });

    it('sets request.info.remoteAddress to the first value of x-forwarded-for', function (done) {

        const requestOptions = {
            method: 'GET',
            url: '/',
            headers: {
                'x-forwarded-for': '192.16.184.0'
            }
        };

        server.inject(requestOptions, function (res) {

            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal('192.16.184.0');

            done();
        });
    });

    it('works when there are multiple addresses in x-forwarded-for', function (done) {

        const requestOptions = {
            method: 'GET',
            url: '/',
            headers: {
                'x-forwarded-for': '192.16.184.5, 192.16.184.6, 192.16.184.2'
            }
        };

        server.inject(requestOptions, function (res) {

            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal('192.16.184.5');

            done();
        });
    });

    it('does not change request.info.remoteAddress if there is no x-forwarded-for', function (done) {

        const requestOptions = {
            method: 'GET',
            url: '/'
        };

        server.inject(requestOptions, function (res) {

            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal('127.0.0.1');

            done();
        });
    });
});

describe('x-forwarded-port', function () {

    let server;

    before(function (done) {

        server = new Hapi.Server();
        server.connection();

        server.route({
            method: 'GET',
            path: '/',
            handler: function (request, reply) {

                return reply(request.info.remotePort);
            }
        });

        server.register(require('..'), done);
    });

    it('sets request.info.remotePort to the value of x-forwarded-for', function (done) {

        const requestOptions = {
            method: 'GET',
            url: '/',
            headers: {
                'x-forwarded-port': '3781'
            }
        };

        server.inject(requestOptions, function (res) {

            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal('3781');

            done();
        });
    });

    it('does not change request.info.remotePort if there is no x-forwarded-port', function (done) {

        const requestOptions = {
            method: 'GET',
            url: '/'
        };

        server.inject(requestOptions, function (res) {

            expect(res.statusCode).to.equal(200);
            expect(res.result).to.be.null();

            done();
        });
    });
});
