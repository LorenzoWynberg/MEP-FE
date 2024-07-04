import React, { useEffect, useState } from 'react'
import { Col, Row, Input, Label } from 'reactstrap'
import AddIcon from '@material-ui/icons/AddAPhoto'
import styled from 'styled-components'
import colors from '../../../../assets/js/colors'
import { useForm } from 'react-hook-form'
import { CurrentCircuito } from '../../../../types/configuracion'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import { Tooltip, withStyles, Avatar, Checkbox } from '@material-ui/core'
import NavigationContainer from '../../../../components/NavigationContainer'
import useNotification from 'Hooks/useNotification'

import { WebMapView } from '../../director/ExpedienteEstudiante/_partials/contacto/MapView'
import HTMLTable from 'Components/HTMLTable'
import { useTranslation } from 'react-i18next'
const Contacto = React.lazy(() => import('./FichaContacto'))
type IProps = {
	currentCircuito: CurrentCircuito | any
	handleBack: Function
	loading: boolean
	editable: boolean
	hasEditAccess: boolean
}
type SnackbarConfig = {
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

const UbicacionGeografica = (props) => {
  const { t } = useTranslation()
  const [location, setLoacation] = useState([])
  useEffect(() => {
    const loadData = async () => {
      try {
        const province = await axios.get(
					`${envVariables.BACKEND_URL}/api/Provincia/GetById/${props.locationForm['b9876ee4-c219-ff5e-9981-bf3f8425d241']}`
        )
        const canton = await axios.get(
					`${envVariables.BACKEND_URL}/api/Canton/GetById/${props.locationForm['af473821-026e-9a0d-9195-423ee96d9450']}`
        )
        const distrito = await axios.get(
					`${envVariables.BACKEND_URL}/api/Distrito/GetById/${props.locationForm['7a825880-c38d-d0ab-7603-244423aef4d5']}`
        )
        const poblado = await axios.get(
					`${envVariables.BACKEND_URL}/api/Poblado/GetById/${props.locationForm['d329e0a2-9322-9a4d-4a3f-ef35dc49892d']}`
        )
        setLoacation([
          province.data.nombre,
          canton.data.nombre,
          distrito.data.nombre,
          poblado.data.nombre
        ])
      } catch (err) {
        setLoacation([
          'Sin definir',
          'Sin definir',
          'Sin definir',
          'Sin definir'
        ])
      }
    }
    loadData()
  }, [props.locationForm])
  const long = '07701069-2859-9339-c01e-a30f0b97ce86'
  const lat = 'd76f4ce6-5424-28e6-a236-58d3774ac9bc'

  React.useEffect(() => {
    if (props.search) {
      props.search.search(`${location.join(',')}, CRI`)
    }
  }, [props.search])

  return (
    <Card className='bg-white__radius'>
      <CardTitle>{t('supervision_circ>ver>ubi_geo', 'Ubicación geográfica')}</CardTitle>
      <Form>
        <Row>
          <Col>
            <FormGroup>
              <Label>{t('supervision_circ>ver>provincia', 'Provincia')}</Label>
              <Input
                name='provincia'
                readOnly
                value={location[0]}
              />
            </FormGroup>
            <FormGroup>
              <Label>{t('supervision_circ>ver>canton', 'Cantón')}</Label>
              <Input
                name='canton'
                readOnly
                value={location[2]}
              />
            </FormGroup>
            <FormGroup>
              <Label>{t('supervision_circ>ver>distrito', 'Distrito')}</Label>
              <Input
                name='distrito'
                readOnly
                value={location[1]}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t('supervision_circ>ver>poblado', 'Poblado')}</Label>
              <Input
                name='poblado'
                readOnly
                value={location[3]}
              />
            </FormGroup>
          </Col>
        </Row>
        <Checkbox
          checked={props.showMap}
          color='primary'
          onClick={() => {
					  props.setShowMap(!props.showMap)
          }}
        />
        <CardLink
          style={{ cursor: 'pointer' }}
          onClick={() => {
					  props.setShowMap(!props.showMap)
          }}
        >
          {t('supervision_circ>ver>ver_dir_mapa', 'Ver dirección en mapa')}
        </CardLink>
        {props.showMap && (
          <Row>
            <Col style={{ minHeight: '496px' }} xs='12'>
              <WebMapView
                setLocation={() => {}}
                setSearch={props.setSearch}
                setUbicacion={() => {}}
                editable={false}
              />
            </Col>
            <Col xs='6'>
              <Label>{t('supervision_circ>ver>latitud', 'Latitud')}</Label>
              <Input value={props.locationForm[lat]} disabled />
            </Col>
            <Col xs='6'>
              <Label>{t('supervision_circ>ver>longitud', 'Longitud')}</Label>
              <Input value={props.locationForm[long]} disabled />
            </Col>
          </Row>
        )}
      </Form>
    </Card>
  )
}

const FichaGeneral = (props: IProps) => {
  const { t } = useTranslation()
  const [image, setImage] = React.useState({
    url: props.currentCircuito?.imagenUrl
  })
  const [currentExtentions, setCurrentExtentions] = React.useState()
  const { hasEditAccess } = props
  const [openCrop, setOpenCrop] = useState<boolean>(false)
  const [imageSrc, setImageSrc] = useState<string>(null)
  const [showMap, setShowMap] = React.useState(false)
  const [snackbar, handleClick] = useNotification()
  const [locationForm, setLocationForm] = React.useState({})
  const [search, setSearch] = React.useState(null)
  const [snackBarContent, setSnackbarContent] =
		React.useState<SnackbarConfig>({
		  variant: '',
		  msg: ''
		})

  React.useEffect(() => {
    setImage({ url: props.currentCircuito?.imagenUrl || '' })
  }, [props.currentCircuito?.imagenUrl])

  React.useEffect(() => {
    setLocationForm(
      props.currentCircuito.ubicacion
        ? JSON.parse(props.currentCircuito.ubicacion)
        : {}
    )
  }, [props.currentCircuito.ubicacion])

  const { handleSubmit, register, errors, setValue, reset } = useForm({
    defaultValues: {
      esActivo: props.currentCircuito.esActivo || 'Activo',
      nombre: props.currentCircuito.nombre || '',
      nombreSupervisor: props.currentCircuito.nombreSupervisor || ''
    }
  })

  const block = Object.keys(props.currentCircuito).length === 0

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
  console.log(props.currentCircuito, 'AAAAAAAAAAA')
  return (
    <Wrapper>
      <NavigationContainer
        goBack={props.handleBack}
      />
      <MainRow>
        <Col
          md={12}
          xl={6}
          style={{
					  paddingTop: '1.4rem',
					  paddingBottom: '0.5rem'
          }}
        >
          <Card className='bg-white__radius'>
            <CardTitle>{t('supervision_circ>ver>supervision_circ', 'Supervisión circuital')}</CardTitle>
            <Form>
              <Row>
                <Col lg={6}>
                  <FormGroup className='fied-upload'>
                    <label htmlFor='profilePic2'>
                    {!image.url
                    ? (
                    <div
                    style={{
													  width: '13rem',
													  height: '13rem'
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
                    name='profilePic2'
                    className='fileinput-button__input'
                    id='profilePic2'
                  />
                  </FormGroup>
                </Col>
                <Col lg={6}>
                  <FormGroup>
                    <Label>{t('supervision_circ>ver>dir_reg', 'Dirección regional')} </Label>
                    <InputForm
                    name='nombre'
                    color={
												!props.editable
												  ? '#e9ecef'
												  : '#fff'
											}
                    disabled={!props.editable}
                    value={
												props.currentCircuito.regional
											}
                  />
                  </FormGroup>
                  <FormGroup>
                    <Label>{t('supervision_circ>ver>nom_oficial', 'Nombre oficial')} </Label>
                    <InputForm
                    name='nombre'
                    color={
												!props.editable
												  ? '#e9ecef'
												  : '#fff'
											}
                    disabled={!props.editable}
                    value={props.currentCircuito.nombre}
                  />
                  </FormGroup>
                  <FormGroup>
                    <Label>{t('general>estado', 'Estado')}</Label>
                    <InputForm
                    name='esActivo'
                    color={
												!props.editable
												  ? '#e9ecef'
												  : '#fff'
											}
                    disabled={!props.editable}
                    value={
												props.currentCircuito.esActivo
											}
                  />
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <LabelRow>
                  <Label>
                    {t('supervision_circ>ver>nom_supervisor_circ', 'Nombre del supervisor circuital')}
                  </Label>
                </LabelRow>
                <InputForm
                  name='nombreSupervisor'
                  color={!props.editable ? '#e9ecef' : '#fff'}
                  disabled={!props.editable}
                  value={
										props.currentCircuito.nombreSupervisor
									}
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
            values={
							props.currentCircuito?.ubicacionGeograficaJson
							  ? JSON.parse(
							    props.currentCircuito
							      ?.ubicacionGeograficaJson
								  )
							  : undefined
						}
          />
        </Col>
        <Col>
          <Contacto
            {...props}
            handleBack={props.handleBack}
            currentCircuito={props.currentCircuito}
            hasEditAccess={false}
          />
        </Col>
        <Col md={6} sm={6} />
      </MainRow>
    </Wrapper>
  )
}

const MainRow = styled(Row)`
	@media (max-width: 768px) {
		width: 100%;
		display: flex;
		flex-direction: column;
	}
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
	font-size: 100px !important;
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
