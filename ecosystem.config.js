module.exports = {
  apps: [
    {
      name: 'viber',
      script: 'build/app.js',
      env: {
        START_VIBER: 'true',
        NODE_ENV: 'production',
      },
      watch: false
    },
    {
      name: 'telegram',
      script: 'build/app.js',
      env: {
        START_TELEGRAM: 'true',
        NODE_ENV: 'production',
      },
      watch: false
    },
    {
      name: 'cron',
      script: 'build/app.js',
      env: {
        START_CRON: 'true',
        NODE_ENV: 'production',
      },
      watch: false
    },
  ],
  deploy: {
    prod: {
      user: 'admin',
      host: ['ec2-18-185-112-145.eu-central-1.compute.amazonaws.com'],
      ref: 'origin/feature/monthly-meta',
      repo: 'https://github.com/dmtrKovalenko/stand-bots.git',
      path: '/home/admin/stand-bots',
      'post-deploy': "./scripts/post-deploy.sh"
    }
  }
}
