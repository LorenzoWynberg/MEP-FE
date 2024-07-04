import React from 'react'
import { Container } from 'reactstrap'
import styled from 'styled-components'
import HTMLTable from 'Components/HTMLTable/single'
import { getAlertsByCatalog } from '../../../../../../redux/alertaTemprana/actions'
import {
  getAlertStudents,
  getAlertStudentsPaginated
} from '../../../../../../redux/alertaTemprana/actionStudent'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import { Paginationtype } from '../../../../../../types/pagination'
import swal from 'sweetalert'

import ActivarDetalle from './ActivarDetalle'

type AlertaProps = {
	currentAlert: any
	handleCurrentAlert: Function
	currentStudent: any
	handleSetStudent: Function
	handleClearStudent: Function
}

const columns = [
  {
    column: 'identificacion',
    label: 'Número de identificación'
  },
  {
    column: 'nombre',
    label: 'Nombre'
  },
  {
    column: 'institucion',
    label: 'Centro educativo'
  },
  {
    column: 'nivel',
    label: 'Nivel'
  },
  {
    column: 'edad',
    label: 'Edad'
  }
]

const columnsAlerts = [
  {
    column: 'nombre',
    label: 'Nombre de la alerta'
  },
  {
    column: 'contexto',
    label: 'Contexto'
  },
  {
    column: 'dimension',
    label: 'Dimensión'
  },
  {
    column: 'atencionInmediata',
    label: '¿Require atención inmediata?'
  },
  {
    column: 'recordatorio',
    label: 'Recordatorio'
  }
]

type IState = {
	alertaTemprana: any
}

const ActivarAlerta: React.FC<AlertaProps> = (props) => {
  const [alerts, setAlerts] = React.useState<Array<any>>([])
  const [data, setData] = React.useState<Array<any>>([])
  const [type, setType] = React.useState<string>('active')
  const [currentAlert, setCurrentAlert] = React.useState<any>(null)
  const [pagination, setPagination] = React.useState<Paginationtype>({
    pagina: 1,
    cantidad: 10
  })

  const actions = useActions({
    getAlertStudents,
    getAlertStudentsPaginated,
    getAlertsByCatalog
  })

  const state = useSelector((store: IState) => {
    return {
      alerta: store.alertaTemprana
    }
  })

  React.useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    await actions.getAlertStudentsPaginated(
      '',
      '',
      '',
      pagination.pagina,
      pagination.cantidad
    )
  }

  React.useEffect(() => {
    if (
      props.currentStudent &&
			Object.keys(props.currentStudent).length > 0
    ) {
      setType('alerts')
      fetchCatalogAlerts()
    }
  }, [props.currentStudent])

  const fetchCatalogAlerts = async () => {
    await actions.getAlertsByCatalog(pagination.pagina, pagination.cantidad)
  }

  React.useEffect(() => {
    setAlerts(
      state.alerta.alertsActives.entityList.map((alert) => {
        return {
          ...alert,
          tipo: alert.tipoAlerta ? 'Activo' : 'Inactivo',
          estado: alert.estadoAlerta ? 'Activo' : 'Inactivo',
          activada: 'Lorem Ipsum'
        }
      }) || []
    )
  }, [state.alerta.alertsActives])

  React.useEffect(() => {
    setData(
      state.alerta.alertsCatalog.entityList.map((alert) => {
        return {
          ...alert,
          estado: alert.estado ? 'Activa' : 'Inactiva',
          tipo: alert.tipoAlerta ? 'Activa' : 'Inactiva',
          atencionInmediata: alert.atencionInmediata ? 'Sí' : 'No'
        }
      }) || []
    )
  }, [state.alerta.alertsCatalog])

  const actionRow = [
    {
      actionName: 'crud.select',
      actionFunction: (item: any) => {
        props.handleSetStudent(item)
        setType('alerts')
        fetchCatalogAlerts()
      },
      actionDisplay: () => true
    },
    {
      actionName: 'crud.delete',
      actionFunction: (item: any) => {},
      actionDisplay: () => true
    }
  ]

  const actionAlertRow = [
    {
      actionName: 'crud.select',
      actionFunction: (item: any) => {
        if (item.esActivo) {
          setCurrentAlert(item)
        } else {
          swal({
            title: 'Oops',
            text: 'Está alerta ya se encuentra deshabilitada',
            icon: 'warning',
            buttons: {
              ok: {
                text: 'Aceptar',
                value: true
              }
            }
          })
        }
      },
      actionDisplay: () => true
    }
  ]

  return (
    <Container>
      <Title>Activar Alerta</Title>
      {currentAlert === null
        ? (
          <HTMLTable
            columns={type === 'active' ? columns : columnsAlerts}
            selectDisplayMode='datalist'
            showHeaders
            data={type === 'active' ? alerts : data}
            actions={[]}
            isBreadcrumb={false}
            showHeadersCenter={false}
            actionRow={type === 'active' ? actionRow : actionAlertRow}
            match={props.match}
            tableName='label.users'
            modalOpen={false}
            totalRegistro={state.alerta.alertsActives.totalCount}
            handlePagination={(
					  pageNumber: number,
					  selectedPageSize: number
            ) => {
					  actions.getAlertsByCatalog(pageNumber, selectedPageSize)
            }}
            handleSearch={(
					  searchValue: string,
					  selectedColumn: string,
					  selectedPageSize: number,
					  page: number
            ) => {
					  actions.getAlertStudentsPaginated(
					    '',
					    selectedColumn,
					    searchValue,
					    page,
					    selectedPageSize
					  )
            }}
            editModalOpen={false}
            modalfooter
            loading={false}
            roundedStyle
            filterdSearch
            orderOptions={columns}
            readOnly
            hideMultipleOptions
            preferences
            buttonSearch
            backendPaginated
            esBuscador
            newResource={false}
          />
          )
        : (
          <ActivarDetalle
            currentStudent={props.currentStudent}
            currentAlert={currentAlert}
            handleSetAlert={() => setCurrentAlert(null)}
            handleCancel={() => setCurrentAlert(null)}
          />
          )}
    </Container>
  )
}

const Title = styled.h4`
	color: #000;
	margin: 10px 0px 20px;
`

export default ActivarAlerta
