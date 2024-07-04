import moment from 'moment'

export const getYearsOld = (birthDate) => {
  const bDay = moment(birthDate, [
    'YYYYMMDD',
    'DD/MM/YYYY',
    'MM/DD/YYYY'
  ]).toDate()
  const diffYear = moment().diff(bDay, 'years')
  const diffMoth = moment().diff(bDay, 'months') % 12
  return `${diffYear} años ${diffMoth > 0 ? `y ${diffMoth} meses` : ''}`
}

export const calculateAge = (dateOfBirth) => {
  const years = moment().diff(dateOfBirth, 'years')
  const element = new String(`${years} años`)
  element.getYear = () => {
    return years
  }
  return element
}

export const getDiffDates = (initDate, finalDate) => {
  const initDay = moment(initDate, [
    'YYYYMMDD',
    'DD/MM/YYYY',
    'MM/DD/YYYY'
  ]).toDate()
  const finalDay = moment(finalDate, [
    'YYYYMMDD',
    'DD/MM/YYYY',
    'MM/DD/YYYY'
  ]).toDate()
  const diffYear = moment(finalDay).diff(initDay, 'years')
  const diffMoth = moment(finalDay).diff(initDay, 'months') % 12
  return `${diffYear} años ${diffMoth > 0 ? `y ${diffMoth} meses` : ''}`
}
