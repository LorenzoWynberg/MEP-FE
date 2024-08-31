import React, { useState, useEffect } from 'react'
import ApoyoEducativo from './apoyo/ApoyoEducativo'
import ApoyoItem from './apoyo/ApoyoItem'
import ApoyoHeader from './apoyo/ApoyoHeader'
import 'react-tagsinput/react-tagsinput.css'
import CollapseCard from 'Components/common/CollapseCard'
import Pagination from '../../../../../components/table/Pagination'
import { useSelector } from 'react-redux'
import { useActions } from '../../../../../hooks/useActions'
import {
	getTiposApoyos,
	getDependenciasApoyos,
	getCategoriasApoyos,
	getApoyosByType,
	addApoyo,
	deleteApoyo,
	editApoyo,
	getDiscapacidades,
	saveDiscapacidades,
	getCondiciones,
	getResources,
	clearCurrentDiscapacidades
} from '../../../../../redux/apoyos/actions'
import { getCatalogs } from '../../../../../redux/selects/actions'
import Loader from '../../../../../components/Loader'
import { catalogsEnumObj } from '../../../../../utils/catalogsEnum'
import useNotification from '../../../../../hooks/useNotification'
import { useWindowSize } from 'react-use'
import { useForm } from 'react-hook-form'
import { Container } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import ConfirmModal from '../../../../../components/common/ConfirmModal'

const General = props => {
	const { t } = useTranslation()
	const [addItems, setAddItems] = useState({})
	const [loading, setLoading] = useState(false)
	const [snackBar, handleClick] = useNotification()
	const [snackBarContent, setSnackbarContent] = useState({ varian: 'error', msg: '' })
	const { handleSubmit } = useForm()
	const { width } = useWindowSize()

	const [dataEliminar, setDataEliminar] = useState(null)
	const [confirmModalOpen, setConfirmModalOpen] = useState(false)

	const state = useSelector(store => {
		return {
			apoyos: store.apoyos,
			identification: store.matricula,
			selects: store.selects
		}
	})

	const actions = useActions({
		getResources,
		getTiposApoyos,
		getDependenciasApoyos,
		getCategoriasApoyos,
		getApoyosByType,
		addApoyo,
		deleteApoyo,
		editApoyo,
		getCatalogs,
		getDiscapacidades,
		saveDiscapacidades,
		getCondiciones,
		clearCurrentDiscapacidades
	})

	const agregarApoyo = async (data, category, categoryKeyName) => {
		if (isNaN(data.tipoDeApoyoId)) {
			showsnackBar('error', 'Debe seleccionar un tipo de apoyo.')
			return { error: 'Debe seleccionar un tipo de apoyo.' }
		}

		if (categoryKeyName === 'Apoyosmaterialesytecnológicos3' && isNaN(data.dependenciasApoyosId)) {
			showsnackBar('error', 'Debe seleccionar una dependencia de apoyo.')
			return { error: 'Debe seleccionar una dependencia de apoyo.' }
		}

		const _apoyosGuardados = state.apoyos[categoryKeyName].entityList

		const _finded = _apoyosGuardados.find(x => {
			const _fechaFinStr = x.fechaFin.substring(0, 10)
			const _fechaInicioStr = x.fechaInicio.substring(0, 10)
			return (
				x.tipoDeApoyoId === data.tipoDeApoyoId &&
				_fechaFinStr === data.fechaFin &&
				_fechaInicioStr === data.fechaInicio
			)
		})

		if (_finded !== undefined) {
			showsnackBar('error', 'Ya existe un apoyo que coincide con la información ingresada.')
			return { error: 'Ya existe un apoyo que coincide con la información ingresada.' }
		}

		return await actions.addApoyo(data, category, categoryKeyName, state.apoyos[categoryKeyName].pageNumber)
	}

	const handleDeleteApoyo = (id, categoryKeyName, category) => {
		setDataEliminar({ id, categoryKeyName, category })
		setConfirmModalOpen(true)
	}

	const editarApoyo = async (data, category, categoryKeyName) => {
		const _apoyosGuardados = state.apoyos[categoryKeyName].entityList

		const _finded = _apoyosGuardados.find(x => {
			const _fechaFinStr = x.fechaFin.substring(0, 10)
			const _fechaInicioStr = x.fechaInicio.substring(0, 10)
			return (
				x.id !== data.id &&
				x.tipoDeApoyoId === data.tipoDeApoyoId &&
				_fechaFinStr === data.fechaFin &&
				_fechaInicioStr === data.fechaInicio
			)
		})

		if (_finded !== undefined) {
			showsnackBar('error', 'Ya existe un apoyo que coincide con la información ingresada.')
			return { error: 'Ya existe un apoyo que coincide con la información ingresada.' }
		}
		return await actions.editApoyo(data, category, categoryKeyName, state.apoyos[categoryKeyName].pageNumber)
	}

	const showsnackBar = (variant, msg) => {
		setSnackbarContent({ variant, msg })
		handleClick()
	}

	useEffect(() => {
		const loadData = async () => {
			setLoading(true)
			await actions.getResources('discapacidades', state.identification.data.id)
			await actions.getResources('condiciones', state.identification.data.id)
			await actions.getTiposApoyos()
			await actions.getDependenciasApoyos()
			await actions.getCategoriasApoyos()
			await actions.getCondiciones(state.identification.data.id)
			!state.selects[catalogsEnumObj.OTRASCONDICIONES.name][0] &&
				(await actions.getCatalogs(catalogsEnumObj.OTRASCONDICIONES.id))
			!state.selects[catalogsEnumObj.DISCAPACIDADES.name][0] &&
				(await actions.getCatalogs(catalogsEnumObj.DISCAPACIDADES.id))
			await actions.getDiscapacidades(state.identification.data.id)
			setLoading(false)
		}
		loadData()

		return () => {
			actions.clearCurrentDiscapacidades()
		}
	}, [])

	useEffect(() => {
		const loadData = async () => {
			for (const category of state.apoyos.categorias) {
				setLoading(true)
				await actions.getApoyosByType(state.identification.data.id, 1, 5, category)
				setLoading(false)
			}
		}
		if (state.apoyos.categorias[0]) {
			loadData()
		}
	}, [state.apoyos.categorias])

	const confirmarEliminar = async data => {
		if (dataEliminar !== null) {
			setConfirmModalOpen(false)
			await actions.deleteApoyo(
				dataEliminar.id,
				dataEliminar.categoryKeyName,
				state.identification.data.id,
				state.apoyos[dataEliminar.categoryKeyName].pageNumber,
				dataEliminar.category
			)
			setDataEliminar(null)
		}
	}

	const closeConfirmModal = () => {
		setConfirmModalOpen(false)
		setDataEliminar(null)
	}

	if (loading) return <Loader />

	return (
		<>
			{snackBar(snackBarContent.variant, snackBarContent.msg)}
			<h4>
				{t(
					'estudiantes>matricula_estudiantil>matricular_estudiante>apoyos_educativos>apoyos_educativos',
					'Apoyos educativos'
				)}
			</h4>
			<br />
			<ApoyoEducativo
				showsnackBar={showsnackBar}
				discapacidades={state.selects[catalogsEnumObj.DISCAPACIDADES.name]}
				condiciones={state.selects[catalogsEnumObj.OTRASCONDICIONES.name]}
				identidadId={state.identification.data.id}
				otrasCondiciones={state.selects[catalogsEnumObj.OTRASCONDICIONES.name]}
				discapacidadesIdentidad={state.apoyos.discapacidadesIdentidad}
				condicionesIdentidad={state.apoyos.condicionesIdentidad}
				saveDiscapacidades={actions.saveDiscapacidades}
				apoyos={state.apoyos}
				handleSubmit={handleSubmit}
			/>

			{state.apoyos.categorias.map(categoria => {
				const storedValuesKey = categoria.nombre.replace(/\s/g, '') + `${categoria.id}`

				const totalRows =
					state.apoyos[storedValuesKey] !== undefined ? state.apoyos[storedValuesKey].entityList?.length : 0
				const _items =
					state.apoyos[storedValuesKey] !== undefined ? state.apoyos[storedValuesKey].entityList : []
				const orderedDescItems =
					_items === undefined ? [] : _items.sort((a, b) => parseInt(b.id) - parseInt(a.id))

				return (
					<>
						{state.apoyos[storedValuesKey] && (
							<CollapseCard
								showContent={totalRows > 0}
								titulo={categoria.nombre}
								label='Agregar'
								addItem={() => {
									setAddItems({ ...addItems, [storedValuesKey]: true })
								}}
							>
								<Container>
									{width > 800 && (
										<ApoyoHeader
											apoyosMateriales={storedValuesKey.search('Apoyosmateriales') !== -1}
										/>
									)}
									{!state.apoyos[storedValuesKey].loading ? (
										<>
											{orderedDescItems.map(apoyo => {
												return (
													<ApoyoItem
														showsnackBar={showsnackBar}
														apoyo={apoyo || {}}
														storedValuesKey={storedValuesKey}
														tipos={state.apoyos.tipos.filter(
															tipo => tipo.categoriaApoyoId === categoria.id
														)}
														dependencias={state.apoyos.dependencias}
														agregarApoyo={agregarApoyo}
														categoria={categoria}
														setAddItems={setAddItems}
														addItems={addItems}
														addNew={false}
														handleDeleteApoyo={handleDeleteApoyo}
														editarApoyo={editarApoyo}
														identidadesId={state.identification.data.id}
														apoyosMateriales={
															storedValuesKey.search('Apoyosmateriales') !== -1
														}
													/>
												)
											})}
											{addItems[storedValuesKey] && (
												<ApoyoItem
													showsnackBar={showsnackBar}
													apoyo={{}}
													storedValuesKey={storedValuesKey}
													tipos={state.apoyos.tipos.filter(
														tipo => tipo.categoriaApoyoId === categoria.id
													)}
													dependencias={state.apoyos.dependencias}
													agregarApoyo={agregarApoyo}
													categoria={categoria}
													setAddItems={setAddItems}
													addItems={addItems}
													addNew
													handleDeleteApoyo={handleDeleteApoyo}
													editarApoyo={editarApoyo}
													identidadesId={state.identification.data.id}
													apoyosMateriales={storedValuesKey.search('Apoyosmateriales') !== -1}
												/>
											)}
											<Pagination
												currentPage={state.apoyos[storedValuesKey].pageNumber}
												totalPage={
													state.apoyos[storedValuesKey].totalCount % 5 === 0
														? state.apoyos[storedValuesKey].totalPages
														: state.apoyos[storedValuesKey].totalPages + 1
												}
												onChangePage={async i =>
													await actions.getApoyosByType(
														state.identification.data.id,
														i,
														5,
														categoria
													)
												}
											/>
										</>
									) : (
										<div style={{ textAlign: 'center' }}>
											<Loader formLoader />
										</div>
									)}
								</Container>
							</CollapseCard>
						)}

						{confirmModalOpen && (
							<ConfirmModal
								openDialog={confirmModalOpen}
								msg='¿Está seguro que desea con esta acción?'
								title='Confirmación de eliminación'
								onClose={closeConfirmModal}
								onConfirm={confirmarEliminar}
							/>
						)}
					</>
				)
			})}
		</>
	)
}

export default General
