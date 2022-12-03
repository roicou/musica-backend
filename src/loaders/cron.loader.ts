import logger from '@/libs/logger';
import cron from 'node-cron';
export default () => {
    cron.schedule('* * * * *', () => logger.info('running a task every minute in /src/loaders/cron.loader.ts'));
}