const Lab = require('@hapi/lab');
const Hapi = require('@hapi/hapi');
const Code = require('@hapi/code');

const lab = (exports.lab = Lab.script());
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;
const before = lab.before;

describe('x-forwarded-for', () => {
    let server;

    before(() => {
        server = new Hapi.Server();

        server
            .register({
                plugin: require('..')
            })
            .then(() => {
                server.start();
            });
        server.route({
            method: 'GET',
            path: '/',
            handler: function (request) {
                return request.info.remoteAddress;
            }
        });
    });

    it('sets request.info.remoteAddress to the first value of x-forwarded-for', async () => {
        const requestOptions = {
            method: 'GET',
            url: '/',
            headers: {
                'x-forwarded-for': '192.16.184.0'
            }
        };

        const res = await server.inject(requestOptions);
        expect(res.statusCode).to.equal(200);
        expect(res.result).to.equal('192.16.184.0');
    });

    it('works when there are multiple addresses in x-forwarded-for', async () => {
        const requestOptions = {
            method: 'GET',
            url: '/',
            headers: {
                'x-forwarded-for': '192.16.184.5, 192.16.184.6, 192.16.184.2'
            }
        };

        const res = await server.inject(requestOptions);
        expect(res.statusCode).to.equal(200);
        expect(res.result).to.equal('192.16.184.5');
    });

    it('does not change request.info.remoteAddress if there is no x-forwarded-for', async () => {
        const requestOptions = {
            method: 'GET',
            url: '/'
        };

        const res = await server.inject(requestOptions);
        expect(res.statusCode).to.equal(200);
        expect(res.result).to.equal('127.0.0.1');
    });
});

describe('x-forwarded-port', () => {
    let server;

    before(() => {
        server = new Hapi.Server();

        server
            .register({
                plugin: require('..')
            })
            .then(() => {
                server.start();
            });
        server.route({
            method: 'GET',
            path: '/',
            handler: function (request) {
                return request.info.remotePort;
            }
        });
    });

    it('sets request.info.remotePort to the value of x-forwarded-for', async () => {
        const requestOptions = {
            method: 'GET',
            url: '/',
            headers: {
                'x-forwarded-port': '3781'
            }
        };
        const res = await server.inject(requestOptions);
        expect(res.statusCode).to.equal(200);
        expect(res.result).to.equal('3781');
    });

    it('does not change request.info.remotePort if there is no x-forwarded-port', async () => {
        const requestOptions = {
            method: 'GET',
            url: '/'
        };

        const res = await server.inject(requestOptions);
        expect(res.statusCode).to.equal(204);
        expect(res.result).to.be.equal(null);
    });
});
