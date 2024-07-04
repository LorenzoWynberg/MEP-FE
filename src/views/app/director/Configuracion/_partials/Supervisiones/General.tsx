import React from 'react'
import { Col, Row, Input, FormGroup, Label } from 'reactstrap'
import AddIcon from '@material-ui/icons/AddAPhoto'
import styled from 'styled-components'
import colors from '../../../../../../assets/js/colors'
import { useForm, Controller } from 'react-hook-form'
import { CurrentCircuito } from '../../../../../../types/configuracion'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import { Tooltip, withStyles, Avatar } from '@material-ui/core'
import NavigationContainer from '../../../../../../components/NavigationContainer'
import Modal from 'Components/Modal/simple'
import Cropper from 'Components/Form/CropImage'
import useNotification from 'Hooks/useNotification'
import Select from 'react-select'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'

type IProps = {
	currentCircuito: CurrentCircuito
	handleCreate: Function
	handleEdit: Function
	handleBack: Function
	loading: boolean
	editable: boolean
	regionales: any[]
	hasEditAccess: boolean
}

export const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#fff',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: `2px solid ${colors.primary}`
  }
}))(Tooltip)

const cropFormat = {
  unit: '%',
  aspect: 1 / 1,
  width: 50,
  height: 70
}
type SnackbarConfig = {
	variant: string
	msg: string
}

const General = (props: IProps) => {
  const { t } = useTranslation()

  const [image, setImage] = React.useState({
    url: props.currentCircuito?.imagenUrl
  })
  const { setEditable, hasEditAccess = true } = props
  const [openCrop, setOpenCrop] = React.useState<boolean>(false)
  const [imageSrc, setImageSrc] = React.useState<string>(null)
  const [snackbar, handleClick] = useNotification()
  const estadosarray: any[] = [
    { value: 'Activo', label: t('configuracion>superviciones_circuitales>agregar>estado>activo', 'Activo') },
    { value: 'Inactivo', label: t('configuracion>superviciones_circuitales>agregar>estado>inactivo', 'Inactivo') }
  ]
  const regionalesselected = props.regionales?.find(
    (x) => x.id === props.currentCircuito.regionalesId
  )?.nombre

  const [snackBarContent, setSnackbarContent] =
		React.useState<SnackbarConfig>({
		  variant: '',
		  msg: ''
		})
  React.useEffect(() => {
    setImage({ url: props.currentCircuito?.imagenUrl || '' })

    setValue('esActivo', {
      value: props.currentCircuito.esActivo || 'Activo',
      label: props.currentCircuito.esActivo || 'Activo'
    })
    setValue('regionalesId', {
      value: props.currentCircuito.regionalesId || '',
      label: regionalesselected || 'Seleccionar'
    })
  }, [props.currentCircuito?.imagenUrl, props.regionales])

  const schema = yup.object().shape({
    esActivo: yup
      .object()
      .shape({ value: yup.string() })
      .required('Campo requerido'),
    regionalesId: yup
      .object()
      .shape({ value: yup.string() })
      .required('Campo requerido')
  })

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    control,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
      esActivo: {
        label: props.currentCircuito.esActivo || 'Activo',
        value: props.currentCircuito.esActivo || 'Activo'
      },
      nombre: props.currentCircuito.nombre || '',
      conocidoComo: props.currentCircuito.conocidoComo || '',
      codigo: props.currentCircuito.codigo || '',
      codigoPresupuestario: props.currentCircuito.codigoPresupuestario || '',
      codigoDgsc: props.currentCircuito.codigoDgsc || '',
      regionalesId: {
        value: props.currentCircuito.regionalesId || '',
        label: regionalesselected || 'Seleccionar'
      }
    }
    // resolver: yupResolver(schema)
  })

  const onSubmit = async (circuito: any) => {
    const _data = {
      ...circuito,
      id: props.currentCircuito.id || '0',
      esActivo: circuito.esActivo === undefined ? true : circuito.esActivo.value == 'Activo',
      regionalesId: circuito.regionalesId.value,
      codigoDgsc: parseInt(circuito.codigoDgsc)
    }
    const formData = new FormData()
    Object.keys(_data).forEach((key) => {
      formData.append(key, _data[key])
    })
    formData.append('image', image.url)
    const res = await props.handleCreate(formData)
    // debugger
    setEditable(false)
    setValue('esActivo', circuito.esActivo)
  }

  const block = !props.currentCircuito.nombre

  const toInputUppercase = (e) => {
    e.target.value = ('' + e.target.value).toUpperCase()
  }
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }
  const showNotification = (variant: string, msg: string) => {
    setSnackbarContent({ variant, msg })
    handleClick()
  }
  const saveUploadPhoto = async (img) => {
    setOpenCrop(true)
    if (img[0]?.size > 5000000) {
      showNotification(
        'error',
        'La fotografiá adjunta no debe ser mayor a 5MB'
      )
      return
    }
    let src = null
    if (img) {
      src = await getBase64(img[0])
    }
    if (src) {
      setImageSrc(src)
    }
  }

  const handleCrop = async (img) => {
    setOpenCrop(false)

    setImageSrc(null)
    setImage({ url: img })
  }

  const handleClose = () => {
    setImageSrc(null)
    setOpenCrop(false)
  }
  return (
    <Wrapper>
      <NavigationContainer
        goBack={props.handleBack}
      />
      <BoxForm>
        <FormTitle>{t('configuracion>superviciones_circuitales>agregar>informacion_general', 'Información general')}</FormTitle>
        <Form>
          <Row>
            <Col lg={6}>
              <FormGroup className='fied-upload'>
                <label htmlFor='profilePic'>
                  {!image.url
                    ? (
                    <div
                    style={{
											  width: '8rem',
											  height: '8rem'
                  }}
                    className='fileinput-button'
                  >
                    <IconAdd />
                  </div>
                      )
                    : (
                    <Avatar
                    className='fileinput-button__avatar'
                    src={image.url}
                  />
                      )}
                </label>
                <input
                  style={{ display: 'none' }}
                  disabled={!props.editable}
                  onChange={(e) => {
									  saveUploadPhoto(e.target.files)
                  }}
                  accept='image/*'
                  type='file'
                  name='profilePic'
                  className='fileinput-button__input'
                  id='profilePic'
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup>
                <Label>{t('configuracion>superviciones_circuitales>agregar>estado', 'Estado')}</Label>
                <Controller
                  as={
                    <Select
                    className='select-rounded react-select'
                    classNamePrefix='select-rounded react-select'
                    placeholder=''
                    options={estadosarray}
                    isDisabled={!props.editable}
                  />
									}
                  name='esActivo'
                  control={control}
                  rules={{ required: true }}
                />
                {errors.esActivo && (
                  <ErrorFeedback>
                    {t('configuracion>superviciones_circuitales>agregar>estado>campo_requerido', 'Campo requerido')}
                  </ErrorFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label>{t('configuracion>superviciones_circuitales>agregar>direccion_regional', 'Dirección regional')} *</Label>
                <Controller
                  as={
                    <Select
                    className='select-rounded react-select'
                    classNamePrefix='select-rounded react-select'
                    placeholder=''
                    options={props.regionales?.map(
											  (regional) => ({
											    label: regional.nombre,
											    value: regional.id
											  })
                  )}
                    isDisabled={!props.editable}
                  />
									}
                  name='regionalesId'
                  control={control}
                  rules={{ required: true }}
                />

                {errors.regionalesId && (
                  <ErrorFeedback>
                    {t('configuracion>superviciones_circuitales>agregar>estado>campo_requerido', 'Campo requerido')}
                  </ErrorFeedback>
                )}
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label>{t('configuracion>superviciones_circuitales>agregar>nombre_oficial', 'Nombre oficial')} *</Label>
            <Input
              name='nombre'
              innerRef={register({
							  required: true,
							  minLength: 1
              })}
              disabled={!props.editable}
              onInput={toInputUppercase}
            />
            {errors.nombre && errors.nombre.type === 'required' && (
              <ErrorFeedback>
                {t('configuracion>superviciones_circuitales>agregar>estado>campo_requerido', 'Campo requerido')}
              </ErrorFeedback>
            )}
          </FormGroup>
          <FormGroup>
            <LabelRow>
              <Label>{t('configuracion>superviciones_circuitales>agregar>conocido_como', 'Conocido como')}</Label>
              <HtmlTooltip
                title={
									t('configuracion>superviciones_circuitales>agregar>conocido_como_msj', 'Digite otro nombre con el cual se conoce la Supervisión Circuital')
								}
                placement='right'
              >
                <StyledInfoOutlinedIcon className='position-absolute' />
              </HtmlTooltip>
            </LabelRow>
            <Input
              name='conocidoComo'
              innerRef={register({
							  required: false,
							  maxLength: 50
              })}
              disabled={!props.editable}
              onInput={toInputUppercase}
            />
            {errors.conocidoComo &&
							errors.conocidoComo.type === 'maxLength' && (
  <ErrorFeedback>
    {t('configuracion>superviciones_circuitales>agregar>longitud50', 'Debe tener una longitud máximo de 50 carácteres')}
  </ErrorFeedback>
            )}
          </FormGroup>
          <Row>
            <Col lg={4}>
              <FormGroup>
                <Label>{t('configuracion>superviciones_circuitales>agregar>codigo_mep', 'Código MEP')} *</Label>
                <Input
                  name='codigo'
                  readOnly={props.currentCircuito.id}
                  innerRef={register({
									  required: true,
									  maxLength: 5
                  })}
                  maxLength='5'
                  disabled={!props.editable}
                />
                {errors.codigo &&
									errors.codigo.type === 'required' && (
  <ErrorFeedback>
    {t('configuracion>superviciones_circuitales>agregar>estado>campo_requerido', 'Campo requerido')}
  </ErrorFeedback>
                )}
                {errors.codigo &&
									errors.codigo.type === 'maxLength' && (
  <ErrorFeedback>
    {t('configuracion>superviciones_circuitales>agregar>longitud5', 'Debe tener una longitud máxima de 5 carácteres')}
  </ErrorFeedback>
                )}
              </FormGroup>
            </Col>
            <Col lg={4}>
              <FormGroup>
                <Label>{t('configuracion>superviciones_circuitales>agregar>codigo_presupuestario', 'Código presupuestario')} *</Label>
                <Input
                  name='codigoPresupuestario'
                  innerRef={register({
									  required: true,
									  maxLength: 5,
									  minLength: 1
                  })}
                  maxLength='5'
                  disabled={!props.editable}
                />
                {errors.codigoPresupuestario &&
									errors.codigoPresupuestario.type ===
										'required' && (
  <ErrorFeedback>
    {t('configuracion>superviciones_circuitales>agregar>estado>campo_requerido', 'Campo requerido')}
  </ErrorFeedback>
                )}
                {errors.codigoPresupuestario &&
									errors.codigoPresupuestario.type ===
										'maxLength' && (
  <ErrorFeedback>
    {t('configuracion>superviciones_circuitales>agregar>longitud5', 'Debe tener una longitud máxima de 5 carácteres')}
  </ErrorFeedback>
                )}
              </FormGroup>
            </Col>
            <Col lg={4}>
              <FormGroup>
                <Label>{t('configuracion>superviciones_circuitales>agregar>codigo_dgsc', 'Código DGSC')} *</Label>
                <Input
                  type='number'
                  name='codigoDgsc'
                  pattern='^-?[0-9]\d*\.?\d*$'
                  color={!props.editable ? '#e9ecef' : '#fff'}
                  onKeyDown={(evt) =>
									  evt.key === 'e' && evt.preventDefault()}
                  innerRef={register({
									  required: true,
									  maxLength: 5,
									  pattern: /^[0-9]*$/,
									  minLength: 1
                  })}
                  disabled={!props.editable}
                />
                {errors.codigoDgsc && (
                  <ErrorFeedback>
                    {t('general>msj_error>long_max_5_num', 'Solo se admiten 5 numeros')}
                  </ErrorFeedback>
                )}
                {errors.codigoDgsc &&
									errors.codigoDgsc.type === 'pattern' && (
  <ErrorFeedback>
    {t('general>msj_error>solo_nums', 'Solo se permiten números')}
  </ErrorFeedback>
                )}
              </FormGroup>
            </Col>
          </Row>
        </Form>
        {props.loading
          ? (
            <Loading>
              <span className='single-loading' />
            </Loading>
            )
          : null}
      </BoxForm>
      <Actions>
        {!props.editable
          ? (
            <>
              {hasEditAccess
                ? (
                  <ActionButton onClick={props.handleEdit}>
                    {t('general>editar', 'Editar')}
                  </ActionButton>
                  )
                : null}
            </>
            )
          : (
            <>
              <BackButton onClick={props.handleBack}>
                {t('general>cancelar', 'Cancelar')}
              </BackButton>
              <ActionButton onClick={handleSubmit(onSubmit)}>
                {Object.keys(props.currentCircuito).length === 0
							  ? t('general>guardar', 'Guardar')
							  : t('general>guardar', 'Guardar')}
              </ActionButton>
            </>
            )}
      </Actions>
      <Modal
        openDialog={openCrop}
        onClose={handleClose}
        txtBtn='Guardar'
        title='Editar foto'
        actions={false}
      >
        <ContainerWebCam>
          <Cropper
            handleClose={handleClose}
            handleCrop={handleCrop}
            txtbtn='Cortar'
            image={imageSrc}
            format={cropFormat}
          />
        </ContainerWebCam>
      </Modal>
    </Wrapper>
  )
}

const ContainerWebCam = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-flow: column;
	min-width: 600px;
`

const Wrapper = styled.div`
	margin-top: 5px;
`

const BoxForm = styled.div`
	border-radius: calc(0.85rem - 1px);
	box-shadow: 0 1px 15px rgba(0, 0, 0, 0.04), 0 1px 6px rgba(0, 0, 0, 0.04);
	background: #fff;
	padding: 1.65rem;
	margin-top: 20px;
	width: 50%;
	position: relative;
	@media (max-width: 768px) {
		width: 100%;
	}
`

const Loading = styled.div`
	width: 100%;
	min-height: 381px;
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

const FormTitle = styled.h4`
	color: #000;
`

const Form = styled.form`
	margin-top: 10px;
`

const IconAdd = styled(AddIcon)`
	font-size: 70px !important;
`

const ErrorFeedback = styled.span`
	color: #bd0505;
	right: 0;
	font-weight: bold;
	font-size: 9px;
	position: absolute;
	padding-top: 3px;
`

const Actions = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20px;
`

const BackButton = styled.button`
	background: transparent;
	border: 1px ${colors.secondary} solid;
	border-radius: 30px;
	color: ${colors.primary};
	padding: 9px 15px;
	cursor: pointer;
	margin-right: 5px;
`

const ActionButton = styled.button`
	background: ${colors.primary};
	border: 1px ${colors.primary} solid;
	border-radius: 30px;
	color: #fff;
	border: 0;
	padding: 9px 15px;
	cursor: pointer;
`

const LabelRow = styled.div`
	flex-direction: row;
	align-items: center;
`

const StyledInfoOutlinedIcon = styled(InfoOutlinedIcon)`
	top: -5px;
	margin-left: 4px;
`

export default General
