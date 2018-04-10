import { format, parse } from 'date-fns'
import ruLocale from 'date-fns/locale/ru'

export const localizedFormat = (date: Date, formatString: string) => {
  return format(date, formatString, { locale: ruLocale })
}

export const localizedParse = (value: string, formatString: string) => {
  return parse(value, formatString, new Date(), { locale: ruLocale })
}
