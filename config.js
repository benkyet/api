var config = require('config-env').define('NODE_ENV', function(config) {
    config.common({
        name: 'benkyet'
    });

    config.config('dev', {
        mongo_uri: 'mongodb://localhost:27017/dev_benkyet',
        domain: '@mail.benkyet.com',
        s3_key: 'AKIAICADFD3QBIHXQTOA',
        s3_secret: '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',
        s3_bucket: 'benkyet',
        s3_region: 'eu-west-1',
        s3_folder: 'test/',
        mandrill_key: 'rkunpHmExBR5biUVEiwquQ',
        mandrill_test: 'rR-vBeIRFJt5_Tesjflv1g',
        port: 3003
    });

    config.config('prod', {
        mongo_uri: 'mongodb://localhost:27017/benkyet',
        domain: '@benkyet.com',
        s3_key: 'AKIAICADFD3QBIHXQTOA',
        s3_secret: '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',
        s3_bucket: 'benkyet',
        s3_region: 'eu-west-1',
        s3_folder: 'prod/',
        mandrill_key: 'rkunpHmExBR5biUVEiwquQ',
        port: 3000
    });
});

module.exports = config