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
  ]
}
