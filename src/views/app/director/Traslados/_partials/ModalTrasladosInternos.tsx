import SimpleModal from 'Components/Modal/simple'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import React, { useState, useEffect } from 'react'
import { DropdownToggle, UncontrolledDropdown, DropdownMenu, DropdownItem } from 'reactstrap'
import { useSelector } from 'react-redux'
import Ofertas from './Ofertas'
import { useTranslation } from 'react-i18next'

const ModalTrasladosInternos = ({
	selectedInstitution = null,
	setSelectedInstitution = e => {},
	openModal = false,
	setOpenModal = e => {},
	setSelectedLevel = e => {},
	selectedLevel = null,
	columns = [],
	data = [],
	selectedMatriculasId = [],
	onSubmit = e => {},
	selectedLvl = null
}) => {
	const { authObject, currentRoleOrganizacion, currentInstitution } = useSelector((state: any) => state.authUser)
	const { centerOffersGrouped, centerOffersForTraslados, centerOffersSpecialty, centerOffersSpecialtyGrouped } =
		useSelector((store: any) => store.grupos)
	const isEncargadoOrEstudiante = authObject.user.rolesOrganizaciones.find(
		rol => rol.rolNombre.toLowerCase() === 'estudiante' || rol.rolNombre.toLowerCase() === 'encargado'
	)
	const { t } = useTranslation()
	const institutionsArray = isEncargadoOrEstudiante
		? ''
		: authObject.user.rolesOrganizaciones.map(el => {
				const institution = authObject.user.instituciones.find(item => item.id === parseInt(el.organizacionId))
				return { ...el, institutionObject: institution }
		  })

	const [dataOfertas, setDataOfertas] = useState([])

	useEffect(() => {
		const _data = centerOffersForTraslados.map(x => {
			return {
				...x,
				entidadMatriculaId: x.especialidadId ? 0 : x.entidadMatriculaId
			}
		})
		setDataOfertas(_data)
	}, [centerOffersForTraslados, currentInstitution])

	console.log(dataOfertas)

	return (
		<SimpleModal
			stylesContent={{
				overflowX: 'hidden'
			}}
			title={
				<div className='d-flex justify-content-between align-items-center'>
					<h3>
						{t(
							'estudiantes>traslados>gestion_traslados>traslados_internos>trasladar>trasladar_estudiantes',
							'Trasladar estudiantes'
						)}
					</h3>
					{authObject.user.rolesOrganizaciones.length > 0 && selectedInstitution && (
						<UncontrolledDropdown className='ml-2'>
							{authObject.user.rolesOrganizaciones.length < 2 ? (
								<div
									className='language-button'
									style={{
										minWidth: '170px',
										whiteSpace: 'unset',
										borderRadius: '35px',
										textAlign: 'center'
									}}
								>
									<DropdownToggle
										caret
										color='primary'
										size='sm'
										className='language-button'
										style={{
											minWidth: '170px',
											whiteSpace: 'unset'
										}}
										disabled={authObject.user.rolesOrganizaciones.length < 2}
									>
										<span className='name'>
											{currentInstitution.codigo} - {currentInstitution?.nombre}
										</span>
									</DropdownToggle>
								</div>
							) : (
								<DropdownToggle
									caret
									color='primary'
									size='sm'
									className='language-button'
									style={{
										minWidth: '170px',
										whiteSpace: 'unset'
									}}
									disabled={authObject.user.rolesOrganizaciones.length < 2}
								>
									<span className='name'>
										{isEncargadoOrEstudiante
											? isEncargadoOrEstudiante.rolNombre
											: currentRoleOrganizacion.accessRole.rolNombre &&
											  `${currentRoleOrganizacion.accessRole.rolNombre} ${
													currentRoleOrganizacion.accessRole.nivelAccesoId > 1
														? currentRoleOrganizacion.accessRole.organizacionNombre === null
															? ''
															: ' - ' +
															  currentRoleOrganizacion.accessRole.organizacionNombre
														: selectedInstitution?.codigo +
														  ' - ' +
														  selectedInstitution.nombre?.toUpperCase()
											  }
    `}
									</span>
								</DropdownToggle>
							)}

							<DropdownMenu className='mt-3' right>
								{institutionsArray &&
									institutionsArray.map(role => {
										return (
											<DropdownItem
												onClick={() => {
													setSelectedInstitution(role?.institutionObject)
												}}
												key={role.rolId}
											>
												{!isEncargadoOrEstudiante
													? `${role.rolNombre} ${
															role.organizacionNombre?.toUpperCase() === undefined
																? ''
																: ' - ' + role.organizacionNombre?.toUpperCase()
													  }`
													: `${role.rolNombre} - ${
															role.institutionObject?.codigo
													  } - ${role.institutionObject?.nombre.toUpperCase()}`}
											</DropdownItem>
										)
									})}
							</DropdownMenu>
						</UncontrolledDropdown>
					)}
				</div>
			}
			openDialog={openModal}
			onClose={() => {
				setOpenModal(false)
				setSelectedLevel(null)
			}}
			onConfirm={onSubmit}
			btnSubmit={selectedLevel}
		>
			<div style={{ maxWidth: '80rem', minWidth: '100%' }}>
				{selectedLevel ? (
					<div style={{ maxWidth: '80rem' }}>
						<TableReactImplementation
							columns={[
								...columns.slice(1, 6),
								{
									Header: t(
										'estudiantes>traslados>gestion_traslados>traslados_internos>trasladar>columna_nivel_actual',
										'Nivel actual'
									),
									accessor: 'lvlActual'
								},
								{
									Header: t(
										'estudiantes>traslados>gestion_traslados>traslados_internos>trasladar>columna_nivel_propuesto',
										'Nivel propuesto'
									),
									accessor: 'lvl'
								}
							]}
							data={data
								?.filter(el => selectedMatriculasId.includes(el.matriculaId))
								.map(el => {
									
									let nivelOrigen = centerOffersGrouped?.find(
										x => x.nivelOfertaId === selectedLvl?.nivelOfertaId
									)
									let nivelDestino = dataOfertas?.find(
										x => x.nivelOfertaId === selectedLevel?.nivelOfertaId
									)
									if (selectedLvl?.especialidadId) {
										nivelOrigen = centerOffersSpecialtyGrouped?.find(
											x => x.entidadMatriculaId === selectedLvl?.entidadMatriculaId
										)
									}
									if (selectedLevel?.especialidadId) {
										nivelDestino = centerOffersSpecialtyGrouped?.find(
											x => x.entidadMatriculaId === selectedLevel?.entidadMatriculaId
										)
									}

									return {
										...el,
										lvlActual: nivelOrigen?.nivelNombre + ' ' + nivelOrigen?.especialidadNombre,
										lvl: nivelDestino?.nivelNombre + ' ' + nivelDestino?.especialidadNombre
									}
								})}
							avoidSearch
						/>
					</div>
				) : (
					<>
						<h6>
							{t(
								'gestion_traslados>internos>selecciona_nivel',
								'Selecciona el nivel donde se trasladaran los estudiantes'
							)}
						</h6>
						<Ofertas
							data={dataOfertas?.filter(el => el.entidadMatriculaId !== selectedLvl?.entidadMatriculaId)}
							institutionId={selectedInstitution?.id}
							setTitle={() => {}}
							selectedLvl={selectedLvl}
							setSelectedLvl={setSelectedLevel}
						/>
					</>
				)}
			</div>
		</SimpleModal>
	)
}

export default ModalTrasladosInternos
