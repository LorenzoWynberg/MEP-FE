import React, { useEffect, useMemo } from 'react'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import { Col, Row, Container, ButtonDropdown } from 'reactstrap'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import Tooltip from '@mui/material/Tooltip'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import colors from 'Assets/js/colors'
import VisibilityIcon from '@material-ui/icons/Visibility'

import swal from 'sweetalert'
import withRouter from 'react-router-dom/withRouter'
import { IoEyeSharp } from 'react-icons/io5'
import BuildIcon from '@mui/icons-material/Build'
import {
  getRegionalesPaginated,
  getRegionalesPaginatedByFilter,
  setRegional,
  deleteRegional,
  setExpedienteRegional
} from 'Redux/configuracion/actions'
import TouchAppIcon from '@material-ui/icons/TouchApp'

import { TableReactImplementation } from 'Components/TableReactImplementation'

import { Configuracion } from '../../../../types/configuracion'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
const ExpedienteDirecciones = React.lazy(() => import('../Configuracion/_partials/Direcciones/main'))
const FichaDirecciones = React.lazy(() => import('../Configuracion/_partials/Direcciones/Ficha'))

type Iprops = {
	match: string
	hasAddAccess: boolean
	hasEditAccess: boolean
	hasDeleteAccess: boolean
}

type IState = {
	configuracion: Configuracion
}

type SnackbarConfig = {
	variant: string
	msg: string
}

const BuscadorDirecciones = ({ hasEditAccess }: Iprops) => {
  const { t } = useTranslation()
  const [data, setData] = React.useState<any[]>([])
  const [expedienteResource, setexpedienteResource] =
		React.useState<boolean>(false)
  const [fichaResource, setfichaResource] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState(false)
  const [dropdownSplitOpen, setDropdownSplitOpen] = React.useState(false)
  const [snackBarContent, setSnackbarContent] =
		React.useState<SnackbarConfig>({ variant: '', msg: '' })
  const [selectedDR, setSelectedDR] = React.useState([])
  const [pagination, setPagination] = React.useState({
    page: 1,
    selectedPageSize: 6,
    selectedColumn: '',
    searchValue: '',
    orderColumn: '',
    orientation: ''
  })
  const history = useHistory()
  const [snackbar, handleClick] = useNotification()
  const actions = useActions({
    getRegionalesPaginated,
    getRegionalesPaginatedByFilter,
    setRegional,
    deleteRegional,
    setExpedienteRegional
  })
  const toggleSplit = () => {
    setDropdownSplitOpen(!dropdownSplitOpen)
  }

  const [editable, setEditable] = React.useState<boolean>(true)

  const { accessRole } = useSelector(
    (state: any) => state?.authUser?.currentRoleOrganizacion
  )
  const state = useSelector((store: IState) => {
    return {
      currentInstitution: store.configuracion.currentInstitution,
      regionales: store.configuracion.regionales,
      permisos: store.authUser.rolPermisos
    }
  })

  React.useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    setLoading(true)
    await actions
      .getRegionalesPaginated({
        pagina: 1,
        cantidad: 30
      })
      .then(() => setLoading(false))
  }

  React.useEffect(() => {
    setLoading(true)
    setData(
      state.regionales.entityList.map((item) => {
        return {
          ...item,
          esActivo: item.esActivo ? 'Activo' : 'Inactivo'
        }
      }) || []
    )
    setLoading(false)
  }, [state.regionales])

  const showNotification = (variant: string, msg: string) => {
    setSnackbarContent({ variant, msg })
    handleClick()
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
          text: 'Eliminar',
          value: true
        }
      }
    }).then(async (result) => {
      if (result) {
        ids.forEach(async (regional) => {
          const error = await actions.deleteRegional(regional)
          if (error.error) {
            for (const fieldName in error.errors) {
              if (error.errors.hasOwnProperty(fieldName)) {
                showNotification(
                  'error',
                  error.errors[fieldName]
                )
              }
            }
          } else {
            showNotification(
              'success',
              'Direccion(es) eliminadas correctamente'
            )
          }
        })
        selectedDR.splice(0, selectedDR.length)
        setSelectedDR([...selectedDR])
      }
    })
  }

  const handleExpediente = async (item: any, alterEdit: boolean = true) => {
    await actions.setRegional(item)
    setexpedienteResource(!expedienteResource)
    if (alterEdit) {
      setEditable(false)
    } else {
      setEditable(true)
    }
  }

  const handleFicha = async (item: any, alterEdit: boolean = true) => {
    await actions.setRegional(item)
    setfichaResource(!fichaResource)
    if (alterEdit) {
      setEditable(false)
    } else {
      setEditable(true)
    }
  }

  const handleBack = async () => {
    fetch()
    await actions.setRegional({})
    setexpedienteResource(!expedienteResource)
  }

  const handleBackFicha = async () => {
    fetch()
    await actions.setRegional({})

    setfichaResource(!fichaResource)
  }

  const handleUpdate = () => {
    setexpedienteResource(!expedienteResource)
    fetch()
  }
  const addRegional = async () => {
    handleExpediente({}, false)
    setexpedienteResource(!expedienteResource)
  }
  // const hasEditAccess = state.permisos.find(
  // 	(permiso) => permiso.codigoSeccion == 'direccionesregionales'
  // )
  const DEFAULT_COLUMNS = useMemo(() => {
    return [
      {
        label: 'Código',
        column: 'codigo',
        accessor: 'codigo',
        Header: t(' dir_regionales>col_codigo', 'Código')
      },
      {
        label: 'Nombre',
        column: 'nombre',
        accessor: 'nombre',
        Header: t('dir_regionales>col_nombre', 'Nombre')
      },
      {
        label: 'Nombre del Director Regional',
        column: 'nombreDirector',
        accessor: 'nombreDirector',
        Header: t(' dir_regionales>col_nom_director_reg', 'Nombre del Director Regional')
      },
      {
        label: 'Estado',
        column: 'esActivo',
        accessor: 'esActivo',
        Header: t('general>estado', 'Estado')
      },
      {
        Header: 'Acciones',
        column: '',
        accessor: '',
        label: '',
        Cell: ({ row }) => {
          return (
            <div className='d-flex justify-content-center align-items-center'>
              <Tooltip title={t(' dir_regionales>col_acciones>ver>hover', 'Ficha de la Dirección Regional')}>
                <VisibilityIcon
                  className='mr-2'
                  style={{
									  fontSize: 25,
									  color: colors.darkGray,
									  cursor: 'pointer'
                  }}
                  onClick={() => handleFicha(row.original, true)}
                />
              </Tooltip>
              <Tooltip title='Seleccionar Dirección Regional'>
                <TouchAppIcon
                  className='mr-2'
                  style={{
									  fontSize: 25,
									  color: colors.darkGray,
									  cursor: 'pointer'
                  }}
                  onClick={() => actions.setExpedienteRegional(row.original)}
                />
              </Tooltip>
              <Tooltip title={t('dir_regionales>col_acciones>config>hover', 'Configuración de la Dirección Regional')}>
                <BuildIcon
                  className='mr-2'
                  style={{
									  fontSize: 25,
									  color: colors.darkGray,
									  cursor: 'pointer'
                  }}
                  onClick={() => handleExpediente(row.original, true)}
                />
              </Tooltip>
            </div>
          )
        }
      }
    ]
  }, [selectedDR])

  return (
    <AppLayout items={directorItems}>
      <div className='dashboard-wrapper'>
        {snackbar(snackBarContent.variant, snackBarContent.msg)}
        <Container>
          <Row>
            {!expedienteResource && !fichaResource
              ? (
                <Col xs={12}>
                  <Title>
                    {t('dir_regionales>titulo', 'Buscador de Direcciones Regionales')}
                  </Title>
                </Col>
                )
              : (
                <Col xs={12}>
                  <Title>
                    {t('dir_regionales>info_gen_dir_regional', 'Información General de la Dirección Regional')}
                  </Title>
                </Col>
                )}

            <Col xs={12}>
              {expedienteResource
                ? (
                  <ExpedienteDirecciones
                    handleBack={handleBack}
                    handleUpdate={handleUpdate}
                    editable={editable}
                    hasEditAccess={hasEditAccess}
                    setEditable={setEditable}
                  />
                  )
                : fichaResource
                  ? (
                    <FichaDirecciones
                      handleBack={handleBackFicha}
                      handleUpdate={handleUpdate}
                      editable={false}
                      hasEditAccess={false}
                      setEditable={setEditable}
                    />
                    )
                  : (
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

									  if (
									    searchValue === '' ||
											searchValue === undefined
									  ) {
									    setLoading(true)
									    actions.getRegionalesPaginated({
									      pagina: 1,
									      cantidad: 30
									    })
									    setLoading(false)
									  } else {
									    setLoading(true)
									    actions.getRegionalesPaginatedByFilter(
									      {
									        pagina: 1,
									        cantidad: 30,
									        type: 'Nombre',
									        search: searchValue
									      }
									    )
									    setLoading(false)
									  }
                      }}
                      columns={DEFAULT_COLUMNS}
                      orderOptions={[]}
                      pageSize={10}
                      backendSearch
                    />
                    )}
            </Col>
          </Row>
        </Container>
      </div>
    </AppLayout>
  )
}

const Wrapper = styled.div`
	background: transparent;
	padding-top: 20px;
`

const Title = styled.h4`
	color: #000;
	margin-bottom: 30px;
`
const StyledButtonDropdown = styled(ButtonDropdown)`
	margin-left: 10px;
	margin-right: 10px;
`
export default withRouter(BuscadorDirecciones)
