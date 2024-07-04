import React from 'react'
import styled from 'styled-components'
import { Input, Button } from 'reactstrap'
import { useForm } from 'react-hook-form'
import AddIcon from '@material-ui/icons/CloudUploadOutlined'
import { uploadFicha } from '../../../../../redux/alertaTemprana/actionsAlerts'
import ModalFiles from '../ActivarAlerta/ModalFiles'

type FormType = {
    loading: boolean;
    handleRequest: Function;
    handleCancel: Function
}

const SolicitudForm: React.FC<FormType> = (props) => {
  const [visible, setVisible] = React.useState<boolean>(false)
  const [uploading, setUploading] = React.useState<boolean>(false)
  const [editable, setEditable] = React.useState<boolean>(true)
  const [resources, setResources] = React.useState<Array<number>>([])
  const { register, errors, reset, handleSubmit } = useForm({ mode: 'onChange' })

  const handleUpload = async (e) => {
    e.preventDefault()
    try {
      setUploading(true)
      const res = await uploadFicha(e.target.files[0], (event) => {})
      setResources([...resources, res])
      setUploading(false)
    } catch (error) {
      setUploading(false)
    }
  }

  const handleDeleteFile = (index: number) => {
    const temp = [...resources]
    temp.splice(index, 1)
    setResources(temp)
  }

  const handleToggle = (e) => {
    e.preventDefault()
    setEditable(!editable)
  }

  const onSubmit = (values: any) => {
    const ids = []

    resources.map((resource) => {
      ids.push(resource.id)
    })

    const data = { ...values, recursosId: ids }
    props.handleRequest(data)
    reset()
  }

  return (
    <Content>
      <Card className='bg-white__radius'>
        <Form>
          <FormGroup>
            <Label>Nombre sugerido para la alerta</Label>
            <Input name='nombre' innerRef={register({ required: true })} readOnly={!editable} autoComplete='off' />
            {errors.nombre && <ErrorFeedback>Campo requerido</ErrorFeedback>}
          </FormGroup>
          <FormGroup>
            <Label>Describa detalladamente la alerta de exclusión educativa que solicita</Label>
            <Input type='textarea' name='descripcion' innerRef={register({ required: true })} readOnly={!editable} autoComplete='off' />
            {errors.descripcion && <ErrorFeedback>Campo requerido</ErrorFeedback>}
          </FormGroup>
          <FormGroup>
            <Label>Justifique la solicitud de la alerta</Label>
            <Input type='textarea' name='justificacion' innerRef={register({ required: true })} readOnly={!editable} autoComplete='off' />
            {errors.justificacion && <ErrorFeedback>Campo requerido</ErrorFeedback>}
          </FormGroup>

          <FormGroup className='fied-upload mt-2'>
            <Label>Incluya cualquier elemento que pueda coadyuvar la atención de la alerta (protocolo, guía, fotos, otros).</Label>
            <ItemUploads>
              <div className='fileinput-buttons'>
                <IconAdd />
                <Button color='primary' outline>Subir Archivo</Button>
                <input
                  accept='pdf/*'
                  id='profile-pic-id'
                  type='file'
                  name='profilePic'
                  onChange={e => {
                    handleUpload(e)
                  }}
                />
              </div>
              {resources.length > 0 ? <Button onClick={() => setVisible(!visible)} className='ml-2' color='primary'>Ver archivos</Button> : null}
            </ItemUploads>
            {uploading ? <Loading><div className='single-loading' /></Loading> : null}
          </FormGroup>
          <Actions>
            {
                            editable
                              ? <>
                                <Button className='mr-2' color='primary' outline onClick={handleToggle}>Cancelar</Button>
                                <Button color='primary' onClick={handleSubmit(onSubmit)}>Guardar</Button>
                              </>
                              : <>
                                <Button className='mr-2' color='primary' outline onClick={props.handleCancel}>Cancelar</Button>
                                <Button color='primary' onClick={handleToggle}>Editar</Button>
                              </>
                        }
          </Actions>
        </Form>
      </Card>

      <ModalFiles
        visible={visible}
        handleModal={() => setVisible(!visible)}
        files={resources}
        handleDelete={handleDeleteFile}
      />

      {props.loading ? <Loading><div className='single-loading' /></Loading> : null}
    </Content>
  )
}

const Content = styled.div`
    width: 50%;
    position: relative;
    margin-top: 20px;
`

const Card = styled.div`
  background: #fff;
  border-radius: calc(0.85rem - 1px);
  box-shadow: 0 1px 15px rgba(0, 0, 0, 0.04), 0 1px 6px rgba(0, 0, 0, 0.04);
`

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

const Form = styled.form`
    
`

const FormGroup = styled.div`
    margin-bottom: 10px;
    position: relative;
`

const Label = styled.label`
  color: #000;
  display: block;
`

const ErrorFeedback = styled.span`
    position: absolute;
    color: #bd0505;
    right: 0;
    font-weight: bold;
    font-size: 10px;
    bottom: -19px;
`

const IconAdd = styled(AddIcon)`
    font-size: 60px !important;
    color: #145388;
    margin-right: 10px;
`

const Actions = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const ItemUploads = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

export default SolicitudForm
