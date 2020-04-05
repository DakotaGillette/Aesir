//this shared config file can ensure shared config between bot and api for things like database

const config = {
    env: process.env.NODE_ENV || 'development',
    mongo_url: process.env.MONGO_URL || 'mongodb://localhost/aesir-dev',
    log_level: process.env.LOG_LEVEL || 'debug',
};

module.exports = config;