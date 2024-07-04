import Grid from '@material-ui/core/Grid'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import React from 'react'
import { Col, Row } from 'reactstrap'
import {
	crearIdentidadPersona,
	getIdentificacionPersona,
	verificarPhoto
} from 'Redux/identidad/actions'
import styled from 'styled-components'

import Nav from './NavRegistrarPersona'
import WizardRegistrar from './wizardRegistrar'

type IProps = {
	handlePrint?: any
}

type SnackbarConfig = {
	variant: string
	msg: string
}
type FIleUpload = {
	base64: string
	tipoDocumentoAprobatorio: number
	nombreDocumento: string
}

const RegistrarPersona: React.FC<IProps> = props => {
	const [selectedType, setSelectedType] = React.useState<any>({
		name: 'cedula',
		id: 1
	})
	const [snackbar, handleClick] = useNotification()
	const [snackBarContent, setSnackbarContent] = React.useState<SnackbarConfig>({
		variant: '',
		msg: ''
	})

	const actions = useActions({
		getIdentificacionPersona,
		crearIdentidadPersona,
		verificarPhoto
	})

	const handleCreate = async (dataForm: any, photo: string, files: any[]) => {
		const dta = {
			tipoIdentificacionId: dataForm.tipoIdentificacionId,
			identificacion: dataForm.identificacion,
			nacionalidadId: dataForm.nacionalidadId,
			nombre: dataForm.nombre,
			primerApellido: dataForm.primerApellido,
			segundoApellido: dataForm.segundoApellido,
			conocidoComo: dataForm.conocidoComo,
			fechaNacimiento: dataForm.fechaNacimiento,
			sexoId: dataForm.sexoId,
			generoId: dataForm.generoId,
			tipoDimexId: dataForm.tipoDimex?.id,
			tipoYisroId: dataForm.tipoYisroId,
			forzar: true,
			continuarRegistroYisro: dataForm.continuarRegistroYisro,
			imagenBase64: photo ? photo.split(',')[1] : '',

			documentosAprobatorios: files
		}

		try {
			let res: any = {}
			res = await actions.crearIdentidadPersona(dta)
			return res
		} catch (error) {
			return { error: true, message: 'Oops! Algo ha salido mal, Inténtelo luego' }
		}
	}

	const selectNav = nav => {
		setSelectedType(nav)
	}

	return (
		<Wrapper>
			{snackbar(snackBarContent.variant, snackBarContent.msg)}
			<Grid container spacing={3}>
				<Grid item xs={12} md={5}>
					<Nav setSelectedType={selectNav} selectedType={selectedType} />
				</Grid>

				<Grid item xs={12} md={7}>
					<ContentRow>
						<Col lg={10}>
							<Card className='bg-white__radius'>
								<WizardRegistrar
									sendData={handleCreate}
									selectedType={selectedType}
									setSelectedType={setSelectedType}
								/>
							</Card>
						</Col>
					</ContentRow>
				</Grid>
			</Grid>
		</Wrapper>
	)
}

const ContentRow = styled(Row)`
	margin-bottom: 50px;
`
const Wrapper = styled.div`
	margin-top: 5px;
`
const Card = styled.div``

export default RegistrarPersona
