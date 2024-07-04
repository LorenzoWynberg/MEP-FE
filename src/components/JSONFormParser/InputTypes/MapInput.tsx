import React, { FunctionComponent } from 'react'
import { Badge, ModalBody, Modal, ModalHeader } from 'reactstrap'
import { WebMapView } from '../../../views/app/director/ExpedienteEstudiante/_partials/contacto/MapView'
import styled from 'styled-components'

type Props = {
    mapOpen: boolean;
    toggleModal(): any;
    setSearch(): any;
    setLocation(location: { latitude: number; longitude: number }): void;
};

const MapInput: FunctionComponent<Props> = props => {
  return (
    <>
      {props.field.config.useModal
        ? (<>
          <BadgeContainer>
            <Badge color='primary' disabled={!props.editable || props.readOnlyFields?.includes(props.field.id)} onClick={() => props.toggleModal()}>
              Ver mapa
            </Badge>
          </BadgeContainer>
          <Modal
            isOpen={props.mapOpen}
            centered
            size='lg'
            backdrop
          >
            <ModalHeader toggle={props.toggleModal} />
            <StyledModalBody>
              <WebMapView
                setLocation={(value) => {
                  props.setLocation(value)
                }}
                setUbicacion={() => {}}
                editable
                setSearch={props.setSearch}
              />
            </StyledModalBody>
          </Modal>
        </>)
        : (<StyledMapWithoutModal>
          <WebMapView
            setLocation={(value) => {
              props.setLocation(value)
            }}
            setUbicacion={props.setUbicacion}
            editable={props.editable}
            setSearch={props.setSearch}
          />
           </StyledMapWithoutModal>)}
    </>
  )
}

const StyledModalBody = styled(ModalBody)`
    height: 86vh;
    padding: 0 !important;
`

const StyledMapWithoutModal = styled(ModalBody)`
    height: 338px;
    padding: 0 !important;
`

const BadgeContainer = styled.div`
    text-align: right;
`

export default MapInput
