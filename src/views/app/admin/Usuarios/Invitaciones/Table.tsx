import React from 'react'
import Table from '../../../../../components/table/paginacion'
import PropTypes from 'prop-types'
import { useWindowSize } from 'react-use'

const columns = [
  { column: 'nombreCompleto', label: 'Nombre Completo' },
  { column: 'tipoIdentificacion', label: 'Tipo de identificacion' },
  { column: 'identificacion', label: 'Número de identificación' },
  { column: 'nacionalidad', label: 'Nacionalidad' },
  { column: 'estado', label: 'Estado', isBadge: true }
]

const TablaMep = (props) => {
  const { data, loading, handlePagination, handleSearch, totalRegistros, handleEdit, layout } = props
  const [users, setUsers] = React.useState<Array<any>>([])
  const { width } = useWindowSize()

  React.useEffect(() => {
    updateData()
  }, [data])

  const updateData = () => {
    const usuarios = []
    data.map((item: any) => {
      usuarios.push({
        ...item,
        id: item.usuarioId
      })
    })
    setUsers(usuarios)
  }

  const actions = [
    {
      actionName: 'button.remove',
      actionFunction: (ids: Array<string>) => {
        // props.handleDeleteSubsidio(ids)
      }
    }
  ]
  const actionRow = [
    {
      actionName: 'Editar',
      actionFunction: (item) => { props.handleEdit(item) },
      actionDisplay: () => true
    }
  ]
  return (
    <Table
      layout={layout}
      columns={columns}
      selectDisplayMode='thumblist'
      data={users}
      actions={actions}
      isBreadcrumb={false}
      actionRow={actionRow}
      match={props.match}
      tableName='label.users'
      toggleEditModal={() => {
        props.handleCreateToggle()
      }}
      toggleModal={() => {
        props.handleCreateToggle()
      }}
      modalOpen={false}
      selectedOrderOption={{ column: 'nombreCompleto', label: 'Nombre Completo' }}
      showHeaders={false}
      showHeadersCenter={width > 800}
      editModalOpen={false}
      modalfooter
      loading={loading}
      orderBy={false}
      totalRegistro={totalRegistros}
      labelSearch='Buscador'
      handlePagination={handlePagination}
      handleSearch={handleSearch}
      customThumbList={width > 800}
      handleCardClick={(_: any) => null}
      readOnly
      hideMultipleOptions
    />
  )
}
TablaMep.prototype = {
  data: PropTypes.array,
  loading: PropTypes.bool,
  handlePagination: PropTypes.func,
  handleSearch: PropTypes.func,
  totalRegistros: PropTypes.number
}
TablaMep.defaultProps = {
  data: [],
  loading: false,
  handlePagination: () => { },
  handleSearch: () => { },
  totalRegistros: 0

}

export default TablaMep
