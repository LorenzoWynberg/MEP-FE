import React, { useState } from 'react'

import HTMLTable from 'Components/HTMLTable'

const columns = [
  { column: 'identificacion', order: true, label: 'Identificación' },
  { column: 'nombre', order: true, label: 'Nombre completo' },
  { column: 'centro', order: true, label: 'Centro educativo' },
  { column: 'oferta', order: true, label: 'Oferta educativa' },
  { column: 'nivel', order: true, label: 'Nivel' }
]

const filterColumns = [
  {
    column: 'identificacion',
    label: 'Identificación',
    order: true,
    filterColumn: 'identificacion',
    filterLabel: 'identificacion'
  },
  {
    column: 'nombre',
    label: 'Nombre completo',
    filterColumn: 'nombreCompleto',
    order: true,
    default: true
  },

  {
    column: 'centro',
    label: 'Centro educativo',
    order: true,
    filterColumn: 'centroEducativo'
  }
]

const SelectorEstudiante = (props) => {
  const {
    tipoTraslado,
    clearStudentsData,
    clearStudentData,
    studentsToTranslate, // studentsToTranslate.entityList
    estudianteData,
    currentStep,
    setCurrentStep,
    setOpenModalAlert,
    setDataEstudiante,
    getStudentSearchPaginated,
    institucionId, // state.authUser.currentInstitution.id
    loading,
    next
  } = props

  const [pagination, setPagination] = useState({})

  return (
    <div className='wizard-basic-step min-height-600'>
      <h4>Identifique el estudiante que desea trasladar:</h4>
      <br />
      <HTMLTable
        columns={columns}
        selectDisplayMode='datalist'
        showHeaders
        alignEnd={false}
        data={
          studentsToTranslate.entityList?.map((student) => {
            return {
              ...student,
              itemSelected: student.idMatricula == estudianteData?.idMatricula
            }
          }) || []
        }
        actions={[]}
        isBreadcrumb={false}
        showHeadersCenter={false}
        actionRow={[]}
        toggleEditModal={(item) => {
          const setEstudianteData = async () => {
            const respSetDataStudent = await setDataEstudiante(item.idMatricula)

            setOpenModalAlert(
              respSetDataStudent.error && respSetDataStudent.message == 'no'
            )

            if (!respSetDataStudent.error) {
              setCurrentStep('step' + (parseInt(currentStep.slice(-1)) + 1))
              next()
            }
          }

          setEstudianteData()
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
        handleSearch={async (searchValue, selectedColumn, selectedPageSize, page) => {
          await getStudentSearchPaginated(
            tipoTraslado,
            institucionId,
            searchValue,
            selectedColumn,
            page,
            selectedPageSize,
            pagination.orderColumn,
            pagination.orientation
          )
        }}
        totalRegistro={studentsToTranslate.totalCount}
        backendPaginated
        handleOrderDirection={async (searchValue, selectedColumn, selectedPageSize, page, orderColumn, orientation) => {
          setPagination({
            tipoTraslado,
            institucionId,
            searchValue,
            selectedColumn,
            page,
            selectedPageSize,
            orderColumn,
            orientation: orientation === 'ASC'
          })
          await getStudentSearchPaginated(
            tipoTraslado,
            institucionId,
            searchValue,
            selectedColumn,
            page,
            selectedPageSize,
            orderColumn,
            orientation === 'ASC'
          )
        }}
        editModalOpen={false}
        modalfooter
        loading={loading}
        roundedStyle
        filterdSearch
        orderOptions={filterColumns}
        readOnly
        hideMultipleOptions
        preferences
        buttonSearch
      />
    </div>
  )
}

export default SelectorEstudiante
