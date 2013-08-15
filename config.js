var config = require('config-env').define('NODE_ENV', function(config) {
    config.common({
        name: 'benkyet',
        express_port: process.env.PORT || 3000
    });

    config.config('dev', {
        mongo_uri: 'mongodb://localhost:27017/benkyet',
        mandrill_key: 'rkunpHmExBR5biUVEiwquQ',
        mandrill_test: 'rR-vBeIRFJt5_Tesjflv1g'
    });

    config.config('prod', {
        mongo_uri: 'mongodb://localhost:27017/benkyet',
        mandrill_key: ''
    });
});

module.exports = config;