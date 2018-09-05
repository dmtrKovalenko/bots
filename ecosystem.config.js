module.exports = {
  apps: [
    {
      name: 'viber',
      script: 'build/bots/viber.js',
      env: {
        NODE_ENV: 'production',
      },
      watch: false
    },
    {
      name: 'telegram',
      script: 'build/bots/telegram.js',
      env: {
        NODE_ENV: 'production',
      },
      watch: false
    },
  ],
  deploy: {
    prod: {
      user: 'admin',
      host: ['ec2-18-185-112-145.eu-central-1.compute.amazonaws.com'],
      key: '/Users/dmitrijkovalenko/dmitriy-kovalenko-aws-bots.pem',
      ref: 'origin/develop',
      repo: 'https://github.com/dmtrKovalenko/stand-bots.git',
      path: '/home/admin/stand-bots',
      'post-setup': "ls -la",
      'post-deploy': "echo 'YRRRA'"
    }
  }
}
