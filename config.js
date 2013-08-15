var config = require('config-env').define('NODE_ENV', function(config) {
    config.common({
        name: 'benkyet'
    });

    config.config('dev', {
        mongo_uri: 'mongodb://localhost:27017/dev_benkyet',
        mandrill_key: 'rkunpHmExBR5biUVEiwquQ',
        mandrill_test: 'rR-vBeIRFJt5_Tesjflv1g',
        port: 3003
    });

    config.config('prod', {
        mongo_uri: 'mongodb://localhost:27017/benkyet',
        mandrill_key: '',
        port: 3000
    });
});

module.exports = config