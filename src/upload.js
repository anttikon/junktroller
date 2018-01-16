import path from 'path'
import fs from 'fs'
import AWS from 'aws-sdk'
import Moment from 'moment'
import logger from './logger'

const awsEndpoint = process.env.AWS_ENDPOINT
const awsBucket = process.env.AWS_BUCKET

const spacesEndpoint = new AWS.Endpoint(awsEndpoint);

function deletes(files) {
  logger.info(awsEndpoint, 'delete', files)
  const params = {
    Bucket: awsBucket,
    Delete: {
      Objects: files.map(file => ({ Key: file })),
    }
  }

  const s3 = new AWS.S3({
    endpoint: spacesEndpoint
  })

  return new Promise((resolve, reject) => {
    s3.deleteObjects(params, function (err, data) {
      if (err) {
        logger.error(awsEndpoint, 'delete error', err)
        return reject(err)
      }
      logger.info(awsEndpoint, 'delete done', data)
      return resolve(data)
    })
  })
}

function listObjects() {
  const params = { Bucket: awsBucket }

  const s3 = new AWS.S3({
    endpoint: spacesEndpoint
  })

  return new Promise((resolve, reject) => {
    s3.listObjects(params, function (err, data) {
      if (err) {
        logger.error(awsEndpoint, 'list error', err)
        return reject(err)
      }
      return resolve(data.Contents.filter(content => new Moment().diff(content.LastModified, process.env.REMOVE_OLD_BACKUPS_UNIT) > process.env.REMOVE_OLD_BACKUPS_AMOUNT))
    })
  })
}

export const  removeOld = async () => {
  logger.info(awsEndpoint, 'remove old backups')
  const objects = await listObjects()
  return deletes(objects.map(obj => obj.Key))
}

export const upload = (filePath) => {
  logger.info(awsEndpoint, 'upload', filePath)
  const filename = path.basename(filePath)
  const fileStream = fs.createReadStream(filePath);

  return new Promise((resolve, reject) => {
    fileStream.on('error', function (err) {
      if (err) {
        logger.error(awsEndpoint, 'upload file stream error', err)
        return reject(err)
      }
    })
    fileStream.on('open', function () {
      const s3 = new AWS.S3({
        endpoint: spacesEndpoint
      });
      s3.putObject({
        Bucket: awsBucket,
        Key: filename,
        Body: fileStream
      }, (err) => {
        if (err) {
          logger.error(awsEndpoint, 'upload error', err)
          return reject(err)
        }
        logger.info(awsEndpoint, 'upload done', filePath)
        return resolve({ success: true, path: filePath, file: filename })
      })
    })
  })
}


