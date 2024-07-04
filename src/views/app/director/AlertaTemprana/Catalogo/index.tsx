import React from 'react'
import styled from 'styled-components'
import { Container } from 'reactstrap'
import HTMLTable from '../../../../../components/HTMLTable/single'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import {
  createAlerta,
  getAlertsByCatalog,
  getAlertsByCatalogPaginated,
  inhabilitarAlerta
} from '../../../../../redux/alertaTemprana/actions'
import moment from 'moment'
import { Paginationtype } from '../../../../../types/pagination'

import ComentariosAlerta from '../modals/Comentarios'

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
  const [loading, setLoading] = React.useState<boolean>(false)
  const [alerts, setAlerts] = React.useState<Array<any>>([])
  const [visible, setVisible] = React.useState<boolean>(false)
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
    inhabilitarAlerta
  })

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
          estado: alert.esActivo ? 'Activa' : 'Inactiva',
          tipo: alert.tipoAlerta,
          insertadoPor: alert.usuario?.nombre,
          fechaInsercion: moment(alert.fechaInsercion).format('DD/MM/YYYY')
        }
      }) || []
    )
  }, [state.alerta.alertsCatalog])

  const handleModal = () => setVisible(!visible)

  const actionRow = [
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
      <Title>Catálogo de Alertas</Title>
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
          toggleEditModal={(el) => null}
          modalOpen={false}
          totalRegistro={state.alerta.alertsCatalog.totalCount}
          handlePagination={(pageNumber: number, selectedPageSize: number) => {
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
          newResource={false}
          resourceTitle=''
          toggleModal={() => null}
        />
      </ContentTable>
      <ComentariosAlerta
        title='Comentarios'
        visible={visible}
        handleModal={handleModal}
      />
    </Container>
  )
}

const Title = styled.strong`
  color: #000;
  font-size: 17px;
  margin: 35px 0px 20px;
  display: block;
`

const ContentTable = styled.div`
  margin-bottom: 20px;
`

export default AlertasPorCatalogo
