import { ThemeColors } from '../helpers/ThemeColors'
const colors = ThemeColors()

export const AreaChartData = (data) => {
  const labels = data
    ? data.labels
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const getData = data ? data.data : [65, 60, 68, 60, 58, 63, 60]
  const datasets = [
    {
      label: '',
      data: getData,
      borderColor: colors.themeColor2,
      pointBackgroundColor: colors.foregroundColor,
      pointBorderColor: colors.themeColor2,
      pointHoverBackgroundColor: colors.themeColor2,
      pointHoverBorderColor: colors.foregroundColor,
      pointRadius: 4,
      pointBorderWidth: 2,
      pointHoverRadius: 5,
      fill: true,
      borderWidth: 2,
      backgroundColor: colors.themeColor2_10
    }
  ]

  return {
    labels,
    datasets
  }
}
