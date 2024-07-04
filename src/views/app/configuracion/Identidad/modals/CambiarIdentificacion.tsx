import SimpleModal from 'Components/Modal/simple'
import { useActions } from 'Hooks/useActions'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { Button, FormFeedback, Input } from 'reactstrap'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import {
  getIdentificacionPersona,
  identificacionTSE
} from 'Redux/identidad/actions'

import { UsuarioRegistro } from '../../../../../types/usuario'
import ReactInputMask from 'react-input-mask'

type IProps = {
  visible: boolean
  handleModal: any
  handleConfirm: any
  requesting: boolean
  user: UsuarioRegistro
  showSnackBar: any
  previewUser: any
  setPreviewUser: any
}

type IState = {
  selects: any
}

const CambiarIdentificacion: React.FC<IProps> = (props) => {
  const {t} = useTranslation()

  const [type, setType] = React.useState<string>('')
  const [idType, setIDType] = React.useState(null)
  const [required, setRequired] = React.useState<boolean>(false)
  const selects = useSelector((state: IState) => state.selects)
  const [notValidId, setNotValidId] = React.useState(true)
  const { handleSubmit, errors, register, control } = useForm(
    {}
  )

  const actions = useActions({ getIdentificacionPersona, identificacionTSE })

  const [typeIdentification, setTypeIdentification] = useState(null)
  const [identification, setIdentification] = useState(null)

  const handleCancel = () => {
    props.handleModal()
  }

  const handleData = (data) => {      
    const {datos} = props.user
    const tipoIdentidad = datos.find(i=>i.codigoCatalogo==1)
    if(tipoIdentidad.elementoId == typeIdentification.id && typeIdentification.id == 4){
      props.showSnackBar("error","El tipo de identificación de origen es el mismo de destino")
      return
    }
    if(identification==null||identification==""){
      props.showSnackBar("error","El número de identificacion no puede quedar vacío")
      return
    }
    
    const defTypeIdentification = data.type_identification || typeIdentification
    data.type_identification = defTypeIdentification
    // console.clear()
    console.log('data', data)
    if (!data.identification) {
      data.identification = identification
    }
    props.handleConfirm(data)
  }

  useEffect(() => {
    if (!props.user.datos) return
    const {identificacion} = props.user
    const identificationId = props.user.datos.find(
      (item: any) => item.nombreCatalogo === 'Tipo de Identificación'
    ).elementoId

    const userIdentification = selects.idTypes.find(
      (item: any) => item.id === identificationId
    )

    setIDType(userIdentification)
    setTypeIdentification(userIdentification)
    setNotValidId(userIdentification.id === 1)
    
    if (identificationId === 1) {
      setRequired(true)
    } else {
      setRequired(false)
    }
  }, [props.user.datos])

  useEffect(() => {
    setTypeIdentification(idType)
  }, [idType])

  useEffect(() => {
    const id = identification
    const _idType = typeIdentification

    const validateExtists = async () => {
      const response = await actions.getIdentificacionPersona(id, true)
      setNotValidId(response.exists)
      response.exists &&
        props.showSnackBar('error', 'El usuario ya está registrado.')
    }

    const loadData = async () => {
      const response = await actions.identificacionTSE(id, false)
      if (response.data !== null && response.data.nombre) {
        props.setPreviewUser({
          ...props.user,
          esFallecido: response.data.esFallecido,
          fechaFallecido: response.data.fechaFallecio,
          fechaNacimiento: response.data.fechaNacimiento,
          nombre: response.data.nombre,
          primerApellido: response.data.primerApellido,
          segundoApellido: response.data.segundoApellido,
          conocidoComo: response.data.conocidoComo,
          type_identification: 1,
          identificacion: id
        })
        setNotValidId(false)
      } else {
        props.showSnackBar('error', 'La cédula no se encuentra en el TSE.')
        setNotValidId(true)
      }
    }

    const nationalValidation =
      id && id.length === 9 && (_idType?.id === 1 || idType.id === 1)
    const dimexValidation =
      id && id.length === 12 && (_idType?.id === 3 || idType.id === 3)

    if (nationalValidation) {
      loadData()
    }

    if (nationalValidation || dimexValidation) {
      validateExtists()
    }
  }, [identification])

  const idTypesParsed = () => {
    switch (idType?.id) {
      case 1:
        return selects.idTypes.filter(el => el.id === idType?.id)
      case 3:
        return selects.idTypes.filter(el => el.id === 1)
      default:
        return selects.idTypes.filter(el => el.id !== idType?.id)
    }
  }

  return (
    <SimpleModal
      openDialog={props.visible}
      onClose={handleCancel}
      title={t('estudiantes>indentidad_per>aplicar_camb>camb_id>titulo', 'Cambiar identificación de la persona')}
      actions={false}
    >
      <StyledModalBody>
        <Form>
          <FormGroup>
            <Label>{t('estudiantes>indentidad_per>aplicar_camb>camb_id>tipo_id', 'Tipo de identificación')}</Label>
            <Select
              className='react-select'
              classNamePrefix='react-select'
              placeholder=''
              options={idTypesParsed()}
              getOptionLabel={(option: any) => option.nombre}
              getOptionValue={(option: any) => option}
              defaultValue={idType}
              isDisabled={required}
              onChange={(value) => {
                setTypeIdentification(value)
              }}
            />
            {errors.type_identification && (
              <ErrorFeedback>{t('general>campo_requerido', 'Campo requerido')}</ErrorFeedback>
            )}
          </FormGroup>

          <FormGroup>
            <Label>{t('estudiantes>indentidad_per>aplicar_camb>camb_id>nuevo_id', 'Nuevo número de identificación')}</Label>

            <ReactInputMask
              mask={
                (typeIdentification?.id === 1)
                  ? '999999999' // 9
                  : (typeIdentification?.id === 3)
                      ? '999999999999' // 12
                      : (typeIdentification?.id === 4)?'YR9999-99999':'99999999999999999999'
              }
              type='text'
              name='identification'
              // control={control}
              invalid={errors.identification}
              className='form-control'
              onChange={(e) => setIdentification(e.target.value)}
              innerRef={register({
                required:
                  typeIdentification?.id !== 4 ||
                  (!typeIdentification && idType?.id !== 4),
                maxLength:
                  typeIdentification?.id === 1 ||
                    (!typeIdentification && idType?.id === 1)
                    ? 9
                    : 25
              })}
              disabled={
                typeIdentification?.id === 4 ||
                (!typeIdentification && idType?.id === 4)
              }
            />
            <FormFeedback>
              {errors.identification &&
                t('estudiantes>indentidad_per>aplicar_camb>error_9_dig', 'El campo es requerido y debe de tener 9 digitos')}
            </FormFeedback>
            {errors.identification &&
              errors.identification.type === 'required' && (
                <FormFeedback>{t('general>campo_requerido', 'Campo requerido')}</FormFeedback>
            )}
            {errors.identificacion &&
              errors.identificacion.type === 'maxLength' && (
                <FormFeedback>
                  {t('estudiantes>indentidad_per>aplicar_camb>error_long_max', 'Debe tener una longitud máxima de')}{' '}
                  {typeIdentification?.id === 1 ||
                    (!typeIdentification && idType?.id === 1)
                    ? 9
                    : 25}{' '}
                  {t('estudiantes>indentidad_per>aplicar_camb>error_long_max_carac', 'carácteres')}
                </FormFeedback>
            )}
          </FormGroup>
          <FormGroup>
            <Label>{t('estudiantes>indentidad_per>aplicar_camb>camb_id>nom_completo', 'Nombre completo')}</Label>
            <Input
              type='text'
              value={`${props.user?.nombre} ${props.user?.primerApellido} ${props.user?.segundoApellido}`}
              disabled
            />
          </FormGroup>
          <Actions>
            <Button
              onClick={() => {
                setTypeIdentification(idType)
                handleCancel()
              }}
              className='mr-3'
              color='secondary'
              outline
            >
              {t('general>cancelar', 'Cancelar')}
            </Button>
            <Button
              color='primary'
              onClick={handleSubmit(handleData)}
              disabled={notValidId}
            >
              {t('general>aplicar_cambio', 'Aplicar cambio')}
            </Button>
          </Actions>
        </Form>
        {props.requesting
          ? (
            <Loading>
              <span className='single-loading' />
            </Loading>
            )
          : null}
      </StyledModalBody>
    </SimpleModal>
  )
}

const StyledModalBody = styled.div``

const Loading = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffffb8;
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

const Form = styled.form``

const FormGroup = styled.div`
  display: block;
  margin-bottom: 15px;
  position: relative;
`

const Label = styled.label`
  color: #000;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 60%;
  justify-content: space-around;
  margin: 20px auto 0px;
`

const ErrorFeedback = styled.span`
  position: absolute;
  color: #bd0505;
  right: 0;
  font-weight: bold;
  font-size: 10px;
  bottom: -19px;
`

export default CambiarIdentificacion
