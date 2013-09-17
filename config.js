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
        fb_id: '199098720262784',
        fb_secret: '1fb6f81445719664a9f4a74896e431ff',
        fb_callback: 'http://dev.benkyet.com/1.0/auth/facebook/callback',
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
        fb_id: '531334010270069',
        fb_secret: '54c6c9bcda9602be5beb01fc342ddd15',
        fb_callback: 'http://benkyet.com/auth/facebook/callback',
        mandrill_key: 'rkunpHmExBR5biUVEiwquQ',
        port: 3000
    });
});

module.exports = config