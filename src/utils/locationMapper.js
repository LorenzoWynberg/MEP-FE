export const provinciaMapper = (provincias) => {
  return provincias.map((provincia) => {
    const _objData = {
      label: provincia.nombre,
      value: provincia.id,
      cantones: provincia.cantones
    }
    return _objData
  })
}

export const cantonMapper = (provincia) => {
  return provincia && provincia.cantones.map((canton) => {
    const _objData = {
      label: canton.nombre,
      value: canton.id,
      distritos: canton.distritos
    }
    return _objData
  })
}

export const distritoMapper = (canton) => {
  return canton && canton.distritos.map((distrito) => {
    const _objData = {
      label: distrito.nombre,
      value: distrito.id,
      poblados: distrito.poblados
    }
    return _objData
  })
}

export const pobladoMapper = (distrito) => {
  return distrito && distrito.poblados.map((poblado) => {
    const _objData = {
      label: poblado.nombre,
      value: poblado.id
    }
    return _objData
  })
}
