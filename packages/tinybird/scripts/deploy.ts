#!/usr/bin/env bun

import { $ } from 'bun'
import path from 'path'

const dir = new URL('..', import.meta.url).pathname
const root = path.resolve(dir, '..', '..')

const TOKEN_NAME = 'api'

// Parse arguments
const stageArg = process.argv.includes('--stage') ? process.argv[process.argv.indexOf('--stage') + 1] : undefined
const branchArg = process.argv.includes('--branch') ? process.argv[process.argv.indexOf('--branch') + 1] : undefined

if (!stageArg && !branchArg) {
  throw new Error('Either --stage or --branch is required')
}

const stage = stageArg ?? branchArg!
const branch = branchArg ?? stageArg!
const force = process.argv.includes('--force')
const isProduction = stage === 'production'

console.log(`Stage: ${stage}`)
console.log(`Target: ${isProduction ? 'Tinybird Cloud' : `Tinybird Branch "${branch}"`}`)

// Deploy
if (isProduction) {
  console.log('Deploying to Tinybird Cloud...')
  await $`TB_VERSION_WARNING=0 tb --cloud deploy --wait`.cwd(dir)
} else {
  const branches = await $`TB_VERSION_WARNING=0 tb --cloud branch ls`
    .cwd(dir)
    .text()
    .catch(() => '')

  const branchExists = new RegExp(`\\b${branch}\\b`).test(branches)
  if (!branchExists) {
    console.log(`Creating branch "${branch}"...`)
    await $`TB_VERSION_WARNING=0 tb --cloud branch create ${branch}`.cwd(dir)
  }

  console.log(`Deploying to branch "${branch}"...`)
  await $`TB_VERSION_WARNING=0 tb --branch ${branch} deploy --wait`.cwd(dir)
}

console.log(`Retrieving ${TOKEN_NAME} token...`)
const token = await (async () => {
  const tbArgs = isProduction ? ['--cloud'] : ['--branch', branch]
  const output = await $`TB_VERSION_WARNING=0 tb ${tbArgs} --show-tokens token ls`.cwd(dir).text()

  const lines = output.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // YAML format: "name: api" followed by "token: p.xxx"
    if (line?.trim() === `name: ${TOKEN_NAME}`) {
      const tokenLine = lines[i + 1]
      if (tokenLine?.startsWith('token: ')) {
        return tokenLine.replace('token: ', '').trim()
      }
    }
    // Table format: "| api | p.xxx... |" - find row with exact name match in first column
    if (line?.includes('|')) {
      const columns = line.split('|').map((col) => col.trim())
      if (columns[1] === TOKEN_NAME && columns[2]?.startsWith('p.')) {
        return columns[2]
      }
    }
  }
  throw new Error(`Token '${TOKEN_NAME}' not found`)
})()

if (!token.startsWith('p.')) {
  throw new Error('Invalid token format')
}

// Check if SST secret is already up to date
const secrets = await $`bunx sst secret list --stage ${stage}`
  .cwd(root)
  .text()
  .catch(() => '')
const lines = secrets.split('\n')
const currentToken = lines.find((line) => line.startsWith('TINYBIRD_TOKEN='))?.split('=')[1]

if (currentToken === token && !force) {
  console.log('TINYBIRD_TOKEN already up to date.')
  process.exit(0)
}

// Set SST secret
console.log(currentToken ? 'Updating TINYBIRD_TOKEN...' : 'Setting TINYBIRD_TOKEN...')
await $`bunx sst secret set TINYBIRD_TOKEN ${token} --stage ${stage}`.cwd(root)

console.log('Done!')
