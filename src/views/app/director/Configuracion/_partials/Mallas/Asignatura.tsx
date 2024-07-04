import React, { useState, useEffect, useMemo } from 'react'
import {
  Card,
  Col,
  CardBody,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  CustomInput
} from 'reactstrap'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import {
  getAsignaturas,
  getAllTiposAsignaturas,
  createAsignatura,
  getAllAsignaturas,
  updateAsignatura,
  deleteAsignatura,
  toggleAsignaturaEstado
} from '../../../../../../redux/asignaturas/actions'
import { useActions } from 'Hooks/useActions'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core'
import SelectItem from './SelectItem'
import colors from 'Assets/js/colors'
import search from 'Utils/search'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import { ReactComponent as GlobeIMG } from 'assets/images/Globe.svg'
import { ReactComponent as ArtIMG } from 'assets/images/Art.svg'
import { ReactComponent as ChemIMG } from 'assets/images/Chemistry.svg'
import { IoMdTrash } from 'react-icons/io'
import { RiPencilFill } from 'react-icons/ri'
import { IoEyeSharp } from 'react-icons/io5'
import BookDisabled from 'Assets/icons/bookDisabled'
import BookAvailable from 'Assets/icons/bookAvailable'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { useTranslation } from 'react-i18next'

const IMAGE_MAP = {}

const useStyles = makeStyles((theme) => ({
  inputTags: {
    minHeight: '8rem',
    border: '1px solid #eaeaea',
    padding: '0.35rem',
    color: 'white'
  },
  input: {
    display: 'none'
  }
}))

const Asignatura = () => {
  const { t } = useTranslation()
  const [edit, setEdit] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [data, setData] = useState<any>({})
  const [dataList, setDataList] = useState([])
  const [selectedAtinencias, setSelectedAtinencias] = useState([])
  const [atinencias, setAtinencias] = useState([])
  const [logosModal, setLogosModal] = useState(false)
  const [asignaturasModal, setAsignaturasModal] = useState(false)
  const [logoSeleccionado, setLogoSeleccionado] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [showAtinencias, setShowAtinencias] = useState(false)
  const [imgLogo, setImgLogo] = useState(null)
  const actions = useActions({
    getAsignaturas,
    createAsignatura,
    getAllTiposAsignaturas,
    getAllAsignaturas,
    updateAsignatura,
    deleteAsignatura,
    toggleAsignaturaEstado
  })
  const classes = useStyles()
  const [confirmDelModal, setConfirmDelModal] = useState<boolean>(false)
  const [edModal, setEdModal] = useState<boolean>(false)

  const state = useSelector((store) => {
    return {
      ...store.asignaturas
    }
  })
  const { handleSubmit, register, errors } = useForm()

  const handleLoadAsginaturas = () => {
    actions.getAllAsignaturas()
  }

  useEffect(() => {
    handleLoadAsginaturas()
    actions.getAllTiposAsignaturas()
    actions.getAllAsignaturas()
  }, [])

  useEffect(() => {
    setFilteredData(state.asignaturas)
    setDataList(
      state.asignaturas.map((el) => {
        const tipoAsignatura = state.asignaturasOptions.find(
          (item) => item.id === el.tipoAsignaturaId
        )
        el.img = IMAGE_MAP[el.logo]
        el.nombre = el.nombre.toUpperCase()

        return {
          ...el,
          tipoAsignatura: tipoAsignatura?.nombre,
          estadoP: el.esActivo ? 'Activo' : 'Inactivo'
        }
      })
    )
  }, [state.asignaturas])

  const toggleEdit = () => {
    setEdit(!edit)
    if (edit) {
      setShowAtinencias(false)
    } else {
      setImgLogo(null)
    }
  }

  const toggleAtinenciassOption = () => {
    setShowAtinencias(!showAtinencias)
    if (showAtinencias) {
      setAtinencias([])
    } else {
      setAtinencias(data.atinenciaCurricular || [])
    }
  }

  const sendData = async (disable = null) => {
    let response = null
    data.logo = imgLogo

    if (data.id || disable.id) {
      const _data = !disable?.id ? data : disable
      response = await actions.updateAsignatura({
        ..._data,
        nombre: _data.nombre.toUpperCase(),
        esActivo: disable?.id
          ? false
          : _data.esActivo === '0',
        atinenciaCurricular: !disable?.id
          ? atinencias
          : disable.atinenciaCurricular
      })
    } else {
      response = await actions.createAsignatura({
        ...data,
        nombre: data.nombre.toUpperCase(),
        esActivo: true,
        atinenciaCurricular: atinencias
      })
    }
    if (!response.error) {
      setData({})
      setEdit(false)
    }
  }

  const openLogosModal = () => {
    setLogosModal(!logosModal)
    if (logosModal) {
      setLogoSeleccionado('')
    }
  }

  const openAsignaturas = (save = false) => {
    setAsignaturasModal(!asignaturasModal)
    if (asignaturasModal && save) {
      setAtinencias(selectedAtinencias)
    } else {
      setSelectedAtinencias(atinencias)
    }
  }

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value.toUpperCase() })
  }

  const deleteAsignaturaEvent = async (obj) => {
    let response = null

    if (!obj.id) return

    response = await actions.deleteAsignatura(obj)

    if (!response.error) {
      handleLoadAsginaturas()
      setConfirmDelModal(false)
    }
  }

  const onToggleEvent = async () => {
    const response = await actions.toggleAsignaturaEstado(data)
    handleLoadAsginaturas()
    setEdModal(false)
  }

  const logoSelector = () => {
    const key = Object.keys(IMAGE_MAP)

    return (
      <>
        {key.map((k) => (
          <div
            onClick={() => {
						  setLogoSeleccionado(k)
            }}
            style={{
						  display: 'flex',
						  justifyContent: 'center',
						  flexDirection: 'column',
						  margin: '15px'
            }}
          >
            {IMAGE_MAP[k]}
            <input
              style={{ marginTop: '10px' }}
              type='radio'
              name='logo'
              value={k}
              checked={logoSeleccionado == k}
            />
          </div>
        ))}
      </>
    )
  }

	const onRegresarEvent = () => {
		setData({})
		setDisabled(false)
		setEdit(false)
		setImgLogo(null)
	}

	const columns = useMemo(() => {
		return [
			{
				Header: t(
					'configuracion>mallas_curriculares>asignatura/figura_afin>columna_logo',
					'Logo'
				),
				column: 'img',
				accessor: 'img',
				label: ''
			},
			{
				Header: t(
					'configuracion>mallas_curriculares>asignatura/figura_afin>columna_nombre',
					'Nombre'
				),
				column: 'nombre',
				accessor: 'nombre',
				label: '',
				Cell: ({ value }) => <div>{value.toUpperCase()}</div>
			},
			{
				Header: t(
					'configuracion>mallas_curriculares>asignatura/figura_afin>columna_tipo_asignatura/figura_afin',
					'Tipo de asignatura/figura afín'
				),
				column: 'tipoAsignatura',
				accessor: 'tipoAsignatura',
				label: '',
				Cell: ({ value }) => <div>{value?.toUpperCase()}</div>
			},
			{
				Header: t(
					'configuracion>mallas_curriculares>asignatura/figura_afin>columna_estado',
					'Estado'
				),
				column: 'estadoP',
				accessor: 'estadoP',
				label: '',
				Cell: ({ value }) => <div>{value?.toUpperCase()}</div>
			},
			{
				Header: t(
					'configuracion>mallas_curriculares>asignatura/figura_afin>columna_acciones',
					'Acciones'
				),
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
								className="btn-void"
								onClick={() => {
									setData({
										...fullRow,
										esActivo: fullRow.esActivo ? '0' : '1'
									})
									setImgLogo(fullRow.logo)
									setDisabled(true)
									toggleEdit()
								}}
							>
								<Tooltip title={t("estudiantes>expediente>buscador>col_acciones>ver", "Ver")}>
									<IconButton>
										<IoEyeSharp style={{ fontSize: 30 }} />
									</IconButton>
								</Tooltip>
							</button>
							<button
								className="btn-void"
								onClick={() => {
									setData({
										...fullRow,
										esActivo: fullRow.esActivo ? '0' : '1'
									})
									setImgLogo(fullRow.logo)
									if (
										fullRow.atinenciaCurricular?.length > 0
									) {
										setShowAtinencias(true)
									}
									setAtinencias(
										fullRow.atinenciaCurricular || []
									)
									setEdit(true)
									setDisabled(false)
								}}
							>
								<Tooltip
									title={t('boton>general>editar', 'Editar')}
								>
									<IconButton>
										<RiPencilFill
											style={{ fontSize: 25 }}
										/>
									</IconButton>
								</Tooltip>
							</button>
							{!fullRow.esActivo ? (
								<button
									className="btn-void"
									onClick={() => {
										setData(fullRow)
										setEdModal(true)
									}}
								>
									<Tooltip
										title={t("general>habilitar", "Habilitar")}
									>
										<IconButton>
											<BookAvailable />
										</IconButton>
									</Tooltip>
								</button>
							) : (
								<button
									className="btn-void"
									onClick={() => {
										setData(fullRow)
										setEdModal(true)
									}}
								>
									<Tooltip
										title={t("boton>general>deshabilitar", "Deshabilitar")}
									>
										<IconButton>
											<BookDisabled />
										</IconButton>
									</Tooltip>
								</button>
							)}
							<button
								className="btn-void"
								onClick={() => {
									setData(fullRow)
									setConfirmDelModal(true)
								}}
							>
								<Tooltip
									title={t(
										'boton>general>eliminar',
										'Eliminar'
									)}
								>
									<IconButton>
										<IoMdTrash style={{ fontSize: 30 }} />
									</IconButton>
								</Tooltip>
							</button>
						</div>
					)
				}
			}
		]
	}, [dataList, t])

  if (edit) {
    return (
      <Container>
        <Col>
          <h1>
            {t(
						  "configuracion>mallas_curriculares>asignatura/figura_afin>asignatura/figura_afin","Asignatura/figura afín"
            )}
          </h1>
        </Col>
        <div style={{ display: 'flex', cursor: 'pointer' }}>
          <ArrowBackIosIcon onClick={onRegresarEvent} />
          <h3 onClick={onRegresarEvent}>
            {' '}
            {t('edit_button>regresar', 'REGRESAR')}
          </h3>
        </div>

        <Col xs='6'>
          <Card>
            <CardBody>
              <Form onSubmit={handleSubmit(sendData)}>
                <FormGroup>
                  <Label>
                    {t(
										  'configuracion>mallas_curriculares>asignatura/figura_afin>agregar>nombre',
										  'Nombre'
                    )}
                  </Label>
                  <Input
                    type='text'
                    style={{ textTransform: 'uppercase' }}
                    readOnly={disabled}
                    value={data?.nombre}
                    onChange={handleChange}
                    name='nombre'
                    innerRef={register({ required: true })}
                  />
                  <ErrorSpan>
                    {errors.nombre ? 'Campo Requerido' : ''}
                  </ErrorSpan>
                </FormGroup>
                <FormGroup>
                  <Label>
                    {t(
										  'configuracion>mallas_curriculares>asignatura/figura_afin>agregar>tipo_asignatura/figura_afin',
										  'Tipo de asignatura/figura afín'
                    )}
                  </Label>
                  <Select
                    placeholder=''
                    className='select-rounded react-select'
                    classNamePrefix='select-rounded react-select'
                    disabled={disabled}
                    readOnly={disabled}
                    innerRef={register({ required: true })}
                    value={{
										  id: data?.tipoAsignaturaId,
										  nombre: data?.tipoAsignaturaId
										    ? state.asignaturasOptions
										      .find(
										        (item) =>
										          item.id ==
																data?.tipoAsignaturaId
										      )
										      ?.nombre.toUpperCase()
										    : null
                    }}
                    options={state.asignaturasOptions.map(
										  (el) => ({
										    ...el,
										    label: el.nombre.toUpperCase(),
										    value: el.id
										  })
                    )}
                    noOptionsMessage={() => 'Sin opciones '}
                    getOptionLabel={(option: any) =>
										  option.nombre?.toUpperCase()}
                    getOptionValue={(option: any) =>
										  option.id}
                    components={{
										  Input: CustomSelectInput
                    }}
                    onChange={(e) =>
										  setData({
										    ...data,
										    tipoAsignaturaId: e.id
										  })}
                  />
                  <ErrorSpan>
                    {errors.tipoAsignaturaId
										  ? 'Campo Requerido'
										  : ''}
                  </ErrorSpan>
                </FormGroup>
                <FormGroup>
                  <Label>
                    {t(
										  'configuracion>mallas_curriculares>asignatura/figura_afin>agregar>estado',
										  'Estado'
                    )}
                  </Label>
                  <Input
                    readOnly={disabled}
                    type='select'
                    name='esActivo'
                    value={data?.esActivo}
                    innerRef={register}
                    onChange={(e) =>
										  setData({
										    ...data,
										    esActivo: e.target.value
										  })}
                    disabled={disabled}
                  >
                    <option value='0'>
                      {t(
											  'configuracion>mallas_curriculares>asignatura/figura_afin>agregar>estado>activo',
											  'ACTIVO'
                  )}
                    </option>
                    <option value='1'>
                      {t(
											  'configuracion>mallas_curriculares>asignatura/figura_afin>agregar>estado>inactivo',
											  'INACTIVO'
                  )}{' '}
                    </option>
                  </Input>
                </FormGroup>
                <div>
                  <span>
                    {t(
										  'configuracion>mallas_curriculares>asignatura/figura_afin>agregar>logo',
										  'Logo'
                    )}
                  </span>
                  <div
                    style={{
										  display: 'flex',
										  alignItems: 'center'
                    }}
                  >
                    {imgLogo
                      ? (
										  IMAGE_MAP[imgLogo]
                        )
                      : (
                    <InsertPhotoOutlinedIcon color='primary' />
                        )}
                    <Button
                      color='primary'
                      hidden={disabled}
                      outline
                      style={{
											  marginRight: '1rem',
											  marginLeft: '1rem',
											  height: '3rem'
                  }}
                      onClick={() => {
											  setLogoSeleccionado(imgLogo)
											  openLogosModal()
                  }}
                    >
                      {t('configuracion>mallas>asignatura>seleccionar_logo','Seleccionar logo')}
                    </Button>
                    <FormGroup>
                      <Label>
                    {t(
												  'configuracion>mallas_curriculares>asignatura/figura_afin>agregar>abreviatura',
												  'Abreviatura'
                  )}
                  </Label>
                      <Input
                    readOnly={disabled}
                    style={{
												  textTransform: 'uppercase'
                  }}
                    type='text'
                    maxlength='3'
                    name='abreviatura'
                    value={data?.abreviatura}
                    onChange={handleChange}
                    innerRef={register({
												  required: true
                  })}
                  />
                      <ErrorSpan>
                    {errors.abreviatura
												  ? 'Campo Requerido'
												  : ''}
                  </ErrorSpan>
                    </FormGroup>
                  </div>
                </div>
                <FormGroup>
                  <Label>
                    <CustomInput
                      label={t(
											  'configuracion>mallas_curriculares>asignatura/figura_afin>agregar>atinencia_curricular',
											  'Atinencia curricular'
                  )}
                      disabled={disabled}
                      checked={showAtinencias}
                      type='checkbox'
                      onClick={() => {
											  toggleAtinenciassOption()
                  }}
                    />
                  </Label>
                  {showAtinencias && (
                    <StyledMultiSelect
                      className={classes.inputTags}
                      onClick={() => {
											  openAsignaturas()
                  }}
                    >
                      {atinencias.map((element) => {
											  const elementParsed =
													state.asignaturas.find(
													  (i) => i.id == element
													)
											  return (
  <SelectItem
    item={elementParsed}
  />
											  )
                  })}
                    </StyledMultiSelect>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>
                    {t(
										  'configuracion>mallas_curriculares>asignatura/figura_afin>agregar>descripcion',
										  'Descripción'
                    )}
                  </Label>
                  <Input
                    type='textarea'
                    readOnly={disabled}
                    value={data?.descripcion}
                    onChange={handleChange}
                    name='descripcion'
                    innerRef={register({ required: true })}
                  />
                  <ErrorSpan>
                    {errors.descripcion
										  ? 'Campo Requerido'
										  : ''}
                  </ErrorSpan>
                </FormGroup>
                <div
                  style={{
									  display: 'flex',
									  justifyContent: 'center'
                  }}
                >
                  <Button
                    color='primary'
                    style={{ marginRight: '20px' }}
                    outline
                    onClick={() => {
										  setData({})
										  setImgLogo(null)
										  setEdit(false)
										  setDisabled(false)
                    }}
                  >
                    {t('edit_button>regresar', 'Regresar')}
                  </Button>
                  <Button
                    color='primary'
                    hidden={!disabled}
                    onClick={() => {
										  setDisabled(false)
                    }}
                  >
                    {t('boton>general>editar', 'Editar')}
                  </Button>
                  <Button
                    hidden={disabled}
                    type='submit'
                    color='primary'
                    onClick={() => {}}
                  >
                    {t('boton>general>guardar', 'Guardar')}
                  </Button>
                </div>
              </Form>
              <Modal isOpen={logosModal} toggle={openLogosModal}>
                <ModalHeader toggle={openLogosModal}>
                  Seleccionar logo
                </ModalHeader>
                <ModalBody>
                  <p>
                    Selecciona un logo que haga referencia a
                    la asignatura
                  </p>
                  <div
                    style={{
										  display: 'flex',
										  flexDirection: 'column'
                    }}
                  >
                    <div
                      style={{
											  display: 'flex',
											  flexDirection: 'row'
                  }}
                    >
                      {logoSelector()}
                    </div>
                    <div>
                      <Button
                    color='primary'
                    style={{ marginRight: '20px' }}
                    onClick={() => {
												  openLogosModal()
												  setDisabled(false)
												  setLogoSeleccionado(null)
                  }}
                  >
                    {t(
												  'edit_button>regresar',
												  'Regresar'
                  )}
                  </Button>

                      <Button
                    color='primary'
                    hidden={disabled}
                    outline
                    onClick={() => {
												  openLogosModal()
												  setDisabled(false)
												  setImgLogo(logoSeleccionado)
                  }}
                  >
                    {t(
												  'boton>general>guardar',
												  'Guardar'
                  )}
                  </Button>
                    </div>
                  </div>
                </ModalBody>
              </Modal>
              <Modal
                isOpen={asignaturasModal}
                toggle={openAsignaturas}
              >
                <ModalHeader toggle={openAsignaturas}>
                  {t(
									  'configuracion>mallas_curriculares>asignatura/figura_afin>agregar>agregar_atinencia',
									  'Agregar atinencia'
                  )}
                </ModalHeader>
                <ModalBody>
                  <p>
                    {t(
										  'configuracion>mallas_curriculares>asignatura/figura_afin>agregar>agregar_atinencia>listado_asignaturas',
										  'Listado de asignaturas/figuras afín'
                    )}
                  </p>
                  <div
                    style={{
										  display: 'flex',
										  flexDirection: 'column'
                    }}
                  >
                    <Input
                      type='text'
                      onChange={(e) =>
											  setFilteredData(
											    search(e.target.value).in(
											      state.asignaturas,
											      ['nombre']
											    )
											  )}
                    />
                    <div
                      style={{
											  paddingBottom: '1rem',
											  paddingTop: '1rem'
                  }}
                    >
                      {filteredData.map((el) => {
											  return (
  <div
    style={{
														  display: 'flex',
														  padding: '1rem',
														  borderBottom:
																'1px solid #B5B9BD',
														  borderTop:
																'1px solid #B5B9BD'
    }}
  >
    <CustomInput
      label={el.nombre}
      type='checkbox'
      checked={selectedAtinencias.includes(
															  el.id
      )}
      onClick={() => {
															  const elements =
																	selectedAtinencias.includes(
																	  el.id
																	)
																	  ? selectedAtinencias.filter(
																	    (
																	      item
																	    ) =>
																	      item !==
																					el.id
																		  )
																	  : [
																	      ...selectedAtinencias,
																	      el.id
																		  ]
															  setSelectedAtinencias(
															    elements
															  )
      }}
    />
  </div>
											  )
                  })}
                    </div>
                    <div
                      style={{
											  display: 'flex',
											  justifyContent: 'center'
                  }}
                    >
                      <Button
                    color='primary'
                    outline
                    style={{ marginRight: '20px' }}
                    onClick={() => {
												  openAsignaturas()
												  setDisabled(false)
                  }}
                  >
                    {t(
												  'edit_button>regresar',
												  'Regresar'
                  )}
                  </Button>

                      <Button
                    color='primary'
                    hidden={disabled}
                    onClick={() => {
												  openAsignaturas(true)
												  setDisabled(false)
                  }}
                  >
                    {t(
												  'boton>general>guardar',
												  'Guardar'
                  )}
                  </Button>
                    </div>
                  </div>
                </ModalBody>
              </Modal>
            </CardBody>
          </Card>
        </Col>
      </Container>
    )
  } else {
    return (
      <div>
        <ConfirmModal
          openDialog={confirmDelModal}
          onClose={() => {
					  setConfirmDelModal(false)
          }}
          onConfirm={() => deleteAsignaturaEvent(data)}
          colorBtn='primary'
          txtBtn={t('boton>general>eliminar', 'Eliminar')}
          msg={t(
					  'configuracion>mallas_curriculares>asignatura/figura_afin>eliminar>mensaje',
            '¿Está seguro que desea eliminar esta asignatura?'
          )}
          title={t(
					  'configuracion>mallas_curriculares>asignatura/figura_afin>eliminar>asignaturas',
            'Asignaturas'
          )}
        />
        <ConfirmModal
          openDialog={edModal}
          onClose={() => {
					  setEdModal(false)
          }}
          onConfirm={() => onToggleEvent()}
          colorBtn='primary'
          txtBtn={
						data.esActivo
						  ? t(
						    'configuracion>ofertas_educativas>niveles>hover>deshabilitar',
						    'Deshabilitar'
							  )
						  : t(
						    'configuracion>ofertas_educativas>niveles>hover>habilitar',
						    'Habilitar'
							  )
					}
          msg={
						data.esActivo ? 
           ` ${t('configuracion>mallas_curriculares>asignatura/figura_afin>mensajeDeshabilitar','¿Está seguro que desea deshabilitar la asignatura')} ${data.nombre} ?` :
            `${t('configuracion>mallas_curriculares>asignatura/figura_afin>mensajeHabilitar','¿Está seguro que desea habilitar la asignatura')} ${data.nombre} ?`
            }
          title={t(
					  'configuracion>mallas_curriculares>asignatura/figura_afin>eliminar>asignaturas',
            'Asignaturas'
          )}
        />
        <h1>
          {t(
					  'configuracion>mallas_curriculares>asignatura/figura_afin>asignatura/figura_afin',
					  'Asignatura/figura afín'
          )}
        </h1>
        {/*
          toggleEditModal={(el) => {
            setData({ ...el,esActivo: el.esActivo ? '0': '1' })
            setImgLogo(el.logo)
            if (el.atinenciaCurricular?.length > 0) {
              setShowAtinencias(true)
            }
            setAtinencias(el.atinenciaCurricular || [])
            setEdit(true)
            setDisabled(true)
          }} */}
        <div
          style={{
					  display: 'flex',
					  justifyContent: 'right',
					  alignContent: 'center',
					  alignItems: 'center'
          }}
        >
          {/* <Button color='primary' onClick={toggleEdit}>
            {' '}
            {t('boton>general>agregrar', 'Agregar')}{' '}
          </Button> */}
        </div>
        <TableReactImplementation
          showAddButton
          msjButton
          onSubmitAddButton={toggleEdit} 
          data={dataList}
          handleGetData={() => {}}
          columns={columns}
          orderOptions={[]}
        />
      </div>
    )
  }
}

const ErrorSpan = styled.span`
	position: absolute;
	color: #bd0505;
	right: 0;
	font-weight: bold;
	font-size: 10px;
	bottom: -19px;
`

const StyledMultiSelect = styled.div`
	display: grid;
	grid-template-columns: 50% 50%;
	position: relative;

	${(props) =>
		!props.disabled
			? `&::after {
        content: "+";
        color: white;
        position: absolute;
        right: 10px;
        top: 30%;
        background-color: ${colors.primary};
        border-radius: 50%;
        height: 1.5rem;
        width: 1.5rem;
        font-weight: bold;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 21px;
    }`
			: ''}
	&[disabled] {
		background-color: #eaeaea;
	}
`

export default Asignatura
