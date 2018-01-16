const { spawn } = require('child_process');
import logger from './logger'

export const run = (command, args) => {
  const cmd = spawn(command, args);
  return new Promise((resolve, reject) => {
    cmd.stdout.on('data', (data) => logger.verbose(command, 'stdout:', data.toString().trim()))
    cmd.stderr.on('data', (data) => logger.verbose(command, 'stderr:', data.toString().trim()))
    cmd.on('close', (code) => code === 0 ? resolve(`Success with command: ${command}`) : reject(`Error with command: ${command}`))
  })
}

export const isRemoveOldBackupsActive = () => process.env.REMOVE_OLD_BACKUPS === 'true'

export const getPostfixes = () => Object.keys(process.env)
  .filter(env => env.startsWith('DB_IP_'))
  .map(env => env.split('DB_IP_')[1])

export const getDatabaseConfigurations = () => getPostfixes().map(postfix => ({
  ip: process.env[`DB_IP_${postfix}`],
  port: process.env[`DB_PORT_${postfix}`],
  user: process.env[`DB_USER_${postfix}`],
  password: process.env[`DB_PASSWORD_${postfix}`],
  database: process.env[`DB_DATABASE_${postfix}`]
}))
