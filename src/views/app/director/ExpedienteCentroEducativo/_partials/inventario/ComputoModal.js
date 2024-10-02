import {
	Radio,
	RadioGroup,
	FormControl,
	FormControlLabel
} from '@material-ui/core'
import axios from 'axios'
import colors from 'assets/js/colors'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import React, { useState, useEffect } from 'react'
import { envVariables } from 'Constants/enviroment'
import OptionModal from 'Components/Modal/OptionModal'
import RequiredSpan from 'Components/Form/RequiredSpan'
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap'

const ComputoModal = ({
	open,
	handleClose,
	mode,
	initialData,
	selects,
	nombreDirector,
	idInstitucion,
	refetch
}) => {
	const [showModalEstado, setShowModalEstado] = useState(false)
	const primary = colors.primary
	const { t } = useTranslation()
	const [loading, setLoading] = useState(false)
	const [submitError, setSubmitError] = useState(null)

	const [formState, setFormState] = useState({
		...initialData,
		id: initialData?.id || null,
		condicionNombre: '',
		utilizada:
			initialData?.utilizada !== undefined ? initialData.utilizada : '',
		paraDonar: initialData?.paraDonar !== undefined ? initialData.paraDonar : ''
	})

	// State to track errors for each field
	const [errors, setErrors] = useState({})

	useEffect(() => {
		if (
			formState.sb_condicionId &&
			selects.estadoInventarioTecnologico.length
		) {
			const selectedCondicion = selects.estadoInventarioTecnologico.find(
				condicion => condicion.id === formState.sb_condicionId
			)
			if (selectedCondicion) {
				setFormState(prev => ({
					...prev,
					condicionNombre: selectedCondicion.nombre
				}))
			}
		}
	}, [formState.sb_condicionId, selects.estadoInventarioTecnologico])

	const handleCondicionChange = e => {
		const selectedId = e.target.value
		const selectedCondicion = selects.estadoInventarioTecnologico.find(
			condicion => condicion.id === parseInt(selectedId)
		)

		setFormState(prev => ({
			...prev,
			sb_condicionId: selectedId,
			condicionNombre: selectedCondicion?.nombre || ''
		}))
	}

	const handleInputChange = e => {
		const { name, value } = e.target
		let processedValue = value

		if (name === 'utilizada' || name === 'paraDonar') {
			if (value === '1') {
				processedValue = true
			} else if (value === '0') {
				processedValue = false
			} else {
				processedValue = ''
			}
		}

		setFormState(prev => ({
			...prev,
			[name]: processedValue
		}))
	}

	useEffect(() => {
		setFormState(prev => ({
			...prev,
			nombreDirector: nombreDirector
		}))
	}, [nombreDirector])

	const validateFields = () => {
		const newErrors = {}
		if (!formState.sb_tipoActivoId || formState.sb_tipoActivoId === '')
			newErrors.sb_tipoActivoId = true
		if (!formState.serie) newErrors.serie = true
		if (!formState.placa) newErrors.placa = true
		if (!formState.sb_fuenteId || formState.sb_fuenteId === '')
			newErrors.sb_fuenteId = true
		if (!formState.sb_condicionId || formState.sb_condicionId === '')
			newErrors.sb_condicionId = true
		if (!formState.sb_ubicacionId || formState.sb_ubicacionId === '')
			newErrors.sb_ubicacionId = true
		if (!formState.nombreDirector) newErrors.nombreDirector = true
		if (!formState.puestoRealizaInventario)
			newErrors.puestoRealizaInventario = true
		if (formState.utilizada === '') newErrors.utilizada = true
		if (formState.paraDonar === '') newErrors.paraDonar = true

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async () => {
		if (validateFields()) {
			setLoading(true)
			setSubmitError(null)
			try {
				const submissionData = {
					...formState,
					id: formState.id || 0,
					sb_institucionesId: idInstitucion,
					utilizada: formState.utilizada === true ? 1 : 0,
					paraDonar: formState.paraDonar === true ? 1 : 0
				}

				const response = await axios.post(
					`${envVariables.BACKEND_URL}/api/Inventario/CrearRegistroInventario`,
					submissionData
				)

				setLoading(false)
				handleClose()
				refetch()
				if (onConfirm) {
					onConfirm(response.data)
				}
			} catch (error) {
				setLoading(false)
				setSubmitError(
					error.response?.data?.message || 'Error al guardar el registro.'
				)
				console.error('Error saving data:', error)
			}
		} else {
			console.log('Validation failed:', errors)
		}
	}

	return (
		<>
			<OptionModal
				isOpen={showModalEstado}
				titleHeader={'Estado del activo'}
				onConfirm={() => setShowModalEstado(false)}
				onCancel={() => setShowModalEstado(false)}
			>
				<div>
					<FormControl component="fieldset">
						<RadioGroup
							aria-labelledby="sb_condicionId"
							name="sb_condicionId"
							value={formState.sb_condicionId || ''}
						>
							{selects.estadoInventarioTecnologico.map((item, i) => (
								<Row key={i}>
									<Col
										style={{
											display: 'flex',
											textAlign: 'left',
											justifyContent: 'left',
											alignItems: 'left'
										}}
										sm={5}
									>
										<FormControlLabel
											value={item.id}
											control={
												<Radio
													onClick={handleCondicionChange}
													checked={formState.sb_condicionId == item.id}
													style={{ color: primary }}
												/>
											}
											label={item.nombre}
										/>
									</Col>
									<Col sm={7}>{item.descripcion}</Col>
								</Row>
							))}
						</RadioGroup>
					</FormControl>
				</div>
			</OptionModal>

			<OptionModal
				isOpen={open}
				titleHeader={mode === 'add' ? 'Agregar registro' : 'Editar registro'}
				onConfirm={handleSubmit}
				onCancel={() => {
					handleClose()
					setErrors({})
					setSubmitError(null)
				}}
				textConfirm={loading ? 'Guardando...' : 'Guardar'}
				disableConfirm={loading}
			>
				<Form>
					<Row>
						<Col className={'mb-3'} md={6}>
							<FormGroup className={'mb-0'}>
								<Label for="sb_tipoActivoId">
									Tipo de activo <RequiredSpan />
								</Label>
								<StyledInput
									id="sb_tipoActivoId"
									name="sb_tipoActivoId"
									type="select"
									onChange={handleInputChange}
									value={formState.sb_tipoActivoId || ''}
									style={{
										borderColor: errors.sb_tipoActivoId ? 'red' : ''
									}}
								>
									<option value="">
										{t('general>seleccionar', 'Seleccionar')}
									</option>
									{selects.tipoActivoInventarioTecnologico.map(tipo => (
										<option key={tipo.id} value={tipo.id}>
											{tipo.nombre}
										</option>
									))}
								</StyledInput>
							</FormGroup>
						</Col>
						<Col className={'mb-3'} md={6}>
							<Label for="serie">
								Serie <RequiredSpan />
							</Label>
							<StyledInput
								id="serie"
								name="serie"
								type="text"
								placeholder="Número de serie"
								onChange={handleInputChange}
								value={formState.serie || ''}
								style={{
									borderColor: errors.serie ? 'red' : ''
								}}
							/>
						</Col>
						<Col className={'mb-3'} md={6}>
							<Label for="placa">
								Placa <RequiredSpan />
							</Label>
							<StyledInput
								id="placa"
								name="placa"
								type="text"
								placeholder="Número de placa"
								onChange={handleInputChange}
								value={formState.placa || ''}
								style={{
									borderColor: errors.placa ? 'red' : ''
								}}
							/>
						</Col>
						<Col className={'mb-3'} md={6}>
							<FormGroup className={'mb-0'}>
								<Label for="sb_fuenteId">
									Fuente <RequiredSpan />
								</Label>
								<StyledInput
									id="sb_fuenteId"
									name="sb_fuenteId"
									type="select"
									onChange={handleInputChange}
									value={formState.sb_fuenteId || ''}
									style={{
										borderColor: errors.sb_fuenteId ? 'red' : ''
									}}
								>
									<option value="">
										{t('general>seleccionar', 'Seleccionar')}
									</option>
									{selects.fuenteInventarioTecnologico.map(tipo => (
										<option key={tipo.id} value={tipo.id}>
											{tipo.nombre}
										</option>
									))}
								</StyledInput>
							</FormGroup>
						</Col>
						<Col className={'mb-3'} md={6}>
							<Label for="sb_condicionId">
								Estado <RequiredSpan />
							</Label>
							<StyledInput
								id="sb_condicionId"
								name="sb_condicionId"
								type="text"
								placeholder="Seleccionar"
								onClick={() => setShowModalEstado(true)}
								value={formState.condicionNombre || 'Seleccionar'}
								style={{
									borderColor: errors.sb_condicionId ? 'red' : ''
								}}
							/>
						</Col>
						<Col className={'mb-3'} md={6}>
							<FormGroup className={'mb-0'}>
								<Label for="sb_ubicacionId">
									Ubicación <RequiredSpan />
								</Label>
								<StyledInput
									id="sb_ubicacionId"
									name="sb_ubicacionId"
									type="select"
									onChange={handleInputChange}
									value={formState.sb_ubicacionId || ''}
									style={{
										borderColor: errors.sb_ubicacionId ? 'red' : ''
									}}
								>
									<option value="">
										{t('general>seleccionar', 'Seleccionar')}
									</option>
									{selects.ubicacionInventarioTecnologico.map(tipo => (
										<option key={tipo.id} value={tipo.id}>
											{tipo.nombre}
										</option>
									))}
								</StyledInput>
							</FormGroup>
						</Col>
						<Col className={'mb-3'} md={6}>
							<Label for="nombreDirector">
								Director <RequiredSpan />
							</Label>
							<StyledInput
								id="nombreDirector"
								name="nombreDirector"
								type="text"
								placeholder="Nombre del director"
								onChange={handleInputChange}
								value={formState.nombreDirector || ''}
								style={{
									borderColor: errors.nombreDirector ? 'red' : ''
								}}
							/>
						</Col>
						<Col className={'mb-3'} md={6}>
							<Label for="puestoRealizaInventario">
								Rol de la persona que inserta <RequiredSpan />
							</Label>
							<StyledInput
								id="puestoRealizaInventario"
								name="puestoRealizaInventario"
								type="text"
								placeholder="Director"
								onChange={handleInputChange}
								value={formState.puestoRealizaInventario || ''}
								style={{
									borderColor: errors.puestoRealizaInventario ? 'red' : ''
								}}
							/>
						</Col>
						<Col className={'mb-3'} md={6}>
							<FormGroup className={'mb-0'}>
								<Label for="utilizada">
									Utilizada <RequiredSpan />
								</Label>
								<StyledInput
									id="utilizada"
									name="utilizada"
									type="select"
									onChange={handleInputChange}
									value={
										formState.utilizada !== ''
											? formState.utilizada
												? '1'
												: '0'
											: ''
									}
									style={{
										borderColor: errors.utilizada ? 'red' : ''
									}}
								>
									<option value="">
										{t('general>seleccionar', 'Seleccionar')}
									</option>
									<option value="1">{t('general>si', 'Si')}</option>
									<option value="0">{t('general>no', 'No')}</option>
								</StyledInput>
							</FormGroup>
						</Col>

						<Col className={'mb-3'} md={6}>
							<FormGroup className={'mb-0'}>
								<Label for="paraDonar">
									¿Puede ser donada a otro centro educativo? <RequiredSpan />
								</Label>
								<StyledInput
									id="paraDonar"
									name="paraDonar"
									type="select"
									onChange={handleInputChange}
									value={
										formState.paraDonar !== ''
											? formState.paraDonar
												? '1'
												: '0'
											: ''
									}
									style={{
										borderColor: errors.paraDonar ? 'red' : ''
									}}
								>
									<option value="">
										{t('general>seleccionar', 'Seleccionar')}
									</option>
									<option value="1">{t('general>si', 'Si')}</option>
									<option value="0">{t('general>no', 'No')}</option>
								</StyledInput>
							</FormGroup>
						</Col>
					</Row>
					{submitError && (
						<div
							className="error-message"
							style={{ color: 'red', marginTop: '10px' }}
						>
							{submitError}
						</div>
					)}
				</Form>
			</OptionModal>
		</>
	)
}

const StyledInput = styled(Input)`
	width: 100% !important;
`

export default ComputoModal
