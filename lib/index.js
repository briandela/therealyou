exports.plugin = {  
  register: (server, options) => {
    server.ext({
        type: 'onRequest',
        method: function (request, h) {
            if (request.headers['x-forwarded-for']) {
                request.info.remoteAddress = request.headers['x-forwarded-for'].split(',')[0].trim();
            }
            if (request.headers['x-forwarded-port']) {
                request.info.remotePort = request.headers['x-forwarded-port'];
            }
            return h.continue;
        }
    });
  },
  pkg: require('../package.json')
}