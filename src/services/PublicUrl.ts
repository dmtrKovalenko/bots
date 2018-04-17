import fetch from 'node-fetch'

export default (): Promise<string> => {
  if (process.env.HEROKU_URL) {
    return Promise.resolve(process.env.HEROKU_URL)
  }

  return fetch('http://localhost:4040/api/tunnels')
    .then(res => res.json())
    .then(data => data.tunnels.filter((t: any) => t.proto === 'https').pop().public_url)
    .catch(console.log)
}
