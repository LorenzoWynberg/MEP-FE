import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { Paginationtype } from '../../../../../../types/pagination'
import { getAlertStudent, getAlertStudentPaginated, setAlertResolution } from '../../../../../../redux/alertaTemprana/actionStudent'
import HTMLTable from 'Components/HTMLTable/single'
import swal from 'sweetalert'

import ReasignarResponsable from '../../modals/ReasignarResponsable'
import VerResponsables from '../../modals/VerResponsables'
import EsperaResolucion from '../../modals/EnEsperaResolucion'
import Observaciones from '../../modals/ObservacionesModal'

import AlertaEstudianteDetail from '../AlertaEstudianteDetail'

type IProps = {
    currentAlert: any,
    handleCurrentAlert: Function,
    currentStudent: any,
    handleSetStudent: Function,
    handleClearStudent: Function
}

type IState = {
    alertaTemprana: any
};

const columns = [
  {
    column: 'nombre',
    label: 'Nombre completo'
  },
  {
    column: 'nivel',
    label: 'Nivel'
  },
  {
    column: 'estadoAlertaEstudiante',
    label: 'Estado de la alerta',
    isBadge: true
  },
  {
    column: 'alerta',
    label: 'Nombre de la alerta'
  }
]

const BuscarEstudiantes: React.FC<IProps> = (props) => {
  const [alerts, setAlerts] = React.useState<Array<any>>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [requesting, setRequesting] = React.useState<boolean>(false)
  const [visibleForm, setVisibleForm] = React.useState<boolean>(false)
  const [modalvisible, setModalVisible] = React.useState<boolean>(false)
  const [modalResolucion, setModalResolucion] = React.useState<boolean>(false)
  const [modalObservaiones, setModalObservaciones] = React.useState<boolean>(false)
  const [responsableVisible, setResponsableVisible] = React.useState<boolean>(false)
  const [currentAlert, setCurrentAlert] = React.useState<any>(null)
  const [pagination, setPagination] = React.useState<Paginationtype>({ pagina: 1, cantidad: 10 })

  const actions = useActions({ getAlertStudent, getAlertStudentPaginated, setAlertResolution })

  const state = useSelector((store: IState) => {
    return {
      alerta: store.alertaTemprana
    }
  })

  React.useEffect(() => {
    fetchAlerts()
  }, [])

  const getColor = (status: string) => {
    switch (status) {
      case 'Cerrada':
        return 'danger'
      case 'Activada':
        return 'success'
      case 'Espera de resolución':
        return 'info'
      default:
        return 'primary'
    }
  }

  React.useEffect(() => {
    setAlerts(state.alerta.alertsStudent.entityList.map((alert) => {
      return {
        ...alert,
        tipo: alert.tipoAlerta ? 'Automática' : 'Manual',
        statusColor: getColor(alert.estadoAlertaEstudiante)
      }
    }) || [])
  }, [state.alerta.alertsStudent])

  const fetchAlerts = async () => {
    setLoading(true)
    await actions.getAlertStudent(pagination.pagina, pagination.cantidad)
    setLoading(false)
  }

  const actionRow = [
    {
      actionName: 'Ver proceso de atención',
      actionFunction: async (item: any) => {
        props.handleSetStudent(item)
      },
      actionDisplay: () => true
    },
    {
      actionName: 'En espera de resolución',
      actionFunction: async (item: any) => {
        if (!item.cerrada) {
          setCurrentAlert(item)
          setModalResolucion(!modalResolucion)
        }
      },
      actionDisplay: (data) => {
        if (data.cerrada) {
          return false
        } else {
          return true
        }
      }
    },
    {
      actionName: 'Ver observaciones',
      actionFunction: async (item: any) => {
        setCurrentAlert(item)
        setModalObservaciones(!modalObservaiones)
      },
      actionDisplay: () => true
    }
  ]

  const handleSave = async () => {

  }

  const handleSingleButton = (item: any) => {
    props.handleCurrentAlert(item)
    setResponsableVisible(!responsableVisible)
  }

  const handleBack = () => {
    props.handleClearStudent()
    fetchAlerts()
  }

  const handleSaveResolucion = async (comments: string) => {
    setRequesting(true)
    const res = await actions.setAlertResolution(currentAlert.alertaEstudianteId, { observacion: comments })
    setRequesting(false)
    setModalResolucion(!modalResolucion)
    if (!res.error) {
      swal({
        title: 'Correcto',
        text: 'La alerta se actualizo a espera de resolución',
        icon: 'success',
        buttons: {
          ok: {
            text: 'Aceptar',
            value: true
          }
        }
      }).then((result) => {
        if (result) {
          fetchAlerts()
        }
      })
    } else {
      swal({
        title: 'Oops',
        text: res.message,
        icon: 'warning',
        buttons: {
          ok: {
            text: 'Aceptar',
            value: true
          }
        }
      }).then((result) => {
        if (result) {
          fetchAlerts()
        }
      })
    }
  }

  return (
    <Wrapper>
      {
                props.currentStudent === null

                  ? <HTMLTable
                      columns={columns}
                      selectDisplayMode='datalist'
                      showHeaders
                      data={alerts}
                      actions={[]}
                      isBreadcrumb={false}
                      showHeadersCenter={false}
                      actionRow={actionRow}
                      match={props.match}
                      tableName='label.users'
                      modalOpen={false}
                      pageSize={5}
                      totalRegistro={state.alerta.alertsStudent.totalCount}
                      handlePagination={(pageNumber: number, selectedPageSize: number) => {
                        actions.getAlertStudent(pageNumber, selectedPageSize)
                      }}
                      handleSearch={(searchValue: string, selectedColumn: string, selectedPageSize: number, page: number) => {
                        if (searchValue === '') {
                          actions.getAlertStudent(page, selectedPageSize)
                        } else {
                          actions.getAlertStudentPaginated(page, selectedPageSize, selectedColumn, searchValue)
                        }
                      }}
                      toggleEditModal={(item: object) => {
                        if (item.estado !== 'Inactivo') {
                          props.handleSetStudent(item)
                        }
                      }}
                      editModalOpen={false}
                      modalfooter
                      loading={loading}
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
                      resourceTitle='Activar alerta'
                      toggleModal={() => setVisibleForm(!visibleForm)}
                      handleSingleButton={handleSingleButton}
                    />

                  : <AlertaEstudianteDetail
                      currentStudent={props.currentStudent}
                      handleClearStudent={props.handleClearStudent}
                      handleBack={handleBack}
                    />
            }

      {
                props.currentAlert !== null
                  ? <ReasignarResponsable
                      currentAlert={props.currentAlert}
                      visible={modalvisible}
                      loading={loading}
                      handleCancel={() => setModalVisible(!modalvisible)}
                      handleSave={handleSave}
                    />
                  : null
            }

      {
                props.currentAlert !== null
                  ? <VerResponsables
                      currentAlert={props.currentAlert}
                      visible={responsableVisible}
                      handleCancel={() => setResponsableVisible(!responsableVisible)}
                    />
                  : null
            }

      <EsperaResolucion
        visible={modalResolucion}
        loading={requesting}
        handleCancel={() => setModalResolucion(!modalResolucion)}
        handleSave={handleSaveResolucion}
      />

      {
                currentAlert !== null
                  ? <Observaciones
                      visible={modalObservaiones}
                      handleCancel={() => setModalObservaciones(!modalObservaiones)}
                      observaciones={currentAlert.observaciones}
                    />
                  : null
            }
    </Wrapper>
  )
}

const Wrapper = styled.div`
    margin-top: 10px;
`

export default BuscarEstudiantes
