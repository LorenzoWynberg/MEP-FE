import React, { useState } from 'react'
import styled from 'styled-components'
import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'
import './general.css'
import CardRol from './CardRol'
import ModalPerfil from './ModalPerfil'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import Checkbox from '@mui/material/Checkbox'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import {
  getGetAllRolesProfesorByUsuarioId
} from '../../../../../../../redux/RecursosHumanos/actions'
import { useActions } from 'Hooks/useActions'
import { useTranslation } from 'react-i18next'
interface role {
  id: number | void
  name: string | void
}
const PerfilesAsociados = ({ setLoading }) => {
  const { t } = useTranslation()
  const actions = useActions({ getGetAllRolesProfesorByUsuarioId })
  const state = useSelector((store: any) => {
    return {
      rolesSecciones: store.funcionarios.rolesSecciones,
      funcionarioSelected: store.funcionarios.funcionariosIdentificacion
    }
  })
  const [moduloOptionState, setModuloOptionsState] = useState<any>({})
  const [selectedModulo, setSelectedModulo] = useState<any>({})

  const buildModulesApartados = (rol) => {
    if (!rol.modulos) return
    const modulos = new Map<number, string>()
    const resultModulos = []
    rol.modulos = typeof rol.modulos === 'string' ? JSON.parse(rol.modulos) : rol.modulos
    rol.modulos.forEach(seccionObj => {
      modulos.set(seccionObj.moduloId, seccionObj.moduloNombre)
    })
    modulos.forEach((value, key) => {
      resultModulos.push({ label: value, value: key })
    })
    return resultModulos
  }

  const onChangeModuleEvent = (value, key) => {
    const newState = { ...selectedModulo }
    newState[key] = value
    setSelectedModulo(newState)
  }
  const getModuleValueEvent = (key) => {
    return selectedModulo[key]
  }

  React.useEffect(() => {
    if (!state.funcionarioSelected.usuarioId) return

    setLoading(true)
    const fetch = async () => {
      const rolesSecciones = await actions.getGetAllRolesProfesorByUsuarioId(state.funcionarioSelected.usuarioId)
      if (!rolesSecciones) return
      const newOptionState = { ...moduloOptionState }
      const newSelectedModuloState = { ...selectedModulo }
      rolesSecciones.forEach((role) => {
        const modulosOptions = buildModulesApartados(role)
        if (modulosOptions.length > 0) {
          newOptionState[role.rolId] = modulosOptions
          newSelectedModuloState[role.rolId] = modulosOptions[0]
        }
      })
      setModuloOptionsState(newOptionState)
      setSelectedModulo(newSelectedModuloState)
      setLoading(false)
    }
    fetch()
  }, [state.funcionarioSelected.usuarioId])

  const RolesAccordion = (arr) => {
    arr = arr.map(i => {
      if (typeof i.modulos === 'string') { return { ...i, modulos: JSON.parse(i.modulos) } } else { return i }
    })
    return (
      <div style={{ padding: '1.5rem' }}>
        {
        arr.map((rol, index) => {
          return (
            <Accordion key={index}>
              <AccordionSummaryStyled
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1a-content'
                id='panel1a-header'
              >
                <Typography>{rol.rolNombre}</Typography>
              </AccordionSummaryStyled>
              <AccordionDetails>
                <>
                  <div style={{ margin: '0 3% 1rem 3%', width: '30%' }}>
                    <h3>{t('general>modulo', 'Módulo')}: </h3><Select options={moduloOptionState[rol.rolId]} placeholder='' onChange={(obj) => onChangeModuleEvent(obj, rol.rolId)} noOptionsMessage={() => t('general>no_opt', 'Sin opciones')} value={selectedModulo[rol.rolId]} />
                  </div>
                  {rol?.modulos?.find(m => m.moduloId == getModuleValueEvent(rol.rolId)?.value)?.apartados?.map((apartado, i) => {
                    return (
                      <div key={i} style={{ marginTop: '1rem', marginBottom: '2rem ' }}>
                        <ApartadoNombre>{apartado.apartadoNombre}</ApartadoNombre>
                        <SeccionContainer>
                          {apartado.secciones.map((seccion, index) => {
                return (
                            <div key={index} style={{ marginTop: '1rem' }}>
                                <SeccionNombre>{seccion.seccionNombre}</SeccionNombre>
                                <PermisosContainer>
            <PermisosBox><FormControlLabel control={<Checkbox readOnly checked={seccion.Modificar} />} label={t('general>modificar', 'Modificar')} /></PermisosBox>
            <PermisosBox><FormControlLabel control={<Checkbox readOnly checked={seccion.Eliminar} />} label={t('general>eliminar', 'Eliminar')} /></PermisosBox>
            <PermisosBox><FormControlLabel control={<Checkbox readOnly checked={seccion.Agregar} />} label={t('general>agregar', 'Agregar')} /></PermisosBox>
            <PermisosBox><FormControlLabel control={<Checkbox readOnly checked={seccion.Leer} />} label={t('general>leer', 'Leer')} /></PermisosBox>
          </PermisosContainer>
                              </div>
                )
              })}
                        </SeccionContainer>
                      </div>
                    )
                  })}
                </>
              </AccordionDetails>
            </Accordion>
          )
        })
      }
      </div>
    )
  }

  return (
    <>
      <Box>
        <div className='div-head'>
          <h5>{t('expediente_ce>recurso_humano>fun_ce>roles', 'Roles asociados')}</h5>
        </div>

        {RolesAccordion(state.rolesSecciones)}

      </Box>
    </>
  )
}

export default PerfilesAsociados

const AccordionSummaryStyled = styled(AccordionSummary)`
  padding: 5px 10px !important;
  text-transform: uppercase;
  background-color: #f8f8f8 !important;
`
const ApartadoNombre = styled.div`
  color: #145388!important;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
`

const SeccionNombre = styled.div`
  color: #145388!important;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  padding-left: 1rem;
`
const SeccionContainer = styled.div`
display: grid;
gap: 1rem;
width: 100%;
grid-Template-Columns: 1fr 1fr 
`

const PermisosContainer = styled.div`
  display: grid;
  gap: 1rem;
  width: 50%;
  grid-Template-Columns: 1fr 1fr 1fr 1fr
`
const PermisosBox = styled.div`
  display: grid;
  width: 10%;
  grid-Template-Columns: 1fr
`

const Box = styled.div`
  max-width: 100%;
  min-height: 20rem;
  max-height: 100%;
  background: #fff;
  border-radius: 10px;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
  margin-top: 1%;
  margin-right: 1%;
  margin-bottom: 1%;
`

/* const Table = styled.div`
  display: flex;
  flex-direction: column
` */

const Table = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin-left: 2%;
`
