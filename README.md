# Junktroller

Junktroller is service that can:
- Backup mongo databases
- Transfer backups to S3 bucket
- Remove old backups from S3 bucket

# Dev
`yarn dev`

# Prod
`yarn build` and `yarn start`

## Database environment variables:

Env | Explanation
------------ | -------------
DB_IP_API | Database IP
DB_PORT_API | Database port
DB_USER_API | Database username
DB_PASSWORD_API | Database password
DB_DATABASE_API | Database name

## You can specify multiple databases like this:

Env | Explanation
------------ | -------------
DB_IP_API | Database IP
DB_PORT_API | Database port
DB_USER_API | Database username
DB_PASSWORD_API | Database password
DB_DATABASE_API | Database name
DB_IP_API2 | Database IP
DB_PORT_API2 | Database port
DB_USER_API2 | Database username
DB_PASSWORD_API2 | Database password
DB_DATABASE_API2 | Database name

## Required environment variables:

Env | Explanation
------------ | -------------
AWS_BUCKET | S3 Bucket name
AWS_ENDPOINT | Your AWS endpoint name

## Optional environment variables:
Env | Explanation
------------ | -------------
REMOVE_OLD_BACKUPS | Should junktroller remove old backups automatically
REMOVE_OLD_BACKUPS_UNIT | "days", "hours", "minutes" etc. For example 12 hours means that junktroller will remove backups that are older than 12 hours.
REMOVE_OLD_BACKUPS_AMOUNT | 1, 2, 12 or 24. For example 12 hours means that junktroller will remove backups that are older than 12 hours.
CRON_REMOVE_OLD_BACKUPS | How often old backups should be checked? Defaults to `0 3 * * 0`
CRON_BACKUP | How often new backups should be taken? Defaults to `0 */6 * * *`
