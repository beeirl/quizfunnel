import { secret } from './secret'

export const storageBucket = new sst.cloudflare.Bucket('Bucket')

const storageManagedDomain = new cloudflare.R2ManagedDomain('StorageManagedDomain', {
  accountId: sst.cloudflare.DEFAULT_ACCOUNT_ID,
  bucketName: storageBucket.name,
  enabled: true,
}).domain

new cloudflare.R2BucketCors('StorageBucketCors', {
  accountId: sst.cloudflare.DEFAULT_ACCOUNT_ID,
  bucketName: storageBucket.name,
  rules: [
    {
      allowed: {
        headers: ['*'],
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
        origins: ['http://localhost:5173'],
      },
    },
  ],
})

export const storage = new sst.Linkable('Storage', {
  properties: {
    name: storageBucket.name,
    url: $interpolate`https://${storageManagedDomain}`,
    endpoint: `https://${sst.cloudflare.DEFAULT_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    accessKeyId: secret.CLOUDFLARE_R2_ACCESS_KEY_ID.value,
    secretAccessKey: secret.CLOUDFLARE_R2_SECRET_ACCESS_KEY.value,
  },
})
