import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Input } from 'reactstrap'
import './general.css'
import {
  getInfoGeneralStudent
} from '../../../../../../../../redux/VistasUsuarios/actions'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import moment from 'moment'

const General = ({ data }) => {
  const actions = useActions({
    getInfoGeneralStudent
  })
  const state = useSelector((store) => {
    return {
      institution: store.authUser.currentInstitution,
      info_general: store.VistasUsuarios.info_general
    }
  })

  useEffect(() => {
    actions.getInfoGeneralStudent(4, data.institucionId)
  }, [data.institucionId])

  return (
    <Grid>
      <div>
        <BoxGeneral>
          <h5>Información general</h5>
          <span>Nivel</span>
          <InputStyled disabled value={state.info_general.nombreNivel || '-'} />
          <span>Grupo</span>
          <InputStyled disabled value={state.info_general.nombreGrupo || '-'} />
          <span>Oferta educativa</span>
          <InputStyled disabled value={state.info_general.nombreOfertaEducativa || '-'} />
          <span>Modalidad</span>
          <InputStyled disabled value={state.info_general.nombreModalidad || '-'} />
          <span>Servicio</span>
          <InputStyled disabled value={state.info_general.nombreServicio || '-'} />
          <span>Especialidad</span>
          <InputStyled disabled value={state.info_general.nombreEspecialidad || '-'} />
          <span>Año educativo</span>
          <InputStyled disabled value={state.info_general.anioEducativo || '-'} />
          <span>Período</span>
          <div style={{ display: 'flex' }}>
            <InputStyled disabled value={moment(state.info_general.preiodoDesde).format('DD/MM/yyyy') || '-'} />
            <span
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                margin: '10px'
              }}
            >
              al
            </span>
            <InputStyled disabled value={moment(state.info_general.periodoHasta).format('DD/MM/yyyy') || '-'} />
          </div>
        </BoxGeneral>
      </div>
      <div>
        <BoxCondicion>
          <h5>Condición del estudiante</h5>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}
          >
            <div>
              <span>Condición</span>
              <InputStyled disabled value='-' />
            </div>
            <div>
              <span>Condición final</span>
              <InputStyled disabled value='-' />
            </div>
          </div>
        </BoxCondicion>
        <BoxEducativo>
          <h5>Información del centro educativo</h5>
          <div className='grid'>
            <div>
              <span>ID</span>
              <InputStyled disabled value={state.info_general.idSaber || '-'} />
            </div>
            <div>
              <span>Tipo centro</span>
              <InputStyled disabled value={state.info_general.tipoCentroEducativo || '-'} />
            </div>
          </div>
          <span>Centro educativo</span>
          <InputStyled disabled value={state.info_general.nombreCentroEducativo || '-'} />
          <span>Dirección regional / Circuito</span>
          <InputStyled disabled value={state.info_general.direccionRegionalCircuito || '-'} />
          <span>Provincia / Cantón / Distrito</span>
          <InputStyled disabled value={state.info_general.provinciaCantondistritoEducativo || '-'} />
          <div className='grid2'>
            <div>
              <span>Teléfono principal</span>
              <InputStyled disabled value={state.info_general.telefonoCentroEducativo || '-'} />
            </div>
            <div>
              <span>Correo institucional</span>
              <InputStyled disabled value={state.info_general.correoInstitucional || '-'} />
            </div>
          </div>
        </BoxEducativo>
      </div>
    </Grid>
  )
}

export default General

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5%;
  margin-top: 2%;
`
const InputStyled = styled(Input)`
  margin-bottom: 5%;
`
const BoxGeneral = styled.div`
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2);
  background: #fff;
  width: 100%;
  min-height: 40rem;
  border-radius: 15px;
  padding: 5%;
  max-height: 100%;
`

const BoxCondicion = styled.div`
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2);
  background: #fff;
  width: 100%;
  min-height: 10rem;
  border-radius: 15px;
  margin-bottom: 8%;
  padding: 5%;
  max-height: 100%;
`

const BoxEducativo = styled.div`
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2);
  background: #fff;
  width: 100%;
  min-height: 25rem;
  border-radius: 15px;
  padding: 5%;
  max-height: 100%;
`
