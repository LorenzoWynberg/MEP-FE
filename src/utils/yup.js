import * as yup from 'yup'

yup.addMethod(yup.string, 'mintel', function (min = 9, msg) {
  return this.test({
    name: 'mintel',
    exclusive: true,
    message: msg,
    test: value => {
      value = value.split('_')[0]
      if (value.length > 0) {
        return !value || value.length >= min
      } else {
        return true
      }
    }
  })
})

export default yup
