import React from 'react'
import styled from 'styled-components'
import { Container } from 'reactstrap'
import HTMLTable from 'Components/HTMLTable/single'
import { getAlertsByStatus, addCommentsToAlert, changeAlertStatus } from '../../../../../../redux/alertaTemprana/actionRequests'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { Paginationtype } from '../../../../../../types/pagination'
import swal from 'sweetalert'

import AgregarComentarios from '../../modals/AgregarComentarios'
import DetalleSolicitud from '../../modals/DetalleSolicitud'
import Observaciones from '../../modals/Comentarios'

type AlertaProps = {

}

type IStore = {
    alertaTemprana: any,
    authUser: any
}

const columns = [
  {
    column: 'estadoSolicitud',
    label: 'Estado de la solicitud',
    isBadge: true
  },
  {
    column: 'nombre',
    label: 'Nombre de la solicitud'
  },
  {
    column: 'nombreSolicitante',
    label: 'Nombre del solicitante'
  },
  {
    column: 'rolSolicitante',
    label: 'Rol del Solicitante'
  },
  {
    column: 'centroEducativo',
    label: 'Centro educativo'
  },
  {
    column: 'regional',
    label: 'Regional'
  }
]

const AlertasEnProceso: React.FC<AlertaProps> = (props) => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [detailModal, setDetailModal] = React.useState<boolean>(false)
  const [visible, setVisible] = React.useState<boolean>(false)
  const [observacionesModal, setObservacionesModal] = React.useState<boolean>(false)
  const [type, setType] = React.useState<string>('')
  const [currentAlert, setCurrentAlert] = React.useState<any>(null)
  const [data, setData] = React.useState<Array<any>>([])
  const actions = useActions({ getAlertsByStatus, addCommentsToAlert, changeAlertStatus })
  const [pagination, setPagination] = React.useState<Paginationtype>({ pagina: 1, cantidad: 10 })

  const state = useSelector((store: IStore) => {
    return {
      received: store.alertaTemprana.alertsReceived,
      currentInstitution: store.authUser.currentInstitution
    }
  })

  React.useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    setLoading(true)
    await actions.getAlertsByStatus(3, pagination.pagina, pagination.cantidad)
    setLoading(false)
  }

  React.useEffect(() => {
    setData(state.received.entityList.map((alert) => {
      const role = alert.roles && alert.roles.length > 0 && alert.roles[0]
      return {
        ...alert,
        statusColor: 'success',
        rolSolicitante: role.rolSolicitante || ''
      }
    }) || [])
  }, [state.received])

  const handleSave = async (comments: string) => {
    setLoading(true)
    const res = await actions.changeAlertStatus(type, currentAlert.id, { comentario: comments })
    setCurrentAlert(null)
    setType('')
    setLoading(false)
    setVisible(!visible)

    if (!res.error) {
      swal({
        title: 'Correcto',
        text: 'La alerta ha sido actualizada correctamente.',
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
        }
      })
    } else {
      swal({
        title: 'Oops',
        text: res.message,
        icon: 'warning',
        className: 'text-alert-modal',
        buttons: {
          ok: {
            text: 'Aceptar',
            value: true,
            className: 'btn-alert-color'
          }
        }
      }).then((result) => {
        if (result) {
          fetchAlerts()
        }
      })
    }
  }

  const actionRow = [
    {
      actionName: 'Detalles',
      actionFunction: (item: any) => {
        setCurrentAlert(item)
        setDetailModal(!detailModal)
      },
      actionDisplay: () => true
    },
    {
      actionName: 'Ver Observaciones',
      actionFunction: (item: any) => {
        setCurrentAlert(item)
        setObservacionesModal(!observacionesModal)
      },
      actionDisplay: () => true
    }
  ]

  return (
    <Container>
      <SectionTable>
        <HTMLTable
          columns={columns}
          selectDisplayMode='datalist'
          showHeaders
          data={data}
          actions={[]}
          isBreadcrumb={false}
          showHeadersCenter={false}
          actionRow={actionRow}
          match={props.match}
          tableName='label.users'
          modalOpen={false}
          totalRegistro={state.received.totalCount}
          handlePagination={(pageNumber: number, selectedPageSize: number) => {
            actions.getAlertsByStatus(3, pageNumber, selectedPageSize)
          }}
          handleSearch={(searchValue: string, selectedColumn: string, selectedPageSize: number, page: number) => {

          }}
          toggleEditModal={() => null}
          editModalOpen={false}
          modalfooter
          loading={loading}
          roundedStyle
          filterdSearch={false}
          orderOptions={columns}
          readOnly
          hideMultipleOptions
          preferences={false}
          buttonSearch
          backendPaginated
          esBuscador
          newResource={false}
          resourceTitle='Solicitar nueva alerta'
          toggleModal={() => null}
        />
      </SectionTable>
      <AgregarComentarios
        visible={visible}
        loading={loading}
        handleCancel={() => setVisible(!visible)}
        handleSave={handleSave}
      />
      {
                currentAlert !== null
                  ? <DetalleSolicitud
                      visible={detailModal}
                      alert={currentAlert}
                      handleCancel={() => setDetailModal(!detailModal)}
                    />
                  : null
            }
      {
                currentAlert !== null
                  ? <Observaciones
                      visible={observacionesModal}
                      observaciones={currentAlert.comentarios}
                      handleCancel={() => {
                        setCurrentAlert(null)
                        setObservacionesModal(!observacionesModal)
                      }}
                    />
                  : null
            }
    </Container>
  )
}

const SectionTable = styled.div`
    margin-top: 15px;
`

export default AlertasEnProceso
