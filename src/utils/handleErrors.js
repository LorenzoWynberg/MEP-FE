export function handleErrors (error) {
  let data = []
  const errors = []
  const fields = []

  if (error.response) {
    switch (error.response.status) {
      case 400:
        data = error.response.data.errors
        for (const property in data) {
          errors[property] = data[property][0]
          fields[property] = true
        }
        data = { code: 400, errors, fields }
        break
      case 401:
        data = { errors, fields }
        break
      case 402:
        data = { errors, fields }
        break
      case 403:
        data = { errors, fields }
        break
      case 404:
        data = { errors, fields }
        break
      case 409:
        data = { errors, fields }
        break
      default:
        data = { errors, fields }
    }
  } else {
    data = { errors, fields }
  }
  return data
}
