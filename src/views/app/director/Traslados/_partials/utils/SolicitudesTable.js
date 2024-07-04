import React, { useState } from 'react'

import HTMLTable from 'Components/HTMLTable'

import moment from 'moment'

const columns = [
  { column: 'numeroSolicitud', label: 'N. Solicitud', order: true },
  { column: 'identificacion', label: 'Identificación', order: true },
  { column: 'nombreEstudiante', label: 'Nombre completo', order: true },
  { column: 'ceResuelve', label: 'CE Resuelve', order: true },
  {
    column: 'fechaHoraSolicitud',
    label: 'Fecha de solicitud',
    order: true
  },
  {
    column: 'estado',
    label: 'Estado de la solicitud',
    isBadge: true,
    order: true
  }
]

const SolicitudesTable = (props) => {
  const {
    traslados, // traslados.entityList
    trasladoData,
    setOneTrasladoData,
    setTrasladosData,
    institucionId, // state.authUser.currentInstitution.id
    loading,
    filterOptions,
    setFilterOptions
  } = props

  const [sortBy, setSortBy] = useState(undefined)
  const [orientacion, setOrientacion] = useState(undefined)

  const getSortAndOrientation = () => {
    return {
      sortBy: sortBy || 'nombreEstudiante',
      orientacion: orientacion || 'ASC'
    }
  }

  const changeFilterCheck = (
    item,
    searchValue,
    selectedColumn,
    selectedPageSize,
    page
  ) => {
    // anioEducativo,
    // idCentro,
    // textoFiltro,
    // recibido,
    // enviado,
    // pagina,
    // cantidadPagina,
    const newFilterOptions = filterOptions.map((opt) =>
      opt.id == item.id ? { ...item, checked: !item.checked } : opt
    )
    setFilterOptions(newFilterOptions)

    const valueSearch = searchValue || 'all'

    const sort = getSortAndOrientation()

    const loadTraslados = async () => {
      await setTrasladosData(
        institucionId,
        valueSearch,
        newFilterOptions[0].checked, // Solicitudes de traslados recibidas, recibido
        newFilterOptions[1].checked, // Solicitudes de traslados enviadas, enviado
        sort.sortBy,
        sort.orientacion,
        page,
        selectedPageSize
      )
    }
    loadTraslados()
  }

  return (
    <>
      <h4>Listado de traslados:</h4>
      <br />

      <HTMLTable
        startIcon
        columns={columns}
        selectDisplayMode='datalist'
        showHeaders
        data={
          traslados.entityList?.map((traslado) => {
            return {
              ...traslado,
              faIcon:
                traslado.tipo == 'recibido'
                  ? 'fa-arrow-alt-circle-right'
                  : 'fa-arrow-alt-circle-left',
              fechaHoraSolicitud: moment(traslado.fechaHoraSolicitud).format(
                'DD/MM/YYYY'
              ),
              itemSelected: traslado.id == trasladoData?.id,
              statusColor:
                traslado.estado == 'Cancelado'
                  ? 'warning'
                  : traslado.estado == 'En espera'
                    ? 'info'
                    : traslado.estado == 'Aceptado'
                      ? 'success'
                      : traslado.estado == 'Rechazado'
                        ? 'danger'
                        : undefined
            }
          }) || []
        }
        actions={[]}
        isBreadcrumb={false}
        showHeadersCenter={false}
        actionRow={[]}
        toggleEditModal={(item) => {
          const setTrasladoData = async () => {
            const respSetData = await setOneTrasladoData(item.id)
          }
          setTrasladoData()
        }}
        match={props.match}
        tableName='label.users'
        modalOpen={false}
        selectedOrderOption={{
          column: 'detalle',
          label: 'Nombre Completo'
        }}
        handlePagination={(page, selectedPageSize, searchValue) => {
          const sort = getSortAndOrientation()
          const loadTraslados = async () => {
            await setTrasladosData(
              institucionId,
              searchValue || 'all',
              filterOptions[0].checked, // Solicitudes de traslados recibidas, recibido
              filterOptions[1].checked, // Solicitudes de traslados enviadas, enviado
              sort.sortBy,
              sort.orientacion,
              page,
              selectedPageSize
            )
          }
          loadTraslados()
        }}
        handleSearch={(searchValue, selectedColumn, selectedPageSize, page) => {
          // anioEducativo,
          // idCentro,
          // textoFiltro,
          // recibido,
          // enviado,
          // pagina,
          // cantidadPagina,
          const valueSearch = searchValue || 'all'

          const sort = getSortAndOrientation()

          const loadTraslados = async () => {
            await setTrasladosData(
              institucionId,
              valueSearch,
              filterOptions[0].checked, // Solicitudes de traslados recibidas, recibido
              filterOptions[1].checked, // Solicitudes de traslados enviadas, enviado
              sort.sortBy,
              sort.orientacion,
              page,
              selectedPageSize
            )
          }
          loadTraslados()
        }}
        totalRegistro={traslados.totalCount}
        backendPaginated
        editModalOpen={false}
        modalfooter
        loading={loading}
        roundedStyle
        readOnly
        hideMultipleOptions
        buttonSearch
        filters={{ changeFilterCheck, filterOptions }}
        handleOrderDirection={(
          searchValue,
          selectedColumn,
          selectedPageSize,
          page,
          orderColumn,
          orientation
        ) => {
          // searchValue, selectedColumn, selectedPageSize, page
          setSortBy(orderColumn)
          setOrientacion(orientation)
          orderColumn = orderColumn || 'nombreEstudiante'
          orientation = orientation || 'ASC'

          const valueSearch = searchValue || 'all'

          const loadTraslados = async () => {
            await setTrasladosData(
              institucionId,
              valueSearch,
              filterOptions[0].checked, // Solicitudes de traslados recibidas, recibido
              filterOptions[1].checked, // Solicitudes de traslados enviadas, enviado
              orderColumn,
              orientation,
              page,
              selectedPageSize
            )
          }
          loadTraslados()
        }}
      />

    </>
  )
}

export default SolicitudesTable
