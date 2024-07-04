import React from 'react'
import styled from 'styled-components'
import { Row, Col, Button } from 'reactstrap'
import IconEye from '@material-ui/icons/Visibility'
import IconArti from '@material-ui/icons/Description'
import AddIcon from '@material-ui/icons/CloudUploadOutlined'
import { uploadFicha } from '../../../../../../redux/alertaTemprana/actionsAlerts'
import { activeAlertStudent } from '../../../../../../redux/alertaTemprana/actionStudent'
import { useActions } from 'Hooks/useActions'
import swal from 'sweetalert'

type IProps = {
    currentStudent: any,
    currentAlert: any,
    handleCancel: Function,
    handleSetAlert: Function
}

const ActivarDetalle: React.FC<IProps> = (props) => {
  const actions = useActions({ uploadFicha, activeAlertStudent })
  const [details, setDetails] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(false)
  const [uploading, setUploading] = React.useState<boolean>(false)
  const [image, setImage] = React.useState<any>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetails(e.target.value)
  }

  const handleSave = async () => {
    if (details == '') {
      return
    }
    setLoading(true)
    const res = await actions.activeAlertStudent(props.currentAlert.id, props.currentStudent.alertaEstudianteId, { observacion: details, recursosId: [] })
    if (!res.error) {
      setLoading(false)
      swal({
        title: 'Correcto',
        text: 'Se ha activa la alerta correctamente',
        icon: 'success',
        buttons: {
          ok: {
            text: 'Aceptar',
            value: true
          }
        }
      }).then((result) => {
        if (result) {
          props.handleSetAlert()
        }
      })
    } else {
      setLoading(false)
      swal({
        title: 'Oops',
        text: res.message,
        icon: 'warning',
        buttons: {
          ok: {
            text: 'Aceptar',
            value: true
          }
        }
      }).then((result) => {
        if (result) {
          props.handleSetAlert()
        }
      })
    }
  }

  const handleOpenFile = (file: string) => {
    window.open(file, '_blank')
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    try {
      setUploading(true)
      const res = await uploadFicha(e.target.files[0], (event) => {
        const percentCompleted = Math.round((event.loaded * 100) / event.total)
        if (percentCompleted == 100) {
          setUploading(false)
        }
      })
      setImage(res)
    } catch (error) {
      setUploading(false)
    }
  }

  return (
    <Wrapper>
      <Row>
        <Col md={6}>
          <Card>
            <Title>Descripción</Title>
            <Content>
              <Description>{props.currentAlert.descripcion}</Description>
            </Content>
            <ActionsInfo>
              <Button size='sm' className='d-flex align-items-center mr-2' color='primary' outline onClick={() => handleOpenFile(props.currentAlert.fichaUrl)}><IconEye /> Ver ficha completa</Button>
              <Button size='sm' className='d-flex align-items-center' color='primary' outline onClick={() => handleOpenFile(props.currentAlert.fichaUrl)}><IconArti /> Ver normativas</Button>
            </ActionsInfo>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Title>Detalles</Title>
            <Content>
              <Label>Observaciones</Label>
              <Textarea value={details} cols='3' rows='5' onChange={handleChange} />
            </Content>
            <div className='fileinput-buttons'>
              <IconAdd />
              <Button color='primary' outline>{Object.keys(image).length > 0 ? 'Actualizar Archivo' : 'Subir Archivo'}</Button>
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
            {uploading ? <Loading><div className='single-loading' /></Loading> : null}
          </Card>
        </Col>
      </Row>
      <Actions>
        <Button className='mr-2' onClick={props.handleCancel} color='primary' outline>Cancelar</Button>
        <Button onClick={handleSave} color='primary'>Guardar</Button>
      </Actions>
      {
                loading
                  ? <Loading>
                    <div className='single-loading' />
                    <LoadingFeedback>Por favor espere...</LoadingFeedback>
                  </Loading>
                  : null
            }
    </Wrapper>
  )
}

const Wrapper = styled.div`
    position: relative;
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

const LoadingFeedback = styled.strong`
    color: #145388;
    font-size: 15px;
`

const Card = styled.div`
  background: #fff;
  border-radius: calc(0.85rem - 1px);
  box-shadow: 0 1px 15px rgba(0, 0, 0, 0.04), 0 1px 6px rgba(0, 0, 0, 0.04);
  padding: 20px;
  min-height: 300px;
  position: relative;
`

const IconAdd = styled(AddIcon)`
    font-size: 60px !important;
    color: #145388;
    margin-right: 10px;
`

const Title = styled.h5`
    color: #000;
`

const Content = styled.div`
    min-height: 130px;
    margin-top: 20px;
`

const Description = styled.p`
    font-size: 14px;
`

const Form = styled.div`
    margin-top: 5px;
`

const Label = styled.label`
    color: #000;
    margin-bottom: 6px;
`

const Textarea = styled.textarea`
    color: #333;
    width: 100%;
    border-color: #ddd;
    padding: 10px;
    outline: 0;
    &:focus{
        outline: 0;
    }
`

const Actions = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 30px auto 0px;
`

const ActionsInfo = styled(Actions)`
    justify-content: flex-start;
`

export default ActivarDetalle
