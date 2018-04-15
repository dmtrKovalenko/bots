import path from 'path'
import { Sequelize } from 'sequelize-typescript';
import config from '../constants/config'

if (!config.db.url) {
  throw new Error('Database url must be provided with DATABASE_URL env var')
}

const sequelize = new Sequelize({
  url: config.db.url,
  modelPaths: [path.resolve(__dirname, 'models')],
  ...config.db.options
})

export default sequelize 

