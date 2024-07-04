import React from 'react'
import { ModalBody, Modal, ModalHeader, Button, Row, Col } from 'reactstrap'
import styled from 'styled-components'
import PerfectScrollbar from 'react-perfect-scrollbar'

type ComentariosAlertaProps = {
	visible: boolean
	handleModal: any
}

const Filtros: React.FC<ComentariosAlertaProps> = (props) => {
  return (
    <CustomModal
      isOpen={props.visible}
      centered
      size='md'
      backdrop
    >
      <Header>Agregar Filtro</Header>
      <StyledModalBody>
        <ComentariosLista>
          <Row>
            <Col lg={6}>
              <FilterItem>
                <FilterItemTitle>
                  Relacionados al estudiante
                </FilterItemTitle>
                <Lists>
                  <Item>Sexo</Item>
                  <Item>Rango de edad</Item>
                  <Item>Nacionalidad</Item>
                  <Item>Migración</Item>
                </Lists>
              </FilterItem>
              <FilterItem>
                <FilterItemTitle>Geograficos</FilterItemTitle>
                <Lists>
                  <Item>Por provincia</Item>
                  <Item>Por cantón</Item>
                  <Item>Por distrito</Item>
                </Lists>
              </FilterItem>
              <FilterItem>
                <FilterItemTitle>
                  Relacionados a la alerta
                </FilterItemTitle>
                <Lists>
                  <Item>Dimensión</Item>
                  <Item>Contexto</Item>
                  <Item>Alerta</Item>
                </Lists>
              </FilterItem>
            </Col>
            <Col lg={6}>
              <FilterItem>
                <FilterItemTitle>
                  Relacionados al estudiante
                </FilterItemTitle>
                <Lists>
                  <Item>Responsable</Item>
                  <Item>Centro educativo</Item>
                  <Item>Niveles</Item>
                  <Item>Dirección regional</Item>
                  <Item>Circuito</Item>
                  <Item>Región (según MIDEPLAN)</Item>
                </Lists>
              </FilterItem>
              <FilterItem>
                <FilterItemTitle>Geograficos</FilterItemTitle>
                <Lists>
                  <Item>Condición de indígena</Item>
                  <Item>Condición de Discapacidad</Item>
                  <Item>Condición de Dotados</Item>
                </Lists>
              </FilterItem>
            </Col>
          </Row>
        </ComentariosLista>
        <Actions>
          <Button color='primary' outline onClick={props.handleModal}>
            Cancelar
          </Button>
        </Actions>
      </StyledModalBody>
    </CustomModal>
  )
}

const CustomModal = styled(Modal)`
	box-shadow: none;
`

const StyledModalBody = styled(ModalBody)`
	padding: 20px 30px !important;
`

const Header = styled(ModalHeader)`
	padding: 15px 30px !important;
	border-bottom-width: 1px;
	border-bottom-color: #ddd;
`

const ComentariosLista = styled(PerfectScrollbar)`
	min-height: 300px;
`

const Actions = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-around;
	width: 30%;
	justify-content: space-around;
	margin: 10px auto;
`

const FilterItem = styled.div`
	margin-bottom: 10px;
`

const FilterItemTitle = styled.strong`
	color: #000;
`

const Lists = styled.div`
	padding: 0px;
	margin-top: 5px;
`

const Item = styled.button`
	border: 0;
	display: block;
	background: transparent;
	padding: 0px;
	cursor: pointer;
	margin-bottom: 3px;
`

export default Filtros
