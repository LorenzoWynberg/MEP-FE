import React, { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap'
import styled from 'styled-components'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import VisibilityIcon from '@material-ui/icons/Visibility'
import colors from 'Assets/js/colors'
import { GithubPicker } from 'react-color'
import swal from 'sweetalert'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import {
  getOneTheme,
  saveTheme,
  updateTheme,
  cleanCurrentForm
} from '../../../../redux/Temas/actions'
import { withRouter } from 'react-router-dom'
import ResponseForm from '../../FormResponse'
import Loader from '../../../../components/LoaderContainer'
import BackIcon from '@material-ui/icons/ArrowBackIos'
import { useTranslation } from 'react-i18next'

import creadorDeFormulariosItems from 'Constants/creadorDeFormulariosItems'

type IProps = {}

const Edit: React.FC<IProps> = (props) => {
  const [openPrimaryColorPicker, setOpenPrimaryColorPicker] = useState(false)
  const [primaryColor, setPrimaryColor] = useState(null)
  const [secondaryColor, setSecondaryColor] = useState(null)
  const { t } = useTranslation()
  const [uploadImage, setUploadImage] = useState()
  const [colorsError, setColorsError] = useState(false)
  const [fontFamily, setFontFamily] = useState(null)
  const [nombre, setNombre] = useState('')
  const [openSecondaryColorPicker, setOpenSecondaryColorPicker] =
		useState(false)
  const [preview, setPreview] = useState(false)
  const [loading, setLoading] = useState(false)
  const actions = useActions({
    saveTheme,
    getOneTheme,
    updateTheme,
    cleanCurrentForm
  })
  const state = useSelector((store) => store.temas)

  const popover = {
    position: 'absolute',
    zIndex: '2'
  }
  useEffect(() => {
    if (secondaryColor && primaryColor == secondaryColor) {
      swal({
        title: t('formularios>crear_tema>color_texto', 'El color del texto no puede ser igual al de primario'),
        icon: 'warning',
        className: 'text-alert-modal',
        buttons: {
          ok: {
            text: t('formularios>crear_formulario>aceptar', 'Aceptar'),
            value: true,
            className: 'btn-alert-color'
          }
        }
      }).then((result) => {
        if (result) {
          setColorsError(true)
        }
      })
    }
  }, [primaryColor, secondaryColor])

  useEffect(() => {
    if (!props.create) {
      actions.getOneTheme(props.match.params.themeId)
    } else {
      actions.cleanCurrentForm()
    }
  }, [])

  useEffect(() => {
    setUploadImage({ preview: state?.currentTheme?.imagenFondo })
    setNombre(state?.currentTheme?.nombre || '')
    setPrimaryColor(state?.currentTheme?.color || '')
    setSecondaryColor(state?.currentTheme?.colorTexto || '')
    setFontFamily(state?.currentTheme?.font)
  }, [state?.currentTheme?.temaId])

  const sendData = async () => {
    setLoading(true)
    let response
    if (state?.currentTheme?.temaId) {
      if (uploadImage && uploadImage.raw) {
        const data = new FormData()
        data.append('Nombre', nombre)
        data.append(
          'Color',
          primaryColor || colors.primary
        )
        data.append('Font', fontFamily)
        data.append('ColorTexto', secondaryColor || null)
        data.append('ImagenFondo', uploadImage.raw)
        response = await actions.updateTheme(
          data,
          state?.currentTheme?.temaId,
          true
        )
      } else {
        const data = {
          Nombre: nombre,
          Color: primaryColor,
          Font: fontFamily,
          ColorTexto: secondaryColor,
          ImagenFondo: uploadImage ? uploadImage.preview : null
        }
        response = await actions.updateTheme(
          data,
          state?.currentTheme?.temaId
        )
      }
    } else {
      if (uploadImage && uploadImage.raw) {
        const data = new FormData()
        data.append('Nombre', nombre)
        data.append(
          'Color',
          primaryColor || colors.primary
        )
        data.append('Font', fontFamily)
        data.append('ColorTexto', secondaryColor || null)
        data.append('ImagenFondo', uploadImage.raw)
        response = await actions.saveTheme(data, true)
      } else {
        const data = {
          Nombre: nombre,
          Color: primaryColor,
          Font: fontFamily,
          ColorTexto: secondaryColor || null,
          ImagenFondo: uploadImage ? uploadImage.preview : null
        }
        response = await actions.saveTheme(data)
      }
    }
    setLoading(false)
    if (!response.error) {
      props.history.push('/forms/themes')
      actions.cleanCurrentForm()
    }
  }

  if (preview) {
    return (
      <ResponseForm
        allowGoBack
        {...props}
        setPreview={setPreview}
        previewTheme
        theme={{
				  nombre,
				  color: primaryColor,
				  font: fontFamily,
				  colorTexto: secondaryColor || null,
				  imagenFondo: uploadImage ? uploadImage.preview : null
        }}
      />
    )
  }
  const newMenus = creadorDeFormulariosItems.map((el) => ({
    ...el,
    label: t(`formularios>navigation>${el?.id}`, el?.label)
  }))
  return (
    <AppLayout items={newMenus}>
      <div className='dashboard-wrapper'>
        <Container>
          <Row>
            <button
              onClick={() => {
							  console.clear()
							  console.log('click...')

							  props.history.push('/forms/themes')
              }}
              style={{
							  padding: '0',
							  margin: '0',
							  background: 'unset',
							  border: 'none'
              }}
            >
              <Back
                style={{ cursor: 'pointer' }}
                onClick={() => {
								  props.history.push('/forms/themes')
                }}
              >
                <BackIcon />
                <BackTitle>{t('formularios>crear_formulario>regresar', 'Regresar')}</BackTitle>
              </Back>
            </button>
          </Row>
          <Row>
            <Col xs='12'>
              <h1 style={{ fontWeight: 'bold' }}>Temas</h1>
            </Col>
            <Col xs='12'>
              <h2>{t('formularios>crear_tema>personalizar', 'Personalizar')}</h2>
            </Col>
            <Col xs='12'>
              <ConfigsContainer>
                {loading && <Loader />}
                <Row>
                  <Col xs='12' md='6'>
                    <ThemeItemContainer>
                    <FormGroup
                    style={{ width: '100%' }}
                  >
                    <Label>{t('formularios>crear_tema>nombre', 'Nombre del tema')}</Label>
                    <Input
                    value={nombre}
                    onChange={(e) =>
													  setNombre(
													    e.target.value
													  )}
                    type='text'
                  />
                  </FormGroup>
                  </ThemeItemContainer>
                    <ThemeItemContainer>
                    <FormGroup
                    style={{ width: '100%' }}
                  >
                    <Label>{t('formularios>crear_tema>fuente', 'Fuente')}</Label>
                    <Input
                    type='select'
                    style={{
													  fontFamily: fontFamily || ''
                  }}
                    value={fontFamily}
                    onChange={(e) => {
													  setFontFamily(
													    e.target.value
													  )
                  }}
                  >
                    <option
                    selected={!fontFamily}
                    style={{
														  display: 'none'
                  }}
                  />
                    {[
													  {
													    label: t('formularios>crear_tema>font>arial', 'Arial'),
													    value: 'Arial'
													  },
													  {
													    label: t('formularios>crear_tema>font>verdana', 'Verdana'),
													    value: 'Verdana'
													  },
													  {
													    label: t('formularios>crear_tema>font>trebuchet', 'Trebuchet MS'),
													    value: 'Trebuchet MS'
													  },
													  {
													    label: t('formularios>crear_tema>font>times_new_roman', 'Times New Roman'),
													    value: 'Times New Roman'
													  },
													  {
													    label: t('formularios>crear_tema>font>didot', 'Didot'),
													    value: 'Didot'
													  },
													  {
													    label: t('formularios>crear_tema>font>georgia', 'Georgia'),
													    value: 'Georgia'
													  },
													  {
													    label: t('formularios>crear_tema>font>courier', 'Courier'),
													    value: 'Courier'
													  },
													  {
													    label: t('formularios>crear_tema>font>lucid_console', 'Lucid Console'),
													    value: 'Lucid Console'
													  },
													  {
													    label: t('formularios>crear_tema>font>monaco', 'Mónaco'),
													    value: 'Mónaco'
													  }
                  ].map((el) => {
													  return (
  <option
    value={el.value}
    style={{
																  fontFamily:
																		el.label
    }}
  >
    {el.label}
  </option>
													  )
                  })}
                  </Input>
                  </FormGroup>
                  </ThemeItemContainer>
                    <ThemeItemContainer>
                    <p>{t('formularios>crear_tema>color_primario', 'Color primario')}</p>
                    <div
                    style={{ position: 'relative' }}
                  >
                    <div
                    style={{
													  padding: '7px',
													  border: '1px solid #eaeaea',
													  borderRadius: '5px',
													  display: 'flex',
													  justifyContent:
															'space-between',
													  alignItems: 'center'
                  }}
                    onClick={() => {
													  setOpenPrimaryColorPicker(
													    !openPrimaryColorPicker
													  )
													  setOpenSecondaryColorPicker(
													    false
													  )
                  }}
                  >
                    <div
                    style={{
														  backgroundColor:
																primaryColor || colors.primary,
														  height: '1rem',
														  width: '1rem',
														  marginLeft: '10px'
                  }}
                  />
                  </div>
                    {openPrimaryColorPicker && (
                    <div style={popover}>
                    <GithubPicker
                    colors={[
															  '#09243B',
															  '#0C3354',
															  '#10436E',
															  '#145388',
															  '#1862A1',
															  '#1B71BA',
															  '#1F81D4',
															  '#2391ED'
                  ]}
                    color={
																primaryColor || colors.primary
															}
                    onChange={(
															  color,
															  event
                  ) => {
															  setOpenPrimaryColorPicker(
															    !openPrimaryColorPicker
															  )
															  setPrimaryColor(
															    color.hex
															  )
                  }}
                  />
                  </div>
                  )}
                  </div>
                  </ThemeItemContainer>
                  </Col>
                  <Col xs='12' md='6'>
                    <ThemeItemContainer>
                    <p>{t('formularios>crear_tema>color_texto_title', 'Color de texto')}</p>
                    <div
                    style={{ position: 'relative' }}
                  >
                    <div
                    style={{
													  padding: '7px',
													  border: '1px solid #eaeaea',
													  borderRadius: '5px',
													  display: 'flex',
													  justifyContent:
															'space-between',
													  alignItems: 'center'
                  }}
                    onClick={() => {
													  setOpenSecondaryColorPicker(
													    !openSecondaryColorPicker
													  )
													  setOpenPrimaryColorPicker(
													    false
													  )
                  }}
                  >
                    <div
                    style={{
														  backgroundColor:
																secondaryColor || '#000',
														  height: '1rem',
														  width: '1rem',
														  marginLeft: '10px'
                  }}
                  />
                  </div>
                    {openSecondaryColorPicker && (
                    <div style={popover}>
                    <GithubPicker
                    color={
																secondaryColor || '#000'
															}
                    colors={[
															  '#333333',
															  '#000000',
															  '#707070'
                  ]}
                    onChange={(
															  color,
															  event
                  ) => {
															  setSecondaryColor(
															    color.hex
															  )
															  setOpenSecondaryColorPicker(
															    !openSecondaryColorPicker
															  )
                  }}
                  />
                  </div>
                  )}
                  </div>
                  </ThemeItemContainer>
                    <ThemeItemContainer>
                    <p>{t('formularios>crear_tema>imagen_fondo', 'Imagen de fondo')}</p>
                    <div
                    style={{
												  display: 'flex',
												  alignItems: 'center'
                  }}
                  >
                    {uploadImage
                    ? (
                    <div
                    style={{
														  height: '4rem',
														  width: '4rem',
														  backgroundImage: `url("${uploadImage.preview}")`,
														  backgroundRepeat:
																'no-repeat',
														  backgroundSize:
																'cover',
														  backgroundPosition:
																'center',
														  marginRight: '1rem'
                  }}
                  />
                      )
                    : (
                    <DownloadIconContainer>
                    <i
                    className='simple-icon-cloud-upload'
                  />
                  </DownloadIconContainer>
                      )}
                    <label htmlFor='backgroundImage'>
                    <input
                    onChange={(e) => {
														  setUploadImage({
														    preview:
																	URL.createObjectURL(
																	  e.target
																	    .files[0]
																	),
														    raw: e.target
														      .files[0]
														  })
                  }}
                    id='backgroundImage'
                    name='backgroundImage'
                    type='file'
                    style={{
														  display: 'none'
                  }}
                    accept={'image/*'}
                  />
                    <FileLabel>
                    {uploadImage?.preview
														  ? t('formularios>crear_tema>cambiar', 'Cambiar')
														  : t('formularios>crear_tema>subir', 'Subir una')}{' '}
                    {t('formularios>crear_tema>imagen', 'imagen')}
													</FileLabel>
                  </label>
                  </div>
                  </ThemeItemContainer>
                    <ThemeItemContainerEnd>
                    <span
                    style={{
												  color: colors.primary,
												  padding: '2px',
												  display: 'flex',
												  alignItems: 'center',
												  cursor: 'pointer'
                  }}
                    onClick={() => {
												  setPreview(true)
                  }}
                  >
  {t('formularios>crear_tema>previsualizar', 'Previsualizar')}{'  '}
                    <VisibilityIcon />
                  </span>
                    <Button
                    outline
                    color='primary'
                    style={{
												  marginRight: '10px',
												  marginLeft: '10px'
                  }}
                    onClick={() => {
												  props.history.push(
												    '/forms/themes'
												  )
                  }}
                  >
  {t('formularios>crear_formulario>configuracion>cancelar', 'Cancelar')}
                  </Button>
                    <Button
                    color='primary'
                    onClick={() => {
												  sendData()
                  }}
                  >
  {t('formularios>crear_formulario>guardar', 'Guardar')}
                  </Button>
                  </ThemeItemContainerEnd>
                  </Col>
                </Row>
              </ConfigsContainer>
            </Col>
          </Row>
        </Container>
      </div>
    </AppLayout>
  )
}

const ThemeItemContainer = styled.div`
	display: flex;
	justify-content: space-between;
	border-bottom: 1px solid #eaeaea;
	padding: 20px;
	align-items: center;
	position: relative;
`

const ThemeItemContainerEnd = styled.div`
	display: flex;
	justify-content: flex-end;
	padding: 10px;
`

const ConfigsContainer = styled.div`
	border: 1px solid gray;
	background-color: white;
	width: 100%;
	border-radius: 15px;
	padding: 1rem;
`
const DownloadIconContainer = styled.span`
	font-size: 35px;
	color: ${colors.primary};
	padding: 10px;
`

const FileLabel = styled.div`
	background-color: white;
	color: ${colors.primary};
	border: 1.5px solid ${colors.primary};
	width: 7rem;
	height: 2.7rem;
	text-align: center;
	justify-content: center;
	align-items: center;
	display: flex;
	border-radius: 26px;
	&:hover {
		background-color: ${colors.primary};
		color: white;
	}
`
const Back = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 0 5px;
	margin-bottom: 20px;
`

const BackTitle = styled.span`
	color: #000;
	font-size: 14px;
	font-size: 16px;
`
export default withRouter(Edit)
