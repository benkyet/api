var config = require('config-env').define('ENV', function(config) {
    config.common({
        name: 'benkyet'
    });

    config.config('local', {

    });

    config.config('dev', {
        mongo_uri: 'mongodb://localhost:27017/dev_benkyet',
        domain: '@mail.benkyet.com',
        s3_key: 'AKIAICADFD3QBIHXQTOA',
        s3_secret: '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',
        s3_bucket: 'benkyet',
        s3_region: 'eu-west-1',
        s3_folder: 'test/',
        fb_id: '242355285916432',
        fb_secret: '5325b432b62e14967c2153bf4e6bd860',
        fb_callback: 'http://localhost:8000/1.0/auth/facebook/callback',
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
        fb_id: '199098720262784',
        fb_secret: '1fb6f81445719664a9f4a74896e431ff',
        fb_callback: 'http://benkyet.com/1.0/auth/facebook/callback',
        mandrill_key: 'rkunpHmExBR5biUVEiwquQ',
        port: 3000
    });
});

module.exports = config