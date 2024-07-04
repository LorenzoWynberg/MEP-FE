import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { Configuracion } from '../../../types/configuracion'
import HTMLTable from 'Components/HTMLTable'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import {
  getCircuitos,
  getCircuitosPaginated,
  getCircuitosPaginatedByFilter,
  setCircuito,
  deleteCircuito,
  setExpedienteSupervision
} from 'Redux/configuracion/actions'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import withRouter from 'react-router-dom/withRouter'
import { RiPencilFill } from 'react-icons/ri'
import { Col, Row, Container, ButtonDropdown, Button } from 'reactstrap'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import { IoEyeSharp } from 'react-icons/io5'
import BuildIcon from '@mui/icons-material/Build'
import colors from 'Assets/js/colors'
import { useTranslation } from 'react-i18next'
import TouchAppIcon from '@material-ui/icons/TouchApp'

const ExpedienteDirecciones = React.lazy(() => import('./_partials/main'))
const FichaSupervisores = React.lazy(() => import('./_partials/Ficha'))

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

const BuscadorSupervisiones = (props) => {
  const { t } = useTranslation()
  const [data, setData] = React.useState<any[]>([])

  const [expedienteResource, setExpedienteResource] =
		React.useState<boolean>(false)
  const [fichaResource, setFichaResource] = React.useState<boolean>(false)
  const [editable, setEditable] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState(false)
  const [paginationData, setPaginationData] = React.useState({
    pagina: 1,
    cantidad: 6
  })
  const [snackBarContent, setSnackbarContent] =
		React.useState<SnackbarConfig>({
		  variant: '',
		  msg: ''
		})
  const columns = useMemo(() => {
    return [
      {
        Header: t('supervision_circ>buscador>col_codigo', 'Código'),
        column: 'codigo',
        accessor: 'codigo',
        label: ''
      },
      {
        Header: 'Dirección regional',
        column: 'regional',
        accessor: 'regional',
        label: ''
      },
      {
        Header: t('supervision_circ>buscador>col_supervision_circ', 'Supervisión circuital'),
        column: 'nombre',
        accessor: 'nombre',
        label: ''
      },
      {
        Header: t('supervision_circ>buscador>col_nom_supervisor', 'Nombre del supervisor'),
        column: 'nombreSupervisor',
        accessor: 'nombreSupervisor',
        label: ''
      },

      {
        Header: t('supervision_circ>buscador>col_estado', 'Estado'),
        column: 'esActivo',
        accessor: 'esActivo',
        label: '',
        Cell: ({ cell, row, data }) => {
          const fullRow = data[row.index]
          return (
            <p
              style={{
							  background: colors.primary,
							  color: '#fff',
							  textAlign: 'center',
							  borderRadius: ' 20px'
              }}
            >
              {fullRow.esActivo}
            </p>
          )
        }
      },
      {
        Header: t('general>acciones', 'Acciones'),
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
							  alignContent: 'center',
							  gap: '1rem'
              }}
            >
              <Tooltip title={t('supervision_circ>buscador>col_acciones>ver>hover', 'Ficha de la supervisión')}>
              <IconButton >
                <IoEyeSharp
                  onClick={() => {
									  handleFicha(fullRow)
                  }}
                  style={{
									  fontSize: 25,
									  cursor: 'pointer',
									  color: colors.darkGray
                  }}
                />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('general>tooltip>seleccionar_supervision_circuital','Seleccionar supervisión circuital')}>
                <TouchAppIcon
                  style={{
									  fontSize: 25,
									  cursor: 'pointer',
									  color: colors.darkGray
                  }}
                  onClick={() => {
									  actions.setExpedienteSupervision(row.original)
                  }}
                />
              </Tooltip>
              <Tooltip title={t('supervision_circ>buscador>col_acciones>configurar>hover', 'Configurar supervisión circuital')}>
                <BuildIcon
                  onClick={() => {
									  handleExpediente(fullRow)
                  }}
                  style={{
									  fontSize: 25,
									  cursor: 'pointer',
									  color: colors.darkGray
                  }}
                />
              </Tooltip>
            </div>
          )
        }
      }
    ]
  }, [data, t])
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
    deleteCircuito,
    setExpedienteSupervision
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
    setLoading(true)
    await actions.getCircuitosPaginated({
      pagina: 1,
      cantidad: 30
    })
    setLoading(false)
  }

  React.useEffect(() => {
    setLoading(true)
    const circuits = state.circuitos.entityList?.map((item) => {
      return {
        ...item,
        esActivo: item.esActivo ? 'Activo' : 'Inactivo'
      }
    })
    setData(circuits || [])
    setLoading(false)
  }, [state.circuitos])

  const handleExpediente = async (item: any) => {
    await actions.setCircuito(item)
    setExpedienteResource(!expedienteResource)
  }
  const handleUpdate = () => {
    setExpedienteResource(!expedienteResource)
    fetch()
  }

  const handleFicha = async (item: any) => {
    await actions.setCircuito(item)
    setFichaResource(!fichaResource)
  }
  const handleBack = async () => {
    fetch()
    await actions.setCircuito({})
    setExpedienteResource(!expedienteResource)
  }

  const handleBackFicha = async () => {
    fetch()
    await actions.setCircuito({})

    setFichaResource(!fichaResource)
  }

  return (
    <AppLayout items={directorItems}>
      <Wrapper>
        {snackbar(snackBarContent.variant, snackBarContent.msg)}
        <Container>
          <Row>
            {!expedienteResource && !fichaResource
              ? (
                <Col xs={12}>
                  <Title>
                    {t('supervision_circ>buscador>titulo', 'Buscador de supervisiones circuitales')}
                  </Title>
                </Col>
                )
              : (
                <Col xs={12}>
                  <Title>
                    {t('supervision_circ>buscador>info_general', 'Información general de las supervisiones circuitales')}
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
                    <FichaSupervisores
                      handleBack={handleBackFicha}
                      handleUpdate={handleUpdate}
                      editable={editable}
                      hasEditAccess={hasEditAccess}
                      setEditable={setEditable}
                    />
                    )
                  : (
                    <TableReactImplementation
                      data={data}
                      handleGetData={async (searchValue, _) => {
									  if (!searchValue) {
									    setLoading(true)
									    await actions.getCircuitosPaginated(
									      {
									        pagina: 1,
									        cantidad: 30
									      }
									    )
									    setLoading(false)
									  } else {
									    setLoading(true)
									    await actions.getCircuitosPaginatedByFilter(
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
                      columns={columns}
                      orderOptions={[]}
                      pageSize={10}
                      backendSearch
                    />
                    )}
            </Col>
          </Row>
        </Container>
      </Wrapper>
    </AppLayout>
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

export default withRouter(BuscadorSupervisiones)
