import React, { useState, useEffect, useCallback } from 'react'
import 'react-tagsinput/react-tagsinput.css'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'
import {
  Row,
  Col,
  Modal,
  CustomInput,
  Container,
  ModalHeader,
  ModalBody,
  Button,
  Card
} from 'reactstrap'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import CondicionDiscapacidad from './CondicionDiscapacidad'
import OtraCondicion from './OtraCondicion'
import axios from 'axios'
import { envVariables } from '../../../../../../constants/enviroment'

const ApoyoEducativo = (props) => {
  const { t } = useTranslation()

  const [discapacidadesHistorico, setDiscapacidadesHistorico] = useState()
  const [condicionesHistorico, setCondicionesHistorico] = useState()
  const [discapacidades, setDiscapacidades] = useState([])
  const [condiciones, setCondiciones] = useState([])
  const [openOptions, setOpenOptions] = useState({ open: false, type: null })
  const [modalOptions, setModalOptions] = useState([])
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const _discapacidades = []
    const _discapacidadesIdentidad = props.discapacidadesIdentidad.map(
      (discapacidad) => discapacidad.elementosCatalogosId
    )
    props.discapacidades.forEach((discapacidad) => {
      if (_discapacidadesIdentidad.includes(discapacidad.id)) {
        _discapacidades.push(discapacidad)
      }
    })
    setDiscapacidades(_discapacidades)
  }, [props.discapacidadesIdentidad])
  useEffect(() => {
    getHistoricos()
  }, [])

  const getHistoricos = useCallback(
    () => {
      axios.get(`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/DiscapacidadesPorUsuario/GetByIdentityIdHist/${props.identidadId}`).then(r => { setDiscapacidadesHistorico(r.data) }, [])
      // axios.get(`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/DiscapacidadesPorUsuario/GetByIdentityIdHist/${props.identidadId}`).then(r => { setCondicionesHistorico(r.data) }, [])
      axios.get(`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/CondicionesPorUsuario/GetByIdentidad/${props.identidadId}`).then(r => {
        var ids = r.data.map(v => v.elementosCatalogosId);
        var condicionesHistoric = []
        console.log('idsids r.data', r.data)
        console.log('idsids', ids)
        console.log('idsids props.condiciones', props.condiciones)
        props.condiciones.forEach((condicion) => {
          if (ids.includes(condicion.id)) {
            condicionesHistoric.push(condicion)
          }
        })
        console.log('idsids condicionesHistoric', condicionesHistoric)
        setCondicionesHistorico(condicionesHistoric)
      })
    },
    [props.identidadId]
  )

  useEffect(() => {
    const _condiciones = []
    const _condicionesIdentidad = props.condicionesIdentidad.map(
      (condicion) => condicion.elementosCatalogosId
    )
    props.condiciones.forEach((condicion) => {
      if (_condicionesIdentidad.includes(condicion.id)) {
        _condiciones.push(condicion)
      }
    })

    setCondiciones(_condiciones)
  }, [props.condicionesIdentidad])

  const handleOpenOptions = (options, name) => {
    let _options = []

    const map = name === 'discapacidades' && discapacidades.map((item) => item.id) || condiciones.map((item) => item.id)
    _options = options.map((elem) => {
      if (map.includes(elem.id)) {
        return { ...elem, checked: true }
      } else {
        return { ...elem, checked: false }
      }
    })
    setModalOptions(_options)
    setOpenOptions({ open: true, type: name })
  }

  const toggleModal = async (saveData = false) => {
    let options = []
    if (saveData) {

      options = []
      modalOptions.forEach((el) => {
        if (el.checked) options.push(el)
      })
    
      axios.post(`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/${openOptions.type === 'discapacidades' ? 'DiscapacidadesPorUsuario' : 'CondicionesPorUsuario'}/CreateMultiple/${props.identidadId}`, options.map(d => {
        return {
          id: 0,
          elementosCatalogoId: d.id,
          identidadesId: props.identidadId,
          estado: true
        }
      })).then(
        window.location.reload()
      )

    }
    setOpenOptions({ open: false, type: null })
  }

  const handleChangeItem = (item) => {
    const newItems = modalOptions.map((element) => {
      if (element.id === item.id) { return { ...element, checked: !element.checked } }
      return element
    })
    setModalOptions(newItems)
  }


  const optionsTab = [
    { title: 'Condicion De Discapacidad' },
    { title: 'Otras Condiciones' }
  ]
  return (
    <Card style={{ paddingLeft: 36, paddingRight: 36, }}>
      <Row>
        <HeaderTab options={optionsTab} activeTab={activeTab} setActiveTab={setActiveTab} />
        <ContentTab activeTab={activeTab} numberId={activeTab}>

          {activeTab === 0 && <CondicionDiscapacidad discapacidadesHistorico={discapacidadesHistorico} handleOpenOptions={handleOpenOptions} discapacidades={props.discapacidades} />}
          {activeTab === 1 && <OtraCondicion condicionesHistorico={condicionesHistorico} handleOpenOptions={handleOpenOptions} condiciones={props.condiciones} />}
        </ContentTab>


      </Row>
      <Modal isOpen={openOptions.open} size='lg'>
        <ModalHeader>{openOptions.type === 'discapacidades' ? t('estudiantes>expediente>apoyos_edu>modal>tipos', 'Tipos de discapacidades') : t('estudiantes>expediente>apoyos_edu>modal>otro', 'Otros tipos de condiciones')}</ModalHeader>
        <ModalBody>
          <Container className='modal-detalle-subsidio'>
            <Row>
              <Col xs={12}>
                {modalOptions.filter(d =>
                  openOptions.type === 'discapacidades' ? !discapacidadesHistorico?.some(di => di.id == d.id) : !condicionesHistorico?.some(di => di.id == d.id)
                ).map((item) => {
                  console.log('the item', item)
                  console.log('the item props.condicionesHistorico', condicionesHistorico)
                  console.log('the item props.discapacidadesHistorico', discapacidadesHistorico)
                  return (
                    <Row>
                      <Col xs={3} className='modal-detalle-subsidio-col'>
                        <div>
                          <CustomInput
                            type='checkbox'
                            label={item.nombre}
                            inline
                            onClick={() => handleChangeItem(item)}
                            checked={item.checked}
                          />
                        </div>
                      </Col>
                      <Col xs={9} className='modal-detalle-subsidio-col'>
                        <div>
                          <p>
                            {item.descripcion
                              ? item.descripcion
                              : item.detalle ? item.detalle : 'Elemento sin detalle actualmente'}
                          </p>
                        </div>
                      </Col>
                    </Row>
                  )
                })}
              </Col>
            </Row>
            <Row>
              <CenteredRow xs='12'>
                <Button
                  onClick={() => {
                    toggleModal()
                  }}
                  color='primary'
                  outline
                >
                  {t('general>cancelaaaar', 'Cancaaelar')}
                </Button>
                <Button
                  color='primary'
                  onClick={() => {
                    toggleModal(true)
                  }}
                >
                  {t('general>guardar', 'Guaraadar')}
                </Button>

              </CenteredRow>
            </Row>

          </Container>
        </ModalBody>
      </Modal>

    </Card>
  )
}


const CenteredRow = styled(Col)`
        display: flex;
        justify-content: center;
        align-items: center;
        `

export default ApoyoEducativo
