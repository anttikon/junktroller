import { run } from './util'
import { upload } from './upload'
import logger from './logger'

function getPaths(database) {
  const dir = '/tmp'
  const name = `${database}-${new Date().getTime()}`
  const tarName = `${name}.tar.gz`
  const dumpDir = `${dir}/${name}`
  const tarPath = `${dir}/${tarName}`
  return { dir, name, tarName, dumpDir, tarPath }
}

export const backup = async ({ ip, port, user, password, database }) => {
  logger.info('backup', database)
  const { dir, name, tarName, dumpDir, tarPath } = getPaths(database)
  logger.info('mongodump', database)
  await run('mongodump', ['-h', `${ip}:${port}`, '-u', user, '-p', password, '-d', database, '-o', dumpDir])
  logger.info('compress', database)
  await run('tar', ['-C', dir, '-czvf', tarPath, name])
  logger.info('uploading', tarPath)
  await upload(tarPath)
  logger.info('backup ready!', database)
  return { directory: dir, targetDir: name, targetFile: tarName }
}
