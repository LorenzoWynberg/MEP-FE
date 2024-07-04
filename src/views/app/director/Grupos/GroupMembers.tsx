import React, { useEffect, useState, useMemo } from 'react'
import {
	TabContent,
	TabPane,
	Modal,
	ModalBody,
	ModalHeader,
	Button,
	Label,
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	CustomInput
} from 'reactstrap'
import HTMLTable from 'Components/HTMLTable'
import { loadStudent } from 'Redux/expedienteEstudiantil/actions'
import FechaEstudianteModal from './_partials/FichaEstudianteModal'
import {
	getAllStudentsByGroup,
	trasladarMiembros,
	registrarCondicion,
	crearCuentasCorreo,
	getIncidenciasByGroup
} from '../../../../redux/grupos/actions'
import styled from 'styled-components'
import { useActions } from 'Hooks/useActions'
import { IoEyeSharp } from 'react-icons/io5'
import Tooltip from '@mui/material/Tooltip'
import colors from 'Assets/js/colors'
import { RiPencilFill, RiFileInfoLine } from 'react-icons/ri'
import BuildIcon from '@mui/icons-material/Build'
import { useSelector } from 'react-redux'
import { format, parseISO, isBefore } from 'date-fns'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import withRouter from 'react-router-dom/withRouter'
import { Edit } from '@material-ui/icons'
import swal from 'sweetalert'
import useNotification from 'Hooks/useNotification'
import { AiFillFolder } from 'react-icons/ai'
import MensajeModal from '../ExpedienteEstudiante/_partials/cuentaCorreo/MensajeModal'
import { showProgress, hideProgress } from 'Utils/progress'
import StudentsConduct from './_partials/SubjectDetails/StudentsConduct'
import Mustache from 'mustache'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import ModalGrupoTeams from './_partials/ModalGrupoTeams'
import CalficacionesGrupo from './_partials/CalificacionesGrupo'
import { useTranslation } from 'react-i18next'
import IconButton from '@mui/material/IconButton'
import {
	getTemplatesModulo,
	graphApi,
	graphApiTeam
} from 'Redux/office365/actions'

type SnackbarConfig = {
	variant: string
	msg: string
}

const GroupMembers = (props) => {
	const { t } = useTranslation()
	const [modalOpen, setModalOpen] = useState<string>(null)
	const [itemsIds, setItemsIds] = useState<number[]>([])
	const [destinationGroup, setDestinationGroup] = useState<any>({})
	const [pagination, setPagination] = useState<any>({})
	const [condicion, setCondicion] = useState<any>({})
	const [condicionFinal, setCondicionFinal] = useState<any>({})
	const [snackBarContent, setSnackbarContent] =
		React.useState<SnackbarConfig>({
			variant: '',
			msg: ''
		})
	const [snackbar, handleClick] = useNotification()
	const [currentConditionEl, setCurrentConditionEl] = useState<any>({})

	const [openMensajeModal, setOpenMensajeModal] = useState(false)
	const [selectedIds, setSelectedIds] = useState([])
	const [dataMensajeModal, setDataMensajeModal] = useState({
		title: '',
		mensaje: '',
		cancelButton: false
	})
	const [loading, setLoading] = useState(false)
	const [templates, setTemplates] = useState([])
	const [textoModalCrearCuentas, setTextoModalCrearCuentas] = useState('')
	const [openModalGrupoTeams, setOpenModalGrupoTeams] = useState(false)
	const [showModalFichaEstudiante, setShowModalFichaEstudiante] =
		useState<boolean>(false)
	const [selectedStudentId, setSelectedStudentId] = useState<number>()
	const [selectedDR, setSelectedDR] = React.useState([])
	const [dropdownSplitOpen, setDropdownSplitOpen] = React.useState(false)
	const [isAllChecked, setIsAllChecked] = React.useState(false)
	const [data, setData] = useState([])
	const { currentTab } = props

	const step1Columns = [
		{
			column: 'identificacion',
			label: t(
				'buscador_ce>ver_centro>datos_director>identificacion',
				'Identificación'
			)
		},
		{
			column: 'nombreCompleto',
			label: t(
				'buscador_ce>ver_centro>datos_director>nombre',
				'Nombre completo'
			)
		},
		{
			column: 'fechaNacimientoP',
			label: t(
				'gestion_grupo>por_nivel>fecha_nacimiento',
				'Fecha nacimiento'
			)
		},
		{
			column: 'nacionalidad',
			label: t(
				'estudiantes>buscador_per>info_gen>nacionalidad',
				'Nacionalidad'
			)
		},
		{
			column: 'cuentaCorreoOffice',
			label: t(
				'gestion_grupo>por_nivel>tiene_cuenta',
				'Tiene cuenta de correo'
			)
		},
		{
			column: 'condicion',
			label: t(
				'estudiantes>registro_matricula>matricula_estudian>condicion',
				'Condición'
			),
			isBadge: true,
			color: (el) => {
				switch (el.condicionId) {
					case 1:
						return 'success'
					case 2:
						return 'danger'
					case 3:
						return 'warning'
					default:
						return 'warning'
				}
			}
		}
	]

	const columnsModal = [
		{
			column: 'identificacion',
			label: t(
				'buscador_ce>ver_centro>datos_director>identificacion',
				'Identificación'
			)
		},
		{
			column: 'nombreCompleto',
			label: t(
				'buscador_ce>ver_centro>datos_director>nombre',
				'Nombre completo'
			)
		},
		{
			column: 'cuentaCorreoOffice',
			label: t(
				'gestion_grupo>por_nivel>tiene_cuenta',
				'Tiene cuenta de correo'
			)
		},
		{
			column: 'condicion',
			label: t(
				'estudiantes>matricula_estudiantil>matricular_estudiante>datos_educativos>condicion',
				'Condición'
			),
			isBadge: true,
			color: (el) => {
				switch (el.condicionId) {
					case 1:
						return 'success'
					case 2:
						return 'danger'
					case 3:
						return 'warning'
					default:
						return 'warning'
				}
			}
		}
	]

	const actions = useActions({
		getAllStudentsByGroup,
		trasladarMiembros,
		registrarCondicion,
		crearCuentasCorreo,
		getTemplatesModulo,
		graphApi,
		graphApiTeam,
		getIncidenciasByGroup,
		loadStudent
	})
	useEffect(() => {
		const fetchData = async () => {
			await actions.getAllStudentsByGroup(
				props.activeGroup.grupoId,
				props.activeLvl.nivelId,
				props.currentInstitution.id
			)
		}
		setData(state.allGroupMembers)
		fetchData()
	}, [currentTab])
	// const selectedIds = () => {
	//   return data.filter(i=>i.checked).map(i=>i.id)
	// }
	const state = useSelector((store) => {
		return {
			grupos: store.grupos.groups,
			allGroupMembers: store.grupos.GroupMembers,
			condiciones: store.grupos.condiciones,
			groupIncidencias: store.grupos.groupIncidencias,
			activeCalendar: store.grupos.activeCalendar,
			GroupMembers: store.grupos.GroupMembers
		}
	})

	const onRowCheckClick = (data, fullRow, index) => {
		if (selectedIds?.includes(fullRow?.id)) {
			setSelectedIds(selectedIds.filter((el) => el !== fullRow?.id))
		} else {
			setSelectedIds([...selectedIds, fullRow?.id])
		}
		// const newState = [...data]
		// newState[index] = { ...fullRow, checked: !fullRow.checked }
		// setData(newState)
		// setIsAllChecked(
		// 	newState.find((item) => item.checked === false) ? false : true
		// )
	}

	useEffect(() => {
		const fetchData = async () => {
			const response = await actions.getAllStudentsByGroup(
				props.activeGroup.grupoId,
				props.activeLvl.nivelId,
				props.currentInstitution.id
			)
			const respTemplates = await actions.getTemplatesModulo(2)

			if (!respTemplates.error) {
				setTemplates(respTemplates.data)

				const _plantilla = respTemplates.data.find(
					(x) =>
						x.codigo ===
						'O365-TEXTO-MODAL-CREAR-CUENTAS-MASIVA-GRUPOS'
				)
				if (_plantilla !== undefined) {
					const rendered = Mustache.render(
						_plantilla.plantilla_HTML,
						{}
					)

					setTextoModalCrearCuentas(rendered)
				}
			}

			setData(
				response.map((el) => {
					return {
						...el,
						id: el.matriculaId,
						image: el.img,
						fechaNacimientoP: format(
							parseISO(el.fechaNacimiento),
							'dd/MM/yyyy'
						),
						nacionalidad: Array.isArray(el.nacionalidades)
							? el.nacionalidades[0].nacionalidad
							: '',
						cuentaCorreoOffice: el.cuentaCorreoOffice ? 'Sí' : 'No'
					}
				})
			)
		}
		setItemsIds([])
		fetchData()
	}, [])

	const getPlantillaTexto = (codigo) => {
		const _template = templates.find((x) => x.codigo === codigo)
		if (_template !== undefined) {
			return _template
		} else {
			return ''
		}
	}

	const showNotification = (variant: string, msg: string) => {
		setSnackbarContent({ variant, msg })
		handleClick()
	}

	const handleModal = (type = null) => {
		setModalOpen(type)
		if (type === null) {
			setItemsIds([])
			setCurrentConditionEl({})
		}
	}

	const handleCrearTeam = () => {
		showNotification(
			'success',
			t(
				'gestion_grupo>por_nivel>teams>creado_correctamente',
				'El grupo de TEAMS ha sido creado correctamente.'
			)
		)
	}

	const handleActualizarTeam = (teamId, miembros) => {
		let _mensaje = ''
		const _plantilla = getPlantillaTexto(
			'O365-TEXTO-MODAL-ACTUALIZAR-TEAM-CONFIRMAR'
		)

		if (_plantilla !== undefined) {
			_mensaje = Mustache.render(_plantilla.plantilla_Texto, {})
		}

		setDataMensajeModal({
			title: t(
				'gestion_grupo>por_nivel>teams>confirmar_actualizar',
				'Confirmar actualizar el grupo de TEAMS'
			),
			mensaje: _mensaje,
			cancelButton: true,
			action: () => {
				handleActualizarTeamConfirm(teamId, miembros)
			},
			textoAceptar: 'Aceptar'
		})
		setOpenModalGrupoTeams(false)
		setOpenMensajeModal(true)
	}

	const handleCrearCuenta = (id) => {
		const _finded = state.allGroupMembers.find((x) => x.identidadId === id)
		if (_finded !== undefined) {
			if (_finded.cuentaCorreoOffice) {
				swal({
					text: t(
						'gestion_grupo>por_nivel>ya_tiene_cuenta',
						'El estudiante ya tiene una cuenta de correo asignada.'
					),
					icon: 'warning',
					buttons: {
						ok: {
							text: t('general>aceptar', 'Aceptar'),
							value: true
						}
					}
				})
				return
			}
		}
		let _mensaje = ''
		const _plantilla = getPlantillaTexto('O365-TEXTO-CREAR-CUENTA-CONFIRMA')
		if (_plantilla !== undefined) {
			_mensaje = Mustache.render(_plantilla.plantilla_HTML, {
				identificacion: '',
				nombreEstudiante: '',
				email: '',
				password: ''
			})
		}
		setDataMensajeModal({
			title: t(
				'expediente_ce>recurso_humano>fun_ce>cuenta_correo>creacion_cuenta_correo',
				'Creación de cuenta de correo'
			),
			mensaje: _mensaje,
			cancelButton: true,
			action: () => {
				handleCrearCuentaConfirm(id)
			},
			textoAceptar: t('general>boton>crear', 'Crear')
		})
		setOpenMensajeModal(true)
	}

	const handleEliminarTeam = (id) => {
		let _mensaje = ''
		const _plantilla = getPlantillaTexto(
			'O365-TEXTO-MODAL-ELIMINAR-TEAM-CONFIRMAR'
		)

		if (_plantilla !== undefined) {
			_mensaje = Mustache.render(_plantilla.plantilla_Texto, {})
		}

		const handleActualizarTeamConfirm = async (teamId, miembros) => {
			showProgress()
			setLoading(true)
			const response2 = await actions.graphApiTeam({
				accion: 'UpdateTeam',
				teamId,
				miembros
			})

			if (!response2.error) {
				if (!response2.data.error) {
					showNotification(
						'success',
						t(
							'gestion_grupo>por_nivel>teams>actualizado_correctamente',
							'El grupo de TEAMS ha sido actualizado correctamente'
						)
					)
				} else {
					showNotification(
						'error',
						t(
							'gestion_grupo>por_nivel>teams>error_actualizar',
							'Ha ocurrido un error al tratar de actualizar el grupo de TEAMS'
						)
					)
				}
			} else {
				showNotification(
					'error',
					t(
						'gestion_grupo>por_nivel>teams>error_actualizar',
						'Ha ocurrido un error al tratar de actualizar el grupo de TEAMS'
					)
				)
			}

			setOpenMensajeModal(false)
			hideProgress()
			setLoading(false)
		}
		setDataMensajeModal({
			title: t(
				'gestion_grupo>por_nivel>teams>confirmar_eliminar',
				'Confirmar eliminar grupo de TEAMS'
			),
			mensaje: _mensaje,
			cancelButton: true,
			action: () => {
				handleEliminarTeamConfirm(id)
			},
			textoAceptar: 'Aceptar'
		})
		setOpenMensajeModal(true)
	}

	const handleEliminarTeamConfirm = async (id) => {
		showProgress()
		setLoading(true)
		const response2 = await actions.graphApiTeam({
			accion: 'DeleteTeam',
			teamId: id,
			grupoId: props.activeGroup.grupoId
		})

		if (!response2.error) {
			if (!response2.data.error) {
				props.setActiveGroup({
					...props.activeGroup,
					teamId: null
				})
				props.getGroupsReload()
				showNotification(
					'success',
					t(
						'gestion_grupo>por_nivel>teams>eliminado_correctamente',
						'El grupo de TEAMS ha sido eliminado correctamente'
					)
				)
			} else {
				showNotification(
					'error',
					t(
						'gestion_grupo>por_nivel>teams>eliminado_error',
						'Ha ocurrido un error al tratar de eliminar el grupo de TEAMS'
					)
				)
			}
		} else {
			showNotification(
				'error',
				t(
					'gestion_grupo>por_nivel>teams>eliminado_error',
					'Ha ocurrido un error al tratar de eliminar el grupo de TEAMS'
				)
			)
		}

		setOpenMensajeModal(false)
		hideProgress()
		setLoading(false)
	}

	const handleCrearCuentaConfirm = async (id) => {
		showProgress()
		setLoading(true)

		const response = await actions.crearCuentasCorreo([{ Id: id }])
		if (!response.error) {
			await actions.getAllStudentsByGroup(
				props.activeGroup.grupoId,
				props.activeLvl.nivelId,
				props.currentInstitution.id
			)

			const _data = response.data.data.filter((item) => item.cuentaCreada)

			if (_data.length > 0) {
				const _first = _data[0]

				const _data2 = {
					accion: 'GetReceivers',
					identidadId: id
				}
				const response2 = await actions.graphApi(_data2)
				if (response2.data) {
					let _mensaje = ''
					const _plantilla = getPlantillaTexto(
						'O365-TEXTO-CREAR-CUENTA-EXITO'
					)
					if (_plantilla !== undefined) {
						_mensaje = Mustache.render(_plantilla.plantilla_HTML, {
							identificacion: _first.identificacion,
							password: _first.password,
							nombreEstudiante: _first.nombreCompleto,
							email: _first.email
						})
					}

					setDataMensajeModal({
						title: t(
							'expediente_ce>recurso_humano>fun_ce>cuenta_correo>creacion_cuenta_correo',
							'Creación de cuenta de correo'
						),
						icon: 'check',
						mensaje: _mensaje,
						cancelButton: false,
						correos: [
							{
								label: t(
									'gestion_grupo>por_nivel>padre',
									'Padre'
								),
								email: response2.data.emailPadre
							},
							{
								label: t(
									'gestion_grupo>por_nivel>madre',
									'Madre'
								),
								email: response2.data.emailMadre
							},
							{
								label: t(
									'gestion_grupo>asistencia>estudiante',
									'Estudiante'
								),
								email: response2.data.emailEstudiante
							},
							{
								label: t(
									'configuracion>centro_educativo>columna_director',
									'Director'
								),
								email: response2.data.emailCurrentUser
							}
						]
					})
					setOpenMensajeModal(true)
				}
			} else {
				const _dataError = response.data.data.filter(
					(item) => !item.cuentaCreada
				)

				if (_dataError.length > 0) {
					swal({
						text: _dataError[0].mensajeError,
						icon: 'error',
						buttons: {
							ok: {
								text: t('general>aceptar', 'Aceptar'),
								value: true
							}
						}
					})
				}
			}
		} else {
			swal({
				text: response.message,
				icon: 'error',
				buttons: {
					ok: {
						text: t('general>aceptar', 'Aceptar'),
						value: true
					}
				}
			})
		}

		hideProgress()
		setLoading(false)
	}

	const rows = useMemo(() => {
		if (!state.allGroupMembers && (!data || data.length == 0)) return []
		return [...data]
	}, [data])

	const columns = useMemo(() => {
		const cols = [
			{
				Header: t(
					'buscador_ce>ver_centro>datos_director>identificacion',
					'Identificación'
				),
				column: 'identificacion',
				accessor: 'identificacion',
				label: ''
			},
			{
				Header: t(
					'buscador_ce>ver_centro>datos_director>nombre',
					'Nombre completo'
				),
				column: 'nombreCompleto',
				accessor: 'nombreCompleto',
				label: ''
			},
			{
				Header: t(
					'estudiantes>buscador_per>col_fecha_naci',
					'Fecha de nacimiento'
				),
				column: 'fechaNacimientoP',
				accessor: 'fechaNacimientoP',
				label: ''
			},
			{
				Header: t(
					'configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>nacionalidad',
					'Nacionalidad'
				),
				column: 'nacionalidad',
				accessor: 'nacionalidad',
				label: ''
			},
			{
				Header: t(
					'gestion_grupo>por_nivel>tiene_cuenta',
					'Tiene cuenta de correo'
				),
				column: 'cuentaCorreoOffice',
				accessor: 'cuentaCorreoOffice',
				label: ''
			},
			{
				Header: t(
					'estudiantes>matricula_estudiantil>matricular_estudiante>datos_educativos>condicion',
					'Condición'
				),
				column: 'condicion',
				accessor: 'condicion',
				label: '',
				Cell: ({ cell, row, data }) => {
					const fullRow = data[row.index]
					return (
						<p
							style={{
								background:
									fullRow.condicionId === 1
										? '#3e884f'
										: fullRow.condicionId === 2
										? '#ec8180'
										: fullRow.condicionId === 3
										? '#edbc27'
										: '#edbc27',
								color: '#fff',
								textAlign: 'center',
								borderRadius: ' 20px'
							}}
						>
							{fullRow.condicion}
						</p>
					)
				}
			}
		]

		// Actions de tab 0
		if (currentTab == 0) {
			return [
				{
					Header: '',
					column: 'id',
					accessor: 'checked',
					label: '',
					Cell: ({ cell, row, data }) => {
						const fullRow = data[row.index]
						return (
							<div
								style={{
									textAlign: 'center',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center'
								}}
							>
								<input
									className="custom-checkbox mb-0 d-inline-block"
									type="checkbox"
									id="checki"
									style={{
										width: '1rem',
										height: '1rem',
										marginRight: '1rem'
									}}
									onClick={() => {
										onRowCheckClick(
											data,
											fullRow,
											row.index
										)
									}}
									checked={selectedIds.includes(fullRow?.id)}
								/>
							</div>
						)
					}
				},
				...cols,
				{
					Header: t(
						'buscador_ce>buscador>columna_acciones',
						'Acciones'
					),
					column: '',
					accessor: '',
					label: '',
					Cell: ({ cell, row, data }) => {
						const fullRow = data[row.index]
						return (
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									alignContent: 'center'
								}}
							>
								<Tooltip
									title={t(
										'general>boton>trasladar_grupo',
										'Trasladar de grupo'
									)}
								>
									<IconButton>
										<AiFillFolder
											style={{
												fontSize: 25,
												cursor: 'pointer',
												color: colors.darkGray
											}}
											onClick={() => {
												setSelectedIds([fullRow.id])
												setItemsIds([fullRow.id])
												handleModal('step1Modal')
											}}
										/>
									</IconButton>
								</Tooltip>

								<Tooltip
									title={t(
										'estudiantes>matricula_estudiantes>ficha_informativa',
										'Ficha informativa'
									)}
								>
									<IconButton>
										<RiFileInfoLine
											onClick={() => {
												setSelectedStudentId(
													fullRow.identidadId
												)
												setShowModalFichaEstudiante(
													true
												)
											}}
											style={{
												fontSize: 25,
												cursor: 'pointer',
												color: colors.darkGray
											}}
										/>
									</IconButton>
								</Tooltip>
								<Tooltip
									title={t(
										'expediente_ce>recurso_humano>fun_ce>cuenta_correo>crear_cuenta',
										'Crear cuenta de correo'
									)}
								>
									<BuildIcon
										style={{
											fontSize: 25,
											cursor: 'pointer',
											color: colors.darkGray
										}}
										onClick={() => {
											handleCrearCuenta(
												fullRow.identidadId
											)
										}}
									/>
								</Tooltip>
							</div>
						)
					}
				}
			]
		}
		if (currentTab == 1) {
			return [
				...cols,
				{
					Header: t(
						'estudiantes>matricula_estudiantil>matricular_estudiante>datos_educativos>condicion_final',
						'Condición Final'
					),
					column: 'condicionFinal',
					accessor: 'condicionFinal',
					label: ''
				},
				{
					Header: t(
						'buscador_ce>buscador>columna_acciones',
						'Acciones'
					),
					column: '',
					accessor: '',
					label: '',
					Cell: ({ cell, row, data }) => {
						const fullRow = data[row.index]
						return (
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									alignContent: 'center'
								}}
							>
								<Tooltip
									title={t(
										'general>tooltip>modificar_registro',
										'Modificar registro'
									)}
								>
									<Edit
										style={{
											fontSize: 25,
											cursor: 'pointer',
											color: colors.darkGray
										}}
										onClick={() => {
											setCurrentConditionEl(fullRow)
											handleModal('step2Modal')
										}}
									/>
								</Tooltip>

								<Tooltip
									title={t(
										'general>tooltip>ver_expediente',
										'Ver Expediente'
									)}
								>
									<IconButton>
										<IoEyeSharp
											onClick={() => {
												props.history.push(
													`/director/expediente-estudiante/inicio/${fullRow.identificacion}`
												)
											}}
											style={{
												fontSize: 25,
												cursor: 'pointer',
												color: colors.darkGray
											}}
										/>
									</IconButton>
								</Tooltip>
								<Tooltip
									title={t(
										'estudiantes>matricula_estudiantes>ficha_informativa',
										'Ficha informativa'
									)}
								>
									<IconButton>
										<RiFileInfoLine
											style={{
												fontSize: 25,
												cursor: 'pointer',
												color: colors.darkGray
											}}
											onClick={() => {
												setSelectedStudentId(
													fullRow.identidadId
												)
												setShowModalFichaEstudiante(
													true
												)
											}}
										/>
									</IconButton>
								</Tooltip>
							</div>
						)
					}
				}
			]
		}
		if (currentTab == 2) {
			return [
				...cols
				/* {
          Header: 'Acciones',
          column: '',
          accessor: '',
          label: '',
          Cell: ({ cell, row, data }) => {
            const fullRow = data[row.index]
            return (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                }}
              >
                <Tooltip title="Ver">
                <IconButton>
                  <IoEyeSharp
                    style={{
                      fontSize: 25,
                      cursor: 'pointer',
                      color: colors.darkGray
                    }}
                    onClick={() => {
                      props.handleCreateToggle()
                    }}
                    />
                    </IconButton>
                </Tooltip>
              </div>
            )
          }
        } */
			]
		}
		return cols
	}, [state.allGroupMembers, currentTab, templates, selectedIds, t])

	const handleChangeSelectAll = (e) => {
		const newState = data?.map((item) => {
			return { ...item, checked: e }
		})
		setData(newState)
		setIsAllChecked(e)
	}

	const dataGrupoTeams = React.useMemo(
		() =>
			state.allGroupMembers.filter((el) =>
				selectedIds?.includes(el?.matriculaId)
			),
		[selectedIds]
	)

	return (
		<>
			{selectedStudentId && (
				<FechaEstudianteModal
					setShow={setShowModalFichaEstudiante}
					show={showModalFichaEstudiante}
					studentId={selectedStudentId}
				/>
			)}
			<TabContent activeTab={currentTab} style={{ width: '100%' }}>
				{snackbar(snackBarContent.variant, snackBarContent.msg)}
				<TabPane tabId={0}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-end'
						}}
					/>
					<TableReactImplementation
						data={rows}
						handleGetData={() => {}}
						hideMultipleOptions
						checked={selectedIds?.length === data?.length}
						showAddButton
						onSubmitAddButton={() => {
							if (selectedIds.length < 1) {
								swal({
									text: t(
										'gestion_grupo>por_nivel>seleccionar_estudiante',
										'Debe seleccionar al menos un estudiante'
									),
									icon: 'warning',
									buttons: {
										ok: {
											text: t(
												'general>aceptar',
												'Aceptar'
											),
											value: true
										}
									}
								})
							} else {
								handleModal('step1Modal')
							}
						}}
						msjButton
						textButton={t(
							'general>boton>trasladar_grupo',
							'Trasladar de grupo'
						)}
						handleChangeSelectAll={() => {
							if (selectedIds?.length === data?.length) {
								setSelectedIds([])
							} else {
								setSelectedIds(data.map((el) => el.id))
							}
						}}
						actions={[
							{
								actionName: t(
									'general>boton>trasladar_grupo',
									'Trasladar de grupo'
								),
								actionFunction: (el) => {
									// setItemsIds(el)
									if (selectedIds?.length <= 0) {
										swal({
											text: t(
												'gestion_grupo>por_nivel>seleccionar_estudiante',
												'Debe seleccionar al menos un estudiante'
											),
											icon: 'warning',
											buttons: {
												ok: {
													text: t(
														'general>aceptar',
														'Aceptar'
													),
													value: true
												}
											}
										})
									} else {
										handleModal('step1Modal')
									}
								}
							},
							{
								actionName:
									props.activeGroup.teamId == null
										? t(
												'gestion_grupo>por_nivel>crear_grupo_teams',
												'Crear grupo de TEAMS'
										  )
										: t(
												'gestion_grupo>por_nivel>ver_grupo_teams',
												'Ver grupo de TEAMS'
										  ),
								actionFunction: (el) => {
									setOpenModalGrupoTeams(true)
								}
							},
							{
								actionName: t(
									'expediente_ce>recurso_humano>fun_ce>cuenta_correo>crear_cuenta',
									'Crear cuenta de correo'
								),
								actionFunction: (el) => {
									// setItemsIds(el)
									if (selectedIds.length < 1) {
										swal({
											text: t(
												'gestion_grupo>por_nivel>seleccionar_estudiante',
												'Debe seleccionar al menos un estudiante'
											),
											icon: 'warning',
											buttons: {
												ok: {
													text: t(
														'general>aceptar',
														'Aceptar'
													),
													value: true
												}
											}
										})
									} else {
										handleModal('step1Modal2')
									}
								}
							}
						]}
						columns={columns}
						orderOptions={[]}
					/>
					{/* <HTMLTable
            searchSize={7}
            columns={step1Columns}
            thumblist
            actions={[
              {
                actionName: 'Trasladar de grupo',
                actionFunction: (el) => {
                  //setItemsIds(el)
                  if (el.length < 1) {
                    swal({
                      text: 'Debe seleccionar al menos un estudiante',
                      icon: 'warning',
                      buttons: {
                        ok: {
                          text: 'Aceptar',
                          value: true,
                        },
                      },
                    })
                  } else {
                    handleModal('step1Modal')
                  }
                },
              },
              {
                actionName:
                  props.activeGroup.teamId == null
                    ? 'Crear grupo de TEAMS'
                    : 'Ver grupo de TEAMS',
                actionFunction: (el) => {
                  setOpenModalGrupoTeams(true)
                },
              },
              {
                actionName: 'Crear cuentas de correo',
                actionFunction: (el) => {
                  setItemsIds(el)
                  if (el.length < 1) {
                    swal({
                      text: 'Debe seleccionar al menos un estudiante',
                      icon: 'warning',
                      buttons: {
                        ok: {
                          text: 'Aceptar',
                          value: true,
                        },
                      },
                    })
                  } else {
                    handleModal('step1Modal2')
                  }
                },
              },
            ]}
            data={state.allGroupMembers.map((el) => {
              return {
                ...el,
                id: el.matriculaId,
                image: el.img,
                fechaNacimientoP: format(
                  parseISO(el.fechaNacimiento),
                  'dd/MM/yyyy',
                ),
                nacionalidad: Array.isArray(el.nacionalidades)
                  ? el.nacionalidades[0].nacionalidad
                  : '',
                cuentaCorreoOffice: el.cuentaCorreoOffice ? 'Sí' : 'No',
              }
            })}
            actionRow={[
              {
                actionName: 'Trasladar de grupo',
                actionFunction: (el) => {
                  setItemsIds([el.id])
                  handleModal('step1Modal')
                },
                actionDisplay: () => true,
              },
              {
                actionName: 'Ficha informativa',
                actionFunction: (el) => {
                  setSelectedStudentId(el.identidadId)
                  setShowModalFichaEstudiante(true)
                },
                actionDisplay: () => true,
              },
              {
                actionName: 'Crear cuenta de correo',
                actionFunction: (el) => {
                  handleCrearCuenta(el.identidadId)
                },
                actionDisplay: () => true,
              },
            ]}
            isBreadcrumb={false}
            match={props.match}
            tableName="label.grupos"
            pageSize={6}
            toggleEditModal={() => {}}
            toggleModal={(el) => {
              setItemsIds(el)
              if (el.length < 1) {
                swal({
                  text: 'Debe seleccionar al menos un estudiante',
                  icon: 'warning',
                  buttons: {
                    ok: {
                      text: 'Aceptar',
                      value: true,
                    },
                  },
                })
              } else {
                handleModal('step1Modal')
              }
            }}
            modalOpen={false}
            selectedOrderOption={{
              column: 'detalle',
              label: 'Nombre Completo',
            }}
            showHeaders={true}
            editModalOpen={false}
            modalfooter={true}
            loading={false}
            orderBy={false}
            handleCardClick={(_: any) => null}
            roundedStyle
            buttonSearch
            controledItemsIds={setItemsIds}
            buttonLabel="Trasladar de grupo"
          /> */}
					<Modal isOpen={modalOpen === 'step1Modal'} size="lg">
						<ModalHeader toggle={handleModal}>
							{t(
								'gestion_grupo>por_nivel>trasladar_grupo',
								'Trasladar de grupo estudiantes'
							)}
						</ModalHeader>
						<ModalBody>
							<Select
								options={state.grupos
									.filter(
										(el) =>
											el.grupoId !==
											props.activeGroup.grupoId
									)
									.map((el) => ({
										...el,
										value: el.grupoId,
										label: el.grupo
									}))}
								value={destinationGroup}
								onChange={(data) => {
									setDestinationGroup(data)
								}}
								components={{ Input: CustomSelectInput }}
								className="react-select"
								classNamePrefix="react-select"
								placeholder=""
								style={{ width: '50%' }}
							/>
							<HTMLTable
								columns={step1Columns}
								hideMultipleOptions
								data={state.allGroupMembers
									.map((el) => {
										return {
											...el,
											id: el.matriculaId,
											image: el.img,
											fechaNacimientoP: format(
												parseISO(el.fechaNacimiento),
												'dd/MM/yyyy'
											),
											nacionalidad: Array.isArray(
												el.nacionalidades
											)
												? el.nacionalidades[0]
														.nacionalidad
												: '',
											cuentaCorreoOffice:
												el.cuentaCorreoOffice
													? 'Sí'
													: 'No'
										}
									})
									.filter((el) =>
										selectedIds.includes(el.id)
									)}
								actions={[]}
								isBreadcrumb={false}
								actionRow={[]}
								match={props.match}
								tableName="label.grupos"
								disableSelectAll
								backendPaginated
								pageSize={10}
								toggleEditModal={() => {}}
								toggleModal={async () => {}}
								modalOpen={false}
								selectedOrderOption={{
									column: 'detalle',
									label: t(
										'buscador_ce>ver_centro>datos_director>nombre',
										'Nombre completo'
									)
								}}
								showHeaders
								editModalOpen={false}
								modalfooter
								loading={false}
								orderBy={false}
								handleCardClick={(_: any) => null}
								roundedStyle
								disableSearch
								showTitle={t(
									'gestion_grupos>asignatura/afin>estudiantes_seleccionados',
									'Estudiantes seleccionados'
								)}
								readOnly
							/>
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									width: '100%'
								}}
							>
								<Button
									color="primary"
									style={{ marginRight: '10px' }}
									outline
									onClick={() => {
										handleModal()
									}}
								>
									Cancelar
								</Button>
								<Button
									color="primary"
									onClick={async () => {
										const response =
											await actions.trasladarMiembros(
												itemsIds,
												destinationGroup.value,
												pagination
											)
										if (!response.error) {
											await actions.getAllStudentsByGroup(
												props.activeGroup.grupoId,
												props.activeLvl.nivelId,
												props.currentInstitution.id
											)
											handleModal()
										}
									}}
								>
									{t('general>boton>aplicar', 'Aplicar')}
								</Button>
							</div>
						</ModalBody>
					</Modal>

					<Modal isOpen={modalOpen === 'step1Modal2'} size="lg">
						<ModalHeader toggle={handleModal}>
							{t(
								'expediente_ce>recurso_humano>fun_ce>cuenta_correo>creacion_cuenta_correo',
								'Creación de cuenta de correo'
							)}
						</ModalHeader>
						<ModalBody>
							<div
								dangerouslySetInnerHTML={{
									__html: textoModalCrearCuentas
								}}
							/>
							<HTMLTable
								columns={columnsModal}
								hideMultipleOptions
								data={state.allGroupMembers
									.filter(
										(el) =>
											selectedIds.includes(
												el.matriculaId
											) && el.cuentaCorreoOffice === 'No'
									)
									.map((el) => {
										return {
											...el,
											id: el.matriculaId,
											cuentaCorreoOffice:
												el.cuentaCorreoOffice
													? 'Sí'
													: 'No'
										}
									})}
								actions={[]}
								isBreadcrumb={false}
								actionRow={[]}
								match={props.match}
								tableName="label.grupos"
								disableSelectAll
								backendPaginated
								pageSize={10}
								toggleEditModal={() => {}}
								toggleModal={async () => {}}
								modalOpen={false}
								selectedOrderOption={{
									column: 'detalle',
									label: t(
										'buscador_ce>ver_centro>datos_director>nombre',
										'Nombre completo'
									)
								}}
								showHeaders
								editModalOpen={false}
								modalfooter
								loading={false}
								orderBy={false}
								handleCardClick={(_: any) => null}
								roundedStyle
								disableSearch
								showTitle={t(
									'gestion_grupos>asignatura/afin>estudiantes_seleccionados',
									'Estudiantes seleccionados'
								)}
								readOnly
							/>
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									width: '100%'
								}}
							>
								<Button
									color="primary"
									style={{ marginRight: '10px' }}
									outline
									onClick={() => {
										handleModal()
									}}
								>
									{t('boton>general>cancelar', 'Cancelar')}
								</Button>
								<Button
									color="primary"
									onClick={async () => {
										const arrayMiembrosCuenta =
											state.allGroupMembers
												.map((el) => {
													return {
														...el,
														id: el.matriculaId,
														cuentaCorreoOffice:
															el.cuentaCorreoOffice
																? 'Sí'
																: 'No'
													}
												})
												.filter(
													(el) =>
														selectedIds.includes(
															el.id
														) &&
														el.cuentaCorreoOffice ===
															'No'
												)

										const _ids = arrayMiembrosCuenta.map(
											(item) => {
												return {
													Id: item.identidadId
												}
											}
										)
										if (_ids.length < 1) {
											swal({
												text: t(
													'gestion_grupo>por_nivel>allemos_unEstudiante',
													'Debe seleccionar al menos un estudiante que no tenga cuenta de correo creada'
												),
												icon: 'warning',
												buttons: {
													ok: {
														text: t(
															'general>aceptar',
															'Aceptar'
														),
														value: true
													}
												}
											})

											return
										}
										const response =
											await actions.crearCuentasCorreo(
												_ids
											)
										if (!response.error) {
											actions.getAllStudentsByGroup(
												props.activeGroup.grupoId,
												props.activeLvl.nivelId,
												props.currentInstitution.id
											)
											handleModal()

											let _mensaje = ''
											const _plantilla =
												getPlantillaTexto(
													'O365-TEXTO-CREAR-CUENTAS-EXITO-GRUPOS'
												)
											if (_plantilla !== undefined) {
												_mensaje = Mustache.render(
													_plantilla.plantilla_HTML,
													{
														identificacion: '',
														nombreEstudiante: '',
														email: '',
														password: ''
													}
												)
											}
											// Mensaje con modal personalizado.
											setDataMensajeModal({
												title: t(
													'expediente_ce>recurso_humano>fun_ce>cuenta_correo>creacion_cuenta_correo',
													'Creación de cuenta de correo'
												),
												icon: 'check',
												mensaje: _mensaje,
												cancelButton: false
											})

											setOpenMensajeModal(true)
											/* swal({
                        text: 'Las cuentas de correo han sido creadas con éxito. ' + _text,
                        icon: 'success',
                        buttons: {
                            ok: {
                                text: 'Aceptar',
                                value: true,
                            },
                        },
                      }); */
										}
									}}
								>
									{t(
										'expediente_ce>recurso_humano>fun_ce>cuenta_correo>creacion_cuenta_correo',
										'Creación de cuenta de correo'
									)}
								</Button>
							</div>
						</ModalBody>
					</Modal>

					{openMensajeModal && (
						<MensajeModal
							openDialog={openMensajeModal}
							onClose={() => {
								setOpenMensajeModal(false)
								setDataMensajeModal({
									title: '',
									mensaje: '',
									cancelButton: false
								})
							}}
							title={dataMensajeModal.title}
							texto={dataMensajeModal.mensaje}
							pregunta={dataMensajeModal.pregunta}
							txtBtn={t('general>aceptar', 'Aceptar')}
							colorBtn="Primary"
							loading={loading}
							action={dataMensajeModal.action}
							btnCancel={dataMensajeModal.cancelButton}
							textoAceptar={
								dataMensajeModal.textoAceptar
									? dataMensajeModal.textoAceptar
									: 'Aceptar'
							}
							password={
								dataMensajeModal.password
									? dataMensajeModal.password
									: ''
							}
							icon={
								dataMensajeModal.icon
									? dataMensajeModal.icon
									: 'exclamation-circle'
							}
							correos={
								dataMensajeModal.correos
									? dataMensajeModal.correos
									: []
							}
						/>
					)}
				</TabPane>
				<TabPane tabId={1}>
					<TableReactImplementation
						data={state.allGroupMembers.map((el) => {
							return {
								...el,
								id: el.matriculaId,
								image: el.img,
								fechaNacimientoP: format(
									parseISO(el.fechaNacimiento),
									'dd/MM/yyyy'
								),
								nacionalidad: Array.isArray(el.nacionalidades)
									? el.nacionalidades[0].nacionalidad
									: '',
								cuentaCorreoOffice: el.cuentaCorreoOffice
									? 'Sí'
									: 'No'
							}
						})}
						handleGetData={() => {}}
						columns={columns}
						orderOptions={[]}
					/>
					{/* <HTMLTable
            columns={[
              ...step1Columns,
              {
                column: 'condicionFinal',
                label: 'Condición final',
                isBadge: true,
                color: (el) => {
                  switch (el.condicionFinalId) {
                    case 5:
                      return 'success'
                    case 6:
                      return 'warning'
                    case 7:
                      return 'danger'
                  }
                },
              },
            ]}
            data={state.allGroupMembers.map((el) => {
              return {
                ...el,
                id: el.matriculaId,
                image: el.img,
                fechaNacimientoP: format(
                  parseISO(el.fechaNacimiento),
                  'dd/MM/yyyy',
                ),
                nacionalidad: Array.isArray(el.nacionalidades)
                  ? el.nacionalidades[0].nacionalidad
                  : '',
                cuentaCorreoOffice: el.cuentaCorreoOffice ? 'Sí' : 'No',
              }
            })}
            actionRow={[
              {
                actionName: 'Modificar registro',
                actionFunction: (el) => {
                  setCurrentConditionEl(el)
                  handleModal('step2Modal')
                },
                actionDisplay: () => true,
              },
              {
                actionName: 'Ver Expediente',
                actionFunction: (el) => {
                  props.history.push(`/director/expediente-estudiante/inicio/${el.identificacion}`)
                },
                actionDisplay: () => true,
              },
              {
                actionName: 'Ficha informativa',
                actionFunction: (el) => {
                  setSelectedStudentId(el.identidadId)
                  setShowModalFichaEstudiante(true)
                },
                actionDisplay: () => true,
              },
            ]}
            isBreadcrumb={false}
            match={props.match}
            tableName="label.grupos"
            pageSize={6}
            buttonSearch
            toggleEditModal={() => null}
            toggleModal={() => null}
            modalOpen={false}
            selectedOrderOption={{
              column: 'detalle',
              label: 'Nombre Completo',
            }}
            showHeaders={true}
            editModalOpen={false}
            modalfooter={true}
            loading={false}
            orderBy={false}
            handleCardClick={(_: any) => null}
            roundedStyle
            disableSelectAll
            disableMultipleOptions
            hideMultipleOptions
            readOnly
            thumblist
          /> */}
					<Modal isOpen={modalOpen === 'step2Modal'} size="lg">
						<ModalHeader toggle={handleModal}>
							{t(
								'gestion_grupo>por_nivel>registrar_condicion_estudiante',
								'Registrar la condición del estudiante'
							)}
						</ModalHeader>
						<ModalBody>
							<Label>
								{t(
									'gestion_grupo>por_nivel>condicion_estudiante',
									'Condición del estudiante'
								)}
							</Label>
							<Select
								options={state.condiciones
									.filter((el) => el.id < 5)
									.map((el) => ({
										...el,
										value: el.id,
										label: el.nombre
									}))}
								value={condicion}
								onChange={(data) => {
									setCondicion(data)
								}}
								components={{ Input: CustomSelectInput }}
								className="react-select"
								classNamePrefix="react-select"
								placeholder=""
							/>
							<p>
								{t(
									'gestion_grupo>por_nivel>descripcion_condicion',
									'Descripción de la condición del estudiante'
								)}
							</p>
							<br />
							<Label>
								{t(
									'gestion_grupo>por_nivel>condicion_final_estudiante',
									'Condición final del estudiante'
								)}
							</Label>
							<Select
								options={state.condiciones
									.filter((el) => el.id > 4)
									.map((el) => ({
										...el,
										value: el.id,
										label: el.nombre
									}))}
								onChange={(data) => {
									setCondicionFinal(data)
								}}
								components={{ Input: CustomSelectInput }}
								className="react-select"
								classNamePrefix="react-select"
								placeholder=""
								value={condicionFinal}
								isDisabled={
									!isBefore(
										parseISO(
											state.activeCalendar
												.finPeriodoLectivo
										),
										new Date()
									)
								}
							/>
							<p>
								{t(
									'gestion_grupo>por_nivel>condicion_final_habilitada',
									'La Condición Final del estudiante solamente está habilitada para su registro en el periodo correspondiente'
								)}
								.
							</p>
							<br />
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									width: '100%'
								}}
							>
								<Button
									color="primary"
									style={{ marginRight: '10px' }}
									outline
									onClick={() => {
										handleModal()
									}}
								>
									{t('boton>general>cancelar', 'Cancelar')}
								</Button>
								<Button
									color="primary"
									onClick={async () => {
										const response =
											await actions.registrarCondicion(
												currentConditionEl.id,
												condicion.value,
												condicionFinal.value
											)
										if (response.error) {
											for (const fieldName in response.errors) {
												if (
													response.errors.hasOwnProperty(
														fieldName
													)
												) {
													showNotification(
														'error',
														response.errors[
															fieldName
														]
													)
												}
											}
										} else {
											showNotification(
												'success',
												t(
													'gestion_grupo>por_nivel>asignado_correctamente',
													'Condición del estudiante asignada correctamente'
												)
											)
											actions.getAllStudentsByGroup(
												props.activeGroup.grupoId,
												props.activeLvl.nivelId,
												props.currentInstitution.id
											)
											handleModal()
										}
									}}
								>
									{t('general>boton>aplicar', 'Aplicar')}
								</Button>
							</div>
						</ModalBody>
					</Modal>
				</TabPane>
				<TabPane tabId={2}>
					<TableReactImplementation
						data={state.allGroupMembers.map((el) => {
							return {
								...el,
								id: el.matriculaId,
								image: el.img,
								fechaNacimientoP: format(
									parseISO(el.fechaNacimiento),
									'dd/MM/yyyy'
								),
								nacionalidad: Array.isArray(el.nacionalidades)
									? el.nacionalidades[0].nacionalidad
									: '',
								cuentaCorreoOffice: el.cuentaCorreoOffice
									? 'Sí'
									: 'No'
							}
						})}
						handleGetData={() => {}}
						columns={columns}
						orderOptions={[]}
					/>
					{/* <HTMLTable
            columns={step1Columns}
            thumblist
            data={state.allGroupMembers.map((el) => {
              return {
                ...el,
                id: el.matriculaId,
                image: el.img,
                fechaNacimientoP: format(
                  parseISO(el.fechaNacimiento),
                  'dd/MM/yyyy',
                ),
                nacionalidad: Array.isArray(el.nacionalidades)
                  ? el.nacionalidades[0].nacionalidad
                  : '',
                cuentaCorreoOffice: el.cuentaCorreoOffice ? 'Sí' : 'No',
              }
            })}
            actions={[]}
            isBreadcrumb={false}
            actionRow={[]}
            match={props.match}
            tableName="label.grupos"
            pageSize={6}
            toggleEditModal={() => {
              props.handleCreateToggle()
            }}
            toggleModal={() => {
              props.handleCreateToggle()
            }}
            buttonSearch
            modalOpen={false}
            selectedOrderOption={{
              column: 'detalle',
              label: 'Nombre Completo',
            }}
            showHeaders={true}
            editModalOpen={false}
            modalfooter={true}
            loading={false}
            orderBy={false}
            handleCardClick={(_: any) => null}
            roundedStyle
            readOnly
          /> */}
				</TabPane>
				<TabPane tabId={4}>
					<CalficacionesGrupo
						grupoId={props.activeGroup.grupoId}
						students={state.GroupMembers}
					/>
				</TabPane>
				<TabPane tabId={5}>
					<StudentsConduct
						students={state.GroupMembers}
						tiposIncidencia={props.tiposIncidencia}
						groupIncidencias={state.groupIncidencias}
						getIncidentsFunction={() =>
							actions.getIncidenciasByGroup(
								props.activeGroup.grupoId
							)
						}
						activeLvl={props.activeLvl}
						currentInstitution={props.currentInstitution}
					/>
				</TabPane>
			</TabContent>

			{openModalGrupoTeams && (
				<ModalGrupoTeams
					isOpen={openModalGrupoTeams}
					loading={loading}
					activeGroup={props.activeGroup}
					data={dataGrupoTeams}
					handleEliminar={handleEliminarTeam}
					handleCrear={handleCrearTeam}
					handleActualizar={handleActualizarTeam}
					setActiveGroup={props.setActiveGroup}
					getGroupsReload={props.getGroupsReload}
					onClose={() => {
						setOpenModalGrupoTeams(false)
					}}
				/>
			)}
		</>
	)
}

export default withRouter(GroupMembers)

const StyledButtonDropdown = styled(ButtonDropdown)`
	margin-left: 10px;
	margin-right: 10px;
`
