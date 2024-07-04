import TouchAppIcon from '@material-ui/icons/TouchApp'
import Tooltip from '@mui/material/Tooltip'
import colors from 'Assets/js/colors'
import { EditButton } from 'Components/EditButton'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import { CirclePicker } from 'react-color'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  CustomInput,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Row
} from 'reactstrap'
import { getCatalogs } from 'Redux/selects/actions'

import COLORES from 'Constants/ColorList'
import { useTranslation } from 'react-i18next'

import styled from 'styled-components'

import ConfirmModal from 'Components/Modal/ConfirmModal'
import SimpleModal from 'Components/Modal/simple'
import { getInstitucion } from 'Redux/configuracion/actions'
import { TooltipLabel } from '../../../../../../components/JSONFormParser/styles'
import {
  checkMatricula, cleanInstitutions,
  createInstitution,
  deleteInstitutions,
  filterInstitutionsPaginated,
  getCircuitos,
  getInstitucionesFinder,
  getInstitutionsPaginated,
  getRegionales,
  searchCenter,
  searchCenterById,
  updateInstitution
} from '../../../../../../redux/configuracion/actions'
import { catalogsEnumObj } from '../../../../../../utils/catalogsEnum'

const General = (props) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [editable, setEditable] = useState(false)
  const [sede, setSede] = useState(false)
  const [parentId, setParentId] = useState(null)
  const [circuitos, setCircuitos] = useState([])
  const [data, setData] = useState([])
  const [color, setColor] = React.useState(null)
  const [idioma, setIdioma] = React.useState(null)

  const [dataUpdate, setDataUpdate] = useState(null)

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [firstCalled, setFirstCalled] = useState(false)
  const [paginationData, setPaginationData] = useState({
    pagina: 1,
    cantidadPorPagina: 10
  })
  const [snackBarContent, setSnackBarContent] = useState({
    variant: 'error',
    msg: 'something failed'
  })
  const [conocidoComo, setConocidoComo] = useState('')
  const [nombre, setNombre] = useState('')
  const [snackBar, handleClick] = useNotification()
  const [centroPrimario, setCentroPrimario] = useState<any>({})
  const [pagination, setPagination] = useState({
    page: 1,
    selectedPageSize: 6,
    selectedColumn: '',
    searchValue: '',
    orderColumn: '',
    orientation: ''
  })
  const [msgModal, setMsgModal] = useState(
    '¿Desea Desactivar/Cerrar a este Centro educativo?'
  )

  const actions = useActions({
    getInstitutionsPaginated,
    filterInstitutionsPaginated,
    createInstitution,
    updateInstitution,
    deleteInstitutions,
    getCircuitos,
    getRegionales,
    getCatalogs,
    searchCenter,
    getInstitucionesFinder,
    cleanInstitutions,
    checkMatricula,
    getInstitucion
  })

  const {
    hasAddAccess = true,
    hasEditAccess = true,
    hasDeleteAccess = true
  } = props

  const { accessRole } = useSelector(
    (state: any) => state?.authUser?.currentRoleOrganizacion
  )

  const state = useSelector((store: any) => {
    return {
      estados: store.institucion.institutionStates,
      centrosPadre: store.configuracion.centrosPadre,
      regionales: store.configuracion.allRegionales,
      circuitos: store.configuracion.circuitos,
      selects: store.selects,
      feedbackErrors: {
        errors: store.configuracion.errors,
        fields: store.configuracion.fields
      },
      currentInstitution: store.configuracion.currentInstitution,
      idiomas: store.idioma,
      accessRole: store.authUser.currentRoleOrganizacion.accessRole,
      centros: store.configuracion.instituciones
    }
  })
  const { handleSubmit, register, errors, setValue, reset, watch } = useForm()
  const [padreCentro, setPadreCentro] = useState('')
  const tipoCE = watch('tipoCE')
  const toggleAddNewModal = () => {
    setIsOpen(!isOpen)
  }

  const handleSnackbar = (variant, msg) => {
    setSnackBarContent({ variant, msg })
    handleClick()
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      !state.selects[catalogsEnumObj.TIPOCE.name][0] &&
        (await actions.getCatalogs(catalogsEnumObj.TIPOCE.id))

      setLoading(false)
      if (!state.currentInstitution.id) {
        props.setActiveTab(0)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    const loadData = async () => {
      await actions.getCircuitos()
      await actions.getRegionales()
    }
    loadData()
  }, [])

  useEffect(() => {
    setFirstCalled(true)
    return () => {
      actions.cleanInstitutions()
    }
  }, [isOpen])

  useEffect(() => {
    if (!state.centros.entityList) return
    const datos = state.centros.entityList.map((i) => {
      return {
        institucionId: i.institucionId,
        nombre: i.institucionNombre,
        codigo: i.institucionCodigo,
        tipoInstitucion: i.tipoInstitucion,
        regional: i.regionalNombre,
        circuito: i.circuitoNombre,
        estado: i.estado,
        codigoPresupuestario: i.codigoPresupuestario,
        estadoParsed: i.estado ? 'ACTIVA' : 'INACTIVA'
        // checked: sede ? sede.codigo == i.institucionCodigo ? true : false
      }
    })
    setData(datos)
  }, [state.centros.entityList])

  useEffect(() => {
    if (tipoCE === 'PRIVADO') {
      setValue('codigopresupuestario', '0000')
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      if (state.currentInstitution.id) {
        await setSede(state.currentInstitution.sede)
        const _circuito = state.circuitos.find((circuito) => {
          return circuito.id === state.currentInstitution.circuitosId
        })

        _circuito &&
          (await setCircuitos(
            state.circuitos.filter(
              (circuito) =>
                _circuito.regionalesId === circuito.regionalesId
            )
          ))
        setValue('nombre', state.currentInstitution?.nombre)
        setValue('motivo', state.currentInstitution?.motivoEstado)
        setValue('codigo', state.currentInstitution?.codigo)
        setValue(
          'codigopresupuestario',
          state.currentInstitution?.codigoPresupuestario
        )
        setValue('conocidoComo', state.currentInstitution?.conocidoComo)
        setConocidoComo(state.currentInstitution.conocidoComo || '')
        setNombre(state.currentInstitution.nombre)

        if (_circuito) {
          setValue('circuito', _circuito.id)
          setValue('direccion', _circuito.regionalesId)
        }

        setValue('estadoId', state.currentInstitution.estadoId)
        state.currentInstitution.fechaFundacion &&
          state.currentInstitution.fechaFundacion !==
          '0001-01-01T00:00:00' &&
          setValue(
            'fechaFundacion',
            moment(state.currentInstitution.fechaFundacion).format(
              'YYYY-MM-DD'
            )
          )

        let _public: any = 3
        if (state.currentInstitution.datos) {
          _public = state.selects[catalogsEnumObj.TIPOCE.name].find(
            (el) =>
              Number(el.id) ===
              Number(state.currentInstitution.datos[0].elementoId)
          ).codigo
        } else {
          _public = !state.currentInstitution.esPrivado ? 1 : 2
        }

        setValue(
          'tipoCE',
          state.selects[catalogsEnumObj.TIPOCE.name].find(
            (el) => Number(el.codigo) === Number(_public)
          ).nombre
        )

        setParentId(state.currentInstitution.centroPrimario)

        const response = await searchCenterById(
          state.currentInstitution.centroPrimario
        )

        setSede(state.currentInstitution.sede)
        setCentroPrimario({
          codigo: response.data.codigo,
          nombre: response.data.nombre
        })
        /* setValue(
          'centroPadre',
          response.data.codigo && response.data.nombre
            ? response.data.codigo + ' - ' + response.data.nombre
            : ''
        ) */
        setPadreCentro(
          response.data.codigo && response.data.nombre
            ? response.data.codigo + ' - ' + response.data.nombre
            : ''
        )
        const c = COLORES.find(i => i.id == state.currentInstitution.color)
        setColor(c?.color || null)

        const i = state.idiomas.find(i => i.id == state.currentInstitution.idioma)
        setIdioma(i?.id || null)
        /* if (state.currentInstitution.centroPrimario) {
          console.log(response.data, 'AAAAAAAAAA')
        } */
      } else {
        reset()
        setConocidoComo('')
        setNombre('')
      }
    }
    loadData()
  }, [state.currentInstitution, editable])

  const selectInstitution = (fullRow) => {
    setValue('centro', fullRow.nombre)
    // setValue('centroPadre', fullRow.codigo + ' - ' + fullRow.nombre)
    setCentroPrimario({
      id: fullRow.institucionId,
      codigo: fullRow.codigo,
      nombre: fullRow.nombre
    })
    setParentId(fullRow.institucionId)
    // setPadreCentro(fullRow.codigo + ' - ' + fullRow.nombre)
    toggleAddNewModal()
  }

  const columns = useMemo(() => {
    return [
      {
        Header: 'Código',
        column: 'codigo',
        accessor: 'codigo',
        label: ''
      },
      {
        Header: 'Nombre',
        column: 'nombre',
        accessor: 'nombre',
        label: ''
      },
      {
        Header: 'Código presupuestario',
        column: 'codigoPresupuestario',
        accessor: 'codigoPresupuestario',
        label: ''
      },
      {
        Header: 'Regional',
        column: 'regional',
        accessor: 'regional',
        label: ''
      },
      {
        Header: 'Circuito',
        column: 'circuito',
        accessor: 'circuito',
        label: ''
      },
      {
        Header: 'Acciones',
        column: '',
        accessor: '',
        label: ' ',
        Cell: ({ _, row, data }) => {
          const fullRow = data[row.index]
          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Tooltip title='Seleccionar centro educativo'>
                <TouchAppIcon
                  onClick={() => {
                    selectInstitution(fullRow)
                  }}
                  style={{
                    fontSize: 25,
                    color: colors.darkGray,
                    cursor: 'pointer'
                  }}
                />
              </Tooltip>
            </div>
          )
        }
      }
    ]
  }, [data])

  const sendData = async (submitedData) => {
    let _data = {}
    let response

    if (!state.currentInstitution.id) {
      _data = {
        nombre: submitedData.nombre,
        estadoId: submitedData.estadoId,
        estado: true,
        circuitosId: submitedData.circuito,
        conocidoComo: submitedData.conocidoComo,
        fechaFundacion: submitedData.fechaFundacion,
        sede,
        centroPrimario: parentId || 0,
        elementosCatalogosIds: [submitedData.tipoCE],
        //idioma: idioma || state.idiomas[0].id,
        //color: color ? COLORES.find(i => i.color.toLowerCase() == color.toLowerCase()).id : COLORES[0].id
      }
      response = await actions.createInstitution(
        _data,
        paginationData.pagina,
        paginationData.cantidadPorPagina
      )
    } else {
      const tipoCentro = state.selects[catalogsEnumObj.TIPOCE.name].find(
        (el) => el.nombre == submitedData.tipoCE
      ).id

      _data = {
        ...state.currentInstitution,
        nombre,
        circuitosId: submitedData.circuito,
        conocidoComo: conocidoComo || '',
        fechaFundacion: submitedData.fechaFundacion || '',
        sede,
        motivoEstado: submitedData.motivo || '',
        estado: true,
        estadoId: submitedData.estadoId,
        centroPrimario: parentId || 0,
        codigosCatalogosRelacionadosVista: [17],
        elementosCatalogosIds: [tipoCentro],
        codigoPresupuestario: submitedData?.codigopresupuestario,
        //idioma: idioma || state.idiomas[0].id,
        //color: color ? COLORES.find(i => i.color.toLowerCase() == color.toLowerCase()).id : COLORES[0].id
      }

      const haveMatriculaActive: boolean = await actions.checkMatricula(
        state.currentInstitution.id
      )

      if (
        !haveMatriculaActive &&
        (Number(submitedData.estadoId) === 3 ||
          Number(submitedData.estadoId) == 2)
      ) {
        setMsgModal('¿Desea Desactivar/Cerrar a este Centro educativo?')
        setOpenConfirmModal(true)
        setDataUpdate(_data)
        return
      }

      if (
        haveMatriculaActive &&
        (Number(submitedData.estadoId) === 3 ||
          Number(submitedData.estadoId) == 2)
      ) {
        handleSnackbar(
          'error',
          'El Centro educativo actualmente cuenta con matrícula, favor revisar.'
        )

        return
      }

      response = await actions.updateInstitution(
        _data,
        paginationData.pagina,
        paginationData.cantidadPorPagina
      )
      await actions.getInstitucion(state.currentInstitution.id)
    }
    console.log(response, 'RESPONSE')
    if (!response.error) {
      handleSnackbar('success', 'Se actualizó correctamente')

      setEditable(false)
    } else {
      handleSnackbar('error', response.error)
      setEditable(true)
    }
    setDataUpdate(null)
  }

  const handleDirection = (e) => {
    setCircuitos(
      state.circuitos.filter(
        (circuito) => circuito.regionalesId == e.target.value
      )
    )
  }
  const changeStateInstitution = async (e) => {
    if (!dataUpdate) {
      return
    }
    const response = await actions.updateInstitution(
      dataUpdate,
      paginationData.pagina,
      paginationData.cantidadPorPagina
    )
    //console.log(response, 'RESPONSE2222')
    await actions.getInstitucion(state.currentInstitution.id)
    if (!response.error) {
      handleSnackbar('success', 'Se actualizó correctamente')
      setEditable(false)
    } else {
      handleSnackbar('error', response.error)
      setEditable(true)
    }
    setOpenConfirmModal(false)
    setDataUpdate(null)
  }

  useEffect(() => {
    if (tipoCE === 'PRIVADO') {
      setValue('codigopresupuestario', '0000')
    }
  }, [tipoCE])

  return (
    <div>
      {snackBar(snackBarContent.variant, snackBarContent.msg)}
      <Container>
        <Form onSubmit={handleSubmit(sendData)}>
          <Row>
            <Col xs={12} md={6}>
              <Card style={{ paddingTop: '46px' }} className="mb-4">
                <AnimatedCard>
                  <CardTitle>{t('expediente_ce>informacion_general>general>institucion', 'Institución')}</CardTitle>
                  <InputRow>
                    <FormGroup>
                      <Label>{t('expediente_ce>informacion_general>general>institucion_codigo', 'Código')}</Label>
                      <Input
                        name="codigo"
                        readOnly={true}
                        innerRef={register}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>{t('expediente_ce>informacion_general>general>institucion_fecha', 'Fecha de fundación')}</Label>
                      <Input
                        name="fechaFundacion"
                        type="date"
                        readOnly={!editable}
                        invalid={
                          errors.fechaFundacion ||
                          state.feedbackErrors.fields.fechaFundacion
                        }
                        innerRef={register}
                      />
                      <FormFeedback>
                        {errors.fechaFundacion &&
                          'El campo es requerido'}
                        {state.feedbackErrors.fields.fechaFundacion &&
                          state.feedbackErrors.errors.fechaFundacion}
                      </FormFeedback>
                    </FormGroup>
                  </InputRow>
                  <InputRow>
                    <FormGroup>
                      <Label>{t('configuracion>centro_educativo>ver_centro_educativo>informacion_general>codigo_presupuestario', 'Código presupuestario')} *</Label>
                      <Input
                        type="number"
                        name="codigopresupuestario"
                        readOnly={!editable}
                        invalid={
                          errors['codigopresupuestario'] ||
                          state.feedbackErrors.fields[
                          'codigopresupuestario'
                          ]
                        }
                        innerRef={register({
                          required: true,
                          minLength: 4,
                          maxLength: 4
                        })}
                        placeholder='0000'
                      />
                    </FormGroup>
                  </InputRow>
                  <FormGroup>
                    <Label>{t('expediente_ce>informacion_general>general>institucion_nombre', 'Nombre oficial')} *</Label>
                    <Input
                      name='nombre'
                      value={nombre}
                      readOnly={!editable}
                      invalid={
                        errors.nombre ||
                        state.feedbackErrors.fields.nombre
                      }
                      innerRef={register({
                        required: true
                      })}
                      onChange={(e) => {
                        setNombre(
                          e.target.value.toUpperCase()
                        )
                      }}
                    />
                    <FormFeedback>
                      {errors.nombre &&
                        'El campo es requerido'}
                      {state.feedbackErrors.fields.nombre &&
                        state.feedbackErrors.errors.nombre}
                    </FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <TooltipLabel
                      field={{
                        label: t('expediente_ce>informacion_general>general>institucion_conocido_como', 'Conocido como'),
                        config: {
                          tooltipText:
                            t('expediente_ce>informacion_general>general>hover>institucion_conocido_como', 'Digite otro nombre con el cual se conoce el centro educativo')
                        }
                      }}
                    />
                    <Input
                      name='conocidoComo'
                      value={conocidoComo}
                      readOnly={!editable}
                      invalid={
                        errors.conocidoComo ||
                        state.feedbackErrors.fields.conocidoComo
                      }
                      innerRef={register}
                      onChange={(e) => {
                        setConocidoComo(
                          e.target.value.toUpperCase()
                        )
                      }}
                    />
                    <FormFeedback>
                      {errors.conocidoComo &&
                        'El campo es requerido'}
                      {state.feedbackErrors.fields.conocidoComo &&
                        state.feedbackErrors.errors.conocidoComo}
                    </FormFeedback>
                  </FormGroup>
                  <Label>{t('expediente_ce>informacion_general>general>institucion_sede', 'Sede')} *</Label>
                  <br />
                  <SimpleModal
                    title='Buscar Centro Educativo'
                    openDialog={isOpen}
                    onClose={toggleAddNewModal}
                    onConfirm={toggleAddNewModal}
                    btnSubmit={false}
                  >
                    <TableReactImplementation
                      data={data}
                      handleGetData={async (
                        searchValue,
                        _,
                        pageSize,
                        page,
                        column
                      ) => {
                        setPagination({
                          ...pagination,
                          page,
                          pageSize,
                          column,
                          searchValue
                        })

                        if (firstCalled) {
                          setLoading(true)
                          await actions.getInstitucionesFinder(
                            true,
                            searchValue,
                            1,
                            30,
                            state.accessRole
                              .nivelAccesoId == 3
                              ? state.accessRole
                                .organizacionId
                              : null,
                            state.accessRole
                              .nivelAccesoId == 2
                              ? state.accessRole
                                .organizacionId
                              : null,
                            state.accessRole
                              .nivelAccesoId == 1
                              ? state.accessRole
                                .organizacionId
                              : null
                          )
                          setLoading(false)
                        }
                      }}
                      columns={columns}
                      orderOptions={[]}
                      pageSize={10}
                      backendSearch
                    />
                  </SimpleModal>

                  <FormGroup check inline>
                    <CustomInput
                      color='primary'
                      type='radio'
                      label={t('general>si', 'Si')}
                      disabled={!editable}
                      checked={sede}
                      onClick={() => setSede(!sede)}
                    />
                  </FormGroup>
                  <FormGroup check inline>
                    <CustomInput
                      color='primary'
                      type='radio'
                      label={t('general>no', 'No')}
                      disabled={!editable}
                      checked={!sede}
                      onClick={() => {
                        setParentId(null)
                        setSede(!sede)
                      }}
                    />
                  </FormGroup>
                  {sede && (
                    <FormGroup>
                      <Label>
                        {t('expediente_ce>informacion_general>general>institucion_centro_educativo_principal', 'Centro educativo principal')}
                      </Label>

                      <FormGroup>
                        <InputGroup size='lg'>
                          <Input
                            name='centroPadre'
                            innerRef={register}
                            className='input-main-search'
                            disabled
                            value={
                              centroPrimario.codigo &&
                                centroPrimario.nombre
                                ? `${centroPrimario.codigo} - ${centroPrimario.nombre}`
                                : ''
                            }
                          />

                          <InputGroupAddon addonType='append'>
                            <Button
                              disabled={!editable}
                              color='primary'
                              className='buscador-table-btn-search'
                              onClick={async () => {
                                toggleAddNewModal()
                              }}
                            >
                              Buscar
                            </Button>
                          </InputGroupAddon>
                        </InputGroup>
                      </FormGroup>
                    </FormGroup>
                  )}
                  <InputRow>
                    <FormGroup style={{ width: '40%' }}>
                      <Label>
                        {t('expediente_ce>informacion_general>general>institucion_tipo_ce', 'Tipo de centro educativo')}
                      </Label>
                      {!state.currentInstitution.id
                        ? (
                          <Input
                            name='tipoCE'
                            type='select'
                            readOnly
                            invalid={
                              errors.tipoCE ||
                              state.feedbackErrors
                                .fields.tipoCE
                            }
                            innerRef={register({
                              required: true
                            })}
                          >
                            {state.selects[
                              catalogsEnumObj.TIPOCE
                                .name
                            ].map((el) => {
                              const disabled = watch(
                                'tipoCE'
                              )
                                ? el.id !=
                                watch('tipoCE')
                                : false
                              return (
                                <option
                                  key={el.id}
                                  value={el.id}
                                  disabled={
                                    disabled
                                  }
                                >
                                  {el.nombre}
                                </option>
                              )
                            })}
                          </Input>
                        )
                        : (
                          <Input
                            name='tipoCE'
                            innerRef={register}
                            readOnly
                            onChange={() => { }}
                          />
                        )}
                      <FormFeedback>
                        {errors.tipoCE &&
                          'El campo es requerido'}
                        {state.feedbackErrors.fields.tipoCE &&
                          state.feedbackErrors.errors.tipoCE}
                      </FormFeedback>
                    </FormGroup>
                    <FormGroup style={{ width: '40%' }}>
                      <Label>
                        {t('expediente_ce>informacion_general>general>institucion_estado_ce', 'Estado del centro educativo')}
                      </Label>
                      <Input
                        name='estadoId'
                        type='select'
                        disabled={!editable}
                        invalid={
                          errors.estadoId ||
                          state.feedbackErrors.fields.estadoId ||
                          state.feedbackErrors.fields.EstadoId
                        }
                        innerRef={register({
                          required: true
                        })}
                      >
                        <option value={0} />
                        {state.estados.map((el) => {
                          return (
                            <option
                              value={el.id}
                              key={el.id}
                            >
                              {el.nombre}
                            </option>
                          )
                        })}
                      </Input>
                      <FormFeedback>
                        {errors.estadoId &&
                          'El campo es requerido'}
                        {(state.feedbackErrors.fields.estadoId &&
                          state.feedbackErrors.errors.estadoId) ||
                          state.feedbackErrors.errors.EstadoId}
                      </FormFeedback>
                    </FormGroup>
                  </InputRow>

                  <FormGroup>
                    <TooltipLabel
                      field={{
                        label: t('general_ce>observaciones', 'Observaciones'),
                        config: {
                          tooltipText:
                            t('expediente_ce>informacion_general>general>hover>institucion_motivo', 'Detalle porqué cambia el estado del centro educativo')
                        }
                      }}
                    />
                    <Input
                      type="textarea"
                      style={{
                        resize: 'none'
                      }}
                      name='motivo'
                      readOnly={!editable}
                      invalid={
                        errors.motivo ||
                        state.feedbackErrors.fields.motivo
                      }
                      innerRef={register}
                    />
                    <FormFeedback>
                      {errors.motivo &&
                        'El campo es requerido'}
                      {state.feedbackErrors.fields[
                        'motivo'
                      ] &&
                        state.feedbackErrors.errors[
                        'motivo'
                        ]}
                    </FormFeedback>
                  </FormGroup>
                </AnimatedCard>
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card className="mb-4">
                <AnimatedCard>
                  <CardTitle>
                    {t('expediente_ce>informacion_general>general>sedes_ubicacion_adm', 'Ubicación administrativa')}
                  </CardTitle>
                  <FormGroup>
                    <Label>{t('expediente_ce>informacion_general>ubicacion_adm>direccion_regional', 'Dirección regional')} *</Label>
                    <Input
                      name="direccion"
                      type="select"
                      invalid={
                        errors.direccion ||
                        state.feedbackErrors.fields.direccion
                      }
                      disabled={!editable}
                      onChange={handleDirection}
                      innerRef={register({
                        required: true
                      })}
                    >
                      <option value={null} />
                      {state.regionales.map(
                        (circuito) => {
                          return (
                            <option
                              value={circuito.id}
                            >
                              {circuito.nombre}
                            </option>
                          )
                        }
                      )}
                    </Input>
                    <FormFeedback>
                      {errors.direccion &&
                        'El campo es requerido'}
                      {state.feedbackErrors.fields.direccion &&
                        state.feedbackErrors.errors.direccion}
                    </FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label>{t('buscador_ce>ver_centro>ubicacion_administrativa>circuito', 'Circuito')} *</Label>
                    <Input
                      name='circuito'
                      type='select'
                      invalid={
                        errors.circuito ||
                        state.feedbackErrors.fields.circuito
                      }
                      disabled={!editable}
                      innerRef={register({
                        required: true
                      })}
                    >
                      <option value={null} />
                      {circuitos.map((circuito) => {
                        return (
                          <option value={circuito.id}>
                            {circuito.nombre}
                          </option>
                        )
                      })}
                    </Input>
                    <FormFeedback>
                      {errors.circuito &&
                        'El campo es requerido'}
                      {state.feedbackErrors.fields.circuito &&
                        state.feedbackErrors.errors.circuito}
                    </FormFeedback>
                  </FormGroup>
                </AnimatedCard>
              </Card>
              {/* <Card>
                <AnimatedCard>
                  <CardTitle>
                    {t('configuracion>centro_educativo>ver_centro_educativo>informacion_general>general', 'General')}
                  </CardTitle>
                   <FormGroup>
                    <Label>{t('configuracion>centro_educativo>ver_centro_educativo>informacion_general>color', 'Color')}</Label>
                    <CirclePicker color={{ hex: color }} onChangeComplete={(c, _) => setColor(c.hex)} colors={COLORES.map(i => i.color)} />
                  </FormGroup>
                  <FormGroup>
                    <Label>{t('configuracion>centro_educativo>ver_centro_educativo>informacion_general>idioma_por_default', 'Idioma por defecto')}</Label>
                    <Input name='idioma' type='select' value={idioma} onChange={(e) => setIdioma(e.target.value)}>
                    {state.idiomas.map(i => {
											  return <option value={i.id}>{i.nombre.replace('.json', '')}</option>
                  })}
                  </Input>
                  </FormGroup> 
                </AnimatedCard>
              </Card> */}
            </Col>
            {hasEditAccess && (
              <div
                className='mb-5'
                style={{ margin: '0 auto' }}
              >
                <EditButton
                  editable={editable}
                  setEditable={setEditable}
                  loading={loading}
                />
              </div>
            )}
          </Row>
        </Form>
      </Container>
      {openConfirmModal && (
        <ConfirmModal
          title='Centro educativo'
          openDialog={openConfirmModal}
          onClose={() => setOpenConfirmModal(false)}
          onConfirm={changeStateInstitution}
          colorBtn='primary'
          msg={msgModal}
        />
      )}
    </div>
  )
}

const AnimatedCard = styled(CardBody)`
	transition: all ease-in 1s;
`

const InputRow = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;

	@media (max-width: 800px) {
		flex-direction: column;

		.form-group {
			width: 100% !important;
		}
	}
`

export default General
