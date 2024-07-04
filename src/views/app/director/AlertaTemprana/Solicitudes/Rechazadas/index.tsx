import React from 'react'
import styled from 'styled-components'
import { Container } from 'reactstrap'
import HTMLTable from 'Components/HTMLTable/single'
import { getAlertsByStatus, addCommentsToAlert } from '../../../../../../redux/alertaTemprana/actionRequests'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { Paginationtype } from '../../../../../../types/pagination'

import DetalleSolicitud from '../../modals/DetalleSolicitud'
import Observaciones from '../../modals/Comentarios'

type AlertaProps = {}

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

const AlertasRechazadas: React.FC<AlertaProps> = (props) => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [detailModal, setDetailModal] = React.useState<boolean>(false)
  const [observacionesModal, setObservacionesModal] = React.useState<boolean>(false)
  const [currentAlert, setCurrentAlert] = React.useState<any>(null)
  const [data, setData] = React.useState<Array<any>>([])
  const actions = useActions({ getAlertsByStatus, addCommentsToAlert })
  const [pagination, setPagination] = React.useState<Paginationtype>({ pagina: 1, cantidad: 10 })

  const state = useSelector((store: IStore) => {
    return {
      rejected: store.alertaTemprana.alertsRejected,
      currentInstitution: store.authUser.currentInstitution
    }
  })

  React.useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    setLoading(true)
    await actions.getAlertsByStatus(5, pagination.pagina, pagination.cantidad)
    setLoading(false)
  }

  React.useEffect(() => {
    setData(state.rejected.entityList.map((alert) => {
      const role = alert.roles && alert.roles.length > 0 && alert.roles[0]
      return {
        ...alert,
        statusColor: 'danger',
        rolSolicitante: role.rolSolicitante || ''
      }
    }) || [])
  }, [state.rejected])

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
          totalRegistro={state.rejected.totalCount}
          handlePagination={(pageNumber: number, selectedPageSize: number) => {
            actions.getAlertsByStatus(5, pageNumber, selectedPageSize)
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
      {
                currentAlert !== null
                  ? <DetalleSolicitud
                      visible={detailModal}
                      alert={currentAlert}
                      handleCancel={() => {
                        setCurrentAlert(null)
                        setDetailModal(!detailModal)
                      }}
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

export default AlertasRechazadas
