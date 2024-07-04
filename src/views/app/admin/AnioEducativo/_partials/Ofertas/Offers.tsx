import React, { useState, useEffect, useMemo } from 'react'
import { Col, Row, Container } from 'reactstrap'
import { useSelector } from 'react-redux'
import {
  getEducationalYears,
  GetNivelesOferta,
  addCalendar,
  getOfferModalServ,
  createNivelesOferta,
  GetNivelesOfertaByCalendario,
  createMultipleNivelesOferta,
  deleteNivelOfertaByCalendarId,
  setNivelOfertaSelected,
  updateMultipleNivelesOferta
} from '../../../../../../redux/anioEducativo/actions'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import Niveles from './Niveles'
import { getNiveles } from '../../../../../../redux/periodoLectivo/actions'
import { getEspecialidades } from '../../../../../../redux/especialidades/actions'
import {
  getSpecialtiesByModel,
  getLevelsByModel
} from '../../../../../../redux/modelosOferta/actions'
import { TableReactImplementation } from 'Components/TableReactImplementation'

import { uniqBy } from 'lodash'
import { useActions } from 'Hooks/useActions'
import { loaderProgress, progressInCard } from 'Utils/progress'
import useNotification from 'Hooks/useNotification'
import SimpleModal from 'Components/Modal/simple'
import EditIcon from '@material-ui/icons/Edit'
import VisibilityIcon from '@material-ui/icons/Visibility'
import DeleteIcon from '@material-ui/icons/Delete'
import colors from 'Assets/js/colors'
import { useTranslation } from 'react-i18next'

const Offers = (props) => {
  const [showForm, setShowForm] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [editable, setEditable] = useState<boolean>(true)
  const [dataNivelesOferta, setDataNivelesOferta] = useState([])
  const [dataModelosOferta, setDataModelosOferta] = useState([])
  const [dataNiveles, setDataNiveles] = useState([])
  const [dataEspecialidades, setDataEspecialidades] = useState([])
  const [currentOffer, setCurrentOffer] = useState<any>({})
  const [especialidad, setEspecialidad] = useState([])
  const [niveles, setNiveles] = useState([])
  const [editing, setEditing] = useState<boolean>(false)
  const [errors, setErrors] = useState<any>({})
  const { t } = useTranslation()

  const [snackbar, handleClick] = useNotification()
  const [snackbarContent, setSnackbarContent] = useState({
    msg: '',
    variant: ''
  })

  const columns = useMemo(
    () => [
      {
        label: 'Nombre de oferta educativa',
        column: 'ofertaModelNombre',
        Header: t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>ofertas_relacionadas>columna_nombre_oferta_educativa', 'Nombre de oferta educativa'),
        accessor: 'ofertaModelNombre'
      },
      {
        label: 'Especialidades asociadas',
        column: 'cantEspecialidades',
        Header: t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>ofertas_relacionadas>columna_especialidades_asociadas', 'Especialidades asociadas'),
        accessor: 'cantEspecialidades'
      },
      {
        label: 'Niveles asociados',
        column: 'cantNiveles',
        Header: t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>ofertas_relacionadas>columna_niveles_asociados', 'Niveles asociados'),
        accessor: 'cantNiveles'
      },
      {
        label: 'Acciones',
        column: 'actions',
        Header: t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>ofertas_relacionadas>columna_acciones', 'Acciones'),
        accessor: 'actions',
        Cell: ({ row }) => {
          return (
            <>
              <div className='d-flex justify-content-center align-items-center'>
                <div className='mr-2'>
                  <VisibilityIcon
                    style={{
                      fontSize: 25,
                      color: colors.darkGray,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      handleView(row.original)
                    }}
                  />
                </div>
                <div className='mr-2'>
                  <EditIcon
                    style={{
                      fontSize: 25,
                      color: colors.darkGray,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      handleEdit(row.original)
                    }}
                  />
                </div>
                <div>
                  <DeleteIcon
                    style={{
                      fontSize: 25,
                      color: colors.darkGray,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      toggleConfirmModal(row.original)
                    }}
                  />
                </div>
              </div>
            </>
          )
        }
      }
    ],
    [t]
  )

  const actions = useActions({
    getEducationalYears,
    GetNivelesOferta,
    getOfferModalServ,
    // getOfertas,
    getNiveles,
    // getModalidades,
    // getServicios,
    getEspecialidades,
    // getCalendarsByCursoLectivo,
    addCalendar,
    getSpecialtiesByModel,
    getLevelsByModel,
    GetNivelesOfertaByCalendario,
    createNivelesOferta,
    createMultipleNivelesOferta,
    deleteNivelOfertaByCalendarId,
    setNivelOfertaSelected,
    updateMultipleNivelesOferta
  })

  const state = useSelector((store: any) => {
    return {
      years: store.educationalYear.aniosEducativos,
      offerModalServ: store.educationalYear.offerModalServ,
      nivelesOferta: store.educationalYear.nivelesOferta,
      ofertas: store.ofertas.ofertas,
      modalidades: store.modalidades.modalidades,
      servicios: store.servicios.servicios,
      currentYear: store.educationalYear.anioEducativoSeleccionado,
      currentCalendar: store.cursoLectivo.calendarioActivo,
      currentCursoElectivo: store.cursoLectivo.cursoLectivoActivo,
      niveles: store.modelosOfertas.currentOfferLevels,
      especialidades: store.modelosOfertas.currentOfferSpecialties,
      nivelesOfertaSeleccionado:
        store.educationalYear.nivelesOfertaSeleccionado
    }
  })

  useEffect(() => {
    const loadData = async () => {
      progressInCard(true)
      await actions.getOfferModalServ()
      if (state.currentCalendar?.id) {
        await actions.GetNivelesOfertaByCalendario(
          state.currentCalendar.id
        )
      }
      progressInCard(false)
    }
    loadData()
    return () => {
      setShowForm(false)
    }
  }, [])

  useEffect(() => {
    const _dataEspecialidades = [...state.especialidades]
    if (currentOffer?.id) {
      _dataEspecialidades.unshift({
        value: null,
        id: null,
        label: 'SIN ESPECIALIDAD',
        nombre: 'SIN ESPECIALIDAD'
      })
    }
    setDataNiveles(state.niveles)
    setDataEspecialidades(_dataEspecialidades)

    if (state.nivelesOfertaSeleccionado?.id) {
      const records = state.nivelesOferta.filter(
        (x) =>
          x.sb_gr_ofertaModalServId ===
          state.nivelesOfertaSeleccionado.sb_gr_ofertaModalServId
      )
      const niveles = uniqBy(records, 'sb_nivelesId').map((item) => {
        const nivel = state.niveles.find(
          (x) => x.id === item.sb_nivelesId
        )
        return {
          ...item,
          id: item.sb_nivelesId,
          value: item.sb_nivelesId,
          label: nivel?.nombre
        }
      })

      const especialidades = uniqBy(records, 'sb_especialidadesId').map(
        (item) => {
          const label = _dataEspecialidades.find(
            (x) => x.id === item.sb_especialidadesId
          )
          return {
            ...item,

            id: item.sb_especialidadesId,
            value: item.sb_especialidadesId,
            label: label?.nombre
          }
        }
      )
      setNiveles(niveles)
      setEspecialidad(especialidades)
    }
  }, [state.niveles, state.especialidades])

  useEffect(() => {
    const _uniqueByModeloOferta = uniqBy(
      state.nivelesOferta,
      'sb_gr_ofertaModalServId'
    )

    const _newData = _uniqueByModeloOferta.map((item, i) => {
      const records = state.nivelesOferta.filter(
        (x) =>
          x.sb_gr_ofertaModalServId === item.sb_gr_ofertaModalServId
      )

      const cantNiveles = uniqBy(
        records.filter((x) => x.sb_nivelesId),
        'sb_nivelesId'
      ).length
      const cantEspecialidades = uniqBy(
        records.filter((x) => x.sb_especialidadesId),
        'sb_especialidadesId'
      ).length

      return {
        ...item,
        value: item.id,
        label: item.ofertaModelNombre,
        cantNiveles,
        cantEspecialidades
      }
    })

    setDataNivelesOferta(_newData)
  }, [state.nivelesOferta])

  useEffect(() => {
    setDataModelosOferta(state.offerModalServ)
  }, [state.offerModalServ])

  const toggle = async (el = {}) => {
    setCurrentOffer(el)
    await actions.setNivelOfertaSelected(el)
    setShowForm(!showForm)
  }
  const closeFormModal = async (el = {}) => {
    setCurrentOffer({})
    setNiveles([])
    setEspecialidad([])
    setEditing(false)
    setEditable(true)
    await actions.setNivelOfertaSelected({})
    setShowForm(false)
  }

  const handleCurrentOffer = async (el) => {
    delete errors.oferta
    setCurrentOffer(el)
    setNiveles([])
    setEspecialidad([])

    progressInCard(true)
    await actions.getSpecialtiesByModel(el.id)
    await actions.getLevelsByModel(el.id)
    progressInCard(false)
  }

  const handleEdit = async (el) => {
    setCurrentOffer({ ...el, id: el.sb_gr_ofertaModalServId })
    setNiveles([])
    setEspecialidad([])
    setEditing(true)
    await actions.setNivelOfertaSelected(el)

    progressInCard(true)
    await actions.getSpecialtiesByModel(el.sb_gr_ofertaModalServId)
    await actions.getLevelsByModel(el.sb_gr_ofertaModalServId)
    progressInCard(false)
    setShowForm(true)
  }
  const handleView = async (el) => {
    setEditable(false)
    setCurrentOffer({ ...el, id: el.sb_gr_ofertaModalServId })
    setNiveles([])
    setEspecialidad([])
    setEditing(true)
    await actions.setNivelOfertaSelected(el)

    progressInCard(true)
    await actions.getSpecialtiesByModel(el.sb_gr_ofertaModalServId)
    await actions.getLevelsByModel(el.sb_gr_ofertaModalServId)
    progressInCard(false)
    setShowForm(true)
  }

  const onConfirmModal = async () => {
    progressInCard(true)
    const response = await actions.deleteNivelOfertaByCalendarId(
      state.nivelesOfertaSeleccionado?.sb_gr_ofertaModalServId,
      state.currentCalendar?.id
    )
    progressInCard(false)

    if (!response.error) {
      setSnackbarContent({
        variant: 'success',
        msg: 'Se eliminó correctamente la relación de oferta'
      })
      handleClick()
      clear()
      await actions.setNivelOfertaSelected({})
      setConfirmModal(false)
    } else {
      setSnackbarContent({
        variant: 'error',
        msg: 'Ha ocurrido un problema al eliminar la relación'
      })
      handleClick()
    }
  }

  const toggleConfirmModal = async (el) => {
    await actions.setNivelOfertaSelected(el)
    setConfirmModal(true)
  }

  const toggleEditModal = async () => {
    setEditable(true)
  }

  const closeConfirmModal = async (el) => {
    setEditing(false)
    setEditable(true)
    setConfirmModal(false)
    await actions.setNivelOfertaSelected({})
  }
  const validateData = async (): Promise<boolean> => {
    let error = false
    let _errors = {}

    if (!currentOffer?.id) {
      _errors = {
        ..._errors,
        oferta: 'Seleccione la oferta a relacionar'
      }
      error = true
    }

    if (!niveles?.length) {
      _errors = {
        ..._errors,
        niveles: 'Seleccione el nivel a relacionar'
      }
      error = true
    }

    setErrors({ ..._errors })

    return error
  }

  const handleSaveNivelOferta = async () => {
    const _error = await validateData()
    if (_error) {
      return
    }

    loaderProgress(true)
    const dtaArray = []
    const dta = {
      id: 0 || undefined,
      calendarioId: state.currentCalendar.id,
      nivelId: null,
      especialidadId: null,
      ofertaModalServId: currentOffer?.id,
      estado: true
    }
    if (especialidad.length) {
      especialidad.map((especialidad) => {
        niveles.length
          ? niveles.map((nivel) => {
            dtaArray.push({
              ...dta,
              especialidadId: especialidad.id,
              nivelId: nivel.id
            })
          })
          : dtaArray.push({ ...dta, especialidadId: especialidad.id })
      })
    }

    if (niveles.length) {
      niveles.map((nivel) => {
        especialidad.length
          ? especialidad.map((especialidad) => {
            dtaArray.push({
              ...dta,
              nivelId: nivel.id,
              especialidadId: especialidad.id
            })
          })
          : dtaArray.push({ ...dta, nivelId: nivel.id })
      })
    }
    const _dataSend = []
    const _filterUniqueData = uniqBy(dtaArray, (v) =>
      [v.nivelId, v.especialidadId].join()
    )

    _filterUniqueData.forEach((item) => {
      const exist = state.nivelesOferta.find(
        (x) =>
          x.especialidadId === item.especialidadId &&
          x.nivelId === item.nivelId &&
          x.sb_gr_ofertaModalServId === item.sb_gr_ofertaModalServId
      )
      if (exist) {
        _dataSend.push({
          ...item,
          id: exist.id
        })
      } else {
        _dataSend.push({
          ...item
        })
      }
    })

    let response
    if (editing) {
      response = await actions.updateMultipleNivelesOferta(
        _dataSend,
        state.currentCalendar.id
      )
    } else {
      response = await actions.createMultipleNivelesOferta(_dataSend)
    }

    if (!response.error) {
      setSnackbarContent({
        variant: 'success',
        msg: 'Se realizó correctamente la relación de oferta'
      })
      handleClick()
      setNiveles([])
      setCurrentOffer({})
      setEspecialidad([])
      setEditing(false)
      setShowForm(false)
      await actions.GetNivelesOfertaByCalendario(state.currentCalendar.id)
    } else {
      setSnackbarContent({
        variant: 'error',
        msg: 'Ha ocurrido un problema al guardar la relación'
      })
      handleClick()
    }

    loaderProgress(false)
  }
  const actionsRows = [
    {
      actionDisplay: () => true,
      actionName: 'label.view',
      actionFunction: (el) => handleView(el)
    },
    {
      actionDisplay: () => true,
      actionName: 'crud.edit',
      actionFunction: (el) => handleEdit(el)
    },
    {
      actionDisplay: () => true,
      actionName: 'label.delete',
      actionFunction: (el) => toggleConfirmModal(el)
    }
  ]

  return (
    <Container className='mt-5'>
      {snackbar(snackbarContent.variant, snackbarContent.msg)}

      <Row>
        <Col xs='12'>
          <h3>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>ofertas_relacionadas>lista_ofertas_relacionadas', 'Lista de ofertas relacionadas')}</h3>
        </Col>
        <Col xs='12'>
          {/* <HTMLTable
            columns={columns}
            selectDisplayMode="thumblist"
            data={dataNivelesOferta}
            buttonSearch
            actionRow={actionsRows}
            isBreadcrumb={false}
            match={props.match}
            tableName="label.ofertas.educativas"
            toggleEditModal={(el) => {
              handleView(el)
            }}
            toggleModal={() => {
              toggle()
            }}
            modalOpen={false}
            selectedOrderOption={{
              column: 'detalle',
              label: 'Nombre Completo',
            }}
            showHeaders={true}
            modalfooter={true}
            loading={false}
            orderBy={false}
            totalRegistro={0}
            labelSearch={''}
            handlePagination={() => null}
            handleCardClick={(_: any) => null}
            hideMultipleOptions
            roundedStyle
          /> */}
          <div className='mb-5'>
            <TableReactImplementation
              columns={columns}
              data={dataNivelesOferta}
              // avoidSearch
              showAddButton
              onSubmitAddButton={() => {
                toggle()
              }}
            />
          </div>
        </Col>
        <SimpleModal
          openDialog={showForm}
          onClose={closeFormModal}
          onConfirm={
            editable
              ? handleSaveNivelOferta
              : () => toggleEditModal()
          }
          colorBtn='primary'
          txtBtn={
            editing ? (editable ? t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>ofertas_relacionadas>columna_acciones>editar>guardar', 'Guardar') : t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>ofertas_relacionadas>columna_acciones>editar>editar', 'Editar')) : t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>ofertas_relacionadas>columna_acciones>editar>titulo_agregar', 'Agregar')
          }
          txtBtnCancel={t('general>cancelar', 'Cancelar')}
          title={`${
            editing ? t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>ofertas_relacionadas>columna_acciones>editar>titulo_actualizar', 'Actualizar') : t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>ofertas_relacionadas>columna_acciones>editar>titulo_agregar', 'Agregar')
          } ${t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>ofertas_relacionadas>columna_acciones>editar>titulo', 'oferta relacionada')}`}
        >
          <Niveles
            ofertas={dataModelosOferta}
            handleCurrentOffer={handleCurrentOffer}
            setCurrentNiveles={setNiveles}
            setCurrentEspecialidades={setEspecialidad}
            addCalendar={actions.addCalendar}
            currentYear={state.currentYear}
            currentOffer={currentOffer}
            currentEspecialidades={especialidad}
            currentNiveles={niveles}
            niveles={dataNiveles}
            especialidades={dataEspecialidades}
            editable={editable}
            errors={errors}
          />
        </SimpleModal>
      </Row>
      <ConfirmModal
        openDialog={confirmModal}
        onClose={closeConfirmModal}
        onConfirm={onConfirmModal}
        colorBtn='primary'
        txtBtn={t('general>eliminar', 'Eliminar')}
        txtBtnCancel={t('general>cancelar', 'Cancelar')}
        msg={t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>ofertas_relacionadas>columna_acciones>eliminar>mensaje', '¿Está seguro que desea eliminar la oferta?')}
        title={t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>ofertas_relacionadas>columna_acciones>eliminar>titulo', 'Eliminar oferta')}
      />
    </Container>
  )
}

export default Offers
