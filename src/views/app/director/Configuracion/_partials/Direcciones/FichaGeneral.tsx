import React, { useEffect, useState } from 'react'
import {
  Col,
  Row,
  Input,
  Label,
  ModalBody,
  ModalHeader,
  Modal
} from 'reactstrap'
import AddIcon from '@material-ui/icons/AddAPhoto'
import styled from 'styled-components'
import colors from '../../../../../../assets/js/colors'
import { useForm } from 'react-hook-form'
import { CurrentRegional } from '../../../../../../types/configuracion'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import { Tooltip, withStyles, Avatar } from '@material-ui/core'
import NavigationContainer from '../../../../../../components/NavigationContainer'
import useNotification from 'Hooks/useNotification'
import LocationForm from 'Components/LocationForm'
import { useTranslation } from 'react-i18next'
const Contacto = React.lazy(() => import('./FichaContacto'))

interface IProps {
	currentRegional: CurrentRegional | any
	handleBack: Function
	loading: boolean
	editable: boolean
	hasEditAccess: boolean
}

interface SnackbarConfig {
	variant: string
	msg: string
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

const UbicacionGeografica = ({ values }) => {
  const { t } = useTranslation()
  return (
    <div className='bg-white__radius'>
      <LocationForm
        title={t('dir_regionales>ver>ubi_geo', 'Ubicación Geográfica')}
        display='vertical'
        hideButton
        readOnly
        values={values
          ? {
				  ...values,
				  longitude: values?.longitud,
				  latitude: values?.latitud
            }
          : undefined}
      />
    </div>
  )
}

const FichaGeneral = (props: IProps) => {
  const { t } = useTranslation()

  const [image, setImage] = React.useState({
    url: props.currentRegional?.imagenUrl
  })
  const [openCrop, setOpenCrop] = useState<boolean>(false)
  const [imageSrc, setImageSrc] = useState<string>(null)
  const [snackbar, handleClick] = useNotification()
  const [locationForm, setLocationForm] = React.useState({})
  const [snackBarContent, setSnackbarContent] =
		React.useState<SnackbarConfig>({
		  variant: '',
		  msg: ''
		})

  React.useEffect(() => {
    setImage({ url: props.currentRegional?.imagenUrl || '' })
  }, [props.currentRegional?.imagenUrl])

  React.useEffect(() => {
    setLocationForm(
      props.currentRegional.ubicacion
        ? JSON.parse(props.currentRegional.ubicacion)
        : {}
    )
  }, [props.currentRegional.ubicacion])

  const { handleSubmit, register, errors, setValue, reset } = useForm({
    defaultValues: {
      esActivo: props.currentRegional.esActivo || 'Activo',
      nombre: props.currentRegional.nombre || '',
      nombreDirector: props.currentRegional.nombreDirector || ''
    }
  })

  const block = Object.keys(props.currentRegional).length === 0

  const toInputUppercase = (e) => {
    e.target.value = ('' + e.target.value).toUpperCase()
  }
  const showNotification = (variant: string, msg: string) => {
    setSnackbarContent({ variant, msg })
    handleClick()
  }
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
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
      <Row>
        <Col
          md={6}
          sm={6}
          style={{
					  paddingTop: '1.4rem',
					  paddingBottom: '0.5rem'
          }}
        >
          <Card className='bg-white__radius'>
            <CardTitle>{t('dir_regionales>ver>dir_regional', 'Dirección Regional')}</CardTitle>
            <Form>
              <Row>
                <Col lg={6}>
                  <FormGroup className='fied-upload'>
                    <label htmlFor='profilePic2'>
                    {!image.url
                    ? (
                    <div
                    className='fileinput-button'
                    style={{ width: '200px', height: '200px' }}
                  >
                    <IconAdd />
                  </div>
                      )
                    : (
                    <CustomAvatar
                    className='fileinput-button__avatar'
                    src={image.url}
                  />
                      )}
                  </label>
                    <input
                    style={{ display: 'none' }}
                    disabled={!props.editable}
                    onChange={(e) => {
											  // saveUploadPhoto(e.target.files)
                  }}
                    accept='image/*'
                    type='file'
                    name='profilePic2'
                    className='fileinput-button__input'
                    id='profilePic2'
                  />
                  </FormGroup>
                </Col>
                <Col lg={6}>
                  {/* <FormGroup>
										<Label>Dirección Regional</Label>
										<InputForm
											name="esActivo"
											innerRef={register({
												required: true
											})}
											color={
												!props.editable
													? '#e9ecef'
													: '#fff'
											}
											disabled={!props.editable}
											onInput={toInputUppercase}
										/>
									</FormGroup> */}
                  <FormGroup>
                    <Label>{t('dir_regionales>ver>nom_oficial', 'Nombre oficial')} </Label>
                    <InputForm
                    name='nombre'
                    innerRef={register({
											  required: true
                  })}
                    color={!props.editable ? '#e9ecef' : '#fff'}
                    disabled={!props.editable}
                    onInput={toInputUppercase}
                  />
                  </FormGroup>
                  <FormGroup>
                    <Label>{t('dir_regionales>ver>estado', 'Estado')}</Label>
                    <InputForm
                    name='esActivo'
                    innerRef={register({
											  required: true
                  })}
                    color={
												!props.editable
												  ? '#e9ecef'
												  : '#fff'
											}
                    disabled={!props.editable}
                    onInput={toInputUppercase}
                  />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <LabelRow>
                  <Label>{t('dir_regionales>ver>nom_dir_reg', 'Nombre del Director Regional')}</Label>
                </LabelRow>
                <InputForm
                  name='nombreDirector'
                  innerRef={register({
									  required: false,
									  maxLength: 50
                  })}
                  color={!props.editable ? '#e9ecef' : '#fff'}
                  onInput={toInputUppercase}
                  disabled={!props.editable}
                />
              </FormGroup>
            </Form>

            {props.loading
              ? (
                <Loading>
                  <span className='single-loading' />
                </Loading>
                )
              : null}
          </Card>
          <UbicacionGeografica
            values={props.currentRegional?.ubicacionGeograficaJson ? JSON.parse(props.currentRegional?.ubicacionGeograficaJson) : undefined}
          />
        </Col>
        <Col md={6} sm={6}>
          <Contacto
            {...props}
            handleBack={props.handleBack}
            currentRegional={props.currentRegional}
            hasEditAccess={false}
          />
        </Col>
        <Col md={6} sm={6} />
      </Row>
    </Wrapper>
  )
}

const CustomAvatar = styled(Avatar)`
	width: 200px !important;
	height: 200px !important;
`

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

const StyledTable = styled.table`
	border-spacing: 1.8rem;
	width: 100%;
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
const Card = styled.div`
	background: #fff;
	position: relative;
`

const CardTitle = styled.h5`
	color: #000;
	margin-bottom: 10px;
`
const Form = styled.form`
	margin-bottom: 20px;
`

const FormGroup = styled.div`
	margin-bottom: 10px;
`
const CardLink = styled.a`
	color: ${colors.primary};
`

const Select = styled.select`
	background-color: ${(props) => props.color};
	&:active {
		background: #fff;
	}
`

const InputForm = styled(Input)`
	background-color: ${(props) => props.color};
	&:focus {
		background: #fff;
	}
`

const IconAdd = styled(AddIcon)`
	font-size: 50px !important;
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
	border: 1px ${colors.primary} solid;
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

export default FichaGeneral
