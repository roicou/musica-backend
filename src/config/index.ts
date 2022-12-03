import dotenv from 'dotenv';
import httpcodesConfig from '@/config/httpcodes.config';
const envFound = dotenv.config();
if (envFound.error) {
    // This error should crash whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
    /**
     * default port
     */
    port: process.env.PORT,

    /**
     * debug mode
     */
    debug: process.env.DEBUG === "true",

    /**
     * logs config
     */
    logs: {
        log_path: process.env.LOG_PATH || "logs",
        compress_before_days: process.env.COMPRESS_BEFORE_DAYS || 3,
        cron_hour: process.env.CRON_HOUR || 3
    },

    /**
     * database config
     */
    db: {
        uri: process.env.DB_URI,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
        // db: process.env.DB_NAME,
        // options: {
        //     // poolSize: 25,
        //     connectTimeoutMS: 60000,
        //     socketTimeoutMS: 600000,
        //     useUnifiedTopology: true
        // }
    },

    developmentVersion: process.env.DEVELOPMENT_VERSION === 'false' ? false : true,

    /**
     * jwt secret
     */
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        refresh_expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    },

    /**
     * api config
     */
    api: {
        prefix: process.env.API_PREFIX || ''
    },

    /**
     * httpcodes
     */
    httpcodes: httpcodesConfig,

    // /**
    //  * ssl config
    //  */
    //  ssl_credentials: {
    //     key: process.env.SSL_KEY || '',
    //     cert: process.env.SSL_CERT || '',
    //     ca: process.env.SSL_CA || ''
    // },
}