import React, { useEffect, useState } from 'react'
import style from 'styled-components'
import HTMLTable from 'Components/HTMLTable'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'
import IconMEP from 'Assets/icons/IconMEP'
import IconSABER from 'Assets/icons/IconSABER'
import { IoMdMail } from 'react-icons/io'
import { RiHeadphoneFill } from 'react-icons/ri'
import { MdLocationOn } from 'react-icons/md'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import useNotification from 'Hooks/useNotification'

import { FaBookOpen } from 'react-icons/fa'

import { AiFillEye } from 'react-icons/ai'
import {
  Button,
  InputGroupAddon,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'
import { ReactComponent as BusquedaInstitucion } from '../../../assets/images/BusquedaInstitucion.svg'
import Select from 'react-select'
import General from './_partials/general'
import Ubicacion from './_partials/ubicacion'
import Contacto from './_partials/contacto'
import OfertasEducativas from './_partials/ofertasEducativas'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import useReducerBuscador from './_partials'
import { listasPredefinidas } from '../../../components/JSONFormParser/utils/Options'
import Loader from 'components/LoaderContainer'

const zonaCatalog = listasPredefinidas.find((i) => i.id == 'zona')
const regionSocioEconomicaCatalog = listasPredefinidas.find(
  (i) => i.id == 'regionSocioEconomica'
)
const territorioCatalog = listasPredefinidas.find((i) => i.id == 'territorio')
type SnackbarConfig = {
	variant: string
	msg: string
}

const BuscadorInstitucion = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [snackbar, handleClick] = useNotification()
  const [snackBarContent, setSnackbarContent] =
		React.useState<SnackbarConfig>({
		  variant: '',
		  msg: ''
		})

  const optionsTab = [
    'General',
    'Ubicación',
    'Contacto',
    'Ofertas educativas'
  ]

  const {
    getInstituciones,
    state,
    onChangeSelectProvincia,
    loadProvincias,
    onChangeSelectCanton,
    onChangeSelectDistrito,
    loadOfertaEducativa,
    onChangeSelectEspecialidad,
    onChangeSelectPoblado,
    onChangeSelectOfertaEducativa,
    getInstitucionesById,
    getFiltersInst,
    getOfertasByInstituciones,
    onChangeInput,
    fetchOfertas,
    fetchAnios,
    onChangeAnioSelect,
    getAllOfertas,
    clearOfertaEducativaData,
    clearFilters,
    clearFiltersCanton,
    clearFilterDistrito,
    clearFilterPoblado,
    clearFilterOferta,
    clearFilterEspecialidad,
    clearInfoGeneral,
    newSearch
  } = useReducerBuscador()

  const toggle = () => {
    setModalOpen(!modalOpen)
    if (modalOpen) {
      setActiveTab(0)
      clearInfoGeneral()
    }
  }

  const columns = [
    {
      column: 'codigoSaber',
      label: 'Código'
    },
    {
      column: 'nombreInstitucion',
      label: 'Nombre del centro educativo'
    },
    {
      column: 'direccionRegional',
      label: 'Dirección regional'
    },
    {
      column: 'circuito',
      label: 'Circuito'
    },
    {
      column: 'tipoCentro',
      label: 'Tipo de centro educativo'
    },
    {
      column: 'estadoCentroEducativo',
      label: 'Estado del centro educativo'
    },
    {
      column: 'eyeIcon',
      label: ''
    }
  ]

  function handleChangeProvincia (event) {
    if (!event) {
      event = {
        target: 0,
        value: ''
      }
      clearFilters()
    } else {
      onChangeSelectProvincia(event)
    }
  }

  function handleChangeCanton (event) {
    if (!event) {
      event = {
        target: 0,
        value: ''
      }
      clearFiltersCanton()
    } else {
      onChangeSelectCanton(event)
    }
  }
  function handleChangeDistrito (event) {
    if (!event) {
      event = {
        target: 0,
        value: ''
      }
      clearFilterDistrito()
    } else {
      onChangeSelectDistrito(event)
    }
  }

  function handleChangePoblado (event) {
    // Overwrite the event with your own object if it doesn't exist
    if (!event) {
      event = {
        target: 0,
        value: ''
      }
      clearFilterPoblado()
    } else {
      onChangeSelectPoblado(event)
    }
  }

  function handleChangeOferta (event) {
    // Overwrite the event with your own object if it doesn't exist
    if (!event) {
      event = {
        target: 0,
        value: ''
      }
      clearFilterOferta()
    } else {
      onChangeSelectOfertaEducativa(event)
    }
  }
  function handleChangeEspecialidad (event) {
    // Overwrite the event with your own object if it doesn't exist
    if (!event) {
      event = {
        target: 0,
        value: ''
      }
      clearFilterEspecialidad()
    } else {
      onChangeSelectEspecialidad(event)
    }
  }

  useEffect(() => {
    loadProvincias()
    getAllOfertas()
  }, [])

  useEffect(() => {
    setData(state.instituciones)
  }, [state.instituciones])

  const handleSearch = async () => {
    setLoading(true)
debugger
    await getFiltersInst()

    setLoading(false)
  }

  const visualizar = () => {
    //

    if (loading) return <Loader />

    if (data === null) {
      return (
        <div style={{ margin: '3%' }}>
          <Center>
            <BusquedaInstitucion />
          </Center>
          <Center style={{ textAlign: 'center' }}>
            <Span>
              Realiza una búsqueda para poder encontrar
              información sobre un centro educativo
            </Span>
          </Center>
        </div>
      )
    }
    if (data?.length === 0) {
      return (
        <>
          <Center>
            <h1
              style={{
							  textAlign: 'center',
							  fontWeight: '900',
							  margin: '2%'
              }}
            >
              No se encontraron resultados para su búsqueda
            </h1>
          </Center>
        </>
      )
    } else {
      return (
        <>
          <h6
            style={{
						  marginLeft: '9%',
						  marginTop: '2%',
						  fontWeight: 'bolder'
            }}
          >
            Resultados de la búsqueda: {state.instituciones?.length}
          </h6>
          <div style={{ marginLeft: '9%', marginRight: '9%' }}>
            <HTMLTable
              columns={columns}
              data={data.map((i) => ({
							  ...i,
							  eyeIcon: (
  <div style={{ textAlign: 'center' }}>
    <AiFillEye
      style={{ cursor: 'pointer' }}
      size='30px'
      color='#0f3d64'
    />
  </div>
							  )
              }))}
              tableName='label.catalogs'
              editModalOpen
              toggleEditModal={(el) => {
							  clearOfertaEducativaData()
							  getInstitucionesById(el.institucionId)
							  toggle()
              }}
              modalfooter
              roundedStyle
              readOnly
              disableSearch
              disableSelectAll
              hideMultipleOptions
              hidePageSizes
            />
          </div>
        </>
      )
    }
  }

  return (
    <div style={{ cursor: state.loading ? 'wait' : 'initial' }}>
      {snackbar(snackBarContent.variant, snackBarContent.msg)}

      <div
        style={{
				  display: 'flex',
				  flexDirection: 'column',
				  minHeight: '100vh'
        }}
      >
        <Header>
          <div>
            <IconSABER />
          </div>
          <Center style={{ cursor: 'pointer' }}>
            <a
              href='/#/user/login'
              style={{ fontWeight: 'bolder' }}
            >
              INICIAR SESIÓN
            </a>
          </Center>
        </Header>
        <Center>
          <h1
            style={{
						  textAlign: 'center',
						  fontWeight: '900',
						  marginTop: '1%'
            }}
          >
            Buscador de centros educativos del MEP{' '}
          </h1>
        </Center>
        <Center>
          <h6 style={{ fontWeight: 'bolder', textAlign: 'center' }}>
            Permite la búsqueda de centros educativos por código
            SABER, nombre del centro educativo, código
            presupuestario o conocido como.
          </h6>
        </Center>
        <Center>
          <SearchContainer className='mr-4'>
            <div className='search-sm--rounded'>
              <input
                type='text'
                name='search'
                id='search'
                onInput={() => {}}
                onKeyPress={(e) => {
								  if (e.key === 'Enter') handleSearch()
                }}
                value={state.inputValue}
                onChange={onChangeInput}
                autoComplete='off'
                placeholder='Escriba aquí las palabras claves que desea buscar'
              />
              <StyledInputGroupAddon addonType='append'>
                <Button
                  style={{
									  cursor: state.loading
									    ? 'wait'
									    : 'default'
                  }}
                  disabled={state.loading}
                  color='primary'
                  onClick={(e) => {
									  const stringValidado =
											state.inputValue.trim()
									  if (stringValidado !== '') {
									    handleSearch()
									  }
                  }}
                  className='buscador-table-btn-search'
                >
                  Buscar
                </Button>
              </StyledInputGroupAddon>
            </div>
          </SearchContainer>
        </Center>
        <Center>
         {/*  <Accordion
            style={{
						  width: '80%',
						  borderRadius: '15px',
						  marginTop: '2%',
						  marginRight: '1.5rem'
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography>Búsqueda avanzada</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ width: '100%' }}>
                <Filtros>
                  <div style={{ width: '100%' }}>
                    <Label>Filtrar por provincia</Label>
                    <SelectComponent
                    options={state.provincias?.map(
											  (item) => ({
											    ...item,
											    label: item.nombre,
											    value: item.id
											  })
                  )}
                    value={
												state.provincias?.find(
												  (el) =>
												    el.id ==
														state.provinciaValue
												) || null
											}
                    onChange={handleChangeProvincia}
                  />
                  </div>
                  <div style={{ width: '100%' }}>
                    <Label>Filtrar por cantón</Label>
                    <SelectComponent
                    options={state.canton?.map(
											  (item) => ({
											    ...item,
											    label: item.nombre,
											    value: item.id
											  })
                  )}
                    value={
												state.canton.find(
												  (el) =>
												    el.id ==
														state.cantonValue
												) || null
											}
                    onChange={handleChangeCanton}
                  />
                  </div>
                  <div style={{ width: '100%' }}>
                    <Label>Filtrar por distrito</Label>
                    <SelectComponent
                    options={
												state.distrito
												  ? state.distrito.map(
												    (item) => ({
												      ...item,
												      label: item.nombre,
												      value: item.id
												    })
													  )
												  : []
											}
                    value={
												state.distrito.find(
												  (el) =>
												    el.id ==
														state.distritoValue
												) || null
											}
                    onChange={handleChangeDistrito}
                  />
                  </div>
                  <div style={{ width: '100%' }}>
                    <Label>Filtrar por poblado</Label>
                    <SelectComponent
                    options={
												state.poblado
												  ? state.poblado.map(
												    (item) => ({
												      ...item,
												      label: item.nombre,
												      value: item.id
												    })
													  )
												  : []
											}
                    value={
												state.poblado.find(
												  (el) =>
												    el.id ==
														state.pobladoValue
												) || null
											}
                    onChange={handleChangePoblado}
                  />
                  </div>
                </Filtros>
                <Filtros2>
                  <div>
                    <Label>
                    Filtrar por oferta educativa
										</Label>
                    <SelectComponent
                    options={
												state.ofertaEducativa
												  ? state.ofertaEducativa?.map(
												    (item) => ({
												      ...item,
												      label: item.nombre,
												      value: item.id
												    })
													  )
												  : []
											}
                    value={
												state.ofertaEducativa?.find(
												  (el) =>
												    el.id ==
														state.ofertaEducativaValue
												) || null
											}
                    onChange={handleChangeOferta}
                  />
                  </div>
                  <div style={{ width: '100%' }}>
                    <Label>Filtrar por especialidad</Label>
                    <SelectComponent
                    options={state.especialidad?.map(
											  (item) => ({
											    ...item,
											    label: item.nombre,
											    value: item.id
											  })
                  )}
                    value={
												state.especialidad?.find(
												  (el) =>
												    el.id ==
														state.especialidadValue
												) || null
											}
                    isClearable
                    onChange={handleChangeEspecialidad}
                  />
                  </div>
                </Filtros2>
              </div>
              <Center>
                <Button
                  disabled={state.loading}
                  style={{
									  cursor: state.loading
									    ? 'wait'
									    : 'default',
									  marginTop: '2%',
									  height: '2.5rem',
									  marginRight: '1rem'
                  }}
                  color='primary'
                  outline
                  onClick={() => newSearch()}
                >
                  Nueva búsqueda
                </Button>
                <Button
                  disabled={state.loading}
                  style={{
									  cursor: state.loading
									    ? 'wait'
									    : 'default',
									  height: '2.5rem',
									  width: '6rem',
									  marginTop: '2%',
									  marginRight: '1rem'
                  }}
                  color='primary'
                  onClick={(e) => {
									  if (
									    state.provinciaValue ||
											state.cantonValue ||
											state.distritoValue ||
											state.pobladoValue ||
											state.especialidadValue ||
											state.ofertaEducativaValue
									  ) {
									    handleSearch()
									  }
                  }}
                >
                  Buscar
                </Button>
              </Center>
            </AccordionDetails>
          </Accordion> */}
        </Center>
        {visualizar()}

        <Footer>
          <Center style={{ justifyContent: 'flex-start' }}>
            {/* <IconMEP /> */}
            <img alt='Profile' height='43px' src='/assets/img/LogoMepRep.jpg' />
          </Center>
          <Center style={{ justifyContent: 'flex-start' }}>
            <MdLocationOn
              color='#145388'
              fontSize={20}
              className='mr-1'
            />{' '}
            San José, Costa Rica
          </Center>
          <Center style={{ justifyContent: 'flex-start' }}>
            <RiHeadphoneFill
              color='#145388'
              fontSize={20}
              className='mr-1'
            />{' '}
            (506) 2459-1100
          </Center>
          <Center style={{ justifyContent: 'flex-start' }}>
            <IoMdMail
              color='#145388'
              fontSize={20}
              className='mr-1'
            />
            <a href='mailto: info@mep.go.cr'> saber@mep.go.cr</a>
          </Center>
          <Center style={{ justifyContent: 'flex-start' }}>
            <FaBookOpen
              color='#145388'
              fontSize={20}
              className='mr-1'
            />
            <a
              href='SABER-Guia-rapida-buscador-de-centros-educativos.pdf'
              target='_blank'
            >
              {' '}
              Guía-Manuales
            </a>
          </Center>
        </Footer>
      </div>
      <Modal
        isOpen={modalOpen}
        toggle={() => {
				  toggle()
        }}
        size='xl'
      >
        <ModalHeader>Información del centro educativo</ModalHeader>
        <ModalBody>
          <HeaderTab
            options={optionsTab}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          {state?.loading && <Loader />}

          <ContentTab activeTab={activeTab} numberId={activeTab}>
            {activeTab === 0 && (
              <General infoGeneral={state?.infoGeneral} />
            )}
            {activeTab === 1 && (
              <Ubicacion
                zonaCatalog={zonaCatalog}
                regionSocioEconomicaCatalog={
									regionSocioEconomicaCatalog
								}
                territorioCatalog={territorioCatalog}
                infoGeneral={state?.infoGeneral}
              />
            )}
            {activeTab === 2 && (
              <Contacto infoGeneral={state?.infoGeneral} />
            )}
            {activeTab === 3 && (
              <OfertasEducativas
                onChangeAnioSelect={onChangeAnioSelect}
                ofertasEducativasCatalog={
									state.ofertasEducativasCatalog
								}
                anioValue={state.anioValue}
                anios={state.anios}
                fetchAnios={fetchAnios}
                fetchOfertas={fetchOfertas}
              />
            )}
          </ContentTab>
        </ModalBody>
        <ModalFooter
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Button onClick={toggle} color='primary'>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

const SelectComponent = (props) => {
  return (
    <Select
      isClearable
      components={{
			  Input: CustomSelectInput
      }}
      noOptionsMessage={() => 'Sin opciones '}
      getOptionLabel={(option: any) => option.nombre}
      getOptionValue={(option: any) => option.id}
      placeholder='Selecciona'
      styles={{
			  menuPortal: (base) => ({
			    ...base,
			    zIndex: 999
			  }),
			  control: (styles) => ({
			    ...styles,
			    borderRadius: '20px',
			    border: '1px solid #000'
			  }),
			  indicatorSeparator: (styles) => ({
			    ...styles,
			    display: 'none'
			  })
      }}
      {...props}
    />
  )
}
export default BuscadorInstitucion

const StyledInputGroupAddon = style(InputGroupAddon)`
  top: 0;
  right: 0;
  position: absolute;
  height: 100%;
  display: flex;
  align-items: center;
`
const Span = style.span`
  font-weight: bolder;
  font-size: 15px;
  margin-top: 2%;
  margin-bottom: 5%;
`

const Center = style.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  @media (max-width: 750px){
    padding:10px;
  }
`

const SearchContainer = style.div`
  width: 80%;
`

const Header = style.div`
  background:#fff;
  padding:1%;
  display:flex;
  padding-left: 3%;
  padding-right: 3%;
  justify-content:space-between;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2);
`

const Footer = style.div`
  margin-top: auto;
  width:100%;
  background:#fff;
  display:grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding:1%;
  @media (max-width: 750px){
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1%;
  }
`
const Filtros2 = style.div`
display: grid;
grid-template-columns: 1fr 1fr ;
gap: 1rem;
margin-top: 1%;
@media (max-width: 750px){
  display: grid;
  grid-template-columns: 1fr;
}
`

const Filtros = style.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1rem;
  margin-top: 1%;
  @media (max-width: 750px){
    display: grid;
    grid-template-columns: 1fr;
  }
`
