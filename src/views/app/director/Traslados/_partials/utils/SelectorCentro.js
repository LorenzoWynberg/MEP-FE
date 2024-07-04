import React, { useState } from 'react'

import HTMLTable from 'Components/HTMLTable'

const columns = [
  { column: 'codigo', order: true, label: 'Código' },
  { column: 'nombre', order: true, label: 'Centro educativo' },
  { column: 'tipo', order: true, label: 'Tipo de centro educativo' },
  { column: 'locacion', order: true, label: 'Provincia, Cantón, Distrito' },
  {
    column: 'direccionRegional',
    order: true,
    label: 'Dirección Regional de Educación - Circuito'
  }
]

const SelectorCentro = (props) => {
  const [pagination, setPagination] = useState({})
  const {
    centros, // centros.entityList
    centroData,
    currentStep,
    setCurrentStep,
    setDataCentro,
    getCentrosSearchPaginated,
    institucionId, // state.authUser.currentInstitution.id
    loading,
    next
  } = props
  return (
    <HTMLTable
      columns={columns}
      selectDisplayMode='datalist'
      showHeaders
      data={
        centros.entityList?.map((centro) => {
          return {
            ...centro,
            itemSelected: centro.id == centroData?.id
          }
        }) || []
      }
      actions={[]}
      isBreadcrumb={false}
      showHeadersCenter={false}
      actionRow={[]}
      toggleEditModal={(item) => {
        const setCentroData = async () => {
          const respSetData = await setDataCentro(item.id)
          if (!respSetData.error) {
            setCurrentStep('step' + (parseInt(currentStep.slice(-1)) + 1))
            next()
          }
        }
        setCentroData()
      }}
      match={props.match}
      tableName='label.users'
      modalOpen={false}
      selectedOrderOption={{
        column: 'detalle',
        label: 'Nombre Completo'
      }}
      handlePagination={() => {
        //
      }}
      handleSearch={(searchValue, selectedColumn, selectedPageSize, page) => {
        const loadCentros = async () => {
          await getCentrosSearchPaginated(
            institucionId,
            searchValue,
            page,
            selectedPageSize,
            pagination.orderColumn,
            pagination.orientation
          )
        }
        loadCentros()
      }}
      totalRegistro={centros.totalCount}
      backendPaginated
      editModalOpen={false}
      modalfooter
      loading={loading}
      handleOrderDirection={async (
        searchValue,
        selectedColumn,
        selectedPageSize,
        page,
        orderColumn,
        orientation
      ) => {
        setPagination({
          institucionId,
          searchValue,
          selectedColumn,
          page,
          selectedPageSize,
          orderColumn,
          orientation: orientation === 'ASC'
        })
        await getCentrosSearchPaginated(
          institucionId,
          searchValue,
          page,
          selectedPageSize,
          orderColumn,
          orientation === 'ASC'
        )
      }}
      roundedStyle
      readOnly
      hideMultipleOptions
      buttonSearch
    />
  )
}

export default SelectorCentro
