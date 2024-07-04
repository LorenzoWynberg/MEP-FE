import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { Container, Row, Col, Card, CardBody, FormGroup, CardTitle, Input, Button, Label, DropdownToggle, DropdownMenu, DropdownItem, CustomInput, ButtonDropdown, Form, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { useForm } from 'react-hook-form'
import { IconButton } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import MenuItem from '@material-ui/core/MenuItem'
import IntlMessages from 'Helpers/IntlMessages'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import JSONFormParser from 'Components/JSONFormParser/JSONFormParser.tsx'
import Loader from 'Components/Loader'
import { EditButton } from 'Components/EditButton'
import Fade from '@material-ui/core/Fade'
import NavigationContainerTwo from '../../../../../../components/NavigationContainer'
import { saveFormularioLocalizacion, updateFormularioLocalizacion, getFormsByCircuito, DeleteFormResponses } from 'Redux/configuracion/actions'
import { GetByName } from 'Redux/formularios/actions'
import { CurrentCircuito } from '../../../../../../types/configuracion'
import { maxLengthString } from '../../../../../../utils/maxLengthString'
import colors from '../../../../../../assets/js/colors'
import swal from 'sweetalert'
import useNotification from 'Hooks/useNotification'
import { useTranslation } from 'react-i18next'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import Tooltip from '@mui/material/Tooltip'

type IProps = {
    currentCircuito: CurrentCircuito,
    handleBack: Function,
    hasEditAccess: boolean;
};

const formIds = {
  phone: 'f26f66d0-936a-b6f4-c161-4cd9a4b84339_89e0ec4e-1a1b-def9-311d-5136ff311910_col',
  description: 'c8851fbf-ea92-4123-8678-ad474d14493f_89e0ec4e-1a1b-def9-311d-5136ff311910_col',
  columnExtension: 'ad98a0fa-eb5b-9f45-fe50-4c6fa1a488c6',
  columnDescription: '7d45cc6f-bd5f-c62b-f61c-55244d7247da',
  table: 'b5295c77-b1b9-6804-43b7-87bbf5a0ccd6_89e0ec4e-1a1b-def9-311d-5136ff311910_col',
  email: '34bf936b-846b-fc16-2274-770832549f1f_398f5e08-429f-9bee-3c80-dd15d2b5065d_col',
  web: 'acb70d37-a1c6-e142-abdd-d1713d684f82_398f5e08-429f-9bee-3c80-dd15d2b5065d_col'
}

const Contacto = (props: IProps) => {
  const [snackbar, handleClick] = useNotification()
  const [openInfoModal, setOpenInfoModal] = React.useState()
  const [snackbarContent, setSnackbarContent] = React.useState(false)
  const { handleSubmit } = useForm()
  const [pageData, setPageData] = React.useState({ layouts: [] })
  const [tableFormData, setTableFormData] = React.useState({ layouts: [] })
  const [formResponse, setFormResponse] = React.useState<any>()
  const [tableformResponse, setTableformResponse] = React.useState<any>({})
  const [formUtils, setFormUtils] = React.useState<any>({})
  const [anchorEl, setAnchorEl] = React.useState<any>(null)

  const [horarios, setHorarios] = React.useState<string>('')
  const [loadingRequest, setLoadingRequest] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [editable, setEditable] = React.useState<boolean>(false)
  const [showForm, setShowForm] = React.useState<boolean>(false)
  const [dropdownSplitOpen, setDropdownSplitOpen] = React.useState<boolean>(false)
  const [loadingMainFormRequest, setLoadingMainFormRequest] = React.useState<boolean>(false)
  const [contactoCategoriaId, setContactoCategoriaId] = React.useState<boolean>(null)
  const [formularioCategoriaId, setFormularioCategoriaId] = React.useState<boolean>(null)
  const [editExtForm, setEditExtForm] = React.useState(true)
  const [selectedIds, setSelectedIds] = React.useState<any[]>([])
  const [tableResponse, setTableResponse] = React.useState<any[]>([])
  const [editableForm, setEditableForm] = React.useState<boolean>(true)
  const { t } = useTranslation()

  const { hasEditAccess = true } = props

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const form = await GetByName('datosContactoDeCentro')
        const tableForm = await GetByName('datosExtensionesCentro')
        const response = await getFormsByCircuito(props.currentCircuito.id, form.formularioCategoriaId)
        const tableResponse: any[] = await getFormsByCircuito(props.currentCircuito.id, tableForm.formularioCategoriaId)
        if (response.length > 0) {
          const solucion = JSON.parse(response[0].solucion)
          setFormResponse({ ...solucion, id: response[0].id })
          setHorarios(solucion.horarios)
        } else {
          setFormResponse({})
        }

        if (tableResponse.length > 0) {
          setTableResponse(tableResponse)
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
  }, [])

  React.useEffect(() => {
    if (formResponse) {
      setHorarios(formResponse.horarios)
    } else {
      setHorarios('')
    }
  }, [editable])

  const toggleSplit = () => setDropdownSplitOpen(!dropdownSplitOpen)

  const postData = async (values) => {
    setLoadingRequest(true)
    const data = {
      ...values,
      circuitoId: props.currentCircuito.id,
      regionalId: null,
      formularioCategoriaId
    }
    const request = await saveFormularioLocalizacion(data)
    if (!request.error) {
      const tableResponse: any[] = await getFormsByCircuito(props.currentCircuito.id, formularioCategoriaId)
      if (tableResponse.length > 0) {
        setTableResponse(tableResponse)
      } else {
        setTableResponse([])
      }
      setShowForm(!showForm)
    }
    setAnchorEl(null)
    setLoadingRequest(false)
  }

  const handleNotification = (msg, variant) => {
    setSnackbarContent({ msg, variant })
    handleClick()
  }

  const putData = async (values) => {
    setLoadingRequest(true)
    const data = {
      ...values,
      regionalId: null,
      circuitoId: props.currentCircuito.id,
      formularioCategoriaId
    }
    const request = await updateFormularioLocalizacion({ ...data, id: tableformResponse.id })
    if (!request.error) {
      const tableResponse: any[] = await getFormsByCircuito(props.currentCircuito.id, formularioCategoriaId)
      if (tableResponse.length > 0) {
        setTableResponse(tableResponse)
      }
      setShowForm(!showForm)
    }
    setAnchorEl(null)
    setLoadingRequest(false)
  }

  /*
    * CRUD Handlers
    */

  const saveContactChanges = async () => {
    setLoadingMainFormRequest(true)
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    }
    function isValidHttpUrl (string) {
      let url
      try {
        url = new URL(string)
      } catch (_) {
        return false
      }
      return url.protocol === 'http:' || url.protocol === 'https:'
    }
    const formValues = { ...formUtils.getValues(), horarios }
    if (!formValues[formIds?.email]) {
      handleNotification('El correo electrónico es requerido', 'error')
      setLoadingMainFormRequest(false)
      return
    }
    if (!validateEmail(formValues[formIds?.email])) {
      handleNotification('El correo electrónico no es valido', 'error')
      setLoadingMainFormRequest(false)
      return
    }
    if (!formValues[formIds?.web]) {
      handleNotification('La dirección web es requerida', 'error')
      setLoadingMainFormRequest(false)
      return
    }
    if (!isValidHttpUrl(formValues[formIds?.web])) {
      handleNotification('La dirección web no es valida', 'error')
      setLoadingMainFormRequest(false)
      return
    }
    const data = {
      solucion: JSON.stringify(formValues),
      regionalId: null,
      circuitoId: props.currentCircuito.id,
      formularioCategoriaId: contactoCategoriaId
    }
    let response
    if (formResponse.id) {
      response = await updateFormularioLocalizacion({ ...data, id: formResponse.id })
    } else {
      response = await saveFormularioLocalizacion(data)
    }
    if (!response.error) {
      const _response = await getFormsByCircuito(props.currentCircuito.id, contactoCategoriaId)
      const solucion = JSON.parse(_response[0].solucion)
      setFormResponse({ ...solucion, id: response.id })
      setEditable(false)
      setLoadingMainFormRequest(false)
      handleNotification('Se actualizó correctamente', 'success')
    } else {
      handleNotification(request.error, 'error')
    }
  }

  const handleDelete = async (ids) => {
    const requestResponse = await DeleteFormResponses(ids)
    if (!requestResponse.error) {
      const tableResponse: any[] = await getFormsByCircuito(props.currentCircuito.id, formularioCategoriaId)
      if (tableResponse.length > 0) {
        setTableResponse(tableResponse)
      } else {
        setTableResponse([])
      }
    }
  }

  const handleEdit = async (item) => {
    setShowForm(true)
    setEditExtForm(true)
    setTableformResponse(item)
  }

  const handleEditableForm = (value) => {
    if (!value) {
      setShowForm(false)
    }
    setEditableForm(value)
    setTableformResponse({})
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const data = useMemo(() => {
    if (tableResponse?.length > 0) {
      return tableResponse?.map((el) => {
        const solucion = JSON.parse(el.solucion)
        const columnValues = solucion?.tablesData[formIds?.table] ? solucion?.tablesData[formIds?.table][0]?.columnValues : null
        const columnExtension = columnValues?.find((el) => el?.id === formIds?.columnExtension)
        const columnDescription = columnValues?.find((el) => el?.id === formIds?.columnDescription)
        return {
          ...solucion,
          [formIds?.phone]: solucion[formIds?.phone],
          [formIds?.description]: solucion[formIds?.description],
          [formIds?.columnExtension]: columnExtension?.value,
          [formIds?.columnDescription]: columnDescription?.value,
          id: el?.id
        }
      })
    }
    return []
  }, [tableResponse])

  const columns = useMemo(() => {
    return [
      {
        Header: t('expediente_ce>informacion_general>informacion>telefonos>columna_telefono', 'Teléfono'),
        label: t('expediente_ce>informacion_general>informacion>telefonos>columna_telefono', 'Teléfono'),
        accessor: formIds?.phone,
        column: formIds?.phone
      },
      {
        Header: t('expediente_ce>informacion_general>informacion>telefonos>columna_descripcion', 'Descripción'),
        label: t('expediente_ce>informacion_general>informacion>telefonos>columna_descripcion', 'Descripción'),
        accessor: formIds?.description,
        column: formIds?.description
      },
      {
        Header: t('expediente_ce>informacion_general>informacion>telefonos>columna_extension', 'Extensión'),
        label: t('expediente_ce>informacion_general>informacion>telefonos>columna_extension', 'Extensión'),
        accessor: formIds?.columnExtension,
        column: formIds?.columnExtension
      },
      {
        Header: t('expediente_ce>informacion_general>informacion>telefonos>columna_acciones', 'Acciones'),
        label: t('expediente_ce>informacion_general>informacion>telefonos>columna_acciones', 'Acciones'),
        accessor: 'actions',
        column: 'actions',
        Cell: ({ row }) => {
          return (
            <div className='d-flex justify-content-center align-items-center'>
              <CustomInput
                className='custom-checkbox mb-0 d-inline-block mr-2'
                type='checkbox'
                id='checkAll'
                style={{
								  cursor: 'pointer'
                }}
                onClick={() => {
								  if (editable) {
								    if (selectedIds.includes(row.original.id)) {
								      setSelectedIds(
								        selectedIds.filter((id) => id != row.original.id)
								      )
								    } else {
								      setSelectedIds([
								        ...selectedIds,
								        row.original.id
								      ])
								    }
								  }
                }}
                checked={selectedIds.includes(row.original.id)}
              />
              <Tooltip title='Editar'>
                <EditIcon
                  style={{
									  fontSize: 25,
									  color: colors.darkGray,
									  cursor: 'pointer'
                  }}
                  onClick={() => {
									  if (editable) {
									    handleEdit({
									      ...row.original,
									      id: row.original.id
									    })
									    setEditableForm(true)
									  }
                  }}
                />
              </Tooltip>
              <Tooltip title='Eliminar'>
                <DeleteIcon
                  style={{
									  fontSize: 25,
									  color: colors.darkGray,
									  cursor: 'pointer'
                  }}
                  onClick={() => {
									  if (editable) {
									    swal({
									      title: 'Atención',
									      text: '¿Está seguro de querer eliminar este registro?',
									      dangerMode: true,
									      icon: 'warning',
									      buttons: ['Cancelar', 'Aceptar']
									    }).then(async (val) => {
									      if (val) {
									        handleDelete([row.original.id])
									      }
									    })
									  }
                  }}
                />
              </Tooltip>
            </div>
          )
        }
      }
    ]
  }, [data, selectedIds, editable, t])

  return (
    <Wrapper>
      {snackbar(snackbarContent.variant, snackbarContent.msg)}
      {
                !showForm
                  ? <Container>
                    <Form onSubmit={handleSubmit(saveContactChanges)}>
                      <NavigationContainerTwo goBack={props.handleBack} />
                      <Row>
                        <Col xs={12} md={6} style={{ paddingTop: '0.6rem', paddingBottom: '0.5rem' }}>
                          <Card style={{ height: '91%' }}>
                            <CardBody>
                              <CardTitle>
                                {t('expediente_ce>informacion_general>informacion>info_contacto', 'Información de contacto')}
                              </CardTitle>
                              <div>
                                <FormGroup>
                                  <Label>
                                      {t('expediente_ce>informacion_general>informacion>horarios', 'Horarios de atención')}
                                    </Label>
                                  <Input
                                      value={horarios} type='textarea' name='horario' readOnly={!editable} onChange={(e) => {
                                        setHorarios(e.target.value)
                                      }}
                                    />
                                </FormGroup>
                                <br />

                                <div>
                                  <h4>
                                      {t('expediente_ce>informacion_general>informacion>telefonos', 'Teléfonos asociados')}
                                    </h4>
                                  <StyledButtonRow>
                                      <Button
                                        color='primary' disabled={!editable} onClick={() => {
                                        setShowForm(!showForm)
                                      }}
                                      >
                                        {t('general>agregar', 'Agregar')}
                                      </Button>
                                      <StyledButtonDropdown
                                        isOpen={dropdownSplitOpen}
                                        toggle={toggleSplit}
                                        disabled={!editable}
                                      >
                                        <div className='btn btn-primary btn-lg pl-4 pr-0 check-button check-all'>
                                        <CustomInput
                                            className='custom-checkbox mb-0 d-inline-block'
                                            type='checkbox'
                                            id='checkAll'
                                            disabled={!editable}
                                            onClick={() => {
                                                if (editable) {
                                                  if (selectedIds.length === tableResponse.length) {
                                                    setSelectedIds([])
                                                  } else {
                                                    setSelectedIds(tableResponse.map(element => element.id))
                                                  }
                                                }
                                              }}
                                            checked={selectedIds.length === tableResponse.length && tableResponse.length > 0}
                                          />
                                      </div>
                                        <DropdownToggle
                                        caret
                                        color='primary'
                                        className='dropdown-toggle-split btn-lg'
                                        disabled={!editable}
                                      />
                                        <DropdownMenu right>
                                        <DropdownItem onClick={() => {
                                            swal({
                                              title: t('configuracion>ofertas_educativas>modelo_de_ofertas>eliminar>atencion', 'Atención'),
                                              text: t('general>seguro_registros_del', '¿Está seguro de querer eliminar estos registros?'),
                                              dangerMode: true,
                                              icon: 'warning',
                                              buttons: [`${t('general>cancelar', 'Cancelar')}`, `${t('general>aceptar', 'Aceptar')}`]
                                            }).then(async val => {
                                              if (val) {
                                                handleDelete(selectedIds)
                                              }
                                            })
                                          }}
                                          >
                                            {t('general>eliminar', 'Eliminar')}
                                          </DropdownItem>
                                      </DropdownMenu>
                                      </StyledButtonDropdown>
                                    </StyledButtonRow>
                                  <TableReactImplementation
                                      columns={columns}
                                      data={data}
                                      avoidSearch
                                    />
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                        <Modal isOpen={Boolean(openInfoModal)} keepMounted={false}>
                          {openInfoModal &&
                            <>
                              <ModalHeader toggle={() => {
                                setOpenInfoModal()
                              }}
                              />
                              <ModalBody>
                                <StyledTable>
                                  <th>
                                      {t('expediente_ce>informacion_general>informacion>telefonos>columna_extension', 'Extensión')}
                                    </th>
                                  <th>
                                      {t('expediente_ce>informacion_general>informacion>telefonos>columna_descripcion', 'Descripción')}
                                    </th>
                                  {openInfoModal?.tablesData && openInfoModal?.tablesData['49465a64-9674-ec8c-e1a7-ac0b94bdd6e9_46eacd9e-16b2-c92b-fb3d-3722f850f5a2_col'] && openInfoModal?.tablesData && openInfoModal?.tablesData['49465a64-9674-ec8c-e1a7-ac0b94bdd6e9_46eacd9e-16b2-c92b-fb3d-3722f850f5a2_col'].map(item => {
                                      return (
                                        <tr>
                                        <td>{item.columnValues[0].value}</td>
                                        <td>{item.columnValues[1].value}</td>
                                      </tr>

                                      )
                                    })}
                                </StyledTable>
                              </ModalBody>
                            </>}
                        </Modal>
                        <Col xs={12} md={6}>
                          {!loading && !showForm
                            ? <JSONFormParser
                                pageData={pageData}
                                mapFunctionObj={{}}
                                postData={() => {}}
                                putData={() => {}}
                                deleteData={() => {}}
                                dataForm={formResponse}
                                data={[]}
                                statusColor={item => (true ? 'primary' : 'light')}
                                readOnly={false}
                                editable={editable}
                                setFormUtils={setFormUtils}
                                disableButton
                                loadingRequest={loadingRequest}
                                w100
                              />
                            : <Loader />}
                        </Col>
                      </Row>
                      <Row>
                        <CenteredCol xs='12'>
                          {
                                    hasEditAccess && (
                                      <EditButton
                                        editable={editable}
                                        setEditable={setEditable}
                                        loading={loadingMainFormRequest}
                                      />
                                    )
                                }
                        </CenteredCol>
                      </Row>
                    </Form>
                  </Container>
                  : <>
                    <NavigationContainer
                      onClick={(e) => {
                        setShowForm(false)
                      }}
                    >
                      <ArrowBackIosIcon />
                      <h4><IntlMessages id='pages.go-back-home' /></h4>
                    </NavigationContainer>
                    <JSONFormParser
                      pageData={tableFormData}
                      dataForm={tableformResponse}
                      mapFunctionObj={{}}
                      postData={postData}
                      putData={putData}
                      deleteData={() => {}}
                      editable={editableForm}
                      setEditable={handleEditableForm}
                      data={[]}
                      loadingRequest={false}
                    />
                  </>
            }
    </Wrapper>
  )
}

const TableItemMenu = (props) => {
  const [anchorEl, setAnchorEl] = useState(false)
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <>
      <IconButton
        disabled={!props.editable} id={`button-contact-${props.i}`} onClick={(event) => {
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
        TransitionComponent={Fade}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: 200
          }
        }}
      >
        <MenuItem onClick={() => {
          handleClose()
          swal({
            title: 'Atención',
            text: '¿Está seguro de querer eliminar este registro?',
            dangerMode: true,
            icon: 'warning',
            buttons: ['Cancelar', 'Aceptar']
          }).then(async val => {
            if (val) {
              props.handleDelete([props.res.id])
            }
          })
        }}
        >
          Eliminar
        </MenuItem>
        <MenuItem onClick={() => {
          handleClose()
          props.handleEdit({ ...props.solucion, id: props.res.id })
          props.setEditableForm(true)
        }}
        >
          Editar
        </MenuItem>
      </Menu>
    </>
  )
}

const Wrapper = styled.div`
    margin-top: 5px;
`

const StyledButtonDropdown = styled(ButtonDropdown)`
    margin-left: 10px;
    margin-right: 10px;
`

const StyledButtonRow = styled.div`
    display: flex;
    justify-content: flex-end;
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

const CenteredOptions = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
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
    cusror: pointer;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15),
      0 4px 6px 2px rgba(0, 0, 0, 0.15) !important;
    margin: 1rem;
`

const NavigationContainer = styled.span`
  display: flex;
  cursor: pointer;
`

const BackButton = styled.button`
    background: transparent;
    border: 1px ${colors.secondary} solid;
    border-radius: 30px;
    color: ${colors.secondary};
    padding: 9px 15px;
    cursor: pointer;
    margin-right: 5px;
`

const StyledTable = styled.table`
    border-spacing: 1.8rem;
    width: 100%;
`

export default Contacto
