import React, { useState, useEffect } from 'react'
import {
  Container, Card, Row, Col, Label,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import GoBack from 'Components/goBack'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import Loader from 'Components/LoaderContainer'

import { progressInCard } from 'Utils/progress'

import {
  getSections,
  getModulos,
  getApartados,
  getById,
  getRoleProfiles,
  getApartadosByModulo,
  getSectionsByApartado,
  clearRol,
  updateRole,
  crearPerfil
} from 'Redux/roles/actions'

import colors from 'Assets/js/colors'
import Perfil from './Perfil'

import styled from 'styled-components'

const Rol = (props) => {
  const { rolId } = props
  const history = useHistory()
  const [currentModulo, setCurrentModulo] = useState<any>({})
  const [loadingApartados, setLoadingApartados] = useState<any>(false)

  const actions = useActions({
    getSections,
    getRoleProfiles,
    getById,
    getModulos,
    getApartados,
    getApartadosByModulo,
    getSectionsByApartado,
    clearRol,
    updateRole,
    crearPerfil
  })

  const state = useSelector((store: any) => {
    return {
      rol: store.roles.rol,
      perfiles: store.roles.perfiles,
      secciones: store.roles.secciones,
      modulos: store.roles.modulos,
      apartados: store.roles.apartados
    }
  })

  useEffect(() => {
    const fetch = async () => {
      await actions.getById(Number(rolId))
      await actions.getRoleProfiles(Number(rolId))
      await actions.getModulos()
    }
    fetch()
    return () => {
      actions.clearRol()
    }
  }, [])

  useEffect(() => {
    if (state.modulos.length > 0) {
      setCurrentModulo(state.modulos[0])
      _getApartados(state.modulos[0].id)
    }
  }, [state.modulos])

  const _getApartados = async (moduloId) => {
    setLoadingApartados(true)
    await actions.getApartadosByModulo(moduloId)
    await actions.getSections()
    setLoadingApartados(false)
  }

  const updatePerfil = async (perfilId, data) => {
    progressInCard(true)
    await actions.updateRole(rolId, perfilId, data)
    await actions.getRoleProfiles(Number(rolId))
    progressInCard(false)
  }

  const goBack = async () => {
    history.push('/director/usuarios/roles')
    actions.clearRol()
  }
  const createPerfil = async (data) => {
    try {
      progressInCard(true)
      await actions.crearPerfil(data)
      await actions.getRoleProfiles(Number(rolId))
      progressInCard(false)
    } catch (error) {
      console.log(error)
      progressInCard(false)
    }
  }

  if (!rolId) return

  return (
    <Container>
      <h3 className='mt-5 mb-3'>Roles</h3>
      <GoBack onClick={() => goBack()} />

      <label>Rol</label>
      <h3>{state.rol.nombre}</h3>
      <CardStyled>
        <h4 className='mb-1 uppercase'>Seleccione el módulo</h4>
        <UncontrolledDropdown size='md' className='mb-4'>
          <DropdownToggle
            caret
            color='light'
            className='language-button'
          >
            <span className='name'>{currentModulo.nombre}</span>
          </DropdownToggle>
          <DropdownMenu
            className='mt-3'
            modifiers={{
						  setMaxHeight: {
						    enabled: true,
						    order: 890,
						    fn: (data) => {
						      return {
						        ...data,
						        styles: {
						          ...data.styles,
						          overflow: 'auto',
						          maxHeight: 300,
						          minHeight: 300
						        }
						      }
						    }
						  }
            }}
          >
            {state.modulos.map((modulo, i) => {
						  return (
  <DropdownItem
    onClick={() => {
									  setCurrentModulo(modulo)
									  _getApartados(modulo.id)
    }}
    key={i}
  >
    {modulo.nombre}
  </DropdownItem>
						  )
            })}
          </DropdownMenu>
        </UncontrolledDropdown>

        {loadingApartados && <Loader />}
        {state.apartados.map((apartado, i) => {
				  return (
  <Accordion className='mb-3' key={i}>
    <AccordionSummaryStyled
      expandIcon={<ExpandMoreIcon />}
      aria-controls='panel1a-content'
      id='panel1a-header'
    >
      <Typography>{apartado.nombre}</Typography>
    </AccordionSummaryStyled>
    <AccordionDetailsStyled>
      <Row>
        {state.secciones
									  .filter(
									    (x) =>
									      Number(x.sb_ApartadosId) ===
												Number(apartado.id)
									  )
									  ?.map((seccion, i) => {
									    const _perfiles = state.perfiles.find(
									      (x) =>
									        Number(x.seccionId) ===
													Number(seccion.id)
									    )
									    return (
  <Col sm={12} md={6} key={i}>
    <LabelStyled>
      {seccion.nombre[0].toUpperCase() + seccion.nombre.substring(1)}
    </LabelStyled>

    <Perfil
      update={updatePerfil}
      data={_perfiles || {}}
    />
  </Col>
									    )
									  })}
      </Row>
    </AccordionDetailsStyled>
  </Accordion>
				  )
        })}
      </CardStyled>
    </Container>
  )
}

const CardStyled = styled(Card)`
	padding: 10px;
	margin-bottom: 20px;
`
const LabelStyled = styled(Label)`
	color: ${colors.primary}!important;
	font-size: 14px;
	font-weight: bold;

`
const AccordionSummaryStyled = styled(AccordionSummary)`
	padding: 5px 10px !important;
	background-color: ${colors.gray}!important;
`
const AccordionDetailsStyled = styled(AccordionDetails)`
	border: 1px solid ${colors.gray}!important;
`
export default Rol
