import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { Input } from 'reactstrap'
import './general.css'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import {
  getFuncionariosIdentificacion,
  loadCatalogos,
  getGetAllRolesProfesorByUsuarioId
} from '../../../../../../../redux/RecursosHumanos/actions'
import moment from 'moment'
import { calculateAge } from 'Utils/years'
import { formatDistance } from 'date-fns'
import { es } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

const General = ({ data, setLoading }) => {
  const { t } = useTranslation()
  const actions = useActions({ getFuncionariosIdentificacion, loadCatalogos, getGetAllRolesProfesorByUsuarioId })
  const state = useSelector((store: any) => {
    return {
      funcionariosIdentificacion: store.funcionarios.funcionariosIdentificacion,
      catalogos: store.funcionarios.catalogos
    }
  })

  useEffect(() => {
    const fetch = async () => {
      await actions.getFuncionariosIdentificacion(data.identificacion)
      await actions.loadCatalogos()

      setLoading(false)
    }
    if (data.identificacion) {
      setLoading(true)
      fetch()
    }
  }, [data.identificacion])

  const getCatalogoDescription = (id) => {
    if (!state.catalogos || state.catalogos.length == 0) return
    console.log(state.catalogos.find(x => x.id == id), 'lo encontrado')
    return state.catalogos.find(x => x.id == id)?.nombre
  }

  const datosCatalogo = useMemo(() => {
    console.log(state.funcionariosIdentificacion, 'funcionariosIdentificacion')
    if (!state.funcionariosIdentificacion?.id) return {}

    return {
      nacionalidad: getCatalogoDescription(state.funcionariosIdentificacion?.datos[3]?.elementoId),
      tipoIdentificacion: getCatalogoDescription(state.funcionariosIdentificacion?.datos[2]?.elementoId),
      sexo: getCatalogoDescription(state.funcionariosIdentificacion?.datos[0]?.elementoId),
      // estadoCivil: getCatalogoDescription(state.funcionariosIdentificacion?.datos[5]?.elementoId),
      genero: getCatalogoDescription(state.funcionariosIdentificacion?.datos[1]?.elementoId)
      // estadoMigratorio: getCatalogoDescription(state.funcionariosIdentificacion?.datos[5]?.elementoId),
      // lenguaMaterna: getCatalogoDescription(state.funcionariosIdentificacion?.datos[6]?.elementoId),
    }
  }, [state.funcionariosIdentificacion, state.catalogos])

  return (
    <>
      <DivHead>
        <h4 style={{ margin: '25px', fontSize: '1.15rem' }}>{t('buscador_ce>ver_centro>datos_director>identificacion', 'Identificación')}</h4>
        <div className='spacing'>
          <Photo>
            <img
              className='img'
              src={
                state.funcionariosIdentificacion.imagen ||
                '/assets/img/profile-pic-generic.png'
              }
              alt=''
            />
          </Photo>
        </div>
        <div className='spacing'>
          <DivInput>
            <p style={{ margin: '0', fontSize: '0.75rem' }}>{t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>tipo_identificacion', 'Tipo de identificación')}</p>
            <Input value={datosCatalogo?.tipoIdentificacion} disabled='disabled' />
          </DivInput>
          <DivInput>
            <p style={{ margin: '0', fontSize: '0.75rem' }}>{t('estudiantes>buscador_per>info_gen>nacionalidad', 'Nacionalidad')}</p>
            <Input value={datosCatalogo?.nacionalidad} disabled='disabled' />
          </DivInput>
          <DivInput>
            <p style={{ margin: '0' }}>{t('estudiantes>expediente>hogar>miembros_hogar>agregar>num_id', 'Número de identificación')}</p>
            <Input
              value={state.funcionariosIdentificacion.identificacion || '-'}
              disabled='disabled'
            />
          </DivInput>
        </div>
      </DivHead>
      <DivFoot>
        <div className='spacing'>
          <h4
            style={{
              position: 'absolute',
              marginLeft: '25px',
              marginTop: '-15px',
              fontSize: '1.15rem'
            }}
          >
            {t('estudiantes>expediente>info_gen>info_gen>datos_personales>titulo', 'Datos personales')}
          </h4>
          <DivInput2>
            <p style={{ margin: '0', fontSize: '0.75rem' }}>{t('estudiantes>buscador_per>info_gen>nombre', 'Nombre')}</p>
            <Input
              value={state.funcionariosIdentificacion.nombre || '-'}
              style={{ width: '32rem' }}
              disabled='disabled'
            />
          </DivInput2>
          <DivInput2>
            <p style={{ margin: '0', fontSize: '0.75rem' }}>{t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>segundo_apellido', 'Segundo apellido')}</p>
            <Input
              value={state.funcionariosIdentificacion.segundoApellido || '-'}
              style={{ width: '32rem' }}
              disabled='disabled'
            />
          </DivInput2>
          <DivInput2>
            <p style={{ margin: '0', fontSize: '0.75rem' }}>{t('estudiantes>buscador_per>col_fecha_naci', 'Fecha de nacimiento')}</p>
            <Input
              value={
                moment(state.funcionariosIdentificacion.fechaNacimiento).format(
                  'DD/MM/yyyy'
                ) || '-'
              }
              style={{ width: '32rem' }}
              disabled='disabled'
            />
          </DivInput2>
          <DivInput2>
            <p style={{ margin: '0', fontSize: '0.75rem' }}>{t('estudiantes>expediente>hogar>miembros_hogar>agregar>sexo', 'Sexo')}</p>
            <Input value={datosCatalogo.sexo} style={{ width: '32rem' }} disabled='disabled' />
          </DivInput2>
        </div>
        <div className='spacing'>
          <DivInput2>
            <p style={{ margin: '0', fontSize: '0.75rem' }}>{t('estudiantes>expediente>hogar>miembros_hogar>agregar>apellido_1', 'Primer apellido')}</p>
            <Input
              value={state.funcionariosIdentificacion.primerApellido || '-'}
              style={{ width: '32rem' }}
              disabled='disabled'
            />
          </DivInput2>
          <DivInput2>
            <p style={{ margin: '0', fontSize: '0.75rem' }}>{t('buscador_ce>ver_centro>centro_educativo>conocido_como', 'Conocido como')}</p>
            <Input
              value={state.funcionariosIdentificacion.conocidoComo || '-'}
              style={{ width: '32rem' }}
              disabled='disabled'
            />
          </DivInput2>
          <DivInput2>
            <p style={{ margin: '0', fontSize: '0.75rem' }}>{t('estudiantes>expediente>info_gen>info_gen>datos_personales>edad', 'Edad cumplida')}</p>
            <Input
              value={
              `${moment().diff(state.funcionariosIdentificacion.fechaNacimiento, 'years', false)} años` +
              ` ${moment().diff(state.funcionariosIdentificacion.fechaNacimiento, 'month', false) - (moment().diff(state.funcionariosIdentificacion.fechaNacimiento, 'years', false) * 12)} meses`
} style={{ width: '32rem' }} disabled='disabled'
            />
          </DivInput2>
          <DivInput2>
            <p style={{ margin: '0', fontSize: '0.75rem' }}>{t('estudiantes>expediente>hogar>miembros_hogar>agregar>identidad_gen', 'Identidad de género')}</p>
            <Input value={datosCatalogo.genero} style={{ width: '32rem' }} disabled='disabled' />
          </DivInput2>
        </div>
      </DivFoot>
    </>
  )
}

export default General

const DivHead = styled.div`
  width: 100%;
  height: 20rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
  margin-top: 1%;
  display: flex;
  flex-direction: row;
`
const DivFoot = styled.div`
  width: 100%;
  height: 30rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
  margin-top: 2%;
  margin-bottom: 2%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;
`
const Photo = styled.div`
  width: 15rem;
  height: 15rem;

  border-radius: 50%;
`

const DivInput = styled.div`
  margin: 2%;
`
const DivInput2 = styled.div`
  margin: 5%;
`
