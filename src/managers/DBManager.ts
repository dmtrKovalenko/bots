import JsonDb from 'node-json-db'

export default class DBManager {
  db: JsonDb;

  constructor(name: string) {
    this.db = new JsonDb(`db/${name}`)
  }

  push(key: string, value: string) {
    this.db.push(`/${key}`, value)
  }

  get(key: string) {
    this.db.getData(`/${key}`)
  }
}
