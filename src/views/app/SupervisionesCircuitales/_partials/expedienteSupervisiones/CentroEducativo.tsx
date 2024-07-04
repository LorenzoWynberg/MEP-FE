import React, { useState, useMemo, useEffect } from 'react'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { IoEyeSharp } from 'react-icons/io5'
import Tooltip from '@mui/material/Tooltip'
import TouchAppIcon from '@material-ui/icons/TouchApp'
import BarLoader from 'Components/barLoader/barLoader'
import colors from 'Assets/js/colors'
import { useActions } from 'Hooks/useActions'
import { Col, Row, Container } from 'reactstrap'
import { getCentrosByCircuito } from 'Redux/institucion/actions.js'
import { setCircuito } from 'Redux/configuracion/actions'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  handleChangeInstitution,
  updatePeriodosLectivos
} from 'Redux/auth/actions'
import { useTranslation } from 'react-i18next'

interface IState {
	configuracion: {
		currentCircuito: {
			id: number
			codigo: string
			codigoPresupuestario: string
			nombre: string
			esActivo: boolean
			fechaInsercion: string
			fechaActualizacion: string
			telefono: any
			correoElectronico: any
			codigoDgsc2: number
			conocidoComo: any
			imagenUrl: string
			nombreDirector: any
			ubicacionGeograficaJson: any
		}
	}
	institucion: {
		centrosByCircuito: Array<{
			id: number
			codigo: string
			codigoPresupuestario: string
			nombre: string
			circuitosId: number
			imagen: string
			conocidoComo: string
			fechaFundacion: string
			sede: boolean
			centroPrimario: number
			observaciones: string
			motivoEstado: string
			historia: string
			mision: string
			vision: string
			estado: boolean
			estadoId: number
			ubicacionGeografica: string
			provincia: string
			canton: string
			distrito: string
			poblado: string
			telefonoCentroEducativo: string
			correoInstitucional: string
			circuitoNombre: string
			regionNombre: string
			directorCE: string
			tipoCentro: string
			tipoCentroId: number
		}>
	}
}

const CentroEducativo = () => {
  const { t } = useTranslation()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const actions = useActions({
    getCentrosByCircuito,
    setCircuito,
    handleChangeInstitution,
    updatePeriodosLectivos
  })

  const state = useSelector((state: IState) => ({
    currentCircuito: state.configuracion?.expedienteSupervision || state.configuracion.currentCircuito,
    centros: state.institucion.centrosByCircuito,
    expedienteSupervision: state.institucion.expedienteSupervision
  }))

  const setInstitution = async (id) => {
    await actions.handleChangeInstitution(id)
    await actions.updatePeriodosLectivos(id)
  }

  useEffect(() => {
    if (state.currentCircuito) {
      actions.getCentrosByCircuito(state.currentCircuito?.id)
    }
  }, [state.currentCircuito])

  useEffect(() => {
    if (state.centros) {
      setData(state.centros)
    }
  }, [state.centros])

  const columns = useMemo(() => {
    return [
      {
        Header: t('supervision_circ>expediente>ce>codigo', 'Código'),
        column: 'codigo',
        accessor: 'codigo',
        label: ''
      },
      {
        Header: t('supervision_circ>expediente>ce>nom_ce', 'Nombre de Centro educativo'),
        column: 'nombre',
        accessor: 'nombre',
        label: ''
      },
      {
        Header: t('supervision_circ>expediente>ce>tipo_ce', 'Tipo de centro educativo'),
        column: 'tipoCentro',
        accessor: 'tipoCentro',
        label: ''
      },
      {
        Header: t('supervision_circ>expediente>ce>director', 'Director'),
        column: 'directorCE',
        accessor: 'directorCE',
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
              {fullRow.estado ? t('general>activo', 'Activo') : t('general>inactivo', 'Inactivo')}
            </p>
          )
        }
      },
      {
        Header: t('general>acciones', 'Acciones'),
        column: '',
        accessor: '',
        label: '',
        Cell: ({ _, row, data }) => {
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
              <Tooltip title={t('buscador_ce>buscador>columna_acciones>ficha', 'Ver ficha del centro educativo')}>
                <IoEyeSharp
                  onClick={() => {
									  history.push(
											`/director/ficha-centro/${row.original.id}`
									  )
                  }}
                  style={{
									  fontSize: 25,
									  color: colors.darkGray,
									  cursor: 'pointer'
                  }}
                />
              </Tooltip>

              <Tooltip title={t('key', 'Seleccionar institución')}>
                <TouchAppIcon
                  onClick={() => {
									  localStorage.setItem(
									    'selectedInstitution',
									    JSON.stringify(row.original)
									  )
									  setInstitution(row.original.id)
                  }}
                  style={{
									  fontSize: 25,
									  color: colors.darkGray,
									  cursor: 'pointer'
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
    <div className='dashboard-wrapper'>
      {loading && <BarLoader />}
      <Container>
        <Row>
          <Col xs={12}>
            <TableReactImplementation
              data={data}
							// handleGetData={async (
							// 	searchValue,
							// 	_,
							// 	pageSize,
							// 	page,
							// 	column
							// ) => {}}
              columns={columns}
              orderOptions={[]}
              pageSize={10}
            />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default CentroEducativo
