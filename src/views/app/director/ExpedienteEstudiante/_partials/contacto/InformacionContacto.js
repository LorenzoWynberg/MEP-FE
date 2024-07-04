import React, { useState, useEffect, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import Fab from '@material-ui/core/Fab'

import FacebookIcon from '@material-ui/icons/Facebook'
import InstagramIcon from '@material-ui/icons/Instagram'
import WhatsAppIcon from '@material-ui/icons/WhatsApp'
import TwitterIcon from '@material-ui/icons/Twitter'

import { Button, FormGroup, Label, Input, FormFeedback } from 'reactstrap'

import Redes from './_partials/RedesSociales'
import * as contactActions from 'Redux/expedienteEstudiante/informacionContacto/actions'
import { connect } from 'react-redux'
import useNotification from 'Hooks/useNotification'
import { withRouter } from 'react-router-dom'
import Loader from '../../../../../../components/Loader'

import ReactInputMask from 'react-input-mask'
import RequiredLabel from '../../../../../../components/common/RequeredLabel'
import withAuthorization from '../../../../../../Hoc/withAuthorization'
import { useTranslation } from 'react-i18next'
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  control: {
    padding: theme.spacing(2)
  },
  paper: {
    minHeight: 475,
    padding: 20,
    marginLeft: 10,
    borderRadius: 15,
    boxShadow: '2px 2px 5px rgba(228, 226, 226, 0.856)'
  }
}))

const InformacionContacto = (props) => {
  const { t } = useTranslation()

  const classes = useStyles()
  const [snakbar, handleClick, handleClose] = useNotification()
  const [snackbarMsg, setSnackbarMsg] = useState('')
  const [snackbarVariant, setSnackbarVariant] = useState('success')
  const [editable, setEditable] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errorFields, setErrorFields] = useState(
    props.informacionContacto.errorFields
  )
  const [errorMessages, setErrorMessages] = useState(
    props.informacionContacto.errorMessages
  )

  const updateRedes = useCallback((data, action) => {
    const newRedes = redes.map((item) => {
      item.text =
				item.id === data.id ? (action ? data.textInput : '') : item.text
      return item
    })
    setRedes(newRedes)
  })

  const socialNetworks = [
    {
      id: 1,
      name: 'facebook',
      linkBase: 'https://facebook.com/',
      text: ''
    },
    {
      id: 2,
      name: 'instagram',
      linkBase: 'https://instagram.com/',
      text: ''
    },
    {
      id: 3,
      name: 'whatsapp',
      linkBase: 'https://whatsapp.com/',
      text: ''
    },
    {
      id: 4,
      name: 'twitter',
      linkBase: 'https://twitter.com/',
      text: ''
    }
  ]

  const getSocial = (social) => {
    return (
      <Fab disabled aria-label='like' className='social-button'>
        {
					{
					  1: (
  <FacebookIcon
    fontSize='large'
    className='social-icon'
  />
					  ),
					  2: (
  <InstagramIcon
    fontSize='large'
    className='social-icon'
  />
					  ),
					  3: (
  <WhatsAppIcon
    fontSize='large'
    className='social-icon'
  />
					  ),
					  4: (
  <TwitterIcon
    fontSize='large'
    className='social-icon'
  />
					  )
					}[social.id]
				}
      </Fab>
    )
  }
  const [redes, setRedes] = useState(socialNetworks)

  useEffect(() => {
    const fetchData = async () => {
      await props.getInformationContactFromUser(
        props.expedienteEstudiantil.currentStudent.idEstudiante
      )
      setLoading(false)
    }
    fetchData()
    return () => {
      props.cleanInformationContactFromUser()
    }
  }, [])

  useEffect(() => {
    setFormState(props.informacionContacto.contactInformation)

    const items = [
      {
        id: 1,
        textInput:
					props.informacionContacto.contactInformation.facebook || ''
      },
      {
        id: 2,
        textInput:
					props.informacionContacto.contactInformation.instagram || ''
      },
      {
        id: 3,
        textInput:
					props.informacionContacto.contactInformation.whatsapp || ''
      },
      {
        id: 4,
        textInput:
					props.informacionContacto.contactInformation.twitter || ''
      }
    ]

    items.forEach((element) => {
      updateRedes(element, true)
    })

    setErrorFields(props.informacionContacto.errorFields)
    setErrorMessages(props.informacionContacto.errorMessages)
  }, [props.informacionContacto, editable])

  const [formState, setFormState] = useState({
    telefono: '',
    telefonoSecundario: '',
    email: '',
    emailSecundario: '',
    facebook: '',
    twitter: '',
    instagram: '',
    whatsapp: ''
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...formState,
      facebook:
				redes.find((x) => x.id == 1).textInput ||
				redes.find((x) => x.id == 1).text,
      instagram:
				redes.find((x) => x.id == 2).textInput ||
				redes.find((x) => x.id == 2).text,
      whatsapp:
				redes.find((x) => x.id == 3).textInput ||
				redes.find((x) => x.id == 3).text,
      twitter:
				redes.find((x) => x.id == 4).textInput ||
				redes.find((x) => x.id == 4).text
    }

    const rest = await props.updateInformationContactFromUser(
      props.expedienteEstudiantil.currentStudent.idEstudiante,
      payload
    )
    if (rest.payload) {
      setSnackbarVariant('success')
      setSnackbarMsg(t('general>success_act', 'Se actualizo correctamente'))
      handleClick()
      setEditable(false)
    }

    if (rest.data && rest.data.error) {
      setSnackbarVariant('error')
      setSnackbarMsg(t('general>error_act', 'Ocurrio un error al actualizar'))
      handleClick()
    }
  }

  const handleAdd = (data) => {
    if (!data.text && !data.textInput) {
      return
    }

    if (
      data.text.trim().lenght === 0 &&
			data.textInput.trim().lenght === 0
    ) {
      return
    }

    updateRedes(data, true)
  }

  const handleDelete = (data) => {
    updateRedes(data, false)
  }

  const handleInputChange = ({ target }) => {
    if (editable) {
      setFormState({ ...formState, [target.name]: target.value })
    }
  }

  return (
    <Grid container className={classes.root} spacing={2}>
      {loading
        ? (
          <Loader />
          )
        : (
          <>
            {snakbar(snackbarVariant, snackbarMsg)}
            <Grid item md={6} xs={12}>
              <Paper className={classes.paper}>
                <Grid container>
                  <Grid item xs={12} className={classes.control}>
                    <h4>{t('expediente_ce>informacion_general>informacion', 'Información de contacto')}</h4>
                  </Grid>
                  <Grid item xs={12} className={classes.control}>
                    <FormGroup>
                    <Label>
                    * {t('estudiantes>expediente>contacto>info_cont>tel_prin', 'Teléfono principal')}
                  </Label>
                    <ReactInputMask
                    mask='9999-9999'
                    type='text'
                    name='telefono'
                    id='telefono'
                    placeholder='8888-8888'
                    value={formState.telefono}
                    disabled={!editable}
                    onChange={handleInputChange}
                    invalid={errorFields.Telefono}
                  >
                    {(inputProps) => (
                  <Input
                    {...inputProps}
                    disabled={!editable}
                  />
                )}
                  </ReactInputMask>
                    <FormFeedback>
                    {errorMessages.Telefono}
                  </FormFeedback>
                  </FormGroup>

                    <FormGroup>
                    <Label>
                    {t('estudiantes>expediente>contacto>info_cont>tel_alter', 'Teléfono alternativo')}
                  </Label>
                    <ReactInputMask
                    mask='9999-9999'
                    type='text'
                    name='telefonoSecundario'
                    id='telefonoSecundario'
                    placeholder='8888-8888'
                    value={formState.telefonoSecundario}
                    disabled={!editable}
                    onChange={handleInputChange}
                    invalid={
												errorFields.TelefonoSecundario
											}
                  >
                    {(inputProps) => (
                  <Input
                    {...inputProps}
                    disabled={!editable}
                  />
                )}
                  </ReactInputMask>
                    <FormFeedback>
                    {
												errorMessages.TelefonoSecundario
											}
                  </FormFeedback>
                  </FormGroup>

                    <FormGroup>
                    <Label>
                    *{t('estudiantes>expediente>contacto>info_cont>correo_per', 'Correo electrónico personal')}
                  </Label>
                    <Input
                    type='email'
                    name='email'
                    id='email'
                    placeholder='correo@gmail.com'
                    onChange={handleInputChange}
                    disabled={!editable}
                    value={formState.email}
                    invalid={errorFields.Email}
                  />
                    <FormFeedback>
                    {errorMessages.Email}
                  </FormFeedback>
                  </FormGroup>
                    <FormGroup>
                    <Label for='emailSecundario'>
                    {t('estudiantes>expediente>contacto>info_cont>correo_inst', 'Correo electrónico institucional')}
                  </Label>
                    <Input
                    type='email'
                    name='emailSecundario'
                    id='emailSecundario'
                    placeholder='correo@gmail.com'
                    onChange={handleInputChange}
                    disabled={!editable}
                    value={formState.emailSecundario}
                    invalid={
												errorFields.EmailSecundario
											}
                  />
                    <FormFeedback>
                    {errorMessages.EmailSecundario}
                  </FormFeedback>
                  </FormGroup>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item md={6} xs={12}>
              <Paper className={classes.paper}>
                <Grid container>
                  <Grid item xs={12} className={classes.control}>
                    <h4>{t('expediente_ce>informacion_general>informacion>redes', 'Redes sociales')}</h4>
                  </Grid>
                  <Grid item xs={12} className={classes.control}>
                    <Redes
                    hasEditable={editable}
                    socialNetworks={redes}
                    handleAdd={handleAdd}
                    handleDelete={handleDelete}
                  />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid
              item
              xs={12}
              style={{ textAlign: 'center' }}
              className={classes.control}
            >
              <Grid
                item
                xs={12}
                style={{ textAlign: 'center' }}
                className={classes.control}
              >
                {props.informacionContacto.contactInformation
							  .loading
                  ? (
                    <>
                    <Loader formLoader />
                  </>
							    )
                  : (
                    <>
                    {editable
                    ? (
                  <>
                    <Button
                    color='secundary'
                    className='btn-shadow m-0'
                    type='button'
                    onClick={() => {
												  setEditable(false)
												  props.cleanFormErrors()
                  }}
                  >
                    {t('general>cancelar', 'Cancelar')}
                  </Button>
                    <Button
                    color='primary'
                    className='btn-shadow m-0'
                    type='button'
                    onClick={onSubmit}
                  >
                    {t('general>guardar', 'Guardar')}
                  </Button>
                  </>
                      )
                    : (
                  <Button
                    color='primary'
                    className='btn-shadow m-0'
                    type='button'
                    onClick={() => {
											  setEditable(true)
                  }}
                  >
                    {t('general>editar', 'Editar')}
                  </Button>
                      )}
                  </>
							    )}
              </Grid>
            </Grid>
          </>
          )}
    </Grid>
  )
}

const mapStateToProps = (state) => ({
  informacionContacto: state.informacionContacto,
  expedienteEstudiantil: state.expedienteEstudiantil
})

export default withAuthorization({
  id: 2,
  Modulo: 'Expediente Estudiantil',
  Apartado: 'Informacion de Contacto',
  Seccion: 'Informacion de Contacto'
})(connect(mapStateToProps, contactActions)(withRouter(InformacionContacto)))
