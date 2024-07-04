import React from 'react'
import styled from 'styled-components'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from 'react-hook-form'

type IProps = {
    visible: boolean,
    handleToggle: Function,
    handleAdd: Function
};

const NormativasModal: React.FC<IProps> = (props) => {
  const { register, errors, handleSubmit } = useForm({ mode: 'onChange' })

  const onSubmit = (values: any) => {
    props.handleAdd(values)
  }

  return (
    <Modal isOpen={props.visible} toggle={props.handleToggle}>
      <ModalHeader toggle={props.handleToggle}>Agregar Normativa</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label>Enlace</Label>
            <Input name='url' ref={register({ required: true })} />
            {errors.url && <ErrorFeedback>Campo requerido</ErrorFeedback>}
          </FormGroup>
          <FormGroup>
            <Label>Nombre</Label>
            <Input name='nombre' ref={register({ required: true })} />
            {errors.nombre && <ErrorFeedback>Campo requerido</ErrorFeedback>}
          </FormGroup>
        </Form>
      </ModalBody>
      <FooterActions centered>
        <Button color='primary' outline>Cancelar</Button>
        <Button color='primary' onClick={handleSubmit(onSubmit)}>Guardar</Button>
      </FooterActions>
    </Modal>
  )
}

const Form = styled.form``

const FormGroup = styled.div`
    margin-bottom: 10px;
    position: relative;
`

const Label = styled.label`
  color: #000;
  display: block;
`

const Input = styled.input`
    padding: 10px;
    width: 100%;
    border: 1px solid #d7d7d7;
    background-color: #fff;
    outline: 0;
    &:focus {
        background: #fff;
    }
`

const FooterActions = styled(ModalFooter)`
    justify-content: center;
`

const ErrorFeedback = styled.span`
    position: absolute;
    color: #bd0505;
    right: 0;
    font-weight: bold;
    font-size: 10px;
    bottom: -19px;
`

export default NormativasModal
