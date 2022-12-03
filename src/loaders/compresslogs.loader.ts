import config from "@/config";
import logger from "@/libs/logger";
import cron from "node-cron";
import tar from "tar";
import fs from "fs";
import path from "path";
import { DateTime, Settings } from "luxon";
Settings.defaultZone = "Europe/Madrid";

export default async () => {
    // at 0:00 all days, search log files in config.logs.log_path, check if created_date is before 3 days, if so, compress and delete
    cron.schedule("0 " + config.logs.cron_hour + " * * *", async () => {
        try {
            logger.info("Checking for compress logs...");
            const log_path = path.join(process.cwd(), config.logs.log_path);
            const files = fs.readdirSync(log_path);
            for (const file of files) {
                // if last 3 characters doesn't are log, continue
                // don't uses file.substr
                if (file.slice(-4) !== ".log") {
                    continue;
                }

                const file_path = path.join(log_path, file);
                const file_stat = fs.statSync(file_path);
                const file_created_date = DateTime.fromMillis(file_stat.birthtimeMs);
                const now = DateTime.local();
                const diff = now.diff(file_created_date, "days").toObject();
                if (diff.days > config.logs.compress_before_days) {
                    logger.info(`Compressing ${file_path}...`);
                    // tar in tar.xz
                    const tar_path = path.join(log_path, file + ".tar.xz");
                    await tar.c(
                        {
                            gzip: true,
                            file: tar_path,
                            cwd: log_path,
                        },
                        [file]
                    );
                    // delete original file
                    fs.unlinkSync(file_path);
                    logger.info('log ' + file + ' compressed');
                }
            }
        } catch (e) {
            logger.error(e);
        }
    }, {
        scheduled: true,
        timezone: "Europe/Madrid"
    });
    logger.info('compresslogs.loader loaded');
};