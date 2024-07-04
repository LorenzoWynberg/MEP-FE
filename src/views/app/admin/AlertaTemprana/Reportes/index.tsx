import React from 'react'
import { Button, Container } from 'reactstrap'
import styled from 'styled-components'

import { getReports } from '../../../../../redux/alertaTemprana/reportes/actions'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { Paginationtype } from '../../../../../types/pagination'
import HTMLTable from 'Components/HTMLTable/single'

import FiltrosModal from '../modals/Filtros'

type AlertaProps = {}

type IStore = {
    alertaReportes: any
};

const columns = [
  {
    column: 'AlertaId',
    label: 'ID Alerta'
  },
  {
    column: 'AlertaNombre',
    label: 'Nombre de la alerta'
  },
  {
    column: 'tipoAlerta',
    label: 'Rol del Solicitante'
  },
  {
    column: 'dimension',
    label: 'Dimensión'
  },
  {
    column: 'circuito',
    label: 'Circuito'
  }
]

const Reportes: React.FC<AlertaProps> = (props) => {
  const [data, setData] = React.useState<Array<any>>([])
  const [filterModal, setFilterModal] = React.useState<boolean>(false)
  const [pagination, setPagination] = React.useState<Paginationtype>({ pagina: 1, cantidad: 10 })
  const actions = useActions({ getReports })

  const state = useSelector((store: IStore) => {
    return {
      reportes: store.alertaReportes
    }
  })

  React.useEffect(() => {
    const fetchReports = async () => {
      await actions.getReports(pagination.pagina, pagination.cantidad)
    }
    fetchReports()
  }, [])

  React.useEffect(() => {
    setData(state.reportes.reports.entityList.map(item => {
      return {
        ...item,
        tipoAlerta: 'Lorem',
        dimension: 'Loem',
        circuito: 'Lorem'
      }
    }) || [])
  }, [state.reportes])

  return (
    <Container>
      <Filter>
        <Title>Filtros</Title>
        <Button size='sm' color='primary' onClick={() => setFilterModal(!filterModal)}>+ Agregar</Button>
      </Filter>
      <Title>Reportes</Title>
      <SectionTable>
        <HTMLTable
          columns={columns}
          selectDisplayMode='datalist'
          showHeaders
          data={data}
          actions={[]}
          isBreadcrumb={false}
          showHeadersCenter={false}
          actionRow={[]}
          match={props.match}
          tableName='label.users'
          modalOpen={false}
          totalRegistro={state.reportes.reports?.totalCount}
          handlePagination={(pageNumber: number, selectedPageSize: number) => {
            actions.getReports(pageNumber, selectedPageSize)
          }}
          handleSearch={(searchValue: string, selectedColumn: string, selectedPageSize: number, page: number) => {
            // actions.getAlertsByStatus(page, selectedPageSize, selectedColumn, searchValue)
          }}
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
          newResource={false}
        />
      </SectionTable>
      <FiltrosModal
        visible={filterModal}
        handleModal={() => setFilterModal(!filterModal)}
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

const Filter = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 13%;
`

const SectionTable = styled.div`
    margin-top: 15px;
`

export default Reportes
