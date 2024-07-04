import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Icon from 'Assets/icons/calendarioPreviewCursoLectivos'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { useActions } from 'Hooks/useActions'
import { uniqBy } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { IoEyeSharp } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { FormGroup } from 'reactstrap'

import {
	createGroup,
	deleteGroup,
	editGroup,
	getGroupsByIntitution,
	getGroupsByLevel,
	getGroupsByLevelAnio,
	getNivelesGruposByModeloOferta
} from 'Redux/grupos/actions'

import styled from 'styled-components'
import GoBack from 'Components/goBack'
import GruposNivel from './GruposNivel'
import { useTranslation } from 'react-i18next'

type IProps = {}

export const Grupos: React.FC<IProps> = props => {
	const { t } = useTranslation()
	const [showForm, setShowForm] = useState(false)
	const [data, setData] = useState([])
	const [selectedRow, setSelectedRow] = useState([])
	const [ofertaModeloServicioData, setOfertaModeloServicioData] = useState([])
	const [especialidadesData, setEspecialidadesData] = useState([])
	const [nivelesData, setNivelesData] = useState([])

	const [currentLevel, setCurrentLevel] = useState<any>({})
	const [currentOffer, setCurrentOffer] = useState<any>({})
	const [currentEspecialidad, setCurrentEspecialidad] = useState<any>(null)

	const actions = useActions({
		getGroupsByIntitution,
		getNivelesGruposByModeloOferta,
		getGroupsByLevel,
		getGroupsByLevelAnio,
		createGroup,
		editGroup,
		deleteGroup
	})

	const { selectedActiveYear } = useSelector((state: any) => state.authUser)
	const state = useSelector((store: any) => {
		return {
			selectedActiveYear: store.authUser.selectedActiveYear,
			offerModalServ: store.educationalYear.offerModalServ,
			nivelesOferta: store.grupos.centerOffersGrouped,
			ofertas: store.ofertas.ofertas,
			modalidades: store.modalidades.modalidades,
			servicios: store.servicios.servicios,
			niveles: store.niveles.niveles,
			especialidades: store.especialidades.especialidades,
			institution: store.authUser.currentInstitution,
			groups: store.grupos.groups,
			centerOffers: store.grupos.centerOffersGrouped,
			nivelesGr: store.grupos.centerOffersGrouped,
			nivelesData: store.grupos.nivelesGruposYProyecciones
		}
	})

	const columns = useMemo(() => {
		return [
			{
				column: 'nivelNombre',
				accessor: 'nivelNombre',
				label: '',
				Header: t('configuracion>ofertas_educativas>niveles>agregar>nivel', 'Nivel')
			},
			{
				column: 'limiteEstudiantes',
				accessor: 'limiteEstudiantes',
				label: '',
				Header: t(
					'expediente_ce>grupos_proyecciones>niveles asociados>columna_proyeccion_matricula',
					'Proyección de matrícula'
				)
			},
			{
				column: 'matriculas',
				accessor: 'matriculas',
				label: '',
				Header: t(
					'expediente_ce>grupos_proyecciones>niveles asociados>columna_matriculados',
					'Matriculados'
				)
			},
			// {
			// 	column: 'numeroReservados',
			// 	accessor: 'numeroReservados',
			// 	label: '',
			// 	Header: t(
			// 		'expediente_ce>grupos_proyecciones>niveles asociados>columna_reservados',
			// 		'Reservados'
			// 	)
			// },
			{
				column: 'grupos',
				accessor: 'grupos',
				label: '',
				Header: t(
					'expediente_ce>grupos_proyecciones>niveles asociados>columna_grupos',
					'Grupos'
				)
			},
			{
				Header: t('general>acciones', 'Acciones'),
				column: '',
				accessor: '',
				label: '',
				Cell: ({ _, row, data }) => {
					return (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								alignContent: 'center'
							}}
						>
							<button
								style={{
									border: 'none',
									background: 'transparent',
									cursor: 'pointer',
									color: 'grey'
								}}
								onClick={async () => {
									setCurrentLevel(row.original)
									await actions.getGroupsByLevelAnio(
										row.original.nivelId,
										state.institution.id,
										selectedActiveYear.id,
										row.original.especialidadId
									)
									setShowForm(!showForm)
									setSelectedRow(row.original)
								}}
							>
								<Tooltip title={t('general>ver', 'Ver')}>
									<IconButton>
										<IoEyeSharp style={{ fontSize: 30 }} />
									</IconButton>
								</Tooltip>
							</button>
						</div>
					)
				}
			}
		]
	}, [t])

	useEffect(() => {
		return () => {
			setShowForm(false)
		}
	}, [])

	useEffect(() => {
		const fetch = async () => {
			await actions.getGroupsByIntitution(state.institution.id)
		}
		fetch()
	}, [state.institution.id])

	useEffect(() => {
		if (state.nivelesOferta) {
			const _data = state.nivelesOferta
			const _oms = uniqBy(_data, 'modeloOfertaId').map((e: any) => {
				return {
					...e,
					total: e.mujeres + e.hombres,
					label: e.modeloOfertaNombre,
					value: e.modeloOfertaId
				}
			})

			const _especialidades = uniqBy(_data, 'especialidadId').map((e: any) => {
				return {
					...e,
					label: e.especialidadNombre,
					value: e.especialidadId
				}
			})

			setData(_data)
			setOfertaModeloServicioData(_oms)
			setCurrentOffer({})
			setEspecialidadesData(_especialidades)
		}
	}, [state.nivelesOferta])

	const handleOffer = offer => {
		if (offer) {
			const _data = data.filter(e => e.modeloOfertaId === offer.value)
			const _especialidades = uniqBy(_data, 'especialidadId').map(e => {
				return {
					...e,
					label: e.especialidadNombre,
					value: e.especialidadId
				}
			})

			setEspecialidadesData(_especialidades)
			setCurrentOffer(offer)
			setCurrentEspecialidad({})
			if (currentEspecialidad && offer) {
				getNivelesByNOF(currentEspecialidad, offer)
			}
		}
	}

	useEffect(() => {
		if (currentEspecialidad) {
			const esp = especialidadesData.find(
				el => el.especialidadNombre === currentEspecialidad.especialidadNombre
			)
			getNivelesByNOF(esp)
		}
	}, [currentOffer, especialidadesData])

	const handleEspecialidad = esp => {
		if (esp) {
			setCurrentEspecialidad(esp)
			if (esp && currentOffer) {
				getNivelesByNOF(esp, currentOffer)
			}
		}
	}

	const getNivelesByNOF = async (esp, offer) => {
		const no = state.nivelesOferta.find(
			e => e.especialidadId === esp.value && e.modeloOfertaId === offer.value
		)
		const _response = await actions.getNivelesGruposByModeloOferta(no.modeloOfertaId)
		if (_response.error) {
			return
		}

		const _data = _response.data?.filter(e => e.especialidadId === esp.value)
		// debugger
		setNivelesData(_data)
	}

	const Landing = ({ txt }) => {
		return (
			<ContainerLanding>
				<Icon />
				<LabelStyled>{txt}</LabelStyled>
			</ContainerLanding>
		)
	}

	const goBack = () => {
		getNivelesByNOF(currentEspecialidad)
		setShowForm(false)
	}

	return (
		<Wrapper>
			<Helmet>
				<title>Grupos y proyecciones</title>
			</Helmet>

			{showForm && <GoBack onClick={goBack} />}

			<UpperBanner>
				<UpperBannerItem>
					<FeedBack>
						<FeedBackTitle>
							{t(
								'expediente_ce>grupos_proyecciones>niveles asociados>columna_proyeccion_matricula',
								'Proyección de matrícula'
							)}
						</FeedBackTitle>
						<FeedBackDescription>
							{t(
								'expediente_ce>grupos_proyecciones>niveles asociados>msj',
								'En esta sección se debe configurar lo relacionado con las proyecciones de matrícula y los grupos que atenderán su año educativo'
							)}
						</FeedBackDescription>
					</FeedBack>
				</UpperBannerItem>
			</UpperBanner>

			{!showForm && (
				<Container>
					<Card>
						<FeedBack>
							<FeedBackTitle>
								{t(
									'expediente_ce>grupos_proyecciones>niveles asociados>modelos_oferta',
									'Modelos de Oferta'
								)}
							</FeedBackTitle>
						</FeedBack>
						<Educativo>
							<NivelesForm>
								<FormGroup>
									<Label>
										{t(
											'expediente_ce>grupos_proyecciones>modelo_ofertas>oferta_educativa',
											'Oferta educativa / Modalidad / Servicio'
										)}
									</Label>

									<Select
										className='react-select'
										classNamePrefix='react-select'
										components={{
											Input: CustomSelectInput
										}}
										noOptionsMessage={() => t('general>no_opt', 'Sin opciones')}
										placeholder=''
										value={currentOffer}
										options={ofertaModeloServicioData}
										onChange={e => {
											handleOffer(e)
										}}
									/>
								</FormGroup>
								<FormGroup>
									<Label>
										{t(
											'configuracion>ofertas_educativas>especialidades>agregar>especialidad',
											'Especialidad'
										)}
									</Label>
									<Select
										className='react-select'
										classNamePrefix='react-select'
										noOptionsMessage={() => t('general>no_opt', 'Sin opciones')}
										components={{
											Input: CustomSelectInput
										}}
										placeholder=''
										isDisabled={!currentOffer.value}
										value={currentEspecialidad}
										options={especialidadesData}
										onChange={e => {
											handleEspecialidad(e)
										}}
									/>
								</FormGroup>
							</NivelesForm>
						</Educativo>
					</Card>
					<Card style={{ maxWidth: 'inherit' }}>
						<FeedBack>
							<FeedBackTitle>
								{t(
									'configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>ofertas_relacionadas>columna_niveles_asociados',
									'Niveles Asociados'
								)}
							</FeedBackTitle>
						</FeedBack>

						{!currentEspecialidad && (
							<Landing
								txt={t(
									'expediente_ce>grupos_proyecciones>modelo_ofertas>seleccione_msj',
									'Selecciona un modelo de ofertas para ver los niveles asociados'
								)}
							/>
						)}

						{currentEspecialidad && (
							<SectionTable>
								<TableReactImplementation columns={columns} data={nivelesData} />
							</SectionTable>
						)}
					</Card>
				</Container>
			)}
			{showForm && (
				<GruposNivel
					currentLevel={currentLevel}
					currentYear={state.selectedActiveYear}
					createGroup={actions.createGroup}
					getGroupsByLevelAnio={actions.getGroupsByLevelAnio}
					currentOfferName={currentOffer.modeloOfertaNombre}
					currentEspecialidadNombre={currentEspecialidad.label}
					groups={state.groups}
					loading={state.loading}
					institution={state.institution}
					editGroup={actions.editGroup}
					deleteGroup={actions.deleteGroup}
					data={selectedRow}
				/>
			)}
		</Wrapper>
	)
}

const Wrapper = styled.div`
	padding-bottom: 20px;
`
const ContainerLanding = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: center;
	flex-flow: column;
	padding: 30px 5px;
	background: #f2f2f2;

	@media and screen (min-width: 600px) {
		padding: 30px 10px;
	}
`
const LabelStyled = styled.label`
	width: auto;
	text-align: center;
	margin: auto;
	font-size: 16px;
	margin-top: 10px;
	line-height: 16px;

	@media and screen (width: 600px) {
		width: 308px;
	}
`
const FeedBack = styled.div`
	margin-botton: 20px;
`

const FeedBackTitle = styled.h4`
	color: #000;
`

const FeedBackDescription = styled.p`
	color: #000;
`

const Educativo = styled.div``

const NivelesForm = styled.div`
	display: grid;
`

const Label = styled.label`
	color: #000;
	margin: 0;
`
const SectionTable = styled.div`
	margin-top: 10px;
`

const Container = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 20px;
	max-width: 85vw;

	@media and screen (minx-width: 900px) {
		grid-template-columns: 1fr 1fr;
		max-width: auto;
	}
`
const Card = styled.div`
	background: #fafafa;
	border-radius: 12px;
	padding: 25px;
	box-shadow: 1px 0px 10px 5px #eaeaea;
`
const UpperBanner = styled.div`
	display: flex;
	justify-content: space-between;
`
const UpperBannerItem = styled.div`
	margin-left: 5px;
	margin-right: 5px;
`

export default Grupos
