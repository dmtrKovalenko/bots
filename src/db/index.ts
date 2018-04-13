import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import config from '../constants/config'

if (!config.db.url) {
  throw new Error('Database url must be provided with DATABASE_URL env var')
}

const db: { [key: string]: Sequelize.Model<{}, {}> } = {}
const sequelize = new Sequelize(config.db.url, config.db.options)

fs
  .readdirSync(path.resolve(__dirname, 'models'))
  .filter(file => file.indexOf('.') > 0 && file !== 'index.ts')
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, 'models', file))
    db[model.name] = model;
  })

export { sequelize, Sequelize }
export default db
