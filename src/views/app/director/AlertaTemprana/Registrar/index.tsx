import { useActions } from 'Hooks/useActions'
import React, { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Col, Row, Container, Input, Button as ButtonRT, Label } from 'reactstrap'
import {
  cleanAlert,
  getAlertsDimension,
  getCatAlertsByDimension
} from 'Redux/alertaTemprana/actions'

import styled from 'styled-components'
import InputWrapper from 'Components/wrappers/InputWrapper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import Paper from '@material-ui/core/Paper'
import Button from '@mui/material/Button'
import { IconButton } from '@mui/material'
import SignalCellularNoSimIcon from '@mui/icons-material/SignalCellularNoSim'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Tooltip from '@mui/material/Tooltip'

import Loader from 'components/LoaderContainer'
import moment from 'moment'
import colors from 'Assets/js/colors'
import SimpleModal from 'Components/Modal/simple'
import { useTranslation } from 'react-i18next'

interface IProps {
  dataNivel: any
  dataStudent: any
  dataInstitution: any
  goBack: Function
  onConfirm: Function
}

const AlertaTempranaRegistrar: React.FC<IProps> = (props) => {
  const { t } = useTranslation()
  const { dataNivel, dataStudent, dataInstitution, goBack, onConfirm } = props
  const [alertas, setAlertas] = useState([])
  const [currentDimension, setCurrenDimension] = useState(null)
  const [loading, setLoading] = useState<any>(false)
  const [openModal, setOpenModal] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState(false)

  const state = useSelector((store: any) => {
    return {
      institution: store.authUser.currentInstitution,
      dimensions: store.alertaTemprana.alertsDimension,
      alertsCatalog: store.alertaTemprana.alertsCatalog
    }
  })

  const actions = useActions({
    getAlertsDimension,
    getCatAlertsByDimension,
    cleanAlert
  })

  useEffect(() => {
    const fetch = async () => {
      await actions.getAlertsDimension()
    }
    fetch()
  }, [])

  useEffect(() => {
    return () => {
      setAlertas([])
      actions.cleanAlert()
    }
  }, [])

  const onSelectAlert = (alert) => {
    const exist = alertas.find((e) => e.id === alert.id)
    if (!exist) {
      const _alerts = [...alertas]
      const _new = {
        currentDimension,
        alert,
        id: alert.id,
        dimension: currentDimension?.nombre,
        nombre: alert.nombre,
        observacion: ''
      }
      _alerts.push(_new)
      setAlertas(_alerts)
    }
  }

  const onSelectDimension = async (dimension) => {
    setCurrenDimension(dimension)
    await actions.getCatAlertsByDimension(dimension.id)
  }

  const onChangeTextarea = (value, id) => {
    const dta = [...alertas]
    const idx = dta
      .map(function (e) {
        return e.id
      })
      .indexOf(id)
    dta[idx] = {
      ...dta[idx],
      observacion: value
    }
    setAlertas([...dta])
  }

  const onDeleteAlert = (id) => {
    const dta = alertas.filter((e) => e.id !== id)
    setAlertas(dta)
  }

  const onSave = async () => {
    if (!alertas.length) {
      return
    }
    setLoading(true)
    await onConfirm(alertas)
    setLoading(false)
  }

  const columnsAlerts = [
    {
      Header: t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_dimension', 'Dimensión'),
      accessor: 'dimension'
    },
    {
      Header: t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>colum_alerta', 'Alerta Temprana'),
      accessor: 'nombre'
    },

    {
      Header: t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_observacion', 'Observación'),
      accessor: 'observacion',
      Cell: 'input'
    },
    {
      Header: t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_acciones', 'Acciones'),
      accessor: 'action',
      Cell: 'delete'
    }
  ]

  const columns = useMemo(() => {
    return [
      {
        label: '',
        column: '',
        Header: t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>colum_alerta', 'Alerta Temprana'),
        accessor: 'nombre'
      },
      {
        label: '',
        column: '',
        Header: t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>colum_ver_documento', 'Ver documento'),
        accessor: 'document',
        Cell: ({ cell, row, data }) => {
          return (
            <div
              key={row.index}
              className='d-flex justify-content-center align-items-center'
            >
              <Tooltip title='Ver'>
                <IconButton
                  onClick={() => {
                    setSelectedAlert(row.original)
                    setOpenModal(true)
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            </div>
          )
        }
      },
      {
        label: '',
        column: '',
        Header: t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_acciones', 'Acciones'),
        accessor: 'action',
        Cell: ({ cell, row, data }) => {
          const _row = data[row.index]

          return (
            <ButtonStyled
              key={row.index}
              colors={colors.primary}
              onClick={() => onSelectAlert(_row)}
            >
              Agregar
            </ButtonStyled>
          )
        }
      }
    ]
  }, [state.alertsCatalog, alertas])

  const columnsDimension = useMemo(() => {
    return [
      {
        label: '',
        column: '',
        Header: t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_dimension', 'Dimensión'),
        accessor: 'nombre',
        Cell: ({ cell, row, data }) => {
          const _row = data[row.index]

          return (
            <SelectDimension
              key={row.index}
              colors={colors.primary}
              className='cursor-pointer'
              onClick={() => onSelectDimension(_row)}
            >
              {_row.nombre}
            </SelectDimension>
          )
        }
      }
    ]
  }, [state.dimensions, alertas])

  const _goBack = () => {
    setAlertas([])
    actions.cleanAlert()
    goBack()
  }

  return (
    <Row>
      {loading && <Loader />}
      <SimpleModal
        openDialog={openModal}
        title='Detalle'
        btnCancel={false}
        onConfirm={() => {
          setOpenModal(false)
          setSelectedAlert(null)
        }}
        onClose={() => {
          setOpenModal(false)
          setSelectedAlert(null)
        }}
      >
        <div style={{ minWidth: '20rem' }}>
          <Label>Alerta Temprana</Label>
          <Input type='text' disabled value={selectedAlert?.nombre} />
          <Label>Descripción</Label>
          <div className=''>
            <textarea
              rows={4}
              style={{
                resize: 'none',
                width: '100%'
              }}
              disabled
              value={selectedAlert?.descripcion}
            />
          </div>
          <Label>Normativa</Label>
          <div className=''>
            <textarea
              rows={4}
              style={{
                resize: 'none',
                width: '100%'
              }}
              disabled
              value={selectedAlert?.normativas}
            />
          </div>
        </div>
      </SimpleModal>
      <Col xs={12}>
        <Card>
          <InputWrapper
            classNames=' backgroundCard backgroundCard-blue'
          >
            <Typography gutterBottom variant='subtitle1'>
              {t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>persona_seleccionada', 'Persona estudiante seleccionada')}
            </Typography>
            <div style={{ color: 'white' }}>
              <div className='d-flex align-items-center my-3'>
                <div className='mr-3'>
                  <b className='mr-1'>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>identificacion', 'IDENTIFICACIÓN:')}</b>
                  {dataStudent?.identificacion}
                </div>
                <div className='d-flex align-items-center'>
                  <b className='mr-1'>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>nombre', 'NOMBRE COMPLETO:')}</b>
                  <>{`${dataStudent?.nombreCompleto}`}</>
                </div>
              </div>
              <div className='d-flex align-items-center my-3'>
                <div className='d-flex align-items-center mr-3'>
                  <div className='mr-1'>
                    <b>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>fecha_registro', 'FECHA REGISTRO:')}</b>
                  </div>
                  <>
                    {moment(new Date()).format(
                      'DD/MM/YYYY'
                    )}
                  </>
                </div>
                <div className='d-flex align-items-center'>
                  <div className='d-flex align-items-center mr-1'>
                    <b>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>ubi_administrativa  ', 'UBICACIÓN ADMINISTRATIVA:')}</b>
                  </div>
                  <>
                    {dataInstitution.regionNombre} /{' '}
                    {dataInstitution.circuitoNombre}
                  </>
                </div>
              </div>
              <div className='d-flex align-items-center my-3'>
                <div className='d-flex align-items-center mr-3'>
                  <div className='mr-1'>
                    <b>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>centro_ed', 'CENTRO EDUCATIVO:')}</b>
                  </div>
                  <>{dataInstitution.nombre}</>
                </div>
                <div className='d-flex align-items-center'>
                  <div className='mr-1'>
                    <b>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>oferta', 'OFERTA:')}</b>
                  </div>
                  <>{dataNivel.ofertaNombre}/{dataNivel.modalidadNombre}/{dataNivel.servicioNombre}/{dataNivel.nivelNombre}</>
                </div>
              </div>
              <div className='my-3 d-flex align-items-center'>
                <div className='mr-1'>
                  <b>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>ubicacion', 'UBICACIÓN:')}</b>
                </div>
                <>
                  {dataInstitution.provincia}{' '}
                  {`${dataInstitution.distrito || ''}${dataInstitution.distrito?.length > 0 ? '/' : ''}`}{' '}
                  {`${dataInstitution.poblado || ''}${dataInstitution.poblado?.length > 0 ? '/' : ''}`}
                </>
              </div>
            </div>
            {/* <Grid xs={12} container>
              <TableMockup>
                <tbody>
                  <tr>
                    <td>
                      <b>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>identificacion', 'IDENTIFICACIÓN:')}</b>
                    </td>
                    <td>{dataStudent?.identificacion}</td>
                    <td>
                      <b>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>codigo', 'CODIGO:')}</b>
                    </td>
                    <td>{dataInstitution.codigo}</td>
                    <td>
                      <b>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>oferta', 'OFERTA:')}</b>
                    </td>
                    <td>{dataNivel.ofertaNombre}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>nombre', 'NOMBRE COMPLETO:')}</b>
                    </td>
                    <td>{dataStudent?.nombreCompleto}</td>
                    <td>
                      <b>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>centro_ed', 'CENTRO EDUCATIVO:')}</b>
                    </td>
                    <td>{dataInstitution.nombre}</td>
                    <td>
                      <b>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>modalidad', 'MODALIDAD:')}</b>
                    </td>
                    <td>{dataNivel.modalidadNombre}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>fecha_registro', 'FECHA REGISTRO:')}</b>
                    </td>
                    <td>
                      {moment(new Date()).format(
                        'DD/MM/YYYY'
                      )}
                    </td>
                    <td>
                      <b>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>ubi_administrativa  ', 'UBICACIÓN ADMINISTRATIVA:')}</b>
                    </td>
                    <td>
                      {dataInstitution.regionNombre} /{' '}
                      {dataInstitution.circuitoNombre}
                    </td>
                    <td>
                      <b>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>servicio', 'SERVICIO:')}</b>
                    </td>
                    <td>{dataNivel.servicioNombre}</td>
                  </tr>
                  <tr>
                    <td />
                    <td />
                    <td>
                      <b>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>ubicacion', 'UBICACIÓN:')}</b>
                    </td>
                    <td>
                      {dataInstitution.provincia} /{' '}
                      {dataInstitution.distrito}/{' '}
                      {dataInstitution.poblado}
                    </td>
                    <td>
                      <b>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>nivel', 'NIVEL:')}</b>
                    </td>
                    <td>{dataNivel.nivelNombre}</td>
                  </tr>
                </tbody>
              </TableMockup>
            </Grid> */}
          </InputWrapper>
        </Card>
      </Col>
      <Col xs={12}>
        <Paper>
          <Row className='p-3'>
            <Col sm={12} className='my-4'>
              <Typography variant='subtitle1'>
                {t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>texto2', 'Debe seleccionar una dimensión, luego seleccionar la alerta respectiva y agregarla. En la parte inferior, podrá registrar cualquier observación que crea necesaria. Puede agregar más de una alerta.')}
              </Typography>
            </Col>
            <Col s={12} md={4}>
              <TableReactImplementation
                columns={columnsDimension}
                data={state.dimensions}
                avoidSearch
              />
            </Col>
            <Col s={12} md={8}>
              {' '}
              <TableReactImplementation
                columns={columns}
                data={state.alertsCatalog}
                avoidSearch
              />{' '}
            </Col>
            <Col sm={12} md={9}>
              <Typography variant='body1' className='my-4'>
                {t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>texto3', 'A continuación, puede visualizar las alertas que usted esta registrando a la persona estudiante:')}
              </Typography>
            </Col>
            <Col md={12}>
              <table className='mallasTable' role='table'>
                <thead>
                  <tr role='row'>
                    {columnsAlerts.map((row) => {
                      return (
                        <th
                          colSpan={1}
                          role='columnheader'
                        >
                          {row.Header}
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody style={{ background: '#fff' }}>
                  {alertas.map((alert, index) => {
                    alert.index = index
                    return (
                      <tr role='row'>
                        {columnsAlerts.map((cell) => {
                          if (cell.Cell) {
                            const Cell = cell.Cell

                            if (Cell === 'delete') {
                              return (
                                <td role='cell'>
                                  <div
                                    key={
                                      index
                                    }
                                    className='d-flex justify-content-center align-items-center'
                                  >
                                    <IconButton
                                      onClick={() => {
                                        onDeleteAlert(
                                          alert.id
                                        )
                                      }}
                                    >
                                      <Tooltip title='Eliminar'>
                                        <SignalCellularNoSimIcon />
                                      </Tooltip>
                                    </IconButton>
                                  </div>
                                </td>
                              )
                            } else if (
                              Cell === 'input'
                            ) {
                              return (
                                <td role='cell'>
                                  <Input
                                    type='textarea'
                                    onChange={(
                                      e
                                    ) =>
                                      onChangeTextarea(
                                        e
                                          .target
                                          .value,
                                        alert.id
                                      )}
                                  />
                                </td>
                              )
                            } else {
                              return (
                                <td role='cell'>
                                  {
                                    alert[
                                    cell
                                      .accessor
                                    ]
                                  }
                                </td>
                              )
                            }
                          } else {
                            return (
                              <td role='cell'>
                                {
                                  alert[
                                  cell
                                    .accessor
                                  ]
                                }
                              </td>
                            )
                          }
                        })}
                      </tr>
                    )
                  })}
                  {!alertas.length && (
                    <tr role='row'>
                      <td
                        colSpan={4}
                        className='d-flex justify-content-center align-items-center'
                      >
                        {t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>texto_no_hay_alertas', 'No hay alertas agregadas')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Col>

            <Col md={12}>
              <div className='d-flex justify-content-center align-items-center mt-3'>
                <ButtonRT
                  outline
                  className='mr-3 cursor-pointer'
                  onClick={() => _goBack()}
                  color='secondary'
                >
                  {t('boton>general>cancelar', 'Cancelar')}
                </ButtonRT>
                <ButtonRT
                  className='cursor-pointer'
                  onClick={() => onSave()}
                  color='primary'
                  disabled={!alertas.length}
                >
                  {t('boton>general>registrar', 'Registrar')}
                </ButtonRT>
              </div>
            </Col>
          </Row>
        </Paper>
      </Col>
    </Row>
  )
}

const Card = styled.div``

const SelectDimension = styled.div<{ colors: string }>``

const ButtonStyled = styled(Button) <{ colors: string }>`
	background: ${(props) => props.colors}!important;
  text-transform: capitalize !important;
  border-radius: 16px !important;
  padding: 0 !important;
  font-size: 12px !important;
	color: #fff !important;
`

const TableMockup = styled.table`
	font-size: 12px;
	color: white;
	td {
		padding: 5px 0 5px 0;
	}
`

AlertaTempranaRegistrar.defaultProps = {
  dataNivel: {},
  dataStudent: { identificacion: '', nombreCompleto: '', fecha: '' },
  dataInstitution: {},
  goBack: () => { }
}

export default AlertaTempranaRegistrar
