import { CronJob } from 'cron'
import logger from './logger'
import { backup } from './backup'
import { removeOld } from './upload'
import { isRemoveOldBackupsActive, getPostfixes, getDatabaseConfigurations } from './util'

if (isRemoveOldBackupsActive()) {
  const removeOldBackupsCron = process.env.CRON_REMOVE_OLD_BACKUPS || '0 3 * * 0'
  new CronJob(removeOldBackupsCron, () => removeOld(), null, true)
}

const backupCron = process.env.CRON_BACKUP || '0 */6 * * *'
new CronJob(backupCron, async () => {
  try {
    logger.info('starting to backup!')
    await Promise.all(getDatabaseConfigurations().map(config => backup(config)))
    logger.info('all backups done!')
  } catch (e) {
    logger.error('error with backup!', e)
  }
}, null, true);

logger.info('junktroller listening!', getPostfixes(), ',', `remove old backups: ${isRemoveOldBackupsActive()}`)
