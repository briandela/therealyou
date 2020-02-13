exports.plugin = {

    register: (server) => {

        server.ext({
            type: 'onRequest',
            method: function (request, h) {

                if (request.headers['x-forwarded-for']) {

                    request.info._remoteAddress = request.headers['x-forwarded-for'].split(',')[0].trim();
                }

                if (request.headers['x-forwarded-port']) {
                    request.info._remotePort = request.headers['x-forwarded-port'];
                }

                return h.continue;
            }
        });
    },

    pkg: require('../package.json')
};
