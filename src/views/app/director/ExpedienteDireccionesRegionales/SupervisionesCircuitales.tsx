import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
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
import Tooltip from '@mui/material/Tooltip'
import withRouter from 'react-router-dom/withRouter'
import { Col, Row, Container } from 'reactstrap'
import { IoEyeSharp } from 'react-icons/io5'
import colors from 'Assets/js/colors'
import { useTranslation } from 'react-i18next'

const FichaSupervisores = React.lazy(() => import('Views/app/SupervisionesCircuitales/_partials/Ficha'))

interface IProps {
	match: string
    hasAddAccess: boolean
    hasEditAccess: boolean
    hasDeleteAccess: boolean
}

interface IState {
	configuracion: {
        circuitos: {
            entityList: Array<any>
        }
        currentInstitution: any
    }
}

interface SnackbarConfig {
	variant: string
	msg: string
}

const BuscadorSupervisiones = (props: IProps) => {
  const [data, setData] = useState<Array<any>>([])
  const { t } = useTranslation()
  const [expedienteResource, setExpedienteResource] = useState<boolean>(false)
  const [fichaResource, setFichaResource] = useState<boolean>(false)
  const [editable, setEditable] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [snackBarContent, setSnackbarContent] =
		useState<SnackbarConfig>({
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
        Header: t('general>estado', 'Estado'),
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
                <IoEyeSharp
                  style={{
									  fontSize: 25,
									  cursor: 'pointer',
									  color: colors.darkGray
                  }}
                  onClick={() => {
									  // debugger
									  handleFicha(fullRow)
                  }}
                />
              </Tooltip>

              {/* <Tooltip title="Seleccionar supervisión circuital">
								<TouchAppIcon
									onClick={() => {
										// handleExpediente(fullRow)
									}}
									style={{
										fontSize: 25,
										cursor: 'pointer',
										color: colors.darkGray
									}}
								/>
							</Tooltip> */}
            </div>
          )
        }
      }
    ]
  }, [data, t])

  const { hasEditAccess = true } = props

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

  useEffect(() => {
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

  useEffect(() => {
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

  const handleFicha = async (item: any) => {
    await actions.setCircuito(item)
    setFichaResource(!fichaResource)
  }

  const handleBackFicha = async () => {
    fetch()
    await actions.setCircuito({})

    setFichaResource(!fichaResource)
  }

  const handleUpdate = () => {
    setExpedienteResource(!expedienteResource)
    fetch()
  }
  return (
    <>
      <>
        {snackbar(snackBarContent.variant, snackBarContent.msg)}
        <Container>
          <Row>
            {!fichaResource
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
              {fichaResource
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
      </>
    </>
  )
}
const Title = styled.h4`
	color: #000;
	margin-bottom: 30px;
`

export default withRouter(BuscadorSupervisiones)
