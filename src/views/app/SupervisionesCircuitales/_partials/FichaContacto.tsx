import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
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
import { useForm } from 'react-hook-form'
import { IconButton } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import MenuItem from '@material-ui/core/MenuItem'
import IntlMessages from 'Helpers/IntlMessages'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import JSONFormParser from 'Components/JSONFormParser/JSONFormParser'
import Loader from 'Components/Loader'
import { EditButton } from 'Components/EditButton'
import Fade from '@material-ui/core/Fade'
import colors from '../../../../assets/js/colors'
import {
  saveFormularioLocalizacion,
  updateFormularioLocalizacion,
  getFormsByCircuito,
  DeleteFormResponses
} from 'Redux/configuracion/actions'
import { GetByName } from 'Redux/formularios/actions'
import NavigationContainerTwo from '../../../../components/NavigationContainer'
import { CurrentCircuito } from '../../../../types/configuracion'
import { maxLengthString } from '../../../../utils/maxLengthString'
import swal from 'sweetalert'
import useNotification from 'Hooks/useNotification'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import RedesSociales from 'Components/JSONFormParser/InputTypes/_partials/RedesSociales'
import { useTranslation } from 'react-i18next'

import VisibilityIcon from '@material-ui/icons/Visibility'

import Tooltip from '@mui/material/Tooltip'

type IProps = {
	currentCircuito: CurrentCircuito
	handleBack: Function
	hasEditAccess: boolean
}

const fieldIds = {
  email: '34bf936b-846b-fc16-2274-770832549f1f_398f5e08-429f-9bee-3c80-dd15d2b5065d_col',
  web: 'acb70d37-a1c6-e142-abdd-d1713d684f82_398f5e08-429f-9bee-3c80-dd15d2b5065d_col',
  facebook:
		'91a9dba4-07e2-3663-8e22-1ded7307dee9_398f5e08-429f-9bee-3c80-dd15d2b5065d_col_facebook',
  whatsapp:
		'91a9dba4-07e2-3663-8e22-1ded7307dee9_398f5e08-429f-9bee-3c80-dd15d2b5065d_col_whatsapp',
  instagram:
		'91a9dba4-07e2-3663-8e22-1ded7307dee9_398f5e08-429f-9bee-3c80-dd15d2b5065d_col_instagram',
  twitter:
		'91a9dba4-07e2-3663-8e22-1ded7307dee9_398f5e08-429f-9bee-3c80-dd15d2b5065d_col_twitter',
  telephone:
		'f26f66d0-936a-b6f4-c161-4cd9a4b84339_89e0ec4e-1a1b-def9-311d-5136ff311910_col',
  telephoneName:
		'c8851fbf-ea92-4123-8678-ad474d14493f_89e0ec4e-1a1b-def9-311d-5136ff311910_col',
  tableValues:
		'49465a64-9674-ec8c-e1a7-ac0b94bdd6e9_46eacd9e-16b2-c92b-fb3d-3722f850f5a2_col',
  telephoneExtension: 'abe2ebb6-e793-f9b9-3ec3-e39542012984'
}

const FichaContacto = (props: IProps) => {
  const { t } = useTranslation()
  const [snackbar, handleClick] = useNotification()
  const [snackbarContent, setSnackbarContent] = React.useState({})
  const { handleSubmit } = useForm()
  const [pageData, setPageData] = React.useState({ layouts: [] })
  const [tableFormData, setTableFormData] = React.useState({ layouts: [] })
  const [formResponse, setFormResponse] = React.useState<any>({})
  const [tableformResponse, setTableformResponse] = React.useState<any>({})
  const [formUtils, setFormUtils] = React.useState<any>({})
  const [anchorEl, setAnchorEl] = React.useState<any>(null)
  const [openInfoModal, setOpenInfoModal] = React.useState<any>()

  const [horarios, setHorarios] = React.useState<string>('')
  const [loadingRequest, setLoadingRequest] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [editable, setEditable] = React.useState<boolean>(false)
  const [showForm, setShowForm] = React.useState<boolean>(false)
  const [dropdownSplitOpen, setDropdownSplitOpen] =
		React.useState<boolean>(false)
  const [loadingMainFormRequest, setLoadingMainFormRequest] =
		React.useState<boolean>(false)
  const [contactoCategoriaId, setContactoCategoriaId] =
		React.useState<boolean>(null)
  const [formularioCategoriaId, setFormularioCategoriaId] =
		React.useState<boolean>(null)
  const [editExtForm, setEditExtForm] = React.useState(true)
  const [editableForm, setEditableForm] = React.useState<boolean>(true)
  const [selectedIds, setSelectedIds] = React.useState<any[]>([])
  const [tableResponse, setTableResponse] = React.useState<any[]>([])
  const [currentFormCategoriaId, setCurrentFormCategoriaId] =
		React.useState<number>(null)

  const { hasEditAccess = true } = props

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const form = await GetByName('datosContactoDeCentro')
        const tableForm = await GetByName('datosExtensionesCentro')
        setCurrentFormCategoriaId(form.formularioCategoriaId)
        const response = await getFormsByCircuito(
          props.currentCircuito.id,
          form.formularioCategoriaId
        )
        const tableResponse: any[] = await getFormsByCircuito(
          props.currentCircuito.id,
          tableForm.formularioCategoriaId
        )

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

  const toggleSplit = () => setDropdownSplitOpen(!dropdownSplitOpen)

  /*
	 * CRUD Handlers
	 */

  const handleEdit = async (item) => {
    setShowForm(true)
    setEditExtForm(true)
    setTableformResponse(item)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const data = useMemo(() => {
    const newTable = tableResponse.map((el) => ({ ...el, solucion: JSON.parse(el?.solucion) }))
    return newTable
  }, [tableResponse])
  const columns = useMemo(() => {
    return [
      {
        Header: 'Teléfono',
        label: 'Teléfono',
        accessor: fieldIds?.telephone,
        column: fieldIds?.telephone,
        Cell: ({ row }) => {
          return (
            <>
              {row?.original?.solucion[fieldIds?.telephone]}
            </>
          )
        }
      },
      {
        Header: 'Descripción',
        label: 'Descripción',
        accessor: fieldIds?.telephoneName,
        column: fieldIds?.telephoneName,
        Cell: ({ row }) => {
          return (
            <>
              {row?.original?.solucion[fieldIds?.telephoneName]}
            </>
          )
        }
      },
      {
        Header: 'Extensión',
        label: 'Extensión',
        accessor: fieldIds.tableValues,
        column: fieldIds.tableValues,
        Cell: ({ row }) => {
          const solucion = row?.original?.solucion.tablesData
          const data = solucion ? solucion.tablesData : null
          return (
            <>
              {data ? data[fieldIds.tableValues]['0'].columnValues['0'].value : null}
            </>
          )
        }
      },
      {
        Header: 'Acciones',
        label: 'Acciones',
        column: 'actions',
        accessor: 'actions',
        Cell: ({ row }) => {
          return (
            <div className='d-flex justify-content-center align-items-center'>
              <Tooltip title='Ver'>
                <VisibilityIcon
                  onClick={() => {
									  if (row?.original?.solucion.tablesData[fieldIds.tableValues]) {
									    if (row?.original?.solucion.tablesData[fieldIds.tableValues].length >= 0) {
									      setOpenInfoModal(row?.original?.solucion)
									    }
									  }
                  }}
                  style={{
									  fontSize: 30,
									  cursor: 'pointer',
									  color: colors?.darkGray
                  }}
                />
              </Tooltip>
            </div>
          )
        }
      }
    ]
  }, [data])

  return (
    <Wrapper>
      <Modal isOpen={Boolean(openInfoModal)} keepMounted={false}>
        {openInfoModal && (
          <>
            <ModalHeader
              toggle={() => {
							  setOpenInfoModal(undefined)
              }}
            />
            <ModalBody>
              <StyledTable>
                <th>Extensión</th>
                <th>Descripción</th>
                {openInfoModal?.tablesData &&
									openInfoModal?.tablesData[fieldIds?.tableValues] &&
									openInfoModal?.tablesData &&
									openInfoModal?.tablesData[fieldIds?.tableValues].map((item) => {
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
      {!showForm
        ? (
          <Row>
            <Col
              md={12}
              sm={12}
              style={{
						  paddingTop: '0.6rem',
						  paddingBottom: '0.5rem'
              }}
            >
              <Form>
                <Row>
                  <Col xs={12} md={12}>
                    {!loading && !showForm
                    ? (
                    <>
                  <Card>
                    <CardBody>
                    <FormGroup>
                    <Label>
                    {t('supervision_circ>ver>correo', 'Correo electronico')}
                  </Label>
                    <Input
                    type='text'
                    value={
																formResponse[
																  fieldIds
																    ?.email
																]
															}
                    disabled
                  />
                  </FormGroup>
                    <FormGroup>
                    <Label>{t('supervision_circ>ver>web', 'Web')}</Label>
                    <Input
                    type='text'
                    value={
																formResponse[
																  fieldIds
																    ?.web
																]
															}
                    disabled
                  />
                  </FormGroup>
                    <CardTitle>
                    {t('supervision_circ>ver>tel_asociados', 'Teléfonos asociados')}
                  </CardTitle>
                    <div>
                    <div>
                    <TableReactImplementation
                    data={data}
                    columns={columns}
                    avoidSearch
                  />
                    <span>
                    * {t('supervision_circ>ver>dar_clic', 'Puede dar clic al teléfono para ver las extensiones')}
                  </span>
                    <RedesSociales
                    hideUndefinedSocialNetworks
                    socialNetworks={[
																  {
																    id: 1,
																    name: 'facebook',
																    text: formResponse[
																      fieldIds
																        ?.facebook
																    ]
																  },
																  {
																    id: 2,
																    name: 'instagram',
																    text: formResponse[
																      fieldIds
																        ?.instagram
																    ]
																  },
																  {
																    id: 3,
																    name: 'whatsapp',
																    text: formResponse[
																      fieldIds
																        ?.whatsapp
																    ]
																  },
																  {
																    id: 4,
																    name: 'twitter',
																    text: formResponse[
																      fieldIds
																        ?.twitter
																    ]
																  }
                  ]}
                  />
                  </div>
                  </div>
                  </CardBody>
                  </Card>
                </>
                      )
                    : (
                    <Loader />
                      )}
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
          )
        : (
          <>
            <NavigationContainer
              onClick={(e) => {
						  setShowForm(false)
						  setTableformResponse({})
              }}
            >
              <ArrowBackIosIcon />
              <h4>
                <IntlMessages id='pages.go-back-home' />
              </h4>
            </NavigationContainer>
            <JSONFormParser
              pageData={tableFormData}
              dataForm={tableformResponse}
              mapFunctionObj={{}}
              postData={postData}
              putData={putData}
              deleteData={() => {}}
              data={[]}
              loadingRequest={false}
              editable={editableForm}
              setEditable={handleEditableForm}
            />
          </>
          )}
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
        disabled={!props.editable}
        id={`button-contact-${props.i}`}
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
        TransitionComponent={Fade}
        PaperProps={{
				  style: {
				    maxHeight: 48 * 4.5,
				    width: 200
				  }
        }}
      >
        <MenuItem
          onClick={() => {
					  handleClose()
					  swal({
					    title: 'Atención',
					    text: '¿Está seguro de querer eliminar este registro?',
					    dangerMode: true,
					    icon: 'warning',
					    buttons: ['Cancelar', 'Aceptar']
					  }).then(async (val) => {
					    if (val) {
					      props.handleDelete([props.res.id])
					    }
					  })
          }}
        >
          Eliminar
        </MenuItem>
        <MenuItem
          onClick={() => {
					  handleClose()
					  props.handleEdit({
					    ...props.solucion,
					    id: props.res.id
					  })
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
	height: auto;
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

const StyledTable = styled.table`
	border-spacing: 1.8rem;
	width: 100%;
`

const Item = styled.div`
	border: initial;
	background: white;
	cursor: pointer;
	border-radius: calc(0.85rem - 1px);
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15),
		0 4px 6px 2px rgba(0, 0, 0, 0.15) !important;
	margin: 1rem;
	padding: 1rem 0;
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

export default FichaContacto
