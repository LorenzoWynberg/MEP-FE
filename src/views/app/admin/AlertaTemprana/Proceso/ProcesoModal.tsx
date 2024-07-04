import React from 'react'
import styled from 'styled-components'
import { Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from 'react-hook-form'

type IProps = {
    steps: any[]
    visible: boolean,
    loading: boolean,
    handleToggle: Function,
    handleAdd: Function
};

const ProcesoModal: React.FC<IProps> = (props) => {
  const { register, errors, handleSubmit } = useForm({ mode: 'onChange' })
  const [error, setError] = React.useState<string>('')
  const [info, setInfo] = React.useState<any>({})
  const [replace, setReplace] = React.useState<boolean>(false)

  const onSubmit = (values: any) => {
    const lastIndexStep = props.steps.length - 1
    const lastStep = props.steps[lastIndexStep]
    const finalStep = lastStep.numeroPaso + 1
    setInfo(values)

    const filtered = props.steps.find(step => step.numeroPaso == parseInt(values.numeroPaso))
    if (filtered) {
      setReplace(true)
    }

    if (parseInt(values.numeroPaso) !== finalStep) {
      setError(`Por favor seguir el orden de pasos. El último paso es el ${lastStep.numeroPaso}`)
    } else {
      setError('')
      props.handleAdd(values)
    }
  }

  const handleConfirm = async () => {
    setReplace(false)
    setError('')
    props.handleAdd(info)
  }

  return (
    <Modal isOpen={props.visible} toggle={props.handleToggle}>
      <ModalHeader toggle={props.handleToggle}>Agregar Nuevo Paso</ModalHeader>
      {
                replace
                  ? <ModalBody>
                    <Already>
                      <FeedBack>Ya existe un paso en este orden, ¿Desea deshabilitarlo?</FeedBack>
                    </Already>
                    <FooterActions centered>
                      <Button color='primary' outline onClick={() => setReplace(false)}>No</Button>
                      <Button color='primary' onClick={handleConfirm}>Sí</Button>
                    </FooterActions>
                  </ModalBody>
                  : <>
                    <ModalBody>
                      <Form>
                        {error !== '' ? <FeedBack>{error}</FeedBack> : null}
                        <FormGroup>
                          <Label>Nombre</Label>
                          <Input name='nombre' innerRef={register({ required: true })} autoComplete='off' />
                          {errors.nombre && <ErrorFeedback>Campo requerido</ErrorFeedback>}
                        </FormGroup>
                        <FormGroup>
                          <Label>Orden</Label>
                          <Input
                            name='numeroPaso'
                            pattern='^-?[0-9]\d*\.?\d*$'
                            innerRef={register({ required: true, pattern: /^-?[0-9]\d*\.?\d*$/ })}
                            onKeyDown={(evt) => evt.key === 'e' && evt.preventDefault()}
                            autoComplete='off'
                          />
                          {errors.numeroPaso && errors.numeroPaso.type === 'required' && <ErrorFeedback>Campo requerido</ErrorFeedback>}
                          {errors.numeroPaso && errors.numeroPaso.type === 'pattern' && <ErrorFeedback>Solo se permiten números</ErrorFeedback>}
                        </FormGroup>
                      </Form>
                    </ModalBody>
                    <FooterActions centered>
                      <Button color='primary' outline onClick={props.handleToggle}>Cancelar</Button>
                      <Button color='primary' onClick={handleSubmit(onSubmit)}>Guardar</Button>
                    </FooterActions>
                  </>
            }
      {props.loading ? <Loading><div className='single-loading' /></Loading> : null}
    </Modal>
  )
}

const Form = styled.form``

const Loading = styled.div`
    position: absolute;
    background: rgba(255, 255, 255, 0.7);
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const FormGroup = styled.div`
    margin-bottom: 10px;
    position: relative;
`

const Label = styled.label`
  color: #000;
  display: block;
`

const FeedBack = styled.span`
    color: #be1919;
    display: block;
    text-align: center;
`

const Already = styled.div`
    padding: 20px;
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

export default ProcesoModal
