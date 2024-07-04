import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
	Button,
	Dropdown,
	DropdownMenu,
	DropdownToggle,
	DropdownItem,
	ButtonDropdown,
	CustomInput,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Input,
	FormGroup,
	InputGroupAddon
} from 'reactstrap'
import HTMLTable from 'Components/HTMLTable'
import search from 'Utils/search'
import ModalEnrollStudents from './ModalEnrollStudents'
import { useActions } from 'Hooks/useActions'
import {
	getStudentsByAsignaturaGrupoId,
	getStudentsByLevelInstituion,
	getAllStudentsWithoutGroup,
	assignGroup
} from 'Redux/grupos/actions'
import { useSelector } from 'react-redux'
import moment from 'moment'
import {
	updateSubjectGroupEnrolledStudent,
	createMultipleSubjectGroupEnrolledStudent
} from 'Redux/AsignaturaGrupoEstudianteMatriculado/actions'
import FechaEstudianteModal from '../../_partials/FichaEstudianteModal'
import InformationModal from 'Components/Modal/ConfirmModal'
import { useTranslation } from 'react-i18next'

const StudentsSummary = ({ enrolledStudents, subjects = [], subject, currentOffer }) => {
	const { t } = useTranslation()
	const [dropdownToggle, setDropdownToggle] = useState<'' | 'preferences' | 'selectAll'>('')
	const [openModal, setOpenModal] = useState<
		'' | 'unlink' | 'createMail' | 'transferStudent' | 'enrollStudent' | 'link'
	>('')
	const [selectAll, setSelectAll] = useState(false)
	const [selectIds, setSelectsIds] = useState([])
	const [searchValue, setSearchValue] = useState('')
	const { currentInstitution } = useSelector(state => state.authUser)
	const { GroupMembers, membersBySubjectGroup } = useSelector(state => state.grupos)
	const { membersWithoutGroup } = useSelector(state => state.grupos)
	const [items, setItems] = useState<any>(membersBySubjectGroup)

	const [selectedStudents, setSelectedStudents] = useState([])
	const [notEnrolledStudents, setNotEnrolledStudents] = useState([])

	const [itemsGrid, setItemsGrid] = useState<any>()
	const [showModalFichaEstudiante, setShowModalFichaEstudiante] = useState<boolean>(false)
	const [selectedStudentId, setSelectedStudentId] = useState<number>()
	const [selectedStudent, setSelectedStudent] = useState<any>()
	const [informationModal, setInformationModal] = useState<boolean>(false)

	const toggle = (dropdown: 'preferences' | 'selectAll') => {
		if (dropdown === dropdownToggle) {
			setDropdownToggle('')
			return
		}
		setDropdownToggle(dropdown)
	}

	const actions = useActions({
		getStudentsByAsignaturaGrupoId,
		getStudentsByLevelInstituion,
		updateSubjectGroupEnrolledStudent,
		createMultipleSubjectGroupEnrolledStudent,
		getAllStudentsWithoutGroup,
		assignGroup
	})

	useEffect(() => {
		const fetch = async () => {
			if (currentOffer?.nivelId && currentInstitution?.id) {
				if (subject?.id) {
					await actions.getStudentsByAsignaturaGrupoId(subject?.id)
				} else {
					await actions.getStudentsByLevelInstituion(
						currentOffer?.nivelOfertaId,
						currentInstitution?.id
					)
				}
			}
		}
		fetch()
	}, [subject, currentOffer, currentInstitution])

	useEffect(() => {
		if (membersBySubjectGroup.length > 0) {
			setItems(membersBySubjectGroup)
		}
	}, [GroupMembers, membersBySubjectGroup])

	useEffect(() => {
		const fetch = async () => {
			await actions.getAllStudentsWithoutGroup(currentOffer?.nivelId, currentInstitution?.id)
		}
		if (currentOffer?.nivelId && currentInstitution?.id) {
			fetch()
		}
	}, [subject, currentOffer, currentInstitution])

	useEffect(() => {
		if (membersWithoutGroup?.length > 0) {
			const ids = enrolledStudents.map(el => el?.identidadesId)
			setNotEnrolledStudents(
				membersWithoutGroup
					.filter(el => !ids.includes(el?.identidadId))
					.map((el) => ({
						...el,
						nacionalidad: el?.nacionalidades[0] ? el?.nacionalidades[0]?.nacionalidad : '',
						fechaNacimiento: moment(el?.fechaNacimiento).format('DD/MM/YYYY')
					}))
			)
		}
	}, [membersWithoutGroup, enrolledStudents])

	useEffect(() => {
		setSelectedStudents([])
	}, [openModal])

	const groups = subjects.reduce((acc, cur) => {
		if (!acc.includes(cur.groupId)) {
			acc.push(cur.groupId)
		}
		return acc
	}, [])

	const [columns, setColumns] = useState([
		{
			label: t('buscador_ce>ver_centro>datos_director>identificacion', 'Identificación'),
			column: 'identificacion'
		},
		{
			label: t('buscador_ce>ver_centro>datos_director>nombre', 'Nombre completo'),
			column: 'nombreCompleto'
		},
		{
			label: t('estudiantes>buscador_per>col_fecha_naci', 'Fecha de nacimiento'),
			column: 'fechaNacimiento'
		},
		{
			label: t(
				'configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>nacionalidad',
				'Nacionalidad'
			),
			column: 'nacionalidad'
		},
		{
			column: 'condition',
			label: t(
				'estudiantes>matricula_estudiantil>matricular_estudiante>datos_educativos>condicion',
				'Condición'
			),
			show: false
		},
		{
			column: 'email',
			label: t('buscador_ce>ver_centro>datos_contacto>correo', 'Correo electrónico'),
			show: false
		}
	])
	const desvincularEstudiante = async () => {
		if (selectedStudent) {
			const request = {
				id: selectedStudent.asignaturaGrupoMatriculaEstudianteId,
				MatriculasId: selectedStudent.matriculasId,
				AsignaturagrupoId: selectedStudent.asignaturaGrupoId,
				estado: false
			}
			const response = await actions.updateSubjectGroupEnrolledStudent(request)
			if (!response.error) {
				setInformationModal(true)
				setSelectedStudent(null)
				await actions.getStudentsByAsignaturaGrupoId(subject?.id)
			}
		}
	}

	const notColumns = [
		...columns,
		{
			column: 'section',
			label: t('gestion_grupos>asignatura/afin>column_seccion', 'Sección'),
			show: false
		}
	]

	const modals = {
		link: {
			title: t('gestion_grupos>asignatura/afin>vincular_estudiante', 'Vincular estudiante'),
			handleClick: () => {},
			body: (
				<>
					<p>
						{t(
							'gestion_grupos>asignatura/afin>modal_vincular',
							'Confirme que desea vincular al estudiante haciendo click en Vincular'
						)}
					</p>
				</>
			),
			size: 'sm',
			btnSubmitText: t('general>boton>vincular', 'Vincular')
		},
		unlink: {
			title: t(
				'gestion_grupos>asignatura/afin>estudiante_titulo_modal',
				'Desvincular estudiante'
			),
			handleClick: () => desvincularEstudiante(),
			body: (
				<>
					<p>
						{t(
							'gestion_grupos>asignatura/afin>modal_desvincular',
							'Confirme que desea desvincular al estudiante haciendo click en Desvincular'
						)}
					</p>
				</>
			),
			size: 'sm',
			btnSubmitText: t('general>boton>desvincular', 'Desvincular')
		},
		createMail: {
			title: t(
				'expediente_ce>recurso_humano>fun_ce>cuenta_correo>creacion_cuenta_correo',
				'Creación de cuenta de correo'
			),
			handleClick: () => {},
			body: (
				<>
					<p>
						{t(
							'gestion_grupos>asignatura/afin>modal_email',
							'Le recomendamos coordinar con los estudiantes seleccionados o sus familias, la verificación de que los estudiantes seleccionados no posean ya una cuenta activa'
						)}
					</p>
					<p>
						{t(
							'gestion_grupos>asignatura/afin>modal_email2',
							'¿Está usted seguro que los estudiantes seleccionados no poseen ya una cuenta de correo?'
						)}
					</p>
				</>
			),
			size: 'lg',
			btnSubmitText: t(
				'expediente_ce>recurso_humano>fun_ce>cuenta_correo>crear_cuenta',
				'Crear cuenta de correo'
			)
		},
		transferStudent: {
			title: t(
				'gestion_grupo>asignatura/afin>trasladar_estudiante',
				'Trasladar de grupo a un estudiante'
			),
			size: 'lg',
			btnSubmitText: t('general>boton>aplicar', 'Aplicar'),
			handleClick: () => {},
			body: (
				<>
					<h6>
						{t(
							'gestion_grupos>asignatura/afin>seleccionar_grupo',
							'Seleccionar el grupo'
						)}
					</h6>
					<FormGroup>
						<Input
							type='select'
							style={{
								width: '50%',
								backgroundColor: '#efefef'
							}}
						>
							{groups.map((item, i) => (
								<option key={i}>{item}</option>
							))}
						</Input>
					</FormGroup>
					<h5 className='my-4'>
						{t(
							'gestion_grupos>asignatura/afin>estudiantes_seleccionados',
							'Estudiantes seleccionados'
						)}
					</h5>
					<HTMLTable
						columns={[
							{
								label: t(
									'buscador_ce>ver_centro>datos_director>identificacion',
									'Identificación'
								),
								column: 'id'
							},
							{
								label: t(
									'buscador_ce>ver_centro>datos_director>nombre',
									'Nombre completo'
								),
								column: 'name'
							},
							{
								label: t(
									'estudiantes>buscador_per>col_fecha_naci',
									'Fecha de nacimiento'
								),
								column: 'birthDate'
							},
							{
								label: t(
									'configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>nacionalidad',
									'Nacionalidad'
								),
								column: 'nationality'
							},
							{
								column: 'condition',
								label: t(
									'estudiantes>matricula_estudiantil>matricular_estudiante>datos_educativos>condicion',
									'Condición'
								),
								isBadge: true,
								color: item => {
									return item.condition ? 'success' : 'warning'
								}
							}
						]}
						hidePageSizes
						selectDisplayMode='datalist'
						data={membersBySubjectGroup
							.filter(item => selectIds.includes(item.id))
							.map(item => {
								item.condition = item.condition ? 'Regular' : 'Desvinculado'
								return item
							})}
						width={100}
						loading={false}
						PageHeading={false}
						hideMultipleOptions
						toggleEditModal={() => {}}
					/>
				</>
			)
		},
		enrollStudent: {
			title: 'Asociar estudiantes',
			size: 'xl',
			btnSubmitText: 'Guardar',
			handleClick: async () => {
				const response = await actions.createMultipleSubjectGroupEnrolledStudent(
					selectedStudents.map(el => el?.matriculaId),
					subject?.id
				)
				if (!response.error) {
					await actions.getStudentsByAsignaturaGrupoId(subject?.id)
					if (currentOffer?.nivelId && currentInstitution?.id) {
						await actions.getStudentsByLevelInstituion(
							currentOffer?.nivelOfertaId,
							currentInstitution?.id
						)
					}
					await actions.getAllStudentsWithoutGroup(
						currentOffer?.nivelId,
						currentInstitution?.id
					)
				}
			},
			body: (
				<ModalEnrollStudents
					columns={notColumns}
					selectedStudents={selectedStudents}
					setSelectedStudents={setSelectedStudents}
					notEnrolledStudents={notEnrolledStudents}
					enrolledStudents={enrolledStudents}
					items={itemsGrid}
					setItems={setItemsGrid}
				/>
			)
		}
	}

	const handleChangeSelectAll = () => {
		setSelectAll(prevState => !prevState)
	}

	useEffect(() => {
		if (searchValue?.length === 0) {
			setItems(membersBySubjectGroup)
		}
	}, [searchValue])

	const onSearchKey = async e => {
		const { value } = e.target
		setSearchValue(value)
		const data = items
			.filter(el => el?.matriculaId)
			.map(el => ({
				...el,
				...el.datosIdentidadEstudiante,
				fechaNacimiento: moment(el.datosIdentidadEstudiante?.fechaNamiento).format(
					'DD/MM/YYY'
				),
				nombreCompleto: `${el?.datosIdentidadEstudiante?.nombre} ${el?.datosIdentidadEstudiante?.primerApellido}`,
				nacionalidad: 'COSTARRICENSE'
			}))
		if (
			((e.charCode === 13 || e.keyCode === 13 || e.key === 'Enter') && value.length >= 3) ||
			value.length === 0
		) {
			const aux = search(value).in(
				data,
				columns.map(column => column.column)
			)
			setItems(aux)
		}
	}

	return (
		<>
			{selectedStudentId && (
				<FechaEstudianteModal
					setShow={setShowModalFichaEstudiante}
					show={showModalFichaEstudiante}
					studentId={selectedStudentId}
				/>
			)}
			<CustomModal
				isOpen={openModal.length > 0}
				toggle={() => {
					setOpenModal('')
				}}
				size={modals[openModal]?.size || 'lg'}
				style={{ borderRadius: '10px' }}
				centered='static'
			>
				<ModalHeader>{modals[openModal]?.title}</ModalHeader>
				<ModalBody>{modals[openModal]?.body}</ModalBody>
				<ModalFooter>
					<div className='d-flex justify-content-center align-items-center w-100'>
						<Button
							color='outline-primary'
							className='mr-3'
							onClick={() => {
								setOpenModal('')
								setSelectedStudent(null)
							}}
						>
							{t('general>cancelar', 'Cancelar')}
						</Button>
						<Button
							color='primary'
							onClick={() => {
								modals[openModal]?.handleClick()
								setSelectedStudent(null)
								setOpenModal('')
							}}
						>
							{modals[openModal]?.btnSubmitText || 'Confirmar'}
						</Button>
					</div>
				</ModalFooter>
			</CustomModal>
			<h6 className='my-4'>
				{t(
					'gestion_grupos>asignatura/figura>estudiante_asociados',
					'Estudiantes asociados a la asignatura'
				)}
			</h6>
			<Container className='justify-content-between w-100'>
				<div className='d-flex'>
					<SearchContainer className='mr-4'>
						<div className='search-sm--rounded'>
							<input
								type='text'
								name='keyword'
								id='search'
								onInput={e => onSearchKey(e)}
								onKeyPress={e => {
									if (e.key === 'Enter' || e.keyCode === 13) {
										onSearchKey(e)
									}
								}}
								autoComplete='off'
								placeholder={t(
									'estudiantes>buscador_per>info_gen>busc>placeholder',
									'Escriba aquí las palabras claves que desea buscar...'
								)}
							/>
							<StyledInputGroupAddon addonType='append'>
								<Button
									color='primary'
									className='buscador-table-btn-search'
									onClick={e => {
										const data = items
											.filter(el => el?.matriculaId)
											.map(el => ({
												...el,
												...el.datosIdentidadEstudiante,
												fechaNacimiento: moment(
													el.datosIdentidadEstudiante?.fechaNamiento
												).format('DD/MM/YYY'),
												nombreCompleto: `${el?.datosIdentidadEstudiante?.nombre} ${el?.datosIdentidadEstudiante?.primerApellido}`,
												nacionalidad: 'COSTARRICENSE'
											}))
										setItems(
											search(searchValue).in(
												data,
												columns.map(column => column.column)
											)
										)
									}}
								>
									{t('general>buscar', 'Buscar')}
								</Button>
							</StyledInputGroupAddon>
						</div>
					</SearchContainer>
					<Dropdown
						isOpen={dropdownToggle === 'preferences'}
						toggle={() => toggle('preferences')}
					>
						<DropdownToggle caret color='primary'>
							{t('boton>general>preferencias', 'Preferencias')}
						</DropdownToggle>
						<DropdownMenu>
							{columns.map((item, i) => (
								<DropdownItem disabled key={i}>
									<input
										type='checkbox'
										id={item.column}
										checked={item.show ?? true}
										onClick={() => {
											const copy = [...columns]
											const index = columns.findIndex(
												el => el.column === item.column
											)
											if (index !== -1) {
												item.show =
													item.show === undefined ? false : !item.show
												copy[index] = item
												setColumns(copy)
											}
										}}
									/>{' '}
									{item.label}{' '}
								</DropdownItem>
							))}
						</DropdownMenu>
					</Dropdown>
				</div>
				<ButtonsContainer className='d-flex'>
					<Button
						color='primary'
						className='mr-2'
						onClick={() => {
							setItemsGrid(
								notEnrolledStudents.map(item => ({
									...item,
									checked: false
								}))
							)
							setOpenModal('enrollStudent')
						}}
					>
						{t('general>boton>asociar_estudiante', 'Asociar estudiantes')}
					</Button>
					<ButtonDropdown
						isOpen={dropdownToggle === 'selectAll'}
						toggle={() => toggle('selectAll')}
					>
						<div className='btn btn-primary btn-lg pl-4 pr-0 check-button check-all'>
							{selectAll ? (
								<CustomInput
									className='custom-checkbox mb-0 d-inline-block'
									type='checkbox'
									id='checkAll'
									onClick={() => handleChangeSelectAll()}
									checked
								/>
							) : (
								<CustomInput
									className='custom-checkbox mb-0 d-inline-block'
									type='checkbox'
									id='checkAll'
									onClick={() => handleChangeSelectAll()}
								/>
							)}
						</div>
						<DropdownToggle
							caret
							color='primary'
							className='dropdown-toggle-split btn-lg'
						/>
						<DropdownMenu right>
							<DropdownItem onClick={() => setOpenModal('transferStudent')}>
								{t('general>boton>trasladar_grupo', 'Trasladar de grupo')}
							</DropdownItem>
							<DropdownItem onClick={() => setOpenModal('createMail')}>
								{t(
									'expediente_ce>recurso_humano>fun_ce>cuenta_correo>crear_cuenta',
									'Crear cuenta de correo'
								)}
							</DropdownItem>
						</DropdownMenu>
					</ButtonDropdown>
				</ButtonsContainer>
			</Container>
			<HTMLTable
				columns={columns.filter(el => el.show === undefined || el.show)}
				startIcon
				selectDisplayMode='datalist'
				data={
					items.map(el => {
						return {
							...el,
							...el.datosIdentidadEstudiante,
							asignaturaGrupoId: el.asignaturagrupoId,
							matriculasId: el.matriculasId,
							identidadesId: el.identidadesId,
							asignaturaGrupoMatriculaEstudianteId: el.Id,
							fechaNacimiento: moment(
								el.datosIdentidadEstudiante?.fechaNacimiento
							).format('DD/MM/YYYY'),
							nombreCompleto: `${el?.datosIdentidadEstudiante?.nombre} ${el?.datosIdentidadEstudiante?.primerApellido}`,
							nacionalidad: 'COSTARRICENSE'
						}
					}) || []
				}
				selectAll={selectAll}
				onSelectIds={setSelectsIds}
				actionRow={[
					{
						actionName: t('general>boton>desvincular', 'Desvincular'),
						actionFunction: data => {
							setSelectedStudent(data)
							setOpenModal('unlink')
						},
						actionDisplay: () => true
					},
					{
						actionName: t(
							'estudiantes>matricula_estudiantes>ficha_informativa',
							'Ficha informativa'
						),
						actionFunction: data => {
							setSelectedStudentId(data.id)
							setShowModalFichaEstudiante(true)
						},
						actionDisplay: () => true
					}
				]}
				width={150}
				loading={false}
				PageHeading={false}
				toggleEditModal={() => {}}
			/>
			<div className='my-5' />
			<h6 className='my-4'>
				{t(
					'gestion_grupos>asignatura/afin>estuadiante_no_asociado',
					'Estudiantes no asociados a la asignatura'
				)}
			</h6>
			<HTMLTable
				columns={columns.filter(el => el.show === undefined || el.show)}
				startIcon
				selectDisplayMode='datalist'
				data={notEnrolledStudents || []}
				hideMultipleOptions
				actionRow={[
					{
						actionName: t('general>boton>vincular', 'Vincular'),
						actionFunction: () => setOpenModal('link'),
						actionDisplay: () => true
					},
					{
						actionName: t('general>boton>ver_perfil', 'Ver perfil'),
						actionFunction: () => console.log('Ver Perfil'),
						actionDisplay: () => true
					}
				]}
				selectAll={selectAll}
				width={100}
				loading={false}
				readOnly
				roundedStyle
				buttonSearch
				avoidFilter
				preferencesColor='primary dropdown-toggle-split'
				preferences={[
					{
						column: 'id',
						label: t(
							'buscador_ce>ver_centro>datos_director>identificacion',
							'Identificación'
						)
					},
					{
						column: 'name',
						label: t('buscador_ce>ver_centro>datos_director>nombre', 'Nombre completo')
					},
					{
						column: 'birthDate',
						label: t('estudiantes>buscador_per>col_fecha_naci', 'Fecha de nacimiento')
					},
					{
						column: 'nacionality',
						label: t(
							'configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>nacionalidad',
							'Nacionalidad'
						)
					},
					{
						column: 'condition',
						label: t(
							'estudiantes>matricula_estudiantil>matricular_estudiante>datos_educativos>condicion',
							'Condición'
						)
					}
				]}
				toggleEditModal={() => {}}
			/>
			<InformationModal
				openDialog={informationModal}
				onClose={() => setInformationModal(false)}
				onConfirm={() => setInformationModal(false)}
				colorBtn='primary'
				msg={t(
					'gestion_grupos>asignatura/afin>estudiante_msg_modal',
					'El estudiante se ha desvinculado de la asignatura'
				)}
				title={t(
					'gestion_grupos>asignatura/afin>estudiante_titulo_modal',
					'Desvincular estudiante'
				)}
				btnCancel={false}
			/>
		</>
	)
}

const CustomModal = styled(Modal)`
	&.modal-dialog {
		box-shadow: unset !important;
	}
	& > div.modal-content {
		border-radius: 10px !important;
	}
`

const StyledInputGroupAddon = styled(InputGroupAddon)`
  top: 0;
  right: 0;
  position: absolute;
  height: 100%;
  display: flex;
  align-items: center;
  }
`

const SearchContainer = styled.div`
	width: 32vw;
`

const Container = styled.div`
	display: flex;
	flex-direction: column;

	@media screen and (min-width: 1120px) {
		flex-direction: row;
	}
`

const ButtonsContainer = styled.div`
	margin-top: 1rem;

	@media screen and (min-width: 1120px) {
		margin-top: 0;
	}
`

export default StudentsSummary
