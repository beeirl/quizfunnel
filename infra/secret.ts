// prettier-ignore
export const secret = {
  CLOUDFLARE_API_TOKEN: new sst.Secret('CLOUDFLARE_API_TOKEN', process.env.CLOUDFLARE_API_TOKEN),
  CLOUDFLARE_DEFAULT_ACCOUNT_ID: new sst.Secret('CLOUDFLARE_DEFAULT_ACCOUNT_ID', sst.cloudflare.DEFAULT_ACCOUNT_ID),
  GOOGLE_CLIENT_ID: new sst.Secret('GOOGLE_CLIENT_ID', process.env.GOOGLE_CLIENT_ID),
}
export const allSecrets = Object.values(secret)
