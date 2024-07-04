import DropZone from 'Components/Form/DropZone'
import { useActions } from 'Hooks/useActions'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { Button, Col, Row, Input } from 'reactstrap'
import { getCatalogs } from 'Redux/selects/actions'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import { IoIosClose } from 'react-icons/io'
import colors from 'Assets/js/colors'
import useNotification from 'Hooks/useNotification'

interface IProps {
  onPrev: Function
  onNext: Function
  setEvidentialDocuments: Function
  files: any[]
  isAplicar: any
  setFilesTodelete: any
  filesTodelete: any
}
type SnackbarConfig = {
  variant: string
  msg: string
}

const FormDocumentosAprobatorios: React.FC<IProps> = (props) => {
  const {
    onPrev,
    onNext,
    setEvidentialDocuments,
    files,
    isAplicar,
    setFilesTodelete,
    filesTodelete
  } = props
  const [type, setType] = useState<any>({})
  const [name, setName] = useState<string>(null)
  const [errors, setErrors] = useState<any>({})
  const [isOtroDoc, setIsOtroDoc] = useState<boolean>(false)

  const [snackbar, handleClick] = useNotification()
  const [snackBarContent, setSnackbarContent] = React.useState<SnackbarConfig>({
    variant: '',
    msg: ''
  })

  const showNotification = (variant: string, msg: string) => {
    setSnackbarContent({ variant, msg })
    handleClick()
  }

  const actions = useActions({
    getCatalogs
  })
  const state = useSelector((store: any) => {
    return {
      selects: store.selects
    }
  })

  useEffect(() => {
    const fetch = async () => {
      await actions.getCatalogs(39)
    }

    fetch()
  }, [])

  useEffect(() => {
    setErrors(null)
    if (type?.id === 6298) {
      setIsOtroDoc(true)
    } else {
      setIsOtroDoc(false)
    }
  }, [type])

  const saveDoc = async (img: File[]) => {
    let src = null
    if (img[0].size > 5000000) {
      showNotification('error', 'El archivo adjunto no debe ser mayor a 5MB')
      return
    }
    if (img) {
      src = await blobToBase64(img[0])
    }
    const _img = {
      base64: src.split(',')[1],
      tipoDocumentoAprobatorio: type.id,
      nombreDocumento: name || type.nombre
    }
    let error = null
    if (!type.id) {
      error = {
        ...error,
        type: true
      }
    }
    if (type.id === 6298 && !name) {
      error = {
        ...error,
        name: true
      }
    }
    !error ? setEvidentialDocuments([...files, _img]) : setErrors(error)
  }

  const blobToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const onSaveImage = () => {
    onNext()
  }

  const onDelete = (index) => {
    const _files = files
    setFilesTodelete([...filesTodelete, files[index].id])
    _files.splice(index, 1)
    setEvidentialDocuments(_files)
  }

  return (
    <div>
      {snackbar(snackBarContent.variant, snackBarContent.msg)}

      <Form>
        <Row>
          <Col sm={12}>
            <FormGroup>
              <Label>
                {' '}
                Seleccione el tipo de documento probatorio aportado por la
                persona
              </Label>
              <Select
                className='react-select'
                classNamePrefix='react-select'
                placeholder=''
                onChange={(data) => {
                  setType(data)
                }}
                options={state.selects.tipoDocumentos}
                getOptionLabel={(option: any) => option.nombre}
                getOptionValue={(option: any) => option.id}
                name='tipoDocumentos'
              />
              {errors?.type && <Label> Este campo es obligatorio</Label>}
            </FormGroup>
            {isOtroDoc
              ? (
                <FormGroup>
                  <Label> Ingrese el nombre del documento</Label>
                  <Input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                    }}
                  />
                  {errors?.name && <Label> Este campo es obligatorio</Label>}
                </FormGroup>
                )
              : null}
          </Col>
        </Row>
      </Form>
      <h5>Suba los documentos probatorios (opcional)</h5>
      <label>Tamaño máximo 5MB</label>

      <DropZone
        onConfirm={saveDoc}
        onRejection={() => {}}
        onDelete={() => {}}
        name='attachment'
        isMulti
        label='Suba los documentos probatorios'
        type='image/png ,image/jpeg,.pdf'
        value={[]}
      />
      <h5 className='w-100 my-2'>Documentos subidos</h5>

      {files.length
        ? (
            files.map((file, i) => {
              return (
                <UploadedFiles className='mb-2'>
                  <Icon className='fas fa-file' />
                  <span>{file.nombreDocumento}</span>
                  <IconButton
                    onClick={() => onDelete(i)}
                    color='primary'
                    aria-label='Add'
                    size='small'
                  >
                    <IoIosClose style={{ fontSize: '20px', color: '#000' }} />
                  </IconButton>
                </UploadedFiles>
              )
            })
          )
        : (
          <label className='w-100'>Aun no se han subido documentos</label>
          )}

      <Actions className='mt-5'>
        <Button onClick={() => onPrev('form')} color='primary'>
          Anterior
        </Button>
        <Button onClick={() => onSaveImage()} color='primary'>
          {isAplicar ? 'Actualizar' : 'Registrar'}
        </Button>
      </Actions>
    </div>
  )
}

const UploadedFiles = styled.div`
  display: flex;
  width: 200px;
  align-items: center;
  background: ${colors.gray};
  padding: 5px 10px;
  border-radius: 10px;
  justify-content: space-between;
  border: 1px solid ${colors.darkGray};
  span {
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-weight: 600;
  }
`
const Icon = styled.i`
  padding-right: 10px;
  font-size: 16px;
  flex: 0;
`

const Actions = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: space-between;
`
const Form = styled.form`
  margin-bottom: 20px;
`

const FormGroup = styled.div`
  margin-bottom: 10px;
  position: relative;
`

const Label = styled.label`
  color: #000;
  display: block;
`

export default FormDocumentosAprobatorios
