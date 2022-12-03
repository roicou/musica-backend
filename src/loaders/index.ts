import expressLoader from '@/loaders/express.loader';
import mongooseLoader from '@/loaders/mongoose.loader';
import { Application } from 'express';
import compresslogsLoader from '@/loaders/compresslogs.loader';
import cronLoader from '@/loaders/cron.loader';
export default async (app: Application) => {
    // connect mongodb
    try {
        await mongooseLoader();
        await expressLoader(app);
        await compresslogsLoader();
        // cronLoader(); // cron jobs
    } catch (err) {
        throw new Error(err);
    }
}