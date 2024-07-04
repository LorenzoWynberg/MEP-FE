import React, { useEffect, useMemo, useState } from 'react'
import {
  Card,
  CardBody,
  Button,
  InputGroupAddon
} from 'reactstrap'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import VisibilityIcon from '@material-ui/icons/Visibility'
import TouchAppIcon from '@material-ui/icons/TouchApp'
import Tooltip from '@mui/material/Tooltip'

import { TableReactImplementation } from 'Components/TableReactImplementation'
import colors from 'Assets/js/colors'
import { useActions } from 'Hooks/useActions'
import { getCentrosByRegional } from 'Redux/institucion/actions.js'
import { setRegional } from 'Redux/configuracion/actions'
import { useHistory } from 'react-router-dom'
import { handleChangeInstitution, updatePeriodosLectivos } from 'Redux/auth/actions'
import { useTranslation } from 'react-i18next'
import { CurrentRegional } from 'types/configuracion'

interface IState {
    configuracion: {
      currentRegional: CurrentRegional
      expedienteRegional : CurrentRegional
    }
    institucion: {
        centrosByRegional: Array<{
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

const CentrosEducativos = () => {
  const { t } = useTranslation()
  const state = useSelector((state: IState) => ({
    currentRegional: state.configuracion.expedienteRegional || state.configuracion.currentRegional,
    centros: state.institucion.centrosByRegional
  }))
  const history = useHistory()
  const actions = useActions({
    getCentrosByRegional,
    setRegional,
    handleChangeInstitution,
    updatePeriodosLectivos
  })

  const setInstitution = async (id) => {
    await actions.handleChangeInstitution(id)
    await actions.updatePeriodosLectivos(id)
  }

  useEffect(() => {
    if (state.currentRegional) {
      actions.getCentrosByRegional(state.currentRegional?.id)
    }
  }, [state.currentRegional])

  const data = useMemo(() => {
    return state.centros
  }, [state.centros])

  const columns = useMemo(() => {
    return [
      {
        Header: t('supervision_circ>expediente>ce>codigo', 'Código'),
        label: 'Código',
        accessor: 'codigo',
        column: 'codigo'
      },
      {
        Header: t('supervision_circ>expediente>ce>nom_ce', 'Nombre de centro educativo'),
        label: 'Nombre de centro educativo',
        accessor: 'nombre',
        column: 'nombre'
      },
      {
        Header: t('supervision_circ>expediente>ce>tipo_ce', 'Tipo de centro educativo'),
        label: 'Tipo de centro educativo',
        accessor: 'tipoCentro',
        column: 'tipoCentro'
      },
      {
        Header: t('supervision_circ>expediente>ce>director', 'Director'),
        label: 'Director',
        accessor: 'directorCE',
        column: 'directorCE'
      },
      {
        Header: t('general>estado', 'Estado'),
        label: 'Estado',
        accessor: 'esActivo',
        column: 'esActivo',
        Cell: ({ row }) => {
          return (
            <div
              style={{
                padding: '.5rem 1rem',
                backgroundColor: row.original.estado ? colors.primary : 'red',
                borderRadius: '16px',
                color: '#FFF',
                textAlign: 'center'
              }}
            >
              {row.original.estado ? t('general>activo', 'ACTIVO') : t('general>inactivo', 'INACTIVO')}
            </div>
          )
        }
      },
      {
        Header: t('general>acciones', 'Acciones'),
        label: 'Acciones',
        accessor: 'actions',
        column: 'actions',
        Cell: ({ row }) => {
          return (
            <div className='d-flex justify-content-center align-items-center'>
              <Tooltip title={t('general>ver', 'Ver')} className='mr-3'>
                <VisibilityIcon
                  style={{
                    cursor: 'pointer',
                    fontSize: 25,
                    color: colors.darkGray
                  }}
                  onClick={() => {
                    history.push(`/director/ficha-centro/${row.original.id}`)
                  }}
                />
              </Tooltip>
              <Tooltip title={t('general>seleccionar', 'Seleccionar')}>
                <TouchAppIcon
                  onClick={() => {
                    localStorage.setItem(
                      'selectedInstitution',
                      JSON.stringify(row.original)
                    )
                    setInstitution(row.original.id)
                  }}
                  style={{
                    cursor: 'pointer',
                    fontSize: 25,
                    color: colors.darkGray
                  }}
                />
              </Tooltip>
            </div>
          )
        }
      }
    ]
  }, [t])
  return (
    <div>
      <div className='my-5 d-flex justify-content-between'>
        <SearchContainer className='mr-4'>
          <div className='search-sm--rounded'>
            <input
              type='text'
              name='keyword'
              id='search'
              value=''
              onKeyPress={(e) => {

              }}
              onChange={(e) => {

              }}
              placeholder={t('estudiantes>matricula_estudiantes>buscar>placeholder', 'Escriba aquí las palabras claves que desea buscar...')}
            />
            <StyledInputGroupAddon
              style={{ zIndex: 2 }}
              addonType='append'
            >
              <Button
                color='primary'
                className='buscador-table-btn-search'
                onClick={() => { }}
                id='buttonSearchTable'
              >
                {t('general>buscar', 'Buscar')}
              </Button>
            </StyledInputGroupAddon>
          </div>
        </SearchContainer>
      </div>
      <Card>
        <CardBody>
          <TableReactImplementation
            columns={columns}
            data={data}
            avoidSearch
          />
        </CardBody>
      </Card>
    </div>
  )
}

const StyledInputGroupAddon = styled(InputGroupAddon)`
	top: 0;
	right: 0;
	position: absolute;
	height: 100%;
	display: flex;
	align-items: center;
`
const SearchContainer = styled.div`
	width: 32vw;
	min-width: 16rem;
`

export default CentrosEducativos
