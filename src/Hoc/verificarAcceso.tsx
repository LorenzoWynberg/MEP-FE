import React from 'react'
import { useSelector } from 'react-redux'

type actionType = 'agregar' | 'eliminar' | 'leer' | 'modificar'

export const verificarAcceso = (Component: React.ComponentType) => {
  return (props: any) => {
    const auth = useSelector((store) => {
      return {
        ...store.authUser
      }
    })
    // section: string | string[] donde el string o los strings son los codigos de seccion |---| action: string donde el string es el nombre de la accion que se quiere realizar [agregar,eliminar,leer,modificar]
    const verificarAcceso = (
      section: string | string[],
      action: actionType
    ): boolean => {
      if (Array.isArray(section)) {
        return auth.rolPermisos.some((el) => {
          return (
            section.includes(el.codigoSeccion) &&
						(!action || el[action] === 1)
          )
        })
      }

      /* const esAdministrador = auth.currentRoleOrganizacion.accessRole.rolId == 1
            if(esAdministrador)
                return true
            else{ */
      const rolePermision = auth.rolPermisos.find(
        (el) => el.codigoSeccion == section
      )
      return rolePermision ? rolePermision[action] === 1 : false
      // }
    }

    return <Component verificarAcceso={verificarAcceso} {...props} />
  }
}
