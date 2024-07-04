import React, { useEffect, useState } from 'react'
import { useActions } from 'Hooks/useActions'

import JSONFormParser from 'Components/JSONFormParser/JSONFormParser.tsx'
import {
  GetResponseByInstitutionAndFormName,
  CreateNewFormResponse,
  UpdateFormResponse,
  DeleteFormResponses
} from '../../../../../../redux/formularioCentroResponse/actions'
import { GetByName } from 'Redux/formularios/actions'
import { useSelector } from 'react-redux'
import Loader from 'Components/Loader'
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Input,
  Button,
  Label,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CustomInput,
  ButtonDropdown,
  Form,
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap'
import { EditButton } from '../../../../../../components/EditButton'
import { FormGroup, IconButton } from '@material-ui/core'
import styled from 'styled-components'
import Menu from '@material-ui/core/Menu'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import MenuItem from '@material-ui/core/MenuItem'
import { useForm } from 'react-hook-form'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import IntlMessages from 'Helpers/IntlMessages'
import swal from 'sweetalert'
import { TableReactImplementation } from 'Components/TableReactImplementation'

import { useTranslation } from 'react-i18next'

const Contacto = (props) => {
  const { t } = useTranslation()
  const [pageData, setPageData] = useState({ layouts: [] })
  const [tableFormData, setTableFormData] = useState({ layouts: [] })
  const [formResponse, setFormResponse] = useState({})
  const [tableResponse, setTableResponse] = useState<array>([])
  const [loading, setLoading] = useState(true)
  const [loadingRequest, setLoadingRequest] = useState(false)
  const [loadingMainFormRequest, setLoadingMainFormRequest] = useState(false)
  const [formUtils, setFormUtils] = useState({})
  const [horarios, setHorarios] = useState('')
  const [formularioCategoriaId, setFormularioCategoriaId] = useState(null)
  const [contactoCategoriaId, setContactoCategoriaId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editable, setEditable] = useState(false)
  const [tableformResponse, setTableformResponse] = useState({})
  const [dropdownSplitOpen, setDropdownSplitOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [stagedPutData, setStagedPutData] = useState([])
  const [stagedPostData, setStagedPostData] = useState([])
  const [contactEditable, setContactEditable] = useState(false)
  const [currentExtentions, setCurrentExtentions] = useState()
  const [editExtForm, setEditExtForm] = useState(true)
  const actions = useActions({})
  const { handleSubmit } = useForm()
  // const [editable, setEditable] = useState()

  const state = useSelector((store) => {
    return {
      currentInstitution: store.authUser.currentInstitution,
      institucionWithAditionalData: store.institucion.currentInstitution
    }
  })

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const form = await GetByName('datosContactoDeCentro')
        const tableForm = await GetByName('datosExtensionesCentro')
        const response = await GetResponseByInstitutionAndFormName(
          state.currentInstitution.id,
          'datosContactoDeCentro'
        )
        const tableResponseRequest: array =
					await GetResponseByInstitutionAndFormName(
					  state.currentInstitution.id,
					  'datosExtensionesCentro',
					  false
					)

        if (response.solucion) {
          const solucion = JSON.parse(response.solucion)
          setFormResponse({ ...solucion, id: response.id })
          setHorarios(solucion.horarios)
        } else {
          setFormResponse({})
        }

        if (tableResponseRequest) {
          setTableResponse(tableResponseRequest)
        } else {
          setTableResponse([])
        }

        setPageData(form.formulario)
        setContactoCategoriaId(form.formularioCategoriaId)
        setFormularioCategoriaId(tableForm.formularioCategoriaId)
        setTableFormData(tableForm.formulario)
      } catch (e) {
        setPageData({ layouts: [] })
      }
      setLoading(false)
    }

    loadData()
  }, [state.currentInstitution.id])

  useEffect(() => {
    if (formResponse) {
      setHorarios(formResponse.horarios)
    } else {
      setHorarios()
    }
    setStagedPutData([])
    setStagedPostData([])
  }, [editable])

  useEffect(() => {
    if (!showForm) {
      setTableformResponse()
    }
  }, [showForm])

  const postData = async (data) => {
    setLoadingRequest(true)
    const requestResponse = await CreateNewFormResponse({
      solucion: data.solucion,
      institucionId: state.currentInstitution.id,
      formularioCategoriaId
    })
    if (!requestResponse.error) {
      const tableResponseRequest: array =
				await GetResponseByInstitutionAndFormName(
				  state.currentInstitution.id,
				  'datosExtensionesCentro',
				  false
				)
      setTableResponse(tableResponseRequest)
    }
    setLoadingRequest(false)
  }

  const stagePostData = async (data) => {
    if (
      tableResponse
        .concat(stagedPutData, stagedPostData)
        .find(
          (el) =>
            JSON.parse(el.solucion)[
              'f26f66d0-936a-b6f4-c161-4cd9a4b84339_89e0ec4e-1a1b-def9-311d-5136ff311910_col'
            ] ==
						JSON.parse(data.solucion)[
						  'f26f66d0-936a-b6f4-c161-4cd9a4b84339_89e0ec4e-1a1b-def9-311d-5136ff311910_col'
						]
        )
    ) {
      return {
        error: 'El télefono ya existe en el registro del centro educativo'
      }
    }

    postData(data)
    setShowForm(!showForm)
  }

  const stagePutData = async (data) => {
    const _data = [...stagedPutData].map((item) => item.id)
    if (_data.includes(data.id)) {
      setStagedPutData(
        [...stagedPutData].map((item) => {
          if (item.id == data.id) {
            return { ...data }
          }
          return item
        })
      )
    } else {
      setStagedPutData([...stagedPutData, { ...data }])
    }

    setTableResponse(
      [...tableResponse].filter((item) => item.id != data.id)
    )
    setShowForm(!showForm)
  }

  const putData = async (data) => {
    setLoadingRequest(true)
    const requestResponse = await UpdateFormResponse({ ...data })
    if (!requestResponse.error) {
      const tableResponseRequest: array =
				await GetResponseByInstitutionAndFormName(
				  state.currentInstitution.id,
				  'datosExtensionesCentro',
				  false
				)
      setTableResponse(tableResponseRequest)
    }
    setLoadingRequest(false)
  }

  const toggleSplit = () => {
    setDropdownSplitOpen(!dropdownSplitOpen)
  }

  const handleDelete = async (ids) => {
    swal({
      title: 'Eliminar',
      text: `Esta seguro de que desea eliminar ${
				ids.length === 1 ? 'el' : 'los'
			} registro${ids.length === 1 ? '' : 's'}`,
      className: 'text-alert-modal',
      icon: 'warning',
      buttons: {
        cancel: 'Cancelar',
        ok: {
          text: 'Aceptar',
          value: true
        }
      }
    }).then(async (result) => {
      if (result) {
        const requestResponse = await DeleteFormResponses(ids)
        if (!requestResponse.error) {
          const tableResponseRequest: Array<any> =
						await GetResponseByInstitutionAndFormName(
						  state.currentInstitution.id,
						  'datosExtensionesCentro',
						  false
						)
          setTableResponse(tableResponseRequest)
        }
      }
    })
  }

  const saveContactChanges = async () => {
    setLoadingMainFormRequest(true)
    const _solucion = { ...formUtils.getValues(), horarios }

    let requestResponse: object

    stagedPutData.forEach((item) => putData(item))
    stagedPostData.forEach((item) => postData(item))

    if (formResponse.id) {
      requestResponse = await UpdateFormResponse({
        solucion: JSON.stringify(_solucion),
        id: formResponse.id
      })
    } else {
      requestResponse = await CreateNewFormResponse({
        solucion: JSON.stringify(_solucion),
        institucionId: state.currentInstitution.id,
        formularioCategoriaId: contactoCategoriaId
      })
    }
    if (!requestResponse.error) {
      const response = await GetResponseByInstitutionAndFormName(
        state.currentInstitution.id,
        'datosContactoDeCentro'
      )
      const solucion = JSON.parse(response.solucion)
      setFormResponse({ ...solucion, id: response.id })
      setHorarios(solucion.horarios)
      setStagedPostData([])
      setStagedPutData([])
      setEditable(false)
      setLoadingMainFormRequest(false)
    }
  }

  const handleEdit = async (el) => {
    setContactEditable(true)
    setShowForm(true)
    setEditExtForm(true)

    await setTableformResponse(el)
  }
  const columns = React.useMemo(
    () => [
      {
        Header: t('expediente_ce>informacion_general>informacion>telefonos>columna_telefono', 'Telefono'),
        accessor:
					'f26f66d0-936a-b6f4-c161-4cd9a4b84339_89e0ec4e-1a1b-def9-311d-5136ff311910_col',
        column: '',
        label: '',
        Cell: ({ row }) => {
          const aux = row?.original?.solucion
            ? JSON.parse(row?.original?.solucion)[
              'f26f66d0-936a-b6f4-c161-4cd9a4b84339_89e0ec4e-1a1b-def9-311d-5136ff311910_col'
						  ]
            : null
          return <div>{aux}</div>
        }
      },
      {
        Header: t('expediente_ce>informacion_general>informacion>telefonos>columna_descripcion', 'Descripcion'),
        accessor:
					'c8851fbf-ea92-4123-8678-ad474d14493f_89e0ec4e-1a1b-def9-311d-5136ff311910_col',
        column: '',
        label: '',
        Cell: ({ row }) => {
          const aux = row?.original?.solucion
            ? JSON.parse(row?.original?.solucion)[
              'c8851fbf-ea92-4123-8678-ad474d14493f_89e0ec4e-1a1b-def9-311d-5136ff311910_col'
						  ]
            : null
          return <div>{aux}</div>
        }
      },
      {
        Header: t('expediente_ce>informacion_general>informacion>telefonos>columna_extension', 'Extension'),
        accessor:
					'49465a64-9674-ec8c-e1a7-ac0b94bdd6e9_46eacd9e-16b2-c92b-fb3d-3722f850f5a2_col',
        Cell: ({ row }) => {
          const aux = row.original.solucion
            ? JSON.parse(row.original.solucion).tablesData[
              '49465a64-9674-ec8c-e1a7-ac0b94bdd6e9_46eacd9e-16b2-c92b-fb3d-3722f850f5a2_col'
						  ]
            : null
          return (
            <div>
              {aux
							  ? aux['0'].columnValues['0'].value
							  : null}
            </div>
          )
        },
        column: '',
        label: ''
      },
      {
        Header: t('general>acciones', 'Acciones'),
        label: '',
        column: '',
        Cell: ({ row }) => {
          return (
            <CenteredOptions>
              <CustomInput
                className='custom-checkbox mb-0 d-inline-block'
                type='checkbox'
                id='checkAll'
                disabled={!editable}
                onClick={(e) => {
								  e.stopPropagation()
								  if (
								    selectedIds?.includes(row?.original?.id)
								  ) {
								    setSelectedIds(
								      selectedIds?.filter(
								        (id) => id != row?.original?.id
								      )
								    )
								  } else {
								    let newSelectedIds = []
								    if (selectedIds) {
								      newSelectedIds = [
								        ...selectedIds,
								        row?.original?.id
								      ]
								    } else {
								      newSelectedIds = [row?.original?.id]
								    }
								    setSelectedIds(newSelectedIds)
								  }
                }}
                checked={selectedIds?.includes(
								  row?.original?.id
                )}
              />
              <TableItemMenu
                editable={editable}
                handleDeleteItem={() => {
								  handleDelete([row?.original?.id])
                }}
                handleEdit={() => {
								  handleEdit({
								    ...JSON.parse(row?.original?.solucion),
								    id: row?.original?.id,
								    provissionalId:
											row?.original?.provissionalId
								  })
                }}
              />
            </CenteredOptions>
          )
        }
      }
    ],
    [selectedIds, editable, t]
  )

  const data = React.useMemo(
    () => tableResponse.concat(stagedPutData, stagedPostData),
    [tableResponse, stagedPutData, stagedPostData, editable, selectedIds]
  )
  return (
    <div>
      {!showForm ? (
        <Container>
          <Form onSubmit={handleSubmit(saveContactChanges)}>
            <Row>
              <Col
                xs={12}
                md={6}
                style={{
								  paddingTop: '0.6rem',
								  paddingBottom: '0.5rem'
                }}
              >
                <Card>
                  <CardBody>
                    <CardTitle>
                    {t('expediente_ce>informacion_general>informacion', 'Información de contacto')}
                  </CardTitle>
                    <div>
                    <FormGroup>
                    <Label>
                    {t('expediente_ce>informacion_general>informacion>horarios', 'Horarios de atención')}
                  </Label>
                    <Input
                    value={horarios}
                    type='textarea'
                    name='horario'
                    readOnly={!editable}
                    onChange={(e) => {
													  setHorarios(
													    e.target.value
													  )
                  }}
                  />
                  </FormGroup>
                    <br />

                    <div>
                    <h4>{t('expediente_ce>informacion_general>informacion>telefonos', 'Teléfonos asociados')}</h4>
                    <StyledButtonRow>
                    <Button
                    color='primary'
                    disabled={!editable}
                    onClick={() => {
														  setShowForm(
														    !showForm
														  )
														  setContactEditable(
														    true
														  )
                  }}
                  >
                    {t('general>agregar', 'Agregar')}
                  </Button>
                    <StyledButtonDropdown
                    isOpen={
															dropdownSplitOpen
														}
                    toggle={toggleSplit}
                    disabled={!editable}
                  >
                    <div className='btn btn-primary btn-lg pl-4 pr-0 check-button check-all'>
                    <CustomInput
                    className='custom-checkbox mb-0 d-inline-block'
                    type='checkbox'
                    id='checkAll'
                    disabled={
																	!editable
																}
                    onClick={() => {
																  if (
																    editable
																  ) {
																    if (
																      selectedIds?.length ===
																			tableResponse?.length
																    ) {
																      setSelectedIds(
																        []
																      )
																    } else {
																      setSelectedIds(
																        tableResponse.map(
																          (
																            element
																          ) =>
																            element.id
																        )
																      )
																    }
																  }
                  }}
                    checked={
																	selectedIds?.length ===
																		tableResponse?.length &&
																	tableResponse?.length >
																		0
																}
                  />
                  </div>
                    <DropdownToggle
                    caret
                    color='primary'
                    className='dropdown-toggle-split btn-lg'
                    disabled={!editable}
                  />
                    <DropdownMenu right>
                    <DropdownItem
                    onClick={() => {
																  handleDelete(
																    selectedIds
																  )
                  }}
                  >
                    { t('general>eliminar', 'Eliminar') }
                  </DropdownItem>
                  </DropdownMenu>
                  </StyledButtonDropdown>
                  </StyledButtonRow>
                    <TableContainer>
                    <TableReactImplementation
                    columns={columns}
                    data={data}
                    avoidSearch
                  />
                    {/* {tableResponse.concat(stagedPutData, stagedPostData)} */}
                  </TableContainer>
                  </div>
                  </div>
                  </CardBody>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                {!loading && !showForm
                  ? (
                    <>
                    <JSONFormParser
                    pageData={pageData}
                    mapFunctionObj={{}}
                    postData={() => {}}
                    putData={() => {}}
                    deleteData={() => {}}
                    dataForm={formResponse}
                    data={[]}
                    statusColor={(item) =>
											  true ? 'primary' : 'light'}
                    readOnly={false}
                    editable={editable}
                    setFormUtils={setFormUtils}
                    disableButton
                    loadingRequest={loadingRequest}
                    w100
                  />
                  </>
                    )
                  : (
                    <Loader />
                    )}
              </Col>
            </Row>
            <Row>
              <CenteredCol xs='12'>
                <EditButton
                  editable={editable}
                  setEditable={setEditable}
                  loading={loadingMainFormRequest}
                />
              </CenteredCol>
            </Row>
          </Form>
        </Container>
      ) : (
        <>
          <NavigationContainer
            onClick={(e) => {
						  setShowForm(false)
            }}
          >
            <ArrowBackIosIcon />
            <h4>
              {t('general>regresar', 'Regresar')}
            </h4>
          </NavigationContainer>
          <JSONFormParser
            pageData={tableFormData}
            dataForm={tableformResponse}
            mapFunctionObj={{}}
            postData={stagePostData}
            putData={stagePutData}
            deleteData={() => {}}
            setEditable={setContactEditable}
            data={[]}
            editable={contactEditable}
            loadingRequest={false}
          />
        </>
      )}
      <Modal isOpen={Boolean(currentExtentions)} keepMounted={false}>
        {currentExtentions && (
          <>
            <ModalHeader
              toggle={() => {
							  setCurrentExtentions()
              }}
            >
              {t('expediente_ce>informacion_general>informacion>telefonos>columna_extensiones', 'Extensiones')}
            </ModalHeader>
            <ModalBody>
              <StyledTable>
                <th>{t('expediente_ce>informacion_general>informacion>telefonos>columna_extension', 'Extensión')}</th>
                <th>{t('expediente_ce>informacion_general>informacion>telefonos>columna_descripcion', 'Descripción')}</th>
                {currentExtentions.tablesData[
								  '49465a64-9674-ec8c-e1a7-ac0b94bdd6e9_46eacd9e-16b2-c92b-fb3d-3722f850f5a2_col'
                ] &&
									currentExtentions.tablesData[
									  '49465a64-9674-ec8c-e1a7-ac0b94bdd6e9_46eacd9e-16b2-c92b-fb3d-3722f850f5a2_col'
									].map((item) => {
									  return (
  <tr>
    <td>
      {item.columnValues[0].value}
    </td>
    <td>
      {item.columnValues[1].value}
    </td>
  </tr>
									  )
									})}
              </StyledTable>
            </ModalBody>
          </>
        )}
      </Modal>
    </div>
  )
}

const TableItemMenu = (props) => {
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState(false)
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <>
      <IconButton
        disabled={!props.editable}
        onClick={(event) => {
				  setAnchorEl(event.currentTarget)
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
					  props.handleDeleteItem()
          }}
        >
          {t('general>eliminar', 'Eliminar')}
        </MenuItem>
        <MenuItem
          onClick={() => {
					  props.handleEdit()
          }}
        >
          {t('general>editar', 'Editar')}
        </MenuItem>
      </Menu>
    </>
  )
}

const StyledButtonDropdown = styled(ButtonDropdown)`
	margin-left: 10px;
	margin-right: 10px;
`

const StyledButtonRow = styled.div`
	display: flex;
	justify-content: flex-end;
`

const CenteredOptions = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
`

const StyledTable = styled.table`
	border-spacing: 1.8rem;
	width: 100%;
`

const CenteredCol = styled(Col)`
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
`

const Item = styled.div`
	border: initial;
	background: white;
	border-radius: calc(0.85rem - 1px);
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15),
		0 4px 6px 2px rgba(0, 0, 0, 0.15) !important;
	margin: 1rem;
`

const TableContainer = styled.div`
	height: 21rem;
	overflow-y: auto;
	overflow-x: hidden;
	/* width */
	&::-webkit-scrollbar {
		width: 10px;
		border-radius: 30%;
	}

	/* Track */
	&::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	/* Handle */
	&::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 15px;
	}

	/* Handle on hover */
	&::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
`

const NavigationContainer = styled.span`
	display: flex;
	cursor: pointer;
`

export default Contacto
