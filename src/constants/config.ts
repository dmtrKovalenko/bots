export const env = process.env.NODE_ENV || 'development'

export default {
  availableDateFormats: ['DD MM', 'DD.MM', 'DDDo MM'],
  db: {
    url: process.env.DATABASE_URL,
    options: {
      define: {
        underscored: true,
        underscoredAll: true
      },
      dialect: 'postgres'
    }
  }
}
