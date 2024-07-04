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

type AlertaProps = {
    handleForm: Function;
    visibleForm: boolean
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

const AlertasEnviadas: React.FC<AlertaProps> = (props) => {
  const [currentAlert, setCurrentAlert] = React.useState<any>(null)
  const [detailModal, setDetailModal] = React.useState<boolean>(false)
  const [observacionesModal, setObservacionesModal] = React.useState<boolean>(false)
  const [data, setData] = React.useState<Array<any>>([])
  const actions = useActions({ getAlertsByStatus, addCommentsToAlert })
  const [pagination, setPagination] = React.useState<Paginationtype>({ pagina: 1, cantidad: 10 })

  const state = useSelector((store: IStore) => {
    return {
      sents: store.alertaTemprana.alertsSend,
      currentInstitution: store.authUser.currentInstitution
    }
  })

  React.useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    await actions.getAlertsByStatus(2, pagination.pagina, pagination.cantidad)
  }

  React.useEffect(() => {
    setData(state.sents.entityList.map((alert) => {
      const role = alert.roles && alert.roles.length > 0 && alert.roles[0]
      return {
        ...alert,
        statusColor: 'success',
        rolSolicitante: role.rolSolicitante || ''
      }
    }) || [])
  }, [state.sents])

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
          totalRegistro={state.sents.totalCount}
          handlePagination={(pageNumber: number, selectedPageSize: number) => {
            actions.getAlertsByStatus(2, pageNumber, selectedPageSize)
          }}
          handleSearch={(searchValue: string, selectedColumn: string, selectedPageSize: number, page: number) => {

          }}
          toggleEditModal={() => null}
          editModalOpen={false}
          modalfooter
          loading={false}
          roundedStyle
          filterdSearch={false}
          orderOptions={columns}
          readOnly
          hideMultipleOptions
          preferences={false}
          buttonSearch
          backendPaginated
          esBuscador
          newResource
          resourceTitle='Solicitar nueva alerta'
          toggleModal={props.handleForm}
        />
      </SectionTable>
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

export default AlertasEnviadas
