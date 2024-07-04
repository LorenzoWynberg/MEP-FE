export const getIdByName = (name, list) => {
  let _id = -1
  list.map((item) => {
    if (item.name === name || item.nombre === name) {
      _id = item.id
    }
  })
  return _id
}

export const getNameById = (id, list) => {
  let _name = ''
  list.map((item) => {
    if (item.id == id) {
      _name = item.nombre || item.name
    }
  })
  return _name
}

export const parseData = (item) => {
  let color
  if (item.estado || item.state) {
    color = 'success'
  } else {
    color = 'warning'
  }
  const _objData = {
    id: item.id,
    enUso: (item.enUso) ? 'SI' : 'NO',
    state: (item.estado || item.state) ? 'ACTIVO' : 'INACTIVO',
    name: item.nombre || item.name,
    statusColor: color
  }
  return _objData
}

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const ScrollToBottom = () => {
  window.scrollTo(0, document.body.scrollHeight)
}
