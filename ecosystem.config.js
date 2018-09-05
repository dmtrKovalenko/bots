const path = require('path')
require('dotenv').config({ path: path.resolve('.env.prod') })

const customEnvKeys = ['NODE_ENV', 'NOW_URL', 'TEAMUP_TOKEN', 'TEAMUP_SUBCALENDAR_ID', 'DATABASE_URL', 'MIXPANEL_KEY', 'VIBER_BOT_TOKEN', 'TELEGRAM_BOT_TOKEN', 'REDIS_HOST', 'REDIS_PORT', 'REDIS_PASSWORD',]
const prodEnv = Object.keys(process.env)
  .filter(key => customEnvKeys.includes(key))
  .reduce((obj, key) => {
    obj[key] = process.env[key];
    return obj;
  }, {});

module.exports = {
  apps: [
    {
      name: 'viber',
      script: 'build/app.js',
      env: {
        ...prodEnv,
        START_VIBER: 'true',
      },
      watch: false
    },
    {
      name: 'telegram',
      script: 'build/app.js',
      env: {
        ...prodEnv,
        START_TELEGRAM: 'true',
      },
      watch: false
    },
    {
      name: 'cron',
      script: 'build/app.js',
      env: {
        ...prodEnv,
        START_CRON: 'true',
      },
      watch: false
    },
  ],
  deploy: {
    prod: {
      user: 'admin',
      host: [process.env.NOW_URL],
      ref: 'origin/feature/monthly-meta',
      repo: 'https://github.com/dmtrKovalenko/stand-bots.git',
      path: '/home/admin/stand-bots',
      'post-deploy': "bash ./scripts/post-deploy.sh"
    }
  }
}
