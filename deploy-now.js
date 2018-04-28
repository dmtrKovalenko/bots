const fs = require('fs')
const cmd = require('node-cmd')
const path = require('path')
const program = require('commander')

process.env.CLI = true;
program
  .option('--bot [bot]', 'Bot to deploy')
  .option('--env [env]', 'Environment to deploy')
  .parse(process.argv)

const { env, bot } = program
const name = `stand-bots-${env}-${bot}`

const config = {
  name,
  public: true,
  dotenv: `.env.${env}`,
  env: {
    // env variables can only be strings or numbers
    "START_VIBER": Boolean(bot === 'viber').toString(),
    "START_TELEGRAM": Boolean(bot === 'telegram').toString(),
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
