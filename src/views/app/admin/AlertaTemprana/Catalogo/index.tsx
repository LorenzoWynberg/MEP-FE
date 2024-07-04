import React from 'react'
import styled from 'styled-components'
import { Container } from 'reactstrap'
import HTMLTable from '../../../../../components/HTMLTable/single'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import {
  createAlerta,
  updateAlerta,
  getAlertsByCatalog,
  getAlertsByCatalogPaginated,
  inhabilitarAlerta
} from '../../../../../redux/alertaTemprana/actions'
import moment from 'moment'
import { Paginationtype } from '../../../../../types/pagination'
import swal from 'sweetalert'

import ComentariosAlerta from '../modals/Comentarios'

import CrearAlerta from './CrearAlerta'
import ModificarAlerta from './ModificarAlerta'
import InahabilarAlerta from '../modals/InabalitarAlerta'

type CatalogoProps = {
  estudiantes: any
  cleanIdentity: any
  cleanAlertFilter: any
  buscador: any
  changeColumn: any
  changeFilterOption: any
  loadStudent: any
  history: any
  getAlertDataFilter: any
  match: any
}

type IState = {
  alertaTemprana: any
}

const columns = [
  {
    column: 'nombre',
    label: 'Nombre de la alerta'
  },
  {
    column: 'estado',
    label: 'Estado de la alerta'
  },
  {
    column: 'tipo',
    label: 'Tipo de alerta'
  },
  {
    column: 'insertadoPor',
    label: 'Usuario que créo la alerta'
  },
  {
    column: 'fechaInsercion',
    label: 'Fecha de creación de la alerta'
  }
]

const AlertasPorCatalogo: React.FC<CatalogoProps> = (props) => {
  const [alerts, setAlerts] = React.useState<Array<any>>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [visible, setVisible] = React.useState<boolean>(false)
  const [visibleForm, setVisibleForm] = React.useState<boolean>(false)
  const [disable, setDisable] = React.useState<boolean>(false)
  const [currentAlert, setCurrentAlert] = React.useState<any>(null)
  const [pagination, setPagination] = React.useState<Paginationtype>({
    pagina: 1,
    cantidad: 10
  })

  const state = useSelector((store: IState) => {
    return {
      alerta: store.alertaTemprana
    }
  })

  const actions = useActions({
    getAlertsByCatalog,
    getAlertsByCatalogPaginated,
    createAlerta,
    updateAlerta,
    inhabilitarAlerta
  })

  React.useState(() => {
    if (props.location.state && props.location.state.newResource) {
      setVisibleForm(!visibleForm)
    }
  }, [props.location])

  React.useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    setLoading(true)
    await actions.getAlertsByCatalog(
      pagination.pagina,
      pagination.cantidad,
      '',
      ''
    )
    setLoading(false)
  }

  React.useEffect(() => {
    setAlerts(
      state.alerta.alertsCatalog.entityList.map((alert) => {
        return {
          ...alert,
          estado: alert.esActivo,
          tipo: alert.tipoAlerta,
          insertadoPor: alert.usuario?.nombre,
          fechaInsercion: moment(alert.fechaInsercion).format('DD/MM/YYYY')
        }
      }) || []
    )
  }, [state.alerta.alertsCatalog])

  const handleModal = () => setVisible(!visible)

  const handleCreateAlert = async (data: any) => {
    try {
      setLoading(true)
      await actions.createAlerta(data, (error) => {
        setLoading(false)
        if (!error) {
          swal({
            title: 'Correcto',
            text: 'Se ha creado la alerta correctamente.',
            icon: 'success',
            className: 'text-alert-modal',
            buttons: {
              ok: {
                text: '¡Entendido!',
                value: true,
                className: 'btn-alert-color'
              }
            }
          }).then((result) => {
            if (result) {
              fetchAlerts()
              setCurrentAlert(null)
              setVisibleForm(false)
            }
          })
        }
      })
    } catch (error) {
      setLoading(false)
    }
  }

  const handleUpdateAlert = async (data: any) => {
    try {
      setLoading(true)
      await actions.updateAlerta(data, (error, message) => {
        setLoading(false)
        if (!error) {
          swal({
            title: 'Correcto',
            text: 'Se ha modficado la alerta correctamente.',
            icon: 'success',
            className: 'text-alert-modal',
            buttons: {
              ok: {
                text: '¡Entendido!',
                value: true,
                className: 'btn-alert-color'
              }
            }
          }).then((result) => {
            if (result) {
              setCurrentAlert(null)
              fetchAlerts()
              setVisibleForm(false)
            }
          })
        } else {
          swal({
            title: 'Oops',
            text: message,
            icon: 'warning',
            className: 'text-alert-modal',
            buttons: {
              ok: {
                text: '¡Entendido!',
                value: true,
                className: 'btn-alert-color'
              }
            }
          })
        }
      })
    } catch (error) {
      setLoading(false)
    }
  }

  const handleConfirm = async (description: string) => {
    setLoading(true)
    const res = await actions.inhabilitarAlerta(currentAlert.id, {
      comentario: description
    })
    setLoading(false)
    setDisable(!disable)
    if (!res.error) {
      swal({
        title: 'Correcto',
        text: 'Se ha activa la alerta correctamente',
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
      })
    }
  }

  const actionRow = [
    {
      actionName: 'Inhabilitar alerta',
      actionFunction: async (item: any) => {
        if (item.estado === 'Inactiva') {
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
        } else {
          setCurrentAlert(item)
          setDisable(!disable)
        }
      },
      actionDisplay: (data) => {
        if (data.estado === 'Inactiva') {
          return false
        } else {
          return true
        }
      }
    },
    {
      actionName: 'Modificar alerta',
      actionFunction: (item: any) => {
        setCurrentAlert(item)
        setVisibleForm(!visibleForm)
      },
      actionDisplay: () => true
    },
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
      {!visibleForm ? <Title>Catálogo de Alertas</Title> : null}
      {visibleForm
        ? (
            currentAlert === null
              ? (
                <CrearAlerta
                  loading={loading}
                  handleCreateAlert={handleCreateAlert}
                  handleForm={() => {
                    setCurrentAlert(null)
                    setVisibleForm(!visibleForm)
                  }}
                />
                )
              : (
                <ModificarAlerta
                  alerta={currentAlert}
                  loading={loading}
                  handleUpdateAlert={handleUpdateAlert}
                  handleForm={() => {
                    setCurrentAlert(null)
                    setVisibleForm(!visibleForm)
                  }}
                />
                )
          )
        : (
          <ContentTable>
            <HTMLTable
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
              toggleEditModal={(el: any) => {
                if (currentAlert === null) {
                  setCurrentAlert(el)
                  setVisibleForm(!visibleForm)
                }
              }}
              modalOpen={false}
              totalRegistro={state.alerta.alertsCatalog.totalCount}
              handlePagination={(
                pageNumber: number,
                selectedPageSize: number
              ) => {
                actions.getAlertsByCatalog(pageNumber, selectedPageSize, '', '')
              }}
              handleSearch={(
                searchValue: string,
                selectedColumn: string,
                selectedPageSize: number,
                page: number
              ) => {
                if (searchValue === '') {
                  actions.getAlertsByCatalog(page, selectedPageSize, '', '')
                } else {
                  actions.getAlertsByCatalogPaginated(
                    page,
                    selectedPageSize,
                    selectedColumn,
                    searchValue
                  )
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
              newResource
              resourceTitle='Crear nueva alerta'
              toggleModal={() => setVisibleForm(!visibleForm)}
            />
          </ContentTable>
          )}
      <ComentariosAlerta
        title='Comentarios'
        visible={visible}
        handleModal={handleModal}
      />
      <InahabilarAlerta
        visible={disable}
        handleModal={() => setDisable(!disable)}
        handleConfirm={handleConfirm}
      />
    </Container>
  )
}

const Title = styled.strong`
  color: #000;
  font-size: 17px;
  margin: 15px 0px 20px;
  display: block;
`

const ContentTable = styled.div`
  margin-bottom: 20px;
`

export default AlertasPorCatalogo
