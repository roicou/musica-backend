/**
 * main app
 * @version 1.0.0
 */
import express, { Application } from 'express';

import config from '@/config';
import loaders from '@/loaders';
import logger from '@/libs/logger';
// import https from 'https';
// import fs from 'fs';


void (async (): Promise<void> => {
    logger.debug('Debug mode enabled');
    const app: Application = express();

    // let server: Application | https.Server = app;
    // if (!config.developmentVersion) {
    //     const credentials = {
    //         ca: fs.readFileSync(config.ssl_credentials.ca),
    //         key: fs.readFileSync(config.ssl_credentials.key),
    //         cert: fs.readFileSync(config.ssl_credentials.cert)
    //     };
    //     server = https.createServer(credentials, app);
    // }


    await loaders(app)
        .catch(err => {
            logger.error("Error in loaders:", err);
            process.exit(1);
        });

    app.listen(config.port, () => {
        logger.info(`
        #####################################
        #   Server listening on port: ${config.port}  #
        #####################################
       `);
    }).on('error', err => {
        logger.error(err);
        process.exit(1);
    });
})();