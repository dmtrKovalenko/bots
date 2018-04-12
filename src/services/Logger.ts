import Analytics from 'analytics-node'

if (!process.env.ANALYTICS_KEY) {
  throw new Error('Analytics key should be provided')
}

export default new Analytics(process.env.ANALYTICS_KEY)
