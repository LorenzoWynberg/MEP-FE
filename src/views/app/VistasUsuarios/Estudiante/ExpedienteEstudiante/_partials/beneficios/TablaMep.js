import React from 'react'
import Table from 'Components/table/paginacion'
import PropTypes from 'prop-types'
import { useWindowSize } from 'react-use'

const columns = [
  { column: 'nombreDependecia', label: 'Dependecia' },
  { column: 'nombreTipoSubsidio', label: 'Tipo de subsidio' },
  { column: 'detalle', label: 'Detalle del subsidio' },
  { column: 'recepcionVerificada', label: 'Verificación de recepción del apoyo', isBadge: true },
  { column: 'periodo', label: 'Período activo' }
]

const TablaMep = (props) => {
  const { data, loading, handlePagination, handleSearch, totalRegistros } = props
  const { width } = useWindowSize()
  const actions = [
    {
      actionName: 'button.remove',
      actionFunction: (ids) => { props.authHandler('eliminar', props.handleDeleteSubsidio(ids), props.toggleSnackbar) }
    }
  ]
  const actionRow = [
    {
      actionName: 'Editar',
      actionFunction: (item) => { props.authHandler('modificar', props.handleViewSubsidio(item), props.toggleSnackbar) },
      actionDisplay: () => true
    },
    {
      actionName: 'Eliminar',
      actionFunction: (item) => { props.authHandler('eliminar', props.handleDeleteSubsidio([item.id]), props.toggleSnackbar) },
      actionDisplay: () => true
    }
  ]
  return (
    <Table
      columns={columns}
      selectDisplayMode='thumblist'
      data={data}
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
      selectedOrderOption={{ column: 'detalle', label: 'Nombre Completo' }}
      showHeaders={false}
      showHeadersCenter={width > 800}
      editModalOpen={false}
      modalfooter
      hideMultipleOptions
      loading={loading}
      orderBy={false}
      totalRegistro={totalRegistros}
      title='Por parte del MEP'
      handlePagination={handlePagination}
      handleSearch={handleSearch}
      customThumbList={width > 800}
      handleCardClick={(item) => { props.handleViewSubsidio(item) }}
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
