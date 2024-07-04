import React, { useEffect, useState, useMemo } from 'react'
import JSONFormParser from 'Components/JSONFormParser/JSONFormParser'
import { PageData, FormResponse } from 'Components/JSONFormParser/Interfaces'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { useSelector } from 'react-redux'
import { expedienteBaseUrl } from '../../../_partials/expetienteBaseUrl'
import {
  DeleteFormResponses,
  CreateNewFormResponse,
  CreateNewFormResponseAction,
  UpdateFormResponse
} from 'Redux/formularioCentroResponse/actions'
import styled from 'styled-components'
import {
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CustomInput
} from 'reactstrap'
import IntlMessages from 'Helpers/IntlMessages'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import HTMLTable from 'Components/HTMLTable'
import swal from 'sweetalert'
import { useActions } from 'Hooks/useActions'
import { getCatalogs } from 'Redux/selects/actions'
import { catalogsEnum } from 'Utils/catalogsEnum.js'
import { Edit, Delete } from '@material-ui/icons'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import useNotification from 'Hooks/useNotification'
import Tooltip from '@mui/material/Tooltip'
import colors from 'Assets/js/colors'
import { useTranslation } from 'react-i18next'

enum namesToIds {
	'identiﬁcador' = '9a9c38f4-e3bb-8a69-bcf6-eef63dbed000_ab1cfb6e-e0d1-3036-d129-1d66a013d5d1_col',
	'tipoServicio' = 'b34bb93d-a0f0-94d0-6c31-a1df9015a9ed_ab1cfb6e-e0d1-3036-d129-1d66a013d5d1_col',
	'servicio' = '1_77f86240-3787-3897-db65-f2c34c830317_ab1cfb6e-e0d1-3036-d129-1d66a013d5d1_col',
	'proveedor' = '1_3bc116b3-f438-928e-f3eb-719c1ed2fe86_ab1cfb6e-e0d1-3036-d129-1d66a013d5d1_col',
	'fuente' = '1_5ba6f9ba-36ec-2542-df3c-85bbc069faa8_ab1cfb6e-e0d1-3036-d129-1d66a013d5d1_col',
	'estado' = '1_f8c33ec8-e793-bbf1-17c6-5cb0e2ada2b3_ab1cfb6e-e0d1-3036-d129-1d66a013d5d1_col'
}

const Servicios: React.FC = (props) => {
  const { t } = useTranslation()
  const [pageData, setPageData] = useState<PageData | object>({ layouts: [] })
  const [editable, setEditable] = useState<boolean>(false)
  const [formResponse, setFormResponse] = useState<FormResponse | object>()
  const [data, setData] = useState([])
  const [showSpeed, setShowSpeed] = useState<boolean>(false)
  const [formUtils, setFormUtils] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [formularioCategoriaId, setFormularioCategoriaId] = useState(null)
  const [stateUpdater, setStateUpdater] = useState(null)
  const [selectedDR, setSelectedDR] = React.useState([])
  const [dropdownSplitOpen, setDropdownSplitOpen] = React.useState(false)
  const [snackBar, handleClick] = useNotification()
  const [snackbarContent, setSnacbarContent] = useState({
    msg: 'welcome',
    variant: 'info'
  })
  const toggleSplit = () => {
    setDropdownSplitOpen(!dropdownSplitOpen)
  }
  const state = useSelector((store) => {
    return {
      auth: store.authUser,
      selects: store.selects
    }
  })

  useEffect(() => {
    if (stateUpdater && stateUpdater?.options) {
      const _service = state.selects.tipoServicio.find(
        (el) => el.id == stateUpdater?.options[0]
      )
      if (_service) {
        formUtils.setValue(
          'b34bb93d-a0f0-94d0-6c31-a1df9015a9ed_ab1cfb6e-e0d1-3036-d129-1d66a013d5d1_col',
          _service.otro
        )
        const speedCond = _service.codigo2 == 1
        setShowSpeed(speedCond)
        !speedCond &&
					formUtils.setValue(
					  '51913be1-68d0-9518-bc56-a31acc06e00a_ab1cfb6e-e0d1-3036-d129-1d66a013d5d1_col',
					  ''
					)
      }
    }
  }, [stateUpdater])

  const getAndParseItems = async () => {
    const responseDataStored = await axios.get(
			`${envVariables.BACKEND_URL}${expedienteBaseUrl}FormularioCentro/GetAllByInstitucionAndFormName/${state.auth.currentInstitution.id}/serviciosPublicos`
    )
    setData(
      responseDataStored.data.map((item) => {
        const _item = JSON.parse(item.solucion)
        return {
          ...item,
          solucion: _item,
          identiﬁcador: _item[namesToIds.identiﬁcador],
          servicio: _item[namesToIds.servicio],
          proveedor: _item[namesToIds.proveedor],
          fuente: _item[namesToIds.fuente],
          estadoP:
						_item[namesToIds.estado] == 1 ? 'ACTIVO' : 'INACTIVO',
          statusColor:
						_item[namesToIds.estado] == 1 ? 'success' : 'danger'
        }
      })
    )
  }

  const deleteData = async (items) => {
    swal({
      title: 'Eliminar',
      text: `¿Esta seguro de que desea eliminar ${
				items.length === 1 || items.id ? 'el' : 'los'
			} registro${items.length === 1 || items.id ? '' : 's'}?`,
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
        const response = await DeleteFormResponses(
          items.id ? [items.id] : items
        )
        getAndParseItems()
      }
    })
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get(
					`${envVariables.BACKEND_URL}${expedienteBaseUrl}Formulario/GetByName/serviciosPublicos`
        )

        getAndParseItems()
        setFormularioCategoriaId(response.data.formularioCategoriaId)
        setPageData(JSON.parse(response.data.formulario))
      } catch (e) {
        setPageData({})
        setData([])
      }
    }
    loadData()
  }, [state.auth.currentInstitution, state.selects.proveedoresDeServicios])

  const postData = async (data) => {
    const response = await CreateNewFormResponse({
      solucion: data.solucion,
      institucionId: state.auth.currentInstitution.id,
      formularioCategoriaId
    })

    getAndParseItems()
    resetState()
    return response
  }

  const putData = async (data) => {
    const response = await UpdateFormResponse({
      ...data,
      id: formResponse.id
    })
    getAndParseItems()
    resetState()
    return response
  }

  const reduxActions: any = useActions({
    getCatalogs,
    CreateNewFormResponseAction
  })
  const columns = useMemo(() => {
    return [
      {
        label: '',
        column: 'id',
        accessor: 'id',
        Header: '',
        Cell: ({ row }) => {
          return (
            <div
              style={{
							  textAlign: 'center',
							  display: 'flex',
							  justifyContent: 'center',
							  alignItems: 'center'
              }}
            >
              <input
                className='custom-checkbox mb-0 d-inline-block'
                type='checkbox'
                id='checki'
                style={{
								  width: '1rem',
								  height: '1rem',
								  marginRight: '1rem'
                }}
                onClick={(e) => {
								  e.stopPropagation()
								  if (selectedDR.includes(row.original.id)) {
								    const i = selectedDR.indexOf(
								      row.original.id
								    )
								    selectedDR.splice(i, 1)

								    setSelectedDR([...selectedDR])
								  } else {
								    selectedDR.push(row.original.id)
								    setSelectedDR([...selectedDR])
								  }
                }}
                checked={
									(selectedDR?.length === row?.length &&
										row?.length > 0) ||
									selectedDR?.includes(row.original.id)
								}
              />
            </div>
          )
        }
      },
      {
        Header: t("expediente_ce>infraestructura>servicios_publicos>columna_identificador", "Identificador"),
        column: 'identiﬁcador',
        accessor: 'identiﬁcador',
        label: ''
      },
      {
        Header: t("expediente_ce>infraestructura>servicios_publicos>columna_servicio", "Servicio"),
        column: 'servicio',
        accessor: 'servicio',
        label: '',
        Cell: ({ row }) => (
          <>
            {row?.original?.servicio?.options
              ? (
                <>{row?.original?.servicio?.options[0]}</>
                )
              : (
                <>{row?.original?.servicio}</>
                )}
          </>
        )
      },
      {
        Header: t("expediente_ce>infraestructura>servicios_publicos>columna_proveedor", "Proveedor"),
        column: 'proveedor',
        accessor: 'proveedor',
        label: '',
        Cell: ({ row }) => {
          const proveedorId = row?.original?.proveedor?.options
            ? row?.original?.proveedor?.options[0]
            : row?.original?.proveedor
          const proovedor = state.selects.proveedoresDeServicios?.find((el) => el?.id === proveedorId)
          return <>{proovedor?.nombre}</>
        }
      },
      {
        Header: t("expediente_ce>infraestructura>servicios_publicos>columna_fuente", "Fuente"),
        column: 'fuente',
        accessor: 'fuente',
        label: '',
        Cell: ({ row }) => (
          <>
            {row?.original?.fuente?.options
              ? (
                <>{row?.original?.fuente?.options[0]}</>
                )
              : (
                <>{row?.original?.fuente}</>
                )}
          </>
        )
      },
      {
        Header: t("expediente_ce>infraestructura>servicios_publicos>columna_estado", "Estado"),
        column: 'estadoP',
        accessor: 'estadoP',
        label: ''
      },

      {
        Header: t('expediente_ce>infraestructura>servicios_publicos>columna_acciones', 'Acciones'),
        column: '',
        accessor: '',
        label: '',
        Cell: ({ cell, row, data }) => {
          const fullRow = data[row.index]
          return (
            <div className='d-flex justify-content-center align-items-center'>
              <Tooltip title='Editar'>
                <Edit
                  className='mr-2'
                  style={{
									  cursor: 'pointer',
									  color: colors.darkGray
                  }}
                  onClick={async () => {
									  const r = {
									    id: fullRow.id,
									    ...fullRow.solucion,
									    [namesToIds?.proveedor]: {
									      type: 'multiSelect',
									      options: [
									        fullRow.solucion[
									          namesToIds?.proveedor
									        ]
									      ]
									    },
									    [namesToIds?.servicio]: {
									      type: 'multiSelect',
									      options: [
									        fullRow.solucion[
									          namesToIds?.servicio
									        ]
									      ]
									    },
									    [namesToIds?.fuente]: {
									      type: 'multiSelect',
									      options: [
									        fullRow.solucion[
									          namesToIds?.fuente
									        ]
									      ]
									    }
									  }

									  await setFormResponse(r)
									  setShowForm(true)
                  }}
                />
              </Tooltip>

              <Tooltip title='Eliminar'>
                <Delete
                  style={{
									  cursor: 'pointer',
									  color: colors.darkGray
                  }}
                  onClick={() => {
									  deleteData(fullRow)
                  }}
                />
              </Tooltip>
            </div>
          )
        }
      }
    ]
  }, [selectedDR, data, t])

  const toggleAddNewModal = () => {
    setShowForm(!showForm)
    setEditable(!editable)
  }
  const resetState = () => {
    setShowForm(false)
    setEditable(false)
    setFormResponse()
  }

  useEffect(() => {
    reduxActions.getCatalogs(44)
  }, [])
  const handleDelete = (items) => {
    swal({
      title: 'Eliminar',
      text: `¿Esta seguro de que desea eliminar ${
				items.length === 1 || items.id ? 'el' : 'los'
			} registro${items.length === 1 || items.id ? '' : 's'}?`,
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
        items.forEach(async (value) => {
          const response = await DeleteFormResponses(
            value ? [value] : value
          )
          getAndParseItems()
        })
      }
    })
  }
  console.log(pageData,'PAGEDATA')
  return (
    <div>
      {snackBar(snackbarContent.variant, snackbarContent.msg)}
      {showForm && (
        <NavigationContainer
          onClick={(e) => {
					  resetState()
          }}
        >
          <ArrowBackIosIcon />
          <h4>
            <IntlMessages id='pages.go-back-home' />
          </h4>
        </NavigationContainer>
      )}
      {!showForm && (
        <div
          style={{
					  display: 'flex',
					  justifyContent: 'flex-end'
          }}
        >
          <Button color='primary' onClick={toggleAddNewModal}>
            {' '}
            {t('boton>general>agregrar', 'Agregar')}{' '}
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
                onClick={(e) => {
								  e.stopPropagation()

								  if (selectedDR?.length === data?.length) {
								    selectedDR.splice(0, selectedDR.length)
								    setSelectedDR([...selectedDR])
								  } else {
								    data.forEach(function (row, index) {
								      if (!selectedDR.includes(row.id)) {
								        selectedDR.push(row.id)
								        setSelectedDR([...selectedDR])
								      }
								    })
								  }
                }}
                checked={
									selectedDR?.length === data?.length &&
									data?.length > 0
								}
              />
            </div>
            <DropdownToggle
              caret
              color='primary'
              className='dropdown-toggle-split btn-lg'
            />
            <DropdownMenu right>
              <DropdownItem
                onClick={() => {
								  if (selectedDR?.length > 0) { handleDelete(selectedDR) }
                }}
              >
                {t('boton>general>eliminar','Eliminar')}
              </DropdownItem>
            </DropdownMenu>
          </StyledButtonDropdown>
        </div>
      )}
      {!showForm
        ? (
          <TableReactImplementation
            data={data}
            handleGetData={() => {}}
            columns={columns}
            orderOptions={[]}
            avoidSearch
          />
          )
        : (
          <>
            <JSONFormParser
              pageData={pageData}
              postData={async (values) => {
						  const parseSolucion = JSON.parse(values?.solucion)
						  const reqObject = {
						    ...parseSolucion,
						    [namesToIds?.proveedor]:
									parseSolucion[namesToIds?.proveedor]
									  ?.options[0],
						    [namesToIds?.servicio]:
									parseSolucion[namesToIds?.servicio]
									  ?.options[0],
						    [namesToIds?.fuente]:
									parseSolucion?.[namesToIds?.fuente]
									  ?.options[0]
						  }
						  const response =
								await reduxActions.CreateNewFormResponseAction({
								  solucion: JSON.stringify(reqObject),
								  institucionId:
										state.auth.currentInstitution.id,
								  formularioCategoriaId
								})
						  if (response.error) {
						    setSnacbarContent({
						      variant: 'error',
						      msg: response?.message
						    })
						    handleClick()
						  } else {
						    setSnacbarContent({
						      variant: 'success',
						      msg: 'Se creo el servicio de manera exitosa'
						    })
						    handleClick()
						  }
						  getAndParseItems()
						  resetState()
						  return response
              }}
              putData={(values) => {
						  const parseSolucion = JSON.parse(values?.solucion)

						  putData({
						    ...values,
						    solucion: JSON.stringify({
						      ...parseSolucion,
						      [namesToIds?.proveedor]:
										parseSolucion[namesToIds?.proveedor]
										  ?.options[0],
						      [namesToIds?.servicio]:
										parseSolucion[namesToIds?.servicio]
										  ?.options[0],
						      [namesToIds?.fuente]:
										parseSolucion?.[namesToIds?.fuente]
										  ?.options[0]
						    })
						  })
              }}
              dataForm={formResponse}
              setStateUpdater={(value) => {
						  if (value === stateUpdater) return
						  setStateUpdater(value)
              }}
              stateUpdater='1_77f86240-3787-3897-db65-f2c34c830317_ab1cfb6e-e0d1-3036-d129-1d66a013d5d1_col'
              data={[]}
              editable={editable}
              editButtonStyles={{
						  width: '585px'
              }}
              setEditable={setEditable}
              readOnlyFields={
							!showSpeed
							  ? [
							      'b34bb93d-a0f0-94d0-6c31-a1df9015a9ed_ab1cfb6e-e0d1-3036-d129-1d66a013d5d1_col',
							      '51913be1-68d0-9518-bc56-a31acc06e00a_ab1cfb6e-e0d1-3036-d129-1d66a013d5d1_col'
								  ]
							  : [
							      'b34bb93d-a0f0-94d0-6c31-a1df9015a9ed_ab1cfb6e-e0d1-3036-d129-1d66a013d5d1_col'
								  ]
						}
              setFormUtils={(value) => {
						  setFormUtils(value)
              }}
            />
          </>
          )}
    </div>
  )
}

const NavigationContainer = styled.span`
	display: flex;
	cursor: pointer;
`
const StyledButtonDropdown = styled(ButtonDropdown)`
	margin-left: 10px;
	margin-right: 10px;
`
export default Servicios
