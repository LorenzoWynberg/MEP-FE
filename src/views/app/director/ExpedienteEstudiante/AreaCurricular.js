import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'

import colors from '../../../../assets/js/colors'
import { useSelector } from 'react-redux'
import { updateCurricularArea } from '../../../../redux/identificacion/actions'
import { useActions } from '../../../../hooks/useActions'
import useNotification from '../../../../hooks/useNotification'
import { EditButton } from '../../../../components/EditButton'
import { Row, Form } from 'reactstrap'
import {
	StyledCol,
	RadioItemContainer
} from './_partials/areaCurricular/styles'
import { useForm } from 'react-hook-form'
import withAuthorization from '../../../../Hoc/withAuthorization'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		fontFamily: `"Nunito", sans-serif !important`,
		fontSize: '0.8rem',
		fontWeight: 400,
		background: '#f8f8f8',
		color: '#000'
	},
	paper: {
		minHeight: 200,
		padding: 20,
		marginLeft: 10,
		borderRadius: 20
	}
}))

const AreaCurricular = props => {
	const { t } = useTranslation()

	const { handleSubmit } = useForm()
	const state = useSelector(store => {
		return {
			identification: store.identification
		}
	})
	const classes = useStyles()
	const [religion, setReligion] = React.useState(
		state.identification.data.recibeReligion
	)
	const [program, setProgram] = React.useState(
		state.identification.data.recibeSexualidad
	)
	const [editable, setEditable] = React.useState(false)
	const [snackbarContent, setSnackbarContent] = React.useState({
		msg: '',
		variant: 'error'
	})
	const primary = colors.primary

	const actions = useActions({ updateCurricularArea })
	const [snackBar, handleClick] = useNotification()

	useEffect(() => {
		setReligion(state.identification.data.recibeReligion)
		setProgram(state.identification.data.recibeSexualidad)
	}, [
		editable,
		state.identification.data.recibeReligion,
		state.identification.data.recibeSexualidad
	])

	const uploadData = async () => {
		const _data = {
			identidadId: state.identification.data.id,
			recibeReligion: religion,
			recibeSexualidad: program
		}

		const response = await actions.updateCurricularArea(_data)
		if (response.data.error) {
			setSnackbarContent({ msg: response.data.message, variant: 'error' })
			handleClick()
		} else {
			setSnackbarContent({
				msg: 'Datos enviados exitosamente',
				variant: 'success'
			})
			handleClick()
		}
	}

	const showSnackbar = (variant, msg) => {
		setSnackbarContent({
			msg,
			variant
		})
		handleClick()
	}

	return (
		<Grid container className={classes.root} spacing={2}>
			{snackBar(snackbarContent.variant, snackbarContent.msg)}
			<Form
				onSubmit={handleSubmit(data =>
					props.authHandler('modificar', () => uploadData(data), showSnackbar)
				)}
			>
				<Grid item xs={12} lg={6}>
					<Paper className={classes.paper}>
						<Grid container>
							<Grid item xs={12} className="my-2">
								<h4>
									{t(
										'estudiantes>expediente>area_curric>titulo',
										'Área curricular'
									)}
								</h4>
							</Grid>
							<Grid item xs={12} className="my-2">
								<FormControl component="fieldset">
									<FormLabel component="legend">
										{t(
											'estudiantes>expediente>area_curric>educ_religiosa',
											'¿Recibe Educación Religiosa?'
										)}
									</FormLabel>
									<RadioGroup aria-label="religion" name="religion" row>
										<RadioItemContainer>
											<Radio
												disabled={!editable}
												style={{ color: primary }}
												onClick={() => setReligion(true)}
												checked={religion}
											/>
											<span>{t('general>si', 'Si')}</span>
										</RadioItemContainer>
										<RadioItemContainer>
											<Radio
												disabled={!editable}
												style={{ color: primary }}
												onClick={() => setReligion(false)}
												checked={!religion}
											/>
											<span>{t('general>no', 'No')}</span>
										</RadioItemContainer>
									</RadioGroup>
								</FormControl>
							</Grid>
							<Grid item xs={12} className="my-2">
								<FormControl component="fieldset">
									<FormLabel component="legend">
										{t(
											'estudiantes>expediente>area_curric>afectividad_sexualidad',
											'¿Recibe el programa de Educación para la Afectividad y Sexualidad Integral?'
										)}
									</FormLabel>
									<RadioGroup
										aria-label="program"
										name="program"
										value={program}
										row
									>
										<RadioItemContainer>
											<Radio
												disabled={!editable}
												style={{ color: primary }}
												onClick={() => setProgram(true)}
												checked={program}
											/>
											<span>{t('general>si', 'Si')}</span>
										</RadioItemContainer>
										<RadioItemContainer>
											<Radio
												disabled={!editable}
												style={{ color: primary }}
												onClick={() => setProgram(false)}
												checked={!program}
											/>
											<span>{t('general>no', 'No')}</span>
										</RadioItemContainer>
									</RadioGroup>
								</FormControl>
							</Grid>
						</Grid>
					</Paper>
					<Row>
						<StyledCol xs={12}>
							<EditButton
								loading={state.identification.loading}
								setEditable={setEditable}
								editable={editable}
							/>
						</StyledCol>
					</Row>
				</Grid>
			</Form>
		</Grid>
	)
}

export default withAuthorization({
	id: 10,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Area Curricular',
	Seccion: 'Area Curricular'
})(AreaCurricular)
