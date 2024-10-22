import {
	Radio,
	RadioGroup,
	FormControl,
	FormHelperText,
	FormControlLabel
} from '@material-ui/core'
import axios from 'axios'
import colors from 'assets/js/colors'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import React, { useState, useEffect } from 'react'
import { envVariables } from 'Constants/enviroment'
import RequiredSpan from 'Components/Form/RequiredSpan'
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap'
import FormModal from 'Components/Modal/FormModal'

const ComputoModal = ({
	open,
	handleClose,
	mode,
	initialData,
	selects,
	nombreDirector,
	idInstitucion,
	refetch,
	handleClick,
	setSnackbarContent
}) => {
	const [showModalEstado, setShowModalEstado] = useState(false)
	const [loading, setLoading] = useState(false)
	const { t } = useTranslation()
	const primary = colors.primary

	const [errors, setErrors] = useState({
		sb_tipoActivoId: null,
		serie: null,
		placa: null,
		sb_fuenteId: null,
		sb_condicionId: null,
		sb_ubicacionId: null,
		nombreDirector: null,
		puestoRealizaInventario: null,
		utilizada: null,
		paraDonar: null
	})

	const CustomFormHelperText = styled(FormHelperText)(({ theme }) => ({
		color: colors.error + ' !important',
		border: 'none !important'
	}))

	// Definir estado inicial
	const getInitialFormState = () => {
		if (mode === 'add') {
			return {
				id: null,
				condicionNombre: '',
				utilizada: '',
				paraDonar: '',
				sb_tipoActivoId: '',
				serie: '',
				placa: '',
				sb_fuenteId: '',
				sb_condicionId: '',
				sb_ubicacionId: '',
				nombreDirector: nombreDirector,
				puestoRealizaInventario: ''
			}
		} else if (mode === 'edit' || mode === 'view') {
			const selectedCondicion = selects.estadoInventarioTecnologico.find(
				condicion => condicion.id === initialData?.sb_condicionId
			)
			return {
				...initialData,
				id: initialData?.id || null,
				condicionNombre: selectedCondicion?.nombre || '', // Settear el nombre de la condición
				sb_condicionId: initialData?.sb_condicionId || '', // Settear el id de la condición
				utilizada:
					initialData?.utilizada !== undefined ? initialData.utilizada : '',
				paraDonar:
					initialData?.paraDonar !== undefined ? initialData.paraDonar : ''
			}
		}
		return {}
	}

	// Inicializar el estado del formulario
	const [formState, setFormState] = useState(getInitialFormState())

	// Resetear el estado del formulario cuando se abre el modal
	useEffect(() => {
		if (open) {
			setFormState(getInitialFormState())
			setErrors({})
		}
	}, [open, mode, initialData])

	// Condiciones para donar
	const canSetParaDonar =
		['Bueno', 'Excelente'].includes(formState.condicionNombre) &&
		formState.utilizada === false

	// Settea el valor de paraDonar a false si no se cumplen las condiciones
	useEffect(() => {
		if (!canSetParaDonar && formState.paraDonar !== false) {
			setFormState(prev => ({
				...prev,
				paraDonar: false
			}))

			setErrors(prev => ({
				...prev,
				paraDonar: false
			}))
		}
	}, [canSetParaDonar, formState.paraDonar])

	/* 
      Settear el nombre de la condición para mostrar en el
      formulario despues de haber seleccionado del modal de radios
    */
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

	//Manejar cambios de condición
	const handleCondicionChange = e => {
		const selectedId = parseInt(e.target.value, 10)
		const selectedCondicion = selects.estadoInventarioTecnologico.find(
			condicion => condicion.id === selectedId
		)

		setFormState(prev => ({
			...prev,
			sb_condicionId: selectedId,
			condicionNombre: selectedCondicion?.nombre || ''
		}))
	}

	// Manejar cambios de datos de el formulario
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

	// Settear nombre del director
	useEffect(() => {
		if (mode === 'add') {
			setFormState(prev => ({
				...prev,
				nombreDirector: nombreDirector
			}))
		}
	}, [nombreDirector, mode])

	// Validaciones
	const validateFields = () => {
		const newErrors = {}

		if (!formState.sb_tipoActivoId || formState.sb_tipoActivoId === '') {
			newErrors.sb_tipoActivoId = 'Tipo de activo es requerido'
		}

		if (!formState.serie) {
			newErrors.serie = 'Número de serie es requerido'
		}

		if (!formState.placa) {
			newErrors.placa = 'Número de placa es requerido'
		}

		if (!formState.sb_fuenteId || formState.sb_fuenteId === '') {
			newErrors.sb_fuenteId = 'Fuente es requerida'
		}

		if (!formState.sb_condicionId || formState.sb_condicionId === '') {
			newErrors.sb_condicionId = 'Estado es requerido'
		}

		if (!formState.sb_ubicacionId || formState.sb_ubicacionId === '') {
			newErrors.sb_ubicacionId = 'Ubicación es requerida'
		}

		if (!formState.nombreDirector) {
			newErrors.nombreDirector = 'Nombre del director es requerido'
		}

		if (!formState.puestoRealizaInventario) {
			newErrors.puestoRealizaInventario = 'Puesto es requerido'
		}

		if (formState.utilizada === '') {
			newErrors.utilizada = 'Especificar si está utilizada es requerido'
		}

		if (formState.paraDonar === '') {
			newErrors.paraDonar = 'Especificar si puede ser donada es requerido'
		}

		if (formState.paraDonar) {
			if (
				!['Bueno', 'Excelente'].includes(formState.condicionNombre) ||
				formState.utilizada
			) {
				newErrors.paraDonar =
					'Para donar, la condición debe ser Bueno o Excelente y no utilizada'
			}
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	// Enviar datos al backend
	const handleSubmit = async () => {
		if (validateFields()) {
			setLoading(true)
			try {
				const submissionData = {
					...formState,
					id: formState.id || 0,
					sb_institucionesId: idInstitucion,
					utilizada: formState.utilizada === true ? 1 : 0,
					paraDonar: formState.paraDonar === true ? 1 : 0
				}
				// Determinar endpoint y método
				const endpoint =
					mode === 'edit'
						? `${envVariables.BACKEND_URL}/api/Inventario`
						: `${envVariables.BACKEND_URL}/api/Inventario/CrearRegistroInventario`
				const method = mode === 'edit' ? 'put' : 'post'

				const response = await axios({
					method: method,
					url: endpoint,
					data: submissionData
				})
				setLoading(false)
				handleClose()
				setSnackbarContent({
					msg: `Se ha ${
						mode === 'edit' ? 'modificado' : 'guardado'
					} el registro`,
					type: 'success'
				})
				handleClick()
				refetch()
			} catch (error) {
				setLoading(false)
				setSnackbarContent({
					msg: `Error al ${
						mode === 'edit' ? 'modificar' : 'guardar'
					} el registro`,
					type: 'error'
				})
				handleClick()
				if (error?.response?.data?.errors) {
					setErrors(prevErrors => ({
						...prevErrors,
						serie: error.response.data.errors.serie || null,
						placa: error.response.data.errors.placa || null
					}))
				}
			}
		} else {
			setSnackbarContent({
				msg: `Error de validacion`,
				type: 'error'
			})
			handleClick()
		}
	}

	// Modo de vista
	const isViewMode = mode === 'view'

	return (
		<>
			{/* Modal Estado del activo */}
			<FormModal
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
								<Row
									className="py-2"
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										borderBottom: `1px solid ${colors.opaqueGray}`
									}}
								>
									<Col sm={4}>
										<FormControlLabel
											value={item.id}
											control={
												<Radio
													onClick={handleCondicionChange}
													checked={formState.sb_condicionId === item.id}
													style={{ color: primary }}
													disabled={isViewMode} // Disable in 'view' mode
												/>
											}
											label={item.nombre}
										/>
									</Col>
									<Col sm={8}>{item.descripcion}</Col>
								</Row>
							))}
						</RadioGroup>
					</FormControl>
				</div>
			</FormModal>

			{/* Modal Agregar/Edit/View */}
			<FormModal
				isOpen={open}
				titleHeader={
					mode === 'add'
						? 'Agregar registro'
						: mode === 'edit'
						? 'Editar registro'
						: 'Ver registro'
				}
				hideSubmit={isViewMode}
				onConfirm={isViewMode ? handleClose : handleSubmit} // En modo vista cerrar modal en el onConfirm
				onCancel={() => {
					handleClose()
					setFormState(getInitialFormState()) // Settea el estado basado en el modo
					setErrors({})
				}}
				textConfirm={
					loading ? 'Guardando...' : isViewMode ? 'Cerrar' : 'Guardar'
				}
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
										borderColor: errors.sb_tipoActivoId ? colors.error : ''
									}}
									disabled={isViewMode} // Desabilitar campo en modo vista
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
									borderColor: errors.serie ? colors.error : ''
								}}
								disabled={isViewMode} // Desahabilitar campo en modo vista
							/>
							{errors.serie && (
								<CustomFormHelperText error>
									{errors.serie}
								</CustomFormHelperText>
							)}
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
									borderColor: errors.placa ? colors.error : ''
								}}
								disabled={isViewMode} // Desahabilitar campo en modo vista
							/>
							{errors.placa && (
								<CustomFormHelperText error>
									{errors.placa}
								</CustomFormHelperText>
							)}
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
										borderColor: errors.sb_fuenteId ? colors.error : ''
									}}
									disabled={isViewMode} // Desahabilitar campo en modo vista
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
								onClick={() => {
									if (!isViewMode) setShowModalEstado(true) // Prevenir abrir modal en modo vista
								}}
								value={formState.condicionNombre || 'Seleccionar'} // Mostrar el nombre de la condición
								style={{
									borderColor: errors.sb_condicionId ? colors.error : ''
								}}
								disabled={isViewMode} // Desahabilitar campo en modo vista
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
										borderColor: errors.sb_ubicacionId ? colors.error : ''
									}}
									disabled={isViewMode} // Desahabilitar campo en modo vista
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
									borderColor: errors.nombreDirector ? colors.error : ''
								}}
								disabled={isViewMode || mode == 'edit'} // Desahabilitar campo en modo vista
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
									borderColor: errors.puestoRealizaInventario
										? colors.error
										: ''
								}}
								disabled={isViewMode || mode == 'edit'} // Desahabilitar campo en modo vista
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
										borderColor: errors.utilizada ? colors.error : ''
									}}
									disabled={isViewMode} // Desabilitar campo en modo vista
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
										borderColor: errors.paraDonar ? colors.error : ''
									}}
									disabled={isViewMode || !canSetParaDonar} // Desabilitar campo en modo vista o si no se cumplen las condiciones
								>
									<option value="">
										{t('general>seleccionar', 'Seleccionar')}
									</option>
									<option
										value="1"
										disabled={!canSetParaDonar} // Desabilitar opción si no se cumplen las condiciones
										title={
											!canSetParaDonar
												? 'Para donar, la condición debe ser Bueno o Excelente y utilizada debe ser No.'
												: ''
										}
									>
										{t('general>si', 'Si')}
									</option>
									<option value="0">{t('general>no', 'No')}</option>
								</StyledInput>
								{!isViewMode && (
									<FormHelperText disabled>
										Para donar, la condición debe ser Bueno o Excelente y
										utilizada debe ser No.
									</FormHelperText>
								)}
							</FormGroup>
						</Col>
					</Row>
				</Form>
			</FormModal>
		</>
	)
}

const StyledInput = styled(Input)`
	width: 100% !important;
`

export default ComputoModal
