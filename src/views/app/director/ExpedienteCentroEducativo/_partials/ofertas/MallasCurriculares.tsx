import React, { useEffect, useState } from 'react'

import HTMLTable from 'Components/HTMLTable'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import withRouter from 'react-router-dom/withRouter'
import { PaginatedRequest } from './interfaces'
import MallaItem from './MallaItem'
import {
  getCentroMallas,
  getAsignaturasMallaInstitucionByMallaInstitucionId,
  getLvlOfertas,
  deleteMalla
} from '../../../../../../redux/mallasCurriculares/actions'
import { getIndicadorAprendizaje } from '../../../../../../redux/IndicadoresAprendizaje/actions'
import {
  getLevelsByModel,
  getSpecialtiesByModel,
  getOfferModels
} from '../../../../../../redux/modelosOferta/actions'
import {
  getAllAsignaturas,
  getTiposEvaluacion
} from '../../../../../../redux/asignaturas/actions'
import { GetByIdAnio } from '../../../../../../redux/periodos/actions'
import { useTranslation } from 'react-i18next'
import { catalogsEnumObj } from '../../../../../../utils/catalogsEnum'
import { getCatalogs } from '../../../../../../redux/selects/actions'
import { getAllComponenteCalificacion } from '../../../../../../redux/componentesEvaluacion/actions'
import swal from 'sweetalert'

const MallasCurriculares = (props) => {
  const { t } = useTranslation()

  const columns = [
    {
      column: 'nombreModeloOferta',
      label: t('configuracion>ofertas_educativas>modelo_de_ofertas>modelo_de_ofertas', 'Modelo de ofertas')
    },
    {
      column: 'nombreMalla',
      label: t('configuracion>centro_educativo>columna_nombre', 'Nombre')
    },
    {
      column: 'asignaturas',
      label: t('configuracion>ofertas_educativas>modelo_de_ofertas>asignaturas', 'Asignaturas')
    }
  ]

  const [edit, setEdit] = useState<boolean>()
  const [stagedAsignaturas, setStagedAsignaturas] = useState({})
  const [data, setData] = useState<any>({})
  const [dataList, setDataList] = useState<array>([])

  const { hasAddAccess = true, hasEditAccess = true, hasDeleteAccess = true } = props

  const state = useSelector((store) => {
    return {
      modelOffers: store.modelosOfertas.modelOffers,
      currentOfferLevels: store.modelosOfertas.currentOfferLevels,
      currentOfferSpecialties: store.modelosOfertas.currentOfferSpecialties,
      auth: store.authUser,
      ...store.authUser,
      ...store.asignaturas,
      ...store.mallasCurriculares,
      ...store.componentesEvaluacion,
      ...store.periodos,
      ...store.selects,
      ...store.indicadorAprendizaje
    }
  })

  const actions = useActions({
    getCentroMallas,
    getAsignaturasMallaInstitucionByMallaInstitucionId,
    getLvlOfertas,
    getLevelsByModel,
    getSpecialtiesByModel,
    getAllAsignaturas,
    getOfferModels,
    GetByIdAnio,
    getIndicadorAprendizaje,
    getCatalogs,
    getAllComponenteCalificacion,
    getTiposEvaluacion,
    deleteMalla
  })

  useEffect(() => {
    if (state.selectedActiveYear.id) {
      actions.GetByIdAnio(state.selectedActiveYear.id)
    }
  }, [state.selectedActiveYear.id])

  useEffect(() => {
    actions.getCatalogs(catalogsEnumObj.TIPOEVALUACION.id)
    actions.getCentroMallas(
      props.institutionId
        ? props.institutionId
        : state.auth.currentInstitution.id
    )
    actions.getAllAsignaturas()
    actions.getOfferModels()
    actions.getTiposEvaluacion()
    actions.getIndicadorAprendizaje()
    actions.getAllComponenteCalificacion()
  }, [])

  useEffect(() => {
    const asignaturasMallaByAsignature = {}
    state.mallasAsignaturasInstitucion?.forEach((item) => {
      asignaturasMallaByAsignature[item.asignaturaId] =
        asignaturasMallaByAsignature[item.asignaturaId]
          ? [...asignaturasMallaByAsignature[item.asignaturaId], item]
          : [item]
    })
    setStagedAsignaturas(asignaturasMallaByAsignature)
  }, [state.mallasAsignaturasInstitucion])

  useEffect(() => {
    setDataList(state.mallasInstitucion)
  }, [state.mallasInstitucion])

  const toggleEdit = (element = {}) => {
    actions.getAsignaturasMallaInstitucionByMallaInstitucionId(
      element.mallaCurricularInstitucionId
    )
    getItemLvlsAndSp(element.ofertaId)
    setEdit(!edit)
    setData(element)
  }

  const getItemLvlsAndSp = async (id: number) => {
    await actions.getLvlOfertas(id)
    await actions.getLevelsByModel(id)
    await actions.getSpecialtiesByModel(id)
  }

  if (edit) {
    return (
      <MallaItem
        state={state}
        setEdit={setEdit}
        readOnly={props.readOnly}
        data={data}
        stagedAsignaturas={stagedAsignaturas}
        setStagedAsignaturas={setStagedAsignaturas}
        edit={edit}
        disableButton={!hasAddAccess}
        hasEditAccess={hasEditAccess}
        hasDeleteAccess={hasDeleteAccess}
      />
    )
  }

  return (
    <>
      <h3 />
      <HTMLTable
        columns={columns}
        data={dataList}
        isBreadcrumb={false}
        match={props.match}
        actionRow={[
          {
            actionName: t('general>eliminar', 'Eliminar'),
            actionFunction: (item) => {
              swal({
                title: 'Confirmación necesaria',
                text: 'Esta acción afectará a toda la malla institucional seleccionada',
                icon: 'warning',
                className: 'text-alert-modal',
                buttons: {
                  ok: {
                    text: 'Continuar',
                    value: true,
                    className: 'btn-alert-color'
                  }
                }
              }).then((result) => {
                if (result) {
                  actions.deleteMalla(
                    item.mallaCurricularInstitucionId,
                    props.institutionId
                      ? props.institutionId
                      : state.auth.currentInstitution.id
                  )
                }
              })
            },
            actionDisplay: (item) => {
              return item.estudiantesMatriculados <= 0
            }
          }
        ]}
        tableName='label.malla'
        readOnly
        // totalRegistro={0}
        toggleEditModal={(el) => {
          toggleEdit(el)
        }}
        toggleModal={() => {
          toggleEdit()
        }}
        modalOpen={false}
        selectedOrderOption={{ column: 'detalle', label: 'Nombre Completo' }}
        showHeaders
        editModalOpen={false}
        modalfooter
        loading={false}
        orderBy={false}
        handleSearch={(
          searchValue: string,
          selectedColumn: string,
          selectedPageSize: number,
          page: number
        ) => {
          // searchValue, selectedColumn, selectedPageSize, page
          const pageRequest: PaginatedRequest = {
            Pagina: page,
            CantidadPagina: selectedPageSize,
            InstitucionId: state.auth.currentInstitution.id,
            TipoColumna: selectedColumn,
            Busqueda: searchValue
          }
          // actions.getLevelMembers(pageRequest, true) **** page, qnt, filterType, filterText, orderBy="id", direction="ASC" ****
        }}
        handlePagination={(pageNumber, selectedPageSize, searchValue) => {
          const pageRequest: PaginatedRequest = {
            Pagina: pageNumber,
            CantidadPagina: selectedPageSize,
            InstitucionId: state.auth.currentInstitution.id,
            Busqueda: searchValue
          }
        }}
        handleCardClick={(_: any) => null}
        roundedStyle
        buttonSearch
        hideMultipleOptions
      />
    </>
  )
}

export default withRouter(MallasCurriculares)
