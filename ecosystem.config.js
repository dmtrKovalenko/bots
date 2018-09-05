module.exports = {
  apps: [
    {
      name: 'viber',
      script: 'build/app.js',
      env: {
        START_VIBER: 'true',
      },
      watch: false
    },
    {
      name: 'telegram',
      script: 'build/app.js',
      env: {
        START_TELEGRAM: 'true',
      },
      watch: false
    },
    {
      name: 'cron',
      script: 'build/app.js',
      env: {
        START_CRON: 'true',
      },
      watch: false
    },
  ],
  deploy: {
    prod: {
      user: 'admin',
      host: ["ec2-18-185-112-145.eu-central-1.compute.amazonaws.com"],
      ref: 'origin/feature/monthly-meta',
      repo: 'https://github.com/dmtrKovalenko/stand-bots.git',
      path: '/home/admin/stand-bots',
      'post-deploy': "bash ./scripts/post-deploy.sh origin/feature/monthly-meta"
    }
  }
}
