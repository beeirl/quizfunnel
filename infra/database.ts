const cluster = planetscale.getDatabaseOutput({
  name: 'shopfunnel',
  organization: 'shopfunnel',
})

const branch =
  $app.stage === 'production'
    ? planetscale.getBranchOutput({
        name: 'production',
        organization: cluster.organization,
        database: cluster.name,
      })
    : new planetscale.Branch('DatabaseBranch', {
        database: cluster.name,
        organization: cluster.organization,
        name: $app.stage,
        parentBranch: 'production',
      })

const password = new planetscale.Password('DatabasePassword', {
  name: $app.stage,
  database: cluster.name,
  organization: cluster.organization,
  branch: branch.name,
})

export const database = new sst.Linkable('Database', {
  properties: {
    host: password.accessHostUrl,
    database: cluster.name,
    username: password.username,
    password: password.plaintext,
    port: 3306,
  },
})
