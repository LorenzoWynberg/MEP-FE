import Loader from 'Components/Loader'
import HeaderTab from 'Components/Tab/Header'
import directorItems from 'Constants/directorMenu'
import { useActions } from 'Hooks/useActions'
import AppLayout from 'Layout/AppLayout'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { injectIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import { Col, Container, Row } from 'reactstrap'
import { getAllSubjectsGroupByNivelOferta } from 'Redux/AsignaturaGrupo/actions'
import AttendanceBySubject from './_partials/SubjectDetails/Asistencia/AttendanceBySubject'
import {
	getBloquesByOffer,
	getAllStudentsByGroup,
	getCondiciones,
	getCurrentCalendar,
	getCurrentGroupConditions,
	getGroupsByIntitutionWithLevels,
	getGroupsByIntitution,
	getGroupsByLevel,
	getIncidenciasByGroup,
	getTiposIncidencias,
	getGroupsByLevelOfertaId
} from 'Redux/grupos/actions'
import styled from 'styled-components'
import { getAllAsignaturas } from '../../../../redux/asignaturas/actions'
import RequiredInstitution from 'components/RequiredInstitution'

import { useTranslation } from 'react-i18next'
import { verificarAcceso } from 'Hoc/verificarAcceso'
import GoBack from 'Components/goBack'
import GroupMembers from './GroupMembers'
import Ofertas from './ofertas'
import GroupsContent from './GroupsContent'
import EstudiantesNivel from './estudiantesNivel'
import EstudiantesSinGrupos from './EstudiantesSinGrupos'
import StudentsContent from './SubjectDetail'
import SubjectsContent from './SubjectsContent'
import { usePrevious } from 'Hooks'
import { useHistory } from 'react-router-dom'

const options = ['Estudiantes', 'Condición', 'Promover', 'Asistencia', 'Calificaciones', 'Conducta']

interface ILstSectionGroup {
	label: string
	section: string
	switch: string
}

const Groups = props => {
	const colors = ['#17183f', '#145388']

	const { t } = useTranslation()
	const [activeMdlt, setActiveMdlt] = useState<any>({})
	const [activeLvl, setActiveLvl] = useState<any>({})
	const [activeGroup, setActiveGroup] = useState<any>({})

	const [data, setData] = useState([])
	const [currentTab, setCurrentTab] = useState(0)
	const [loading, setLoading] = useState<boolean>(false)
	const [loader, setLoader] = useState(false)
	const [subjectSelected, setSubjectSelected] = useState<any>(null)
	const [subjectData, setSubjectData] = useState<Array<any>>([])
	const [filters, setFilters] = useState<any>({
		sb_gruposId: {},
		subject: {},
		teacher: {}
	})
	const [onlyViewModule, setOnlyViewModule] = useState<boolean>(true)

	const [switched, setSwitched] = useState<string>('offers')

	const lstSectionGroup: ILstSectionGroup[] = [
		{
			label: t('gestion_grupos>tab_grupo', 'Grupos por nivel'),
			switch: 'groups',
			section: 'grupospornivel'
		},
		{
			section: 'asignaturaafinpornivel',
			switch: 'subjects',
			label: t('gestion_grupos>tab_asignatura', 'Asignatura/figura afín por nivel')
		}
	]
	const ACTIVE_YEAR = useSelector((store: any) => store.authUser.selectedActiveYear)

	const PREV_ACTIVE_YEAR: any = usePrevious(ACTIVE_YEAR)
	const history = useHistory()

	const state = useSelector((store: any) => {
		return {
			grupos: store.grupos.groups,
			gruposState: store.grupos,
			centerOffers: store.grupos.centerOffers,
			groupIncidencias: store.grupos.groupIncidencias,
			tiposIncidencia: store.grupos.tiposIncidencia,
			institution: store.authUser.currentInstitution,
			loading: store.grupos.loading,
			currentConditions: store.grupos.currentConditions,
			asignaturas: store.asignaturas.asignaturas,
			allGroupMembers: store.grupos.allGroupMembers,
			GroupMembers: store.grupos.GroupMembers,
			asignaturasGruposByNivelOferta: store.asignaturaGrupo.asignaturasGruposByNivelOferta,
			asignaturaGrupo: store.asignaturaGrupo,
			currentInstitucion: store.authUser.currentInstitution,
			authUser: store.authUser
		}
	})

	const actions = useActions({
		getAllSubjectsGroupByNivelOferta,
		getGroupsByIntitution,
		getGroupsByLevel,
		getAllStudentsByGroup,
		getCondiciones,
		getCurrentCalendar,
		getCurrentGroupConditions,
		getAllAsignaturas,
		getIncidenciasByGroup,
		getTiposIncidencias,
		getBloquesByOffer,
		getGroupsByLevelOfertaId,
		getGroupsByIntitutionWithLevels
	})

	useEffect(() => {
		setOnlyViewModule(!ACTIVE_YEAR.esActivo)
		if (PREV_ACTIVE_YEAR?.id) {
			if (PREV_ACTIVE_YEAR?.id !== ACTIVE_YEAR?.id) history.push('/director/grupos')
		}
	}, [ACTIVE_YEAR])

	const addColorAttr = ofertas => {
		const colorsMap = new Map()
		let i = 0

		return ofertas.map(oferta => {
			if (!colorsMap.get(oferta.nivelId)) {
				if (i >= colors.length) {
					i = 0
				}
				if (oferta.nivelId !== 0) {
					colorsMap.set(oferta.nivelId, colors[i])
				}
				i++
			}
			const newOferta = {
				...oferta,
				color: colorsMap.get(oferta.nivelId)
			}
			return newOferta
		})
	}
	useEffect(() => {
		const fetch = async () => {
			setLoading(true)
			await actions.getCurrentCalendar()
			await actions.getCondiciones()
			await actions.getTiposIncidencias()
			setLoading(false)
		}
		fetch()
	}, [])

	useEffect(() => {
		if (state.institution.id <= 0) return
		const fetch = async () => {
			setLoader(true)
			await actions.getGroupsByIntitutionWithLevels(state.institution.id)
			setLoader(false)
		}
		fetch()
	}, [state.institution?.id, ACTIVE_YEAR])

	useEffect(() => {
		// eslint-disable-next-line array-callback-return
		const filtered = state.asignaturasGruposByNivelOferta.filter(subject => {
			if (!filters.sb_gruposId.grupoId && !filters.subject.id && !filters.teacher.id) {
				return subject
			}

			const aux = Object.keys(filters).map(filter => {
				const filtersToApply = Object.keys(filters).filter(
					el => filters[el].id || filters[el].grupoId
				)
				const validations = []

				if (filtersToApply.length > 1) {
					if (filters.sb_gruposId.grupoId) {
						if (subject.sb_gruposId === filters.sb_gruposId.grupoId) {
							validations.push(true)
						} else {
							validations.push(false)
						}
					}

					if (filters.subject.id) {
						if (
							subject.datosMallaCurricularAsignaturaInstitucion.id ===
							filters.subject.id
						) {
							validations.push(true)
						} else {
							validations.push(false)
						}
					}

					if (filters.teacher.id) {
						if (subject.datosProfesoresinstitucion.id === filters.teacher.id) {
							validations.push(true)
						} else {
							validations.push(false)
						}
					}

					if (validations.some(el => !el)) {
						return 0
					}
					return 1
				} else {
					if (
						(filters.sb_gruposId.grupoId &&
							subject.sb_gruposId === filters.sb_gruposId.grupoId) ||
						(filters.subject.id &&
							subject.datosMallaCurricularAsignaturaInstitucion.id ===
								filters.subject.id) ||
						(filters.teacher.id &&
							subject.datosProfesoresinstitucion.id === filters.teacher.id)
					) {
						return 1
					}
				}
				return 0
			})
			if (!aux.includes(0)) {
				return subject
			}
		})
		setSubjectData(filtered)
	}, [filters, state.asignaturasGruposByNivelOferta])

	useEffect(() => {
		if (subjectData.length > 0 && subjectSelected) {
			const index = subjectData.findIndex(el => el.id === subjectSelected?.id)

			if (index !== -1) {
				setSubjectSelected(subjectData[index])
			}
		}
	}, [subjectData, state.asignaturaGrupo.update])

	useEffect(() => {
		if (!activeLvl.nivelModeloId) return
		console.log(activeLvl, 'El active level !!!!')

		const fetch = async () => {
			await actions.getBloquesByOffer(
				activeLvl?.nivelModeloId,
				state.institution.id,
				state.authUser.selectedActiveYear ? state.authUser.selectedActiveYear.id : null
			)
		}
		fetch()
	}, [activeLvl])

	useEffect(() => {
		const fetch = async () => {
			await actions.getCurrentGroupConditions(activeGroup.grupoId)
			await actions.getIncidenciasByGroup(activeGroup.grupoId)
		}
		if (activeGroup.grupoId !== undefined) {
			fetch()
		}
	}, [activeGroup, state.gruposState.loadedDataGroup])

	useEffect(() => {
		const _data = state.centerOffers

		const d = addColorAttr(_data)
		setData(
			d.sort((a, b) => {
				if (a.nivelId > b.nivelId) {
					return 1
				}
				if (a.nivelId === b.nivelId) {
					if (a.nivelOfertaId > b.nivelOfertaId) {
						return 1
					} else {
						return -1
					}
				}
				return -1
			})
		)
	}, [state.centerOffers])

	useEffect(() => {
		const fetch = async () => {
			await actions.getGroupsByLevelOfertaId(activeLvl.nivelOfertaId, state.institution.id)
			await actions.getAllAsignaturas()
		}
		if (activeLvl.nivelId) {
			fetch()
		}
	}, [state.gruposState.loaded])

	useEffect(() => {
		const fetch = async () => {
			await actions.getAllSubjectsGroupByNivelOferta(
				activeLvl.nivelOfertaId,
				state?.institution?.id
			)
			await actions.getAllStudentsByGroup(null, activeLvl.nivelId, state.institution.id)
		}
		if (activeLvl.nivelId) {
			fetch()
		}
	}, [activeLvl])

	const handleLevel = async (lvl = {}) => {
		if (lvl.nivelId) {
			if (!props.verificarAcceso('grupospornivel', 'leer')) {
				setSwitched('subjects')
			} else {
				setSwitched('groups')
			}
			setLoader(true)
			await actions.getGroupsByLevelOfertaId(lvl.nivelOfertaId, state.institution.id)
			setLoader(false)
			setActiveLvl(lvl)
		}
	}

	const getGroupsReload = async () => {
		await actions.getGroupsByLevelOfertaId(activeLvl.nivelOfertaId, state.institution.id)
	}

	const getGroups = () => {
		if (activeGroup.id !== 0 && activeGroup.id !== 'levelMembers') {
			return (
				<GroupMembers
					{...props}
					options={options}
					currentTab={currentTab}
					setCurrentTab={setCurrentTab}
					activeLvl={activeLvl}
					activeGroup={activeGroup}
					currentInstitution={state.institution}
					setActiveGroup={setActiveGroup}
					getGroupsReload={getGroupsReload}
					tiposIncidencia={state.tiposIncidencia}
				/>
			)
		}
		if (activeGroup.id === 'levelMembers') {
			return (
				<EstudiantesNivel
					{...props}
					options={options}
					currentTab={currentTab}
					setCurrentTab={setCurrentTab}
					activeLvl={activeLvl}
					currentInstitution={state.institution}
				/>
			)
		}
		return (
			<EstudiantesSinGrupos
				{...props}
				options={options}
				currentTab={currentTab}
				setCurrentTab={setCurrentTab}
				activeLvl={activeLvl}
				currentInstitution={state.institution}
			/>
		)
	}

	const goBackInicio = () => {
		setActiveGroup({})
		setActiveLvl({})
		setActiveMdlt({})
		setSwitched('offers')
	}

	const contentGrupos = {
		groups: (
			<GroupsContent
				activeMdlt={activeMdlt}
				setActiveMdlt={setActiveMdlt}
				activeLvl={activeLvl}
				setActiveLvl={handleLevel}
				activeGroup={activeGroup}
				setActiveGroup={setActiveGroup}
				groups={state.grupos}
				modelOffers={data}
				loading={state.loading}
			/>
		),
		offers: <Ofertas setActiveLvl={handleLevel} data={data} />,
		subjects: (
			<SubjectsContent
				loading={false}
				setSubjectSelected={setSubjectSelected}
				selectedSubject={subjectSelected}
				data={subjectData}
				setData={setSubjectData}
				filters={filters}
				setFilters={setFilters}
			/>
		),
		StudentsContent: (
			<StudentsContent
				subject={subjectSelected}
				currentOffer={activeLvl}
				activeGroup={activeGroup}
				activeLvl={activeLvl}
				setSubjectSelected={setSubjectSelected}
			/>
		)
	}

	if (state.currentInstitucion?.id === -1) {
		return (
			<AppLayout items={directorItems}>
				<div className='dashboard-wrapper'>
					<RequiredInstitution />
				</div>
			</AppLayout>
		)
	}

	if (loading) return <Loader />

	return (
		<AppLayout items={directorItems}>
			<Helmet>
				<title>{t('centro_educativo>gestion_grupos>titulo', 'GESTIÓN DE GRUPOS')}</title>
			</Helmet>
			<div className='dashboard-wrapper'>
				<Container>
					<Row>
						<Col xs={12}>
							<h3>{t('centro_educativo>gestion_grupos>titulo', 'GESTIÓN DE GRUPOS')}</h3>
						</Col>
					</Row>

					{!activeGroup.grupoId && activeGroup.grupoId !== 0 && (
						<Row>
							<Col xs={12}>
								<div className='d-flex'>
									<P
										isWarning={switched === 'offers'}
										className={`cursor-pointer ${activeLvl?.nivelId && 'last-border'}`}
										onClick={() => goBackInicio()}
									>
										{t('centro_educativo>gestion_grupos>inicio', 'Inicio')}
									</P>
									{activeLvl?.nivelId && (
										<P
											isWarning={switched === 'groups' || 'subjects'}
											className={` cursor-pointer ${
												(activeGroup.grupoId || activeGroup.grupoId === 0) && 'last-border'
											}`}
											onClick={() => {
												setActiveGroup({})
											}}
										>
											{t('configuracion>ofertas_educativas>niveles>agregar>nivel', 'Nivel')}
										</P>
									)}
									{activeGroup.grupoId === 0 && (
										<P isWarning={true}>
											{t(
												'expediente_ce>grupos_proyecciones>niveles asociados>columna_grupos',
												'Grupos'
											)}
										</P>
									)}
								</div>
							</Col>
							<Col xs={12}>
								{activeLvl?.nivelId && (
									<div className='d-flex'>
										{lstSectionGroup
											.filter(nav => props.verificarAcceso(nav.section, 'leer'))
											.map((nav, navI, { length }) => {
												return (
													<P
														key={navI}
														isWarning={switched === nav.switch}
														className={`cursor-pointer 
																${length - 1 !== navI && 'last-border '}`}
														onClick={() => setSwitched(nav.switch)}
													>
														{nav.label}
													</P>
												)
											})}
									</div>
								)}
							</Col>
						</Row>
					)}
					{!activeLvl.nivelId && <Row>{contentGrupos.offers}</Row>}

					{(activeGroup.grupoId || activeGroup.grupoId === 0) && (
						<Row>
							<Col sm={12}>
								<GoBack onClick={() => setActiveGroup({})} />

								<h2 className='my-4'>
									{t('gestion_grupos>tab_grupo', 'Grupos por nivel')} {'>'}{' '}
									{activeGroup.grupoId === 0 &&
										t('gestion_grupos>sin_grupos', 'Estudiantes sin grupo')}
									{activeGroup.grupoId === 'levelMembers' &&
										t('gestion_grupos>en_nivel', 'Estudiantes en nivel')}
									{activeGroup.grupoId !== 'levelMembers' && activeGroup.grupo}
								</h2>
							</Col>
							{activeGroup.grupoId !== 'levelMembers' && activeGroup.grupoId !== 0 && (
								<Col sm={12}>
									<HeaderTab options={options} activeTab={currentTab} setActiveTab={setCurrentTab} />
									{currentTab === 3 && (
										<AttendanceBySubject
											students={state.GroupMembers}
											grupoId={activeGroup.grupoId}
											currentOffer={activeLvl}
										/>
									)}
								</Col>
							)}
						</Row>
					)}

					{loader ? <Loader /> : null}

					{activeLvl.nivelId && (
						<Row>
							{switched === 'subjects' && (
								<Col sm={12}>
									{!subjectSelected && contentGrupos[switched]}

									{subjectSelected && contentGrupos.StudentsContent}
								</Col>
							)}
							{switched === 'groups' && (
								<Col sm={12}>
									{!activeGroup.grupoId && activeGroup.grupoId !== 0 && contentGrupos[switched]}

									{(activeGroup.grupoId || activeGroup.grupoId === 0) && getGroups()}
								</Col>
							)}
						</Row>
					)}
				</Container>
			</div>
		</AppLayout>
	)
}

export default injectIntl(verificarAcceso(Groups))

const P = styled.p.attrs(props => ({
	isWarning: props.isWarning === undefined ? false : props.isWarning
}))`
	text-decoration: ${props => (props.isWarning ? 'underline' : 'null')};
`
