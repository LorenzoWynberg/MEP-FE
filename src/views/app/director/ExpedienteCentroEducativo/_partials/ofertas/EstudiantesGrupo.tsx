import React, { useEffect, useState } from 'react'
import HTMLTable from 'Components/HTMLTable'
import { getAllStudentsByGroup, trasladarMiembros, registrarCondicion } from '../../../../../../redux/grupos/actions'
import { useActions } from 'Hooks/useActions'
import { PaginatedGroupMemberWithoutGroupRequest } from '../../../../../../redux/grupos/types'
import { useSelector } from 'react-redux'
import { format, parseISO } from 'date-fns'
import withRouter from 'react-router-dom/withRouter'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import NavigationContainer from '../../../../../../components/NavigationContainer'

const step1Columns = [
  {
    column: 'identificacion',
    label: 'Identificación'
  },
  {
    column: 'nombreCompleto',
    label: 'Nombre completo'
  },
  {
    column: 'fechaNacimientoP',
    label: 'Fecha nacimiento'
  },
  {
    column: 'nacionalidad',
    label: 'Nacionalidad'
  },
  {
    column: 'condicion',
    label: 'Condición',
    isBadge: true,
    color: (el) => {
      switch (el.condicionId) {
        case 1:
          return 'success'
        case 2:
          return 'danger'
        case 3:
          return 'warning'
        default:
          return 'warning'
      }
    }
  }
]

const EstudiantesGrupo = (props) => {
  const [pagination, setPagination] = useState<any>({})

  const actions = useActions({
    getAllStudentsByGroup,
    trasladarMiembros,
    registrarCondicion
  })

  useEffect(() => {
    const initialRequest: PaginatedGroupMemberWithoutGroupRequest = {
      Pagina: 1,
      CantidadPagina: 6,
      InstitucionId: state.auth.currentInstitution.id,
      NivelId: props.match.params.lvlId,
      GrupoId: props.match.params.grupoId
    }
    setPagination(initialRequest)
  }, [])

  const state = useSelector((store) => {
    return {
      grupos: store.grupos.groups,
      allGroupMembers: store.grupos.allGroupMembers,
      condiciones: store.grupos.condiciones,
      activeCalendar: store.grupos.activeCalendar,
      auth: store.authUser
    }
  })

  return (
    <AppLayout items={directorItems}>
      <div className='dashboard-wrapper'>
        <NavigationContainer goBack={() => {
          props.history.goBack()
        }}
        />
        <h3>
          Estudiantes del grupo
        </h3>

        <HTMLTable
          columns={step1Columns}
          thumblist
          data={state.allGroupMembers.map(el => {
            return { ...el, id: el.matriculaId, image: el.img, fechaNacimientoP: format(parseISO(el.fechaNacimiento), 'dd/MM/yyyy'), nacionalidad: el.nacionalidades[0].nacionalidad }
          })}
          isBreadcrumb={false}
          match={props.match}
          tableName='label.groupMembers'
          pageSize={6}
          totalRegistro={state.miembros?.totalCount}
          toggleEditModal={() => { }}
          toggleModal={() => null}
          modalOpen={false}
          selectedOrderOption={{ column: 'detalle', label: 'Nombre Completo' }}
          showHeaders
          editModalOpen={false}
          modalfooter
          loading={false}
          orderBy={false}
          handleCardClick={(_: any) => null}
          roundedStyle
          buttonSearch
          readOnly
          hideMultipleOptions
        />
      </div>
    </AppLayout>
  )
}

export default withRouter(EstudiantesGrupo)
