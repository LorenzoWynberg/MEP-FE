import React from 'react'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
const useModalUsuario = () => {
  const [listadoUsuarios, setListadoUsuarios] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const RealizarBusquedaPaginada = async (rolid, pagina = 1, rows = 10, filtro = null) => {
    if (!rolid) return
    setLoading(true)
    const url = `${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/ObtenerUsuariosPorRolIdPaginated?rolid=${rolid}&pagina=${pagina}&rows=${rows}${filtro ? '&filtro=' + filtro : ''}`
    try {
      const response = await axios.get<any>(url)
      setListadoUsuarios(response.data.data)
      return response.data
    } catch (e) {
      console.log(e)
      return { error: true }
    } finally {
      setLoading(false)
    }
  }
  return {
    listadoUsuarios,
    RealizarBusquedaPaginada,
    loading
  }
}

export default useModalUsuario
