const fs = require('fs')
const cmd = require('node-cmd')
const path = require('path')
const program = require('commander')

process.env.CLI = true;
program
  .option('--app [app]', 'Bot to deploy')
  .option('--env [env]', 'Environment to deploy')
  .parse(process.argv)

const { env, app } = program
const name = `stand-bots-${env}-${app}`

const config = {
  name,
  public: true,
  dotenv: `.env.${env}`,
  env: {
    // env variables can only be strings or numbers
    "START_VIBER": Boolean(app === 'viber').toString(),
    "START_TELEGRAM": Boolean(app === 'telegram').toString(),
    "START_CRON": Boolean(app === 'cron').toString()
  },
  bru: {
    min: 1,
    max: 1
  },
  files: [
    ".env",
    ".env.stage",
    "src",
    ".sequelizerc",
    "tsconfig.json",
    "migrations",
    "ecosystem.config.js",
    "typings.d.ts",
    "now.json"
  ]
}

cmd.get(`now rm ${name} --yes`, () => console.log(`> All previous deployments for ${name} have been removed`))

fs.writeFile('now.json', JSON.stringify(config), (error) => {
  if (error) {
    throw error
  }

  console.log('> Successfully created config file')
})
