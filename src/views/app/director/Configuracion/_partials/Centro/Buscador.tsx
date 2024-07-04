import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import TouchAppIcon from '@material-ui/icons/TouchApp'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import colors from 'Assets/js/colors'
import BarLoader from 'Components/barLoader/barLoader'
import { Separator } from 'Components/common/CustomBootstrap'
import { EditButton } from 'Components/EditButton'
import SimpleModal from 'Components/Modal/simple'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import COLORES, { DEFAULT_THEME_COLOR_VALUE, DEFAULT_THEME_NAME, findColorNameByHex } from 'Constants/ColorList'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import React, { useEffect, useMemo, useState } from 'react'
import { CirclePicker } from 'react-color'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { IoEyeSharp } from 'react-icons/io5'
import { RiFileInfoLine } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'

import {
  Button, Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  CustomInput,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row
} from 'reactstrap'
import { getCatalogs } from 'Redux/selects/actions'
import styled from 'styled-components'
import { TooltipLabel } from '../../../../../../components/JSONFormParser/styles'
import IntlMessages from '../../../../../../helpers/IntlMessages'
import {
  cleanInstitutions,
  createInstitution,
  deleteInstitutions,
  filterInBackendInstitutionsPaginated,
  filterInstitutionsPaginated,
  getCircuitos,
  getInstitutionsPaginated,
  getRegionales,
  loadCurrentInstitution,
  searchCenter,
  updateInstitution
} from '../../../../../../redux/configuracion/actions'
import { catalogsEnumObj } from '../../../../../../utils/catalogsEnum'
import { mapOption } from '../../../../../../utils/mapeoCatalogos'
const Buscador = (props) => {
  const { t } = useTranslation()

  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editable, setEditable] = useState(false)
  const [sede, setSede] = useState(false)
  const [showParents, setShowParents] = useState(false)
  const [parentId, setParentId] = useState(null)
  const [editing, setEditing] = useState(false)
  const [circuitos, setCircuitos] = useState([])
  const [data, setData] = useState([])
  const [snackBarContent, setSnackBarContent] = useState({
    variant: 'error',
    msg: 'something failed'
  })
  const [snackBar, handleClick] = useNotification()
  const [conocidoComo, setConocidoComo] = useState('')
  const [publicos, setPublicos] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    selectedPageSize: 6,
    selectedColumn: '',
    searchValue: '',
    orderColumn: '',
    orientation: '',
    filterPor: 'nombre'
  })

  const [nombre, setNombre] = useState('')
  const [openModalExpediente, setOpenModalExpediente] = useState<
    '' | 'see-filterModal'
  >('')
  const [closeContextualMenu, setCloseContextualMenu] = useState(false)
  const [filterIndex, setFilterIndex] = useState(0)
  const [color, setColor] = React.useState(null)
  const [idioma, setIdioma] = React.useState(null)

  const { handleSubmit, register, errors, setValue, reset, watch } = useForm()
  const actions = useActions({
    getInstitutionsPaginated,
    filterInstitutionsPaginated,
    filterInBackendInstitutionsPaginated,
    createInstitution,
    updateInstitution,
    deleteInstitutions,
    getCircuitos,
    getRegionales,
    getCatalogs,
    searchCenter,
    loadCurrentInstitution,
    cleanInstitutions
  })

  const {
    hasAddAccess = true,
    hasEditAccess = true,
    hasDeleteAccess = true
  } = props

  const state = useSelector((store: any) => {
    return {
      instituciones: store.configuracion.instituciones,
      estados: store.institucion.institutionStates,
      centrosPadre: store.configuracion.centrosPadre,
      regionales: store.configuracion.allRegionales,
      circuitos: store.configuracion.circuitos,
      selects: store.selects,
      feedbackErrors: {
        errors: store.configuracion.errors,
        fields: store.configuracion.fields
      },
      idiomas: store.idioma
    }
  })

  useEffect(() => {
    actions.cleanInstitutions()

    const loadData = async () => {
      setLoading(true)
      await actions.getCircuitos()
      await actions.getRegionales()
      !state.selects[catalogsEnumObj.TIPOCE.name][0] &&
        (await actions.getCatalogs(catalogsEnumObj.TIPOCE.id))
      setLoading(false)
    }
    loadData()

    return () => {
      actions.cleanInstitutions()
    }
  }, [])

  useEffect(() => {
    reset()
  }, [editable])

  useEffect(() => {
    setData(
      state.instituciones.entityList.map((inst) => {
        const _public = mapOption(
          inst.datos,
          state.selects,
          catalogsEnumObj.TIPOCE.id,
          catalogsEnumObj.TIPOCE.name
        )
        return {
          ...inst,
          estadoParsed: (
            inst.estadoInstitucion || 'SIN ASIGNAR'
          ).toUpperCase(),
          esPublica: _public?.codigo == 1,
          tipoCE: _public?.codigo == 1 ? 'PÚBLICO' : 'PRIVADO'
        }
      }) || []
    )
  }, [state.instituciones])

  const handleSnackbar = (variant, msg) => {
    setSnackBarContent({ variant, msg })
    handleClick()
  }

  const columns = useMemo(() => {
    return [
      {
        Header: t('configuracion>centro_educativo>columna_nombre', 'Nombre'),
        accessor: 'nombre',
        label: '',
        column: ''
      },
      {
        Header: t('configuracion>centro_educativo>columna_codigo', 'Código'),
        accessor: 'codigo',
        label: '',
        column: ''
      },
      {
        Header: t('configuracion>centro_educativo>columna_codigo_presupuestario', 'Código presupuestario'),
        accessor: 'codigoPresupuestario',
        label: '',
        column: ''
      },
      {
        Header: t('configuracion>centro_educativo>columna_tipo_de_centro_educativo', 'Tipo de centro educativo'),
        accessor: 'tipoCE',
        label: '',
        column: ''
      },
      {
        Header: t('configuracion>centro_educativo>columna_ubicacion_administrativa', 'Ubicación administrativa'),
        accessor: 'regional',
        label: '',
        column: ''
      },
      {
        Header: t('configuracion>centro_educativo>columna_director', 'Director'),
        accessor: 'director',
        label: '',
        column: ''
      },
      {
        Header: t('configuracion>centro_educativo>columna_estado', 'Estado'),
        accessor: 'estadoParsed',
        label: '',
        column: '',
        Cell: ({ cell, row, data }) => {
          const _row = data[row.index]
          return (
            <p
              style={{
                background: colors.primary,
                color: '#fff',
                textAlign: 'center',
                borderRadius: ' 20px',
                fontSize: 10
              }}
            >
              {_row.estadoParsed}
            </p>
          )
        }
      },
      {
        Header: t('configuracion>centro_educativo>columna_acciones', 'Acciones'),
        column: '',
        accessor: '',
        label: '',

        Cell: ({ cell, row, data }) => {
          const fullRow = data[row.index]
          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center'
              }}
            >
              <button
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'grey'
                }}
                onClick={() => {
                  props.history.push(
                    `/director/ficha-centro/${fullRow.id}`
                  )
                }}
              >
                <Tooltip title={t('buscador_ce>buscador>columna_acciones>ficha', 'Ficha del centro educativo')}>
                  <IconButton>
                    <RiFileInfoLine
                      style={{ fontSize: 30 }}
                    />
                  </IconButton>
                </Tooltip>
              </button>
              <button
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'grey'
                }}
                onClick={() => {
                  toggleForm(fullRow)
                }}
              >
                <Tooltip title={t('buscador_ce>buscador>columna_acciones>seleccionar', 'Ver centro educativo')}>
                  <IconButton>
                    <IoEyeSharp style={{ fontSize: 30 }} />
                  </IconButton>
                </Tooltip>
              </button>
            </div>
          )
        }
      }
    ]
  }, [])

  useEffect(() => {
    setLoading(true)
    actions
      .filterInBackendInstitutionsPaginated(publicos, 1, 40, 'NULL')
      .then(() => {
        setLoading(false)
      })
  }, [])

  const sendData = async (submitedData) => {
    let _data = {}
    let response

    _data = {
      nombre: submitedData.nombre,
      estado: true,
      estadoId: submitedData.estadoId,
      circuitosId: submitedData.circuito,
      conocidoComo: submitedData.conocidoComo || '',
      fechaFundacion: submitedData.fechaFundacion || '',
      motivoEstado: submitedData.motivo || '',
      codigopresupuestario: submitedData?.codigopresupuestario,
      sede,
      centroPrimario: parentId || 0,
      elementosCatalogosIds: [submitedData.tipoCE],
      idioma: idioma || state.idiomas[0].id,
      color: color ? findColorNameByHex(color) : DEFAULT_THEME_NAME
    }

    response = await actions.createInstitution(
      _data,
      pagination.pagina,
      pagination.cantidadPorPagina,
      (item) => {
        toggleForm(item)
      }
    )

    if (response.error) {
      handleSnackbar('error', response.error)
    } else {
      handleSnackbar('success', 'Se actualizó correctamente')
    }
  }

  const handleDirection = (e) => {
    setCircuitos(
      state.circuitos.filter(
        (circuito) => circuito.regionalesId == e.target.value
      )
    )
  }

  const toggleForm = async (item = {}) => {
    setShowForm(!showForm)
    setSede(false)
    if (item.id) {
      props.history.push(`/director/configuracion/centro/${item.id}`)
      props.setActiveTab(1)
    } else {
      setEditable(!editable)
    }
  }

  const columnsCentro = useMemo(
    () => [
      {
        Header: 'Nombre',
        accessor: 'nombre',
        label: '',
        column: ''
      },
      {
        Header: 'Código',
        accessor: 'codigo',
        label: '',
        column: ''
      },
      {
        Header: 'Código Presupuestario',
        accessor: 'conocidoComo',
        label: '',
        column: ''
      },
      {
        Header: 'Tipo de centro educativo',
        accessor: 'tipoCE',
        label: '',
        column: ''
      },
      {
        Header: 'Ubicación administrativa',
        accessor: 'regional',
        label: '',
        column: ''
      },
      {
        Hedaer: 'Acciones',
        Cell: ({ row }) => {
          return (
            <div>
              <button
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'grey'
                }}
                onClick={() => {
                  setValue(
                    'centro',
                    `${row.original.nombre} ${row.original.codigo}`
                  )
                  setParentId(row.original.id)
                  setShowParents(!showParents)
                  setOpenModal(false)
                }}
              >
                <Tooltip title='Seleccionar centro educativo'>
                  <IconButton>
                    <TouchAppIcon
                      style={{ fontSize: 30 }}
                    />
                  </IconButton>
                </Tooltip>
              </button>
            </div>
          )
        },
        accessor: 'acciones'
      }
    ],
    [state.instituciones]
  )

  const centros = useMemo(
    () => [...state.instituciones.entityList],
    [state.instituciones]
  )

  const tipoCE = watch('tipoCE')

  useEffect(() => {
    //
    if (tipoCE === '6150') {
      setValue('codigopresupuestario', '0000')
    } else {
      setValue('codigopresupuestario', '')
    }
  }, [tipoCE])

  return (
    <div>
      <SimpleModal
        openDialog={openModal}
        onClose={() => {
          setOpenModal(false)
        }}
        actions={false}
        title='Buscar Centro Educativo'
      >
        <div style={{ minWidth: '50rem' }}>
          <TableReactImplementation
            data={centros}
            columns={columnsCentro}
            handleGetData={async (
              searchValue,
              _,
              pageSize,
              page,
              column
            ) => {
              await actions.filterInBackendInstitutionsPaginated(
                publicos,
                page,
                pageSize,
                searchValue
              )
            }}
          />
        </div>
      </SimpleModal>
      {loading && <BarLoader />}
      {snackBar(snackBarContent.variant, snackBarContent.msg)}
      {!showForm ? (
        <div>
          <h2>{t('configuracion>centro_educativo>configurador_de_centros_educativos', 'Configurador de Centros Educativos')}</h2>
          <br />
          <Separator className='mb-4' />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignContent: 'center',
              alignItems: 'center',
              gap: '6%'
            }}
          >
            {/* <div>
							<CustomInput
								type="checkbox"
								label="Buscar sólo centros educativos públicos"
								checked={publicos}
								onClick={() => {
									setPublicos(!publicos)
								}}
							/>
						</div> */}
            <div>
              <Button
                color='primary'
                onClick={() => {
                  toggleForm()
                }}
              >
                {t('general>agregar', 'Agregar')}
              </Button>
            </div>
          </div>
          <TableReactImplementation
            orderOptions={[]}
            handleGetData={async (
              searchValue,
              filterColumn,
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
              setLoading(true)
              const res =
                await actions.filterInBackendInstitutionsPaginated(
                  publicos,
                  1,
                  30,
                  searchValue
                )
              setLoading(false)
              return res
            }}
            columns={columns}
            data={data}
            pageSize={10}
            backendSearch
          />
        </div>
      ) : (
        <div>
          <NavigationContainer
            onClick={(e) => {
              toggleForm()
            }}
          >
            <ArrowBackIosIcon />
            <h4>
              <IntlMessages id='pages.go-back-home' />
            </h4>
          </NavigationContainer>
          <Container>
            <Form onSubmit={handleSubmit(sendData)}>
              <Row>
                <Col xs={12} md={6}>
                  <Card className='mb-4'>
                    <AnimatedCard>
                      <CardTitle> 
                        {t('configuracion>centro_educativo>agregar>centro_educativo', 'Centro educativo')}
                      </CardTitle>

                      <InputRow>
                        <FormGroup>
                          <Label>{t('configuracion>centro_educativo>agregar>codigo', 'Código')}</Label>
                          <Input
                            name='codigo'
                            readOnly
                            innerRef={register}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label>
                            {t('configuracion>centro_educativo>agregar>fecha_de_fundacion', 'Fecha de fundación')} *
                          </Label>
                          <Input
                            name='fechaFundacion'
                            type='date'
                            readOnly={!editable}
                            invalid={
                              errors.fechaFundacion ||
                              state.feedbackErrors.fields.fechaFundacion
                            }
                            innerRef={register}
                          />
                          <FormFeedback>
                            {errors.fechaFundacion &&
                              t('general>campo_requerido', 'El campo es requerido')}
                            {
                              state.feedbackErrors.fields.fechaFundacion &&
                              state.feedbackErrors.errors.fechaFundacion
                            }
                          </FormFeedback>
                        </FormGroup>
                      </InputRow>
                      <FormGroup>
                        <Label>{t('configuracion>centro_educativo>agregar>nombre_oficial', 'Nombre oficial')} *</Label>
                        <Input
                          name='nombre'
                          value={nombre}
                          readOnly={!editable}
                          invalid={
                            errors.nombre ||
                            state.feedbackErrors
                              .fields.nombre
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
                            t('general>campo_requerido', 'El campo es requerido')}
                          {state.feedbackErrors
                            .fields.nombre &&
                            state.feedbackErrors
                              .errors.nombre}
                        </FormFeedback>
                      </FormGroup>
                      <FormGroup>
                        <TooltipLabel
                          field={{
                            label: t('configuracion>centro_educativo>agregar>conocido_como', 'Conocido como') + ' *',
                            config: {
                              tooltipText:
                                t('configuracion>centro_educativo>agregar>hover>conocido_como', 'Puede ingresar otro nombre que se utilice para identificar al centro educativo')
                            }
                          }}
                        />

                        <Input
                          name='conocidoComo'
                          value={conocidoComo}
                          readOnly={!editable}
                          invalid={
                            errors.conocidoComo ||
                            state.feedbackErrors
                              .fields.conocidoComo
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
                          {state.feedbackErrors
                            .fields.conocidoComo &&
                            state.feedbackErrors
                              .errors.conocidoComo}
                        </FormFeedback>
                      </FormGroup>
                      <Label>{t('configuracion>centro_educativo>agregar>sede', 'Sede')} *</Label>
                      <br />
                      {sede && !editing && (
                        <div>
                          <FormGroup>
                            <Label>
                              Elegir el centro
                              educativo principal
                            </Label>
                            <Input
                              name='centro'
                              readOnly
                              innerRef={register}
                            />
                            {/* {showParents && (
                            <ParentsContainer>
                              <IconContainer>
                                <CancelIcon
                                  onClick={() => {
                                    setShowParents(!showParents)
                                  }}
                                />
                              </IconContainer>
                              <TableReactImplementation
                                data={centros}
                                columns={columnsCentro}
                                avoidSearch
                              />
                            </ParentsContainer>
                          )} */}
                          </FormGroup>
                          <Button
                            color='primary'
                            onClick={() => {
                              setOpenModal(true)
                            }}
                          >
                            Buscar Centro Educativo
                          </Button>
                        </div>
                      )}
                      <FormGroup check inline>
                        <CustomInput
                          color='primary'
                          type='radio'
                          label={t('configuracion>centro_educativo>agregar>si', 'Si')}
                          disabled={!editable}
                          checked={sede}
                          onClick={() =>
                            setSede(!sede)}
                        />
                      </FormGroup>
                      <FormGroup check inline>
                        <CustomInput
                          color='primary'
                          type='radio'
                          label={t('configuracion>centro_educativo>agregar>no', 'No')}
                          disabled={!editable}
                          checked={!sede}
                          onClick={() =>
                            setSede(!sede)}
                        />
                      </FormGroup>
                      <InputRow>
                        <FormGroup
                          style={{ width: '40%' }}
                        >
                          <Label>
                            {t('configuracion>centro_educativo>agregar>tipo_de_centro_educativo', 'Tipo de centro educativo')} *
                          </Label>
                          <Input
                            name='tipoCE'
                            type='select'
                            disabled={false}
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
                              catalogsEnumObj
                                .TIPOCE.name
                            ].map((el) => {
                              return (
                                <option
                                  key={el.id}
                                  value={
                                    el.id
                                  }
                                >
                                  {el.nombre}
                                </option>
                              )
                            })}
                          </Input>
                          <FormFeedback>
                            {errors.tipoCE &&
                              'El campo es requerido'}
                            {state.feedbackErrors
                              .fields.tipoCE &&
                              state.feedbackErrors
                                .errors.tipoCE}
                          </FormFeedback>
                        </FormGroup>
                        <FormGroup
                          style={{ width: '40%' }}
                        >
                          <Label>
                            {t('configuracion>centro_educativo>agregar>estado_del_centro_educativo', 'Estado del centro educativo')} *
                          </Label>
                          <Input
                            name='estadoId'
                            type='select'
                            readOnly
                            disabled={!editable}
                            invalid={
                              errors.estadoId ||
                              state.feedbackErrors
                                .fields.estadoId
                            }
                            innerRef={register({
                              required: true
                            })}
                          >
                            {state.estados.map(
                              (el, i) => {
                                return (
                                  <option
                                    value={
                                      el.id
                                    }
                                    key={
                                      el.id
                                    }
                                    disabled={
                                      i >
                                      0
                                    }
                                  >
                                    {
                                      el.nombre
                                    }
                                  </option>
                                )
                              }
                            )}
                          </Input>
                          <FormFeedback>
                            {errors.estado &&
                              'El campo es requerido'}
                            {state.feedbackErrors
                              .fields.estado &&
                              state.feedbackErrors
                                .errors.estado}
                          </FormFeedback>
                        </FormGroup>
                      </InputRow>
                      <div className='my-3'>
                        <Label>
                          {t('configuracion>centro_educativo>agregar>codigo_presupuestario', 'Código presupuestario')} *
                        </Label>
                        <Input
                          name='codigopresupuestario'
                          readOnly={!editable}
                          invalid={
                            errors.codigopresupuestario ||
                            state.feedbackErrors
                              .fields.codigopresupuestario
                          }
                          innerRef={register({
                            required: true,
                            minLength: 4,
                            maxLength: 4
                          })}
                          placeholder='0000'
                        />
                      </div>
                      <FormGroup>
                        <TooltipLabel
                          field={{
                            label: t('configuracion>centro_educativo>agregar>motivo', 'Motivo') + ' *',
                            config: {
                              tooltipText:
                                t('configuracion>centro_educativo>agregar>hover>motivo', 'Detalle porqué cambia el estado del centro educativo')
                            }
                          }}
                        />
                        <Input
                          name='motivo'
                          readOnly={!editable}
                          invalid={
                            errors.motivo ||
                            state.feedbackErrors
                              .fields.motivo
                          }
                          innerRef={register}
                        />
                        <FormFeedback>
                          {errors.motivo &&
                            'El campo es requerido'}
                          {state.feedbackErrors
                            .fields.motivo &&
                            state.feedbackErrors
                              .errors.motivo}
                        </FormFeedback>
                      </FormGroup>
                    </AnimatedCard>
                  </Card>
                </Col>
                <Col xs={12} md={6}>
                  <Card className='mb-4'>
                    <AnimatedCard>
                      <CardTitle>
                        {t('configuracion>centro_educativo>agregar>ubicacion_administrativa', 'Ubicación administrativa')}
                      </CardTitle>
                      <FormGroup>
                        <Label>
                          {t('configuracion>centro_educativo>agregar>direccion_regional', 'Dirección regional')} *
                        </Label>
                        <Input
                          name='direccion'
                          type='select'
                          invalid={
                            errors.direccion ||
                            state.feedbackErrors
                              .fields.direccion
                          }
                          disabled={!editable}
                          onChange={handleDirection}
                          innerRef={register({
                            required: true
                          })}
                        >
                          <option value={null}>
                            {''}
                          </option>
                          {state.regionales.map(
                            (circuito, i) => {
                              return (
                                <option
                                  value={
                                    circuito.id
                                  }
                                >
                                  {
                                    circuito.nombre
                                  }
                                </option>
                              )
                            }
                          )}
                        </Input>
                        <FormFeedback>
                          {errors.direccion &&
                            'El campo es requerido'}
                          {state.feedbackErrors
                            .fields.direccion &&
                            state.feedbackErrors
                              .errors.direccion}
                        </FormFeedback>
                      </FormGroup>
                      <FormGroup>
                        <Label>{t('configuracion>centro_educativo>agregar>circuito', 'Circuito')} *</Label>
                        <Input
                          name='circuito'
                          type='select'
                          invalid={
                            errors.circuito ||
                            state.feedbackErrors
                              .fields.circuito
                          }
                          disabled={!editable}
                          innerRef={register({
                            required: true
                          })}
                        >
                          <option value={null}>
                            {''}
                          </option>
                          {circuitos.map(
                            (circuito) => {
                              return (
                                <option
                                  value={
                                    circuito.id
                                  }
                                >
                                  {
                                    circuito.nombre
                                  }
                                </option>
                              )
                            }
                          )}
                        </Input>
                        <FormFeedback>
                          {errors.circuito &&
                            'El campo es requerido'}
                          {state.feedbackErrors
                            .fields.circuito &&
                            state.feedbackErrors
                              .errors.circuito}
                        </FormFeedback>
                      </FormGroup>
                    </AnimatedCard>
                  </Card>
                  {/* <Card>
                    <AnimatedCard>
                      <CardTitle>
                        {t('configuracion>centro_educativo>agregar>general', 'General')}
                      </CardTitle>
                      <FormGroup>
                        <Label>{t('configuracion>centro_educativo>agregar>color', 'Color')} *</Label>
                        <CirclePicker color={{ hex: color || DEFAULT_THEME_COLOR_VALUE }} onChangeComplete={(c, _) => setColor(c.hex)} colors={COLORES.map(i => i.color)} />
                      </FormGroup>
                      <FormGroup>
                        <Label>{t('configuracion>centro_educativo>agregar>idioma_por_default', 'Idioma por defecto')} *</Label>
                        <Input name='idioma' type='select' onChange={(e) => setIdioma(e.target.value)}>
                          {state.idiomas.map(i => {
                            return <option value={i.id}>{i.nombre.replace('.json', '')}</option>
                          })}
                        </Input>
                      </FormGroup>
                    </AnimatedCard>
                  </Card> */}
                </Col>
                <div style={{ margin: '0 auto' }}>
                  <EditButton
                    editable={editable}
                    setEditable={async (value) => {
                      await setEditable(value)
                      if (!value) {
                        toggleForm()
                      }
                    }}
                    loading={loading}
                  />
                </div>
              </Row>
            </Form>
          </Container>
        </div>
      )}
    </div>
  )
}

const NavigationContainer = styled.span`
	display: flex;
	cursor: pointer;
`

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

const ParentsContainer = styled.div`
	padding-top: 2rem;
	position: relative;
`

const Centro = styled.div`
	border-bottom: 1px solid grey;
	&:hover {
		cursor: pointer;
		background-color: rgba(0, 0, 0, 0.05);
	}
`

const IconContainer = styled.div`
	position: absolute;
	top: 10px;
	right: 10px;
`

export default withRouter(Buscador)
