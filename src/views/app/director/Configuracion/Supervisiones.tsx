import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { Configuracion } from '../../../../types/configuracion'
import HTMLTable from 'Components/HTMLTable'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import {
  getCircuitos,
  getCircuitosPaginated,
  getCircuitosPaginatedByFilter,
  setCircuito,
  deleteCircuito
} from 'Redux/configuracion/actions'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { IoMdTrash } from 'react-icons/io'
import { Edit, Delete, Lock } from '@material-ui/icons'
import { RiPencilFill } from 'react-icons/ri'
import {
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CustomInput
} from 'reactstrap'
import swal from 'sweetalert'
import colors from 'Assets/js/colors'
import { useTranslation } from 'react-i18next'

const CrearCircuito = React.lazy(() => import('./_partials/Supervisiones/main'))
const columns1 = [
  { column: 'codigo', label: 'Código', width: 15 },
  { column: 'nombre', label: 'Circuito', width: 20 },
  { column: 'regional', label: 'Dirección regional', width: 45 },
  { column: 'esActivo', label: 'Estado', width: 10 }
]

type Iprops = {
	match: string
}

type IState = {
	configuracion: Configuracion
}

type SnackbarConfig = {
	variant: string
	msg: string
}

const Supervisiones = (props) => {
  const { t } = useTranslation()

  const [data, setData] = React.useState<any[]>([])
  const [createResource, setCreateResource] = React.useState<boolean>(false)
  const [editable, setEditable] = React.useState<boolean>(false)
  const [selectedDR, setSelectedDR] = React.useState([])
  const [dropdownSplitOpen, setDropdownSplitOpen] = React.useState(false)
  const [paginationData, setPaginationData] = React.useState({
    pagina: 1,
    cantidad: 6
  })
  const toggleSplit = () => {
    setDropdownSplitOpen(!dropdownSplitOpen)
  }

  const [snackBarContent, setSnackbarContent] =
		React.useState<SnackbarConfig>({
		  variant: '',
		  msg: ''
		})
  const showNotification = (variant: string, msg: string) => {
    setSnackbarContent({ variant, msg })
    handleClick()
  }

  const {
    hasAddAccess = true,
    hasEditAccess = true,
    hasDeleteAccess = true
  } = props

  const [snackbar, handleClick] = useNotification()
  const actions = useActions({
    getCircuitos,
    getCircuitosPaginated,
    getCircuitosPaginatedByFilter,
    setCircuito,
    deleteCircuito
  })

  const state = useSelector((store: IState) => {
    return {
      currentInstitution: store.configuracion.currentInstitution,
      circuitos: store.configuracion.circuitos
    }
  })

  React.useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    await actions.getCircuitosPaginated({
      pagina: 1,
      cantidad: 30
    })
  }

  React.useEffect(() => {
    const circuits = state.circuitos.entityList?.map((item) => {
      return {
        ...item,
        esActivo: item.esActivo ? 'Activo' : 'Inactivo'
      }
    })
    setData(circuits || [])
  }, [state.circuitos])

  const actionRow = [
    {
      actionName: 'Editar',
      actionFunction: (item) => {
        handleEdit(item, false)
      },
      actionDisplay: () => true
    }
  ]

  const tableActions = [
    {
      actionName: 'crud.delete',
      actionFunction: async (ids: number[]) => {
        ids.forEach(async (circuito) => {
          const { error } = await actions.deleteCircuito(circuito)
          if (error) {
            showNotification(
              'error',
              'Algo ha salido mal, Por favor intentelo luego'
            )
          } else {
            showNotification(
              'success',
              'Circuitos eliminados correctamente'
            )
          }
        })
      }
    }
  ]

  const handleEdit = async (item: any, alterEdit: boolean = true) => {
    await actions.setCircuito(item)
    setCreateResource(!createResource)
    if (alterEdit) {
      setEditable(false)
    } else {
      setEditable(true)
    }
  }

  const handleBack = async () => {
    await actions.setCircuito({})
    fetch()
    setCreateResource(!createResource)
  }
  const handleDelete = async (ids) => {
    swal({
      title: 'Eliminar',
      text: `Está seguro de que desea eliminar ${
				ids.length === 1 ? 'el' : 'los'
			} registro${ids.length === 1 ? '' : 's'} ?`,
      className: 'text-alert-modal',
      icon: 'warning',
      buttons: {
        cancel: 'Cancelar',
        ok: {
          text: 'Eliminar',
          value: true
        }
      }
    }).then(async (result) => {
      if (result) {
        ids.forEach(async (circuito) => {
          const response = await actions.deleteCircuito(circuito)
          if (response.error) {
            showNotification(
              'error',
              'No puede eliminar. Circuito tiene instituciones activas asociadas'
            )
          } else {
            showNotification(
              'success',
              'Circuitos eliminados correctamente'
            )
          }
        })
        selectedDR.splice(0, selectedDR.length)
        setSelectedDR([...selectedDR])
      }
    })
  }
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
        Header: t('configuracion>superviciones_circuitales>columna_codigo', 'Código'),
        column: 'codigo',
        accessor: 'codigo',
        label: ''
      },
      {
        Header: t('configuracion>superviciones_circuitales>columna_supervicion_circuital', 'Supervisión circuital'),
        column: 'nombre',
        accessor: 'nombre',
        label: ''
      },
      {
        Header: t('configuracion>superviciones_circuitales>columna_supervisor', 'Supervisor'),
        column: 'nombreSupervisor',
        accessor: 'nombreSupervisor',
        label: ''
      },
      {
        Header: t('configuracion>superviciones_circuitales>columna_estado', 'Estado'),
        column: 'esActivo',
        accessor: 'esActivo',
        label: ''
      },
      {
        Header: t('configuracion>superviciones_circuitales>columna_acciones', 'Acciones'),
        column: '',
        accessor: '',
        label: '',
        Cell: ({ cell, row, data }) => {
          const fullRow = data[row.index]
          return (
            <div className='d-flex justify-content-center align-items-center'>
              <Tooltip title={t('configuracion>superviciones_circuitales>columna_acciones>hover>editar', 'Editar')}>
                <Edit
                  className='mr-2'
                  style={{
									  cursor: 'pointer',
									  color: colors.darkGray
                  }}
                  onClick={() => {
									  {
									    handleEdit(fullRow, false)
									  }
                  }}
                />
              </Tooltip>

              {hasDeleteAccess && (
                <Tooltip title={t('configuracion>superviciones_circuitales>columna_acciones>hover>eliminar', 'Eliminar')}>
                  <Delete
                    style={{
										  cursor: 'pointer',
										  color: colors.darkGray
                    }}
                    onClick={() => {
										  ;[fullRow.id].forEach(
										    async (circuito) => {
										      const { error } =
														await actions.deleteCircuito(
														  circuito
														)
										      if (error) {
										        showNotification(
										          'error',
															`No puede eliminar. Circuito ${fullRow.codigo} tiene instituciones activas asociadas`
										        )
										      } else {
										        showNotification(
										          'success',
										          'Circuitos eliminados correctamente'
										        )
										        fetch()
										      }
										    }
										  )
                    }}
                  />
                </Tooltip>
              )}
            </div>
          )
        }
      }
    ]
  }, [selectedDR])
  return (
    <Wrapper>
      {snackbar(snackBarContent.variant, snackBarContent.msg)}
      <SectionTable>
        <Title>{t('configuracion>superviciones_circuitales>superviciones_circuitales_educacion', 'Supervisiones circuitales de educación')}</Title>
        {!createResource && (
          <div
            style={{
						  display: 'flex',
						  justifyContent: 'flex-end'
            }}
          >
            <Button
              color='primary'
              onClick={() => {
							  handleEdit({}, false)
							  setCreateResource(!createResource)
              }}
            >
              {t('configuracion>superviciones_circuitales>agregar', 'Agregar')}
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

									  if (
									    selectedDR?.length === data?.length
									  ) {
									    selectedDR.splice(
									      0,
									      selectedDR.length
									    )
									    setSelectedDR([...selectedDR])
									  } else {
									    data.forEach(function (row, index) {
									      if (
									        !selectedDR.includes(row.id)
									      ) {
									        selectedDR.push(row.id)
									        setSelectedDR([
									          ...selectedDR
									        ])
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
                  {t('configuracion>superviciones_circuitales>eliminar', 'Eliminar')}
                </DropdownItem>
              </DropdownMenu>
            </StyledButtonDropdown>
          </div>
        )}
        {createResource
          ? (
            <CrearCircuito
              handleBack={handleBack}
              editable={editable}
              setEditable={setEditable}
              hasEditAccess={hasEditAccess}
            />
            )
          : (
            <div>
              <TableReactImplementation
                data={data}
                handleGetData={async (
							  searchValue,
							  _,
							  pageSize,
							  page,
							  column
                ) => {
							  if (
							    searchValue === '' ||
									searchValue === undefined
							  ) {
							    await actions.getCircuitosPaginated({
							      pagina: 1,
							      cantidad: 30
							    })
							  } else {
							    await actions.getCircuitosPaginatedByFilter(
							      {
							        pagina: 1,
							        cantidad: 30,
							        type: 'Nombre',
							        search: searchValue
							      }
							    )
							  }
                }}
                columns={columns}
                orderOptions={[]}
                pageSize={10}
                backendSearch
              />
            </div>
            )}
      </SectionTable>
    </Wrapper>
  )
}

const Wrapper = styled.div`
	background: transparent;
	padding-top: 20px;
`

const SectionTable = styled.div`
	margin-top: 30px;
`

const Title = styled.h4`
	color: #000;
	margin-bottom: 30px;
`
const StyledButtonDropdown = styled(ButtonDropdown)`
	margin-left: 10px;
	margin-right: 10px;
`

export default Supervisiones
