export const getBase64 = (file, cb) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function () {
    cb(reader.result)
  }
  reader.onerror = function (error) {
    console.log('Error: ', error)
  }
}

export const getBase64Promise = (file) => new Promise(
  (resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function () {
      resolve(reader.result)
    }
    reader.onerror = function (error) {
      reject(error)
    }
  }
)
