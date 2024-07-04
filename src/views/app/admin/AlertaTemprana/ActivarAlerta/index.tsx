import React from 'react'
import { Container } from 'reactstrap'
import styled from 'styled-components'
import HTMLTable from 'Components/HTMLTable/single'
import { getAlertsByCatalogUpre } from '../../../../../redux/alertaTemprana/actions'
import {
  getAlertStudents,
  getAlertStudentsPaginated
} from '../../../../../redux/alertaTemprana/actionStudent'
import { useActions } from 'Hooks/useActions'
import BackIcon from '@material-ui/icons/ArrowBackIos'
import { useSelector } from 'react-redux'
import { Paginationtype } from '../../../../../types/pagination'
import swal from 'sweetalert'

import InfoCard from '../AlertaPorEstudiante/InfoCard'

import ActivarDetalle from './ActivarDetalle'

type AlertaProps = {
	type: string
	key: number
	setKey: Function
	setType: Function
	currentStudent: any
	handleClearStudent: Function
	handleCurrentAlert: Function
	handleSetStudent: Function
	currentAlert: any
	setCurrentAlert: Function
	handleClearAlert: Function
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
    label: 'Edad',
    isNumericField: true
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
    column: 'recordatorio',
    label: 'Recordatorio',
    isNumericField: true
  }
]

type IState = {
	alertaTemprana: any
}

const ActivarAlerta: React.FC<AlertaProps> = (props) => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [alerts, setAlerts] = React.useState<Array<any>>([])
  const [data, setData] = React.useState<Array<any>>([])
  const [pagination, setPagination] = React.useState<Paginationtype>({
    pagina: 1,
    cantidad: 10
  })

  const actions = useActions({
    getAlertStudents,
    getAlertStudentsPaginated,
    getAlertsByCatalogUpre
  })

  const state = useSelector((store: IState) => {
    return {
      alerta: store.alertaTemprana,
      currentStudent: store.alertaTemprana.currentStudent
    }
  })

  React.useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    setLoading(true)
    await actions.getAlertStudentsPaginated(
      '',
      '',
      '',
      pagination.pagina,
      pagination.cantidad
    )
    setLoading(false)
  }

  React.useEffect(() => {
    if (
      props.currentStudent &&
			Object.keys(props.currentStudent).length > 0
    ) {
      props.setType('alerts')
      fetchCatalogAlerts()
    }
  }, [props.currentStudent])

  const fetchCatalogAlerts = async () => {
    setLoading(true)
    await actions.getAlertsByCatalogUpre(
      pagination.pagina,
      pagination.cantidad,
      '',
      ''
    )
    setLoading(false)
  }

  React.useEffect(() => {
    setAlerts(
      state.alerta.alertsActives.entityList.map((alert) => {
        return {
          ...alert,
          tipo: alert.tipoAlerta ? 'Activo' : 'Inactivo',
          estado: alert.estadoAlerta ? 'Activo' : 'Inactivo'
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

  const actionAlertRow = [
    {
      actionName: 'Ver ficha descriptiva',
      actionFunction: (item: any) => {
        window.open(item.fichaUrl, '_blank')
      },
      actionDisplay: () => true
    }
  ]

  return (
    <Container>
      <Wrapper>
        {props.currentStudent !== null
          ? (
            <>
              <Back onClick={props.handleClearStudent}>
                <BackIcon />
                <BackTitle>Regresar</BackTitle>
              </Back>
              <InfoCard student={state.currentStudent} />
            </>
            )
          : null}
        {props.currentAlert === null
          ? (
            <HTMLTable
              key={props.key}
              columns={
							props.type === 'students' ? columns : columnsAlerts
						}
              selectDisplayMode='datalist'
              showHeaders
              data={props.type === 'students' ? alerts : data}
              actions={[]}
              isBreadcrumb={false}
              showHeadersCenter={false}
              actionRow={
							props.type === 'students' ? null : actionAlertRow
						}
              match={props.match}
              tableName='label.users'
              modalOpen={false}
              totalRegistro={state.alerta.alertsActives.totalCount}
              handlePagination={(
						  pageNumber: number,
						  selectedPageSize: number
              ) => {
						  if (props.type === 'students') {
						    actions.getAlertStudentsPaginated(
						      '',
						      '',
						      '',
						      pageNumber,
						      selectedPageSize
						    )
						  } else {
						    actions.getAlertsByCatalogUpre(
						      pageNumber,
						      selectedPageSize,
						      '',
						      ''
						    )
						  }
              }}
              handleSearch={(
						  searchValue: string,
						  selectedColumn: string,
						  selectedPageSize: number,
						  page: number
              ) => {
						  if (props.type === 'students') {
						    actions.getAlertStudentsPaginated(
						      '',
						      selectedColumn,
						      searchValue,
						      page,
						      selectedPageSize
						    )
						  } else {
						    actions.getAlertsByCatalogUpre(
						      page,
						      selectedPageSize,
						      selectedColumn,
						      searchValue
						    )
						  }
              }}
              toggleEditModal={(item: object) => {
						  if (props.type === 'students') {
						    props.handleSetStudent(item)
						    props.setType('alerts')
						    fetchCatalogAlerts()
						    props.setKey(Math.random())
						  } else {
						    if (item.esActivo) {
						      props.handleCurrentAlert(item)
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
						  }
              }}
              editModalOpen={false}
              modalfooter
              loading={loading}
              roundedStyle
              filterdSearch
              orderOptions={
							props.type === 'students' ? columns : columnsAlerts
						}
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
              currentAlert={props.currentAlert}
              handleSetAlert={props.handleClearAlert}
              handleCancel={props.handleClearAlert}
            />
            )}
      </Wrapper>
    </Container>
  )
}

const Wrapper = styled.div`
	margin-top: 10px;
`

const Back = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 0 5px;
	margin-bottom: 20px;
`

const BackTitle = styled.span`
	color: #000;
	font-size: 14px;
	font-size: 16px;
`

export default ActivarAlerta
