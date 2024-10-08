import React, { useState, useEffect, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { Button, FormGroup, Label, Input, FormFeedback } from 'reactstrap'
import Redes from './_partials/RedesSociales'
import * as contactActions from 'Redux/expedienteEstudiante/informacionContacto/actions'
import { connect } from 'react-redux'
import useNotification from 'Hooks/useNotification'
import { withRouter } from 'react-router-dom'
import Loader from '../../../../../../components/Loader'
import ReactInputMask from 'react-input-mask'
import withAuthorization from '../../../../../../Hoc/withAuthorization'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { envVariables } from '../../../../../../constants/enviroment'
import RequiredSpan from '../../../../../../components/Form/RequiredSpan'
import moment from 'moment'

const useStyles = makeStyles(theme => ({
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

const InformacionContacto = props => {
	const { t } = useTranslation()

	const classes = useStyles()
	const [snakbar, handleClick] = useNotification()
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

	useEffect(() => {
		axios
			.get(
				`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Contacto/${props.expedienteEstudiantil.currentStudent.idEstudiante}`
			)
			.then(r => {
				setFormState({
					...props.informacionContacto.contactInformation,
					...r.data
				})
				setErrorFields(props.informacionContacto.errorFields)
				setErrorMessages(props.informacionContacto.errorMessages)
			})
	}, [props.informacionContacto, editable])

	const onSubmit = useCallback(
		async e => {
			e.preventDefault()
			props
				.updateInformationContactFromUser(
					props.expedienteEstudiantil.currentStudent.idEstudiante,
					formState
				)
				.then(() => {
					setSnackbarVariant('success')
					setSnackbarMsg(t('general>success_act', 'Se actualizo correctamente'))
					handleClick()
					setEditable(false)
				})
				.catch(() => {
					setSnackbarVariant('error')
					setSnackbarMsg(
						t('general>error_act', 'Ocurrio un error al actualizar')
					)
					handleClick()
				})
		},
		[formState]
	)

	const handleInputChange = ({ target }) => {
		if (editable) {
			setFormState({ ...formState, [target.name]: target.value })
		}
	}

	return (
		<Grid container className={classes.root} spacing={2}>
			{loading ? (
				<Loader />
			) : (
				<>
					{snakbar(snackbarVariant, snackbarMsg)}
					<Grid item md={6} xs={12}>
						<Paper className={classes.paper}>
							<Grid container>
								<Grid item xs={12} className={classes.control}>
									<h4>
										{t(
											'expediente_ce>informacion_general>informacion',
											'Información de contacto'
										)}
									</h4>
								</Grid>
								<Grid item xs={12} className={classes.control}>
									<FormGroup>
										<Label>
											{t(
												'estudiantes>expediente>contacto>info_cont>tel_prin',
												'Teléfono principal'
											)}{' '}
											<RequiredSpan />
										</Label>
										<ReactInputMask
											mask="9999-9999"
											type="text"
											name="telefono"
											id="telefono"
											placeholder="8888-8888"
											value={formState.telefono}
											disabled={!editable}
											onChange={handleInputChange}
											invalid={errorFields.Telefono}
										>
											{inputProps => (
												<Input {...inputProps} disabled={!editable} />
											)}
										</ReactInputMask>
										<FormFeedback>{errorMessages.Telefono}</FormFeedback>
									</FormGroup>

									<FormGroup>
										<Label>
											{t(
												'estudiantes>expediente>contacto>info_cont>tel_alter',
												'Teléfono alternativo'
											)}
										</Label>
										<ReactInputMask
											mask="9999-9999"
											type="text"
											name="telefonoSecundario"
											id="telefonoSecundario"
											placeholder="8888-8888"
											value={formState.telefonoSecundario}
											disabled={!editable}
											onChange={handleInputChange}
											invalid={errorFields.TelefonoSecundario}
										>
											{inputProps => (
												<Input {...inputProps} disabled={!editable} />
											)}
										</ReactInputMask>
										<FormFeedback>
											{errorMessages.TelefonoSecundario}
										</FormFeedback>
									</FormGroup>
									<FormGroup>
										<Label for="emailSecundario">
											{t(
												'estudiantes>expediente>contacto>info_cont>correo_per',
												'Correo electrónico personal'
											)}
										</Label>
										<Input
											type="email"
											name="emailSecundario"
											id="emailSecundario"
											placeholder="correo@gmail.com"
											onChange={handleInputChange}
											disabled={!editable}
											value={formState.emailSecundario}
											invalid={errorFields.EmailSecundario}
										/>
										<FormFeedback>{errorMessages.Email}</FormFeedback>
									</FormGroup>
									<FormGroup>
										<Label for="email">
											{t(
												'estudiantes>expediente>contacto>info_cont>correo_inst',
												'Correo electrónico institucional'
											)}
										</Label>
										<Input
											type="email"
											name="email"
											id="email"
											placeholder="correo@est.mep.go.cr"
											onChange={handleInputChange}
											disabled
											value={formState.email}
										/>
									</FormGroup>
								</Grid>
							</Grid>
						</Paper>
					</Grid>

					<Grid item md={6} xs={12}>
						<Paper className={classes.paper}>
							<Grid container>
								<Grid item xs={12} className={classes.control}>
									<h4>
										{t(
											'expediente_ce>informacion_general>informacion>redes',
											'Redes sociales'
										)}
									</h4>
								</Grid>
								{moment().diff(
									props.expedienteEstudiantil.currentStudent.fechaNacimiento,
									'years'
								) > 12 ? (
									<>
										<Grid item xs={12} className={classes.control}>
											<span>
												Esta información solamente debe completarse en caso
												necesario y no es un requisito indispensable.
											</span>
										</Grid>
										<Grid item xs={12} className={classes.control}>
											<Redes
												hasEditable={editable}
												handleInputChange={handleInputChange}
												formState={formState}
											/>
										</Grid>
									</>
								) : (
									<Grid item xs={12} className={classes.control}>
										<span>
											Estos campos solo se pueden llenar en mayores de 12 años.
										</span>
									</Grid>
								)}
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
							{props.informacionContacto.contactInformation.loading ? (
								<>
									<Loader formLoader />
								</>
							) : (
								<>
									{editable ? (
										<>
											<Button
												color="secundary"
												className="btn-shadow m-0"
												type="button"
												onClick={() => {
													setEditable(false)
													props.cleanFormErrors()
												}}
											>
												{t('general>cancelar', 'Cancelar')}
											</Button>
											<Button
												color="primary"
												className="btn-shadow m-0"
												type="button"
												onClick={onSubmit}
											>
												{t('general>guardar', 'Guardar')}
											</Button>
										</>
									) : (
										<Button
											style={
												props?.validations?.modificar ? {} : { display: 'none' }
											}
											color="primary"
											className="btn-shadow m-0"
											type="button"
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

const mapStateToProps = state => ({
	informacionContacto: state.informacionContacto,
	expedienteEstudiantil: state.expedienteEstudiantil
})

export default withAuthorization({
	id: 2,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Informacion de Contacto',
	Seccion: 'Informacion de Contacto'
})(connect(mapStateToProps, contactActions)(withRouter(InformacionContacto)))
