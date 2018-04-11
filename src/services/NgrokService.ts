import * as http from 'http'

const options = {
  hostname: '127.0.0.1',
  port: 4040,
  path: '/api/tunnels',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
};

export default class NgrokService {
  static getPublicUrl() {
    if (process.env.HEROKU_URL) {
      return Promise.resolve(process.env.HEROKU_URL)
    }

    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (config) => {
          const parsedConfig = JSON.parse(config as string);
          const httpsTunnel = parsedConfig.tunnels.filter((t: any) => t.proto === 'https').pop();

          resolve(httpsTunnel.public_url);
        });
      });

      req.on('error', (e) => reject(e.message))
      req.end();
    });
  }
}
