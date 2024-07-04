import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import moment from 'moment'
import { Button, InputGroupAddon } from 'reactstrap'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import { progressInCard } from 'Utils/progress'
import SimpleModal from 'Components/Modal/simple'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import Item from './item'
import ModalForm from './modal'
import Landing from '../Anio/landing'
import { sortBy } from 'lodash'
import { useTranslation } from 'react-i18next'

import {
	getAllPeriodos,
	setPeriodo,
	getPeriodoById,
	savePeriodo,
	updatePeriodo,
	deletePeriodo,
	clearPeriodoActivo,
	getPeriodosbyCalendar,
	changeStatePerido,
	getFechasBloque,
	saveFechaPeriodoPeriodo,
	cleanFechasBloque,
	desvincularPeriodoCalendario
} from 'Redux/periodos/actions'

type IProps = {
	setCurrentTab: Function
	setCurrentYear: Function
	match?: any
}

const formatter = new Intl.NumberFormat('es-NI', { maximumFractionDigits: 2 })

const Periodos: React.FC<IProps> = props => {
	const { t } = useTranslation()

	const [editable, setEditable] = useState<boolean>(false)
	const [openModalDisabled, setOpenModalDisabled] = useState<boolean>(false)
	const [snackbar, handleClick] = useNotification()
	const [data, setData] = useState([])
	const [lstPeriodos, setLstPeriodos] = useState([])
	const [modal, setModal] = useState(false)

	//
	const [txtModalHeader, setTxtModalHeader] = useState<string>(
		t(
			'configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>agregar>titulo',
			'Agregar Periodo'
		)
	)
	//
	const [errorPorcentaje, setErrorPorcentaje] = useState(false)
	const [total, setTotal] = useState<number>(0)
	const [period, setPeriod] = useState<any>(null)
	const [bloques, setBloques] = useState<any[]>([])
	//
	const [snackbarContent, setSnackbarContent] = useState({
		msg: '',
		variant: ''
	})

	const actions = useActions({
		getAllPeriodos,
		getFechasBloque,
		setPeriodo,
		getPeriodoById,
		savePeriodo,
		updatePeriodo,
		clearPeriodoActivo,
		deletePeriodo,
		getPeriodosbyCalendar,
		changeStatePerido,
		cleanFechasBloque,
		saveFechaPeriodoPeriodo,
		desvincularPeriodoCalendario
	})

	const state = useSelector((store: any) => {
		return {
			periodos: store.periodos.periodosAll.filter(i => i.esActivo) || [],
			bloques: store.periodos.bloquesPeriodoSelected,
			periodosCalendar: store.periodos.periodosCalendar,
			periodoActivo: store.periodos.periodoActivo,
			currentCalendar: store.cursoLectivo.calendarioActivo,
			years: store.educationalYear.aniosEducativos,
			errors: store.periodos.errors,
			eFields: store.periodos.fields
		}
	})
	const dateInitialCalendar = new Date(state.currentCalendar?.fechaInicioAnioEducativo)
	const dateFinalCalendar = new Date(state.currentCalendar?.fechaFinAnioEducativo)
	useEffect(() => {
		setBloques(
			state.bloques.map((item, i) => {
				return {
					...item,
					key: i + 1,
					fechaInicio: item.fechaInicio === null ? dateInitialCalendar : new Date(item.fechaInicio),
					fechaFin: item.fechaFin === null ? dateFinalCalendar : new Date(item.fechaFin),
					fechaCierre: item.fechaCierre === null ? dateFinalCalendar : new Date(item.fechaCierre),
					porcentaje: formatter.format(parseFloat(item.porcentaje))
				}
			})
		)
		const sum = state.bloques.length
			? state.bloques
					.map(o => parseFloat(formatter.format(parseFloat(o.porcentaje))))
					.reduce((a, c) => {
						return a + c
					})
			: 0
		setTotal(sum)
	}, [state.bloques])

	useEffect(() => {
		if (state.periodoActivo?.id) {
			setPeriod(state.periodoActivo.nombre)
		}
	}, [state.periodoActivo])

	useEffect(() => {
		let dta = state.periodos

		dta = state.periodos.filter(item => {
			return !state.periodosCalendar.some(x => x.id === item.id)
		})
		setLstPeriodos(dta)
	}, [state.periodos, state.periodosCalendar])

	useEffect(() => {
		const fetch = async () => {
			progressInCard(true)
			// await actions.getPeriodosbyCalendar(24)
			await actions.getPeriodosbyCalendar(state.currentCalendar.id)
			await actions.getAllPeriodos()
			progressInCard(false)
		}
		state.currentCalendar?.id && fetch()
		// fetch()
	}, [state.currentCalendar])

	useEffect(() => {
		let _data = state.periodosCalendar.map(item => {
			return {
				...item,
				fechaInicioP: item.fechaInicio ? moment(item.fechaInicio).format('DD/MM/YYYY') : 'No definido',
				fechaFinP: item.fechaFin ? moment(item.fechaFin).format('DD/MM/YYYY') : 'No definido',
				fechaCierreP: item.fechaCierre ? moment(item.fechaCierre).format('DD/MM/YYYY') : 'No definido'
			}
		})
		_data = sortBy(_data, 'id')
		setData(_data)
	}, [state.periodosCalendar])

	const clear = async () => {
		await actions.clearPeriodoActivo()
		await actions.cleanFechasBloque()
		setBloques([])
		setTxtModalHeader('Agregar periodo')
		setErrorPorcentaje(false)
		setTotal(0)
		setPeriod(null)
	}

	const closeModal = async () => {
		setModal(false)
		await clear()
	}

	const editPeriodo = async (data): Promise<void> => {
		await actions.getFechasBloque(data.id, state.currentCalendar.id)
		setPeriod(data)
		setTxtModalHeader('Editar periodo')
		setModal(true)
	}

	const addPeriodo = (el: object = {}): void => {
		setEditable(true)
		setTxtModalHeader('Agregar periodo')
		setModal(true)
	}

	const sendData = async () => {
		try {
			if (Number(total) !== 100) {
				setErrorPorcentaje(true)
				setSnackbarContent({
					variant: 'error',
					msg: 'Los bloques deben sumar el 100%'
				})
				handleClick()
				return
			}

			const _bloques = bloques.map(item => {
				return {
					id: item.fechaBloqueId,
					fechaInicio: moment(item.fechaInicio).format('YYYY/MM/DD'),
					fechaFin: moment(item.fechaFin).format('YYYY/MM/DD'),
					fechaCierre: moment(item.fechaCierre).format('YYYY/MM/DD'),
					sb_BloquesPeriodo_Id: item.id,
					sb_Calendario_Id: state.currentCalendar.id
				}
			})
			const _data = {
				id: period.id,
				fechas: _bloques,
				estado: true,
				calendarioId: state.currentCalendar.id
			}

			let response
			progressInCard(true)

			response = await actions.saveFechaPeriodoPeriodo(_data)

			progressInCard(false)

			if (!response.error) {
				await actions.getPeriodosbyCalendar(state.currentCalendar.id)

				setSnackbarContent({
					variant: 'success',
					msg: 'Registro editado con éxito'
				})

				handleClick()
				closeModal()
			} else {
				setSnackbarContent({
					variant: 'error',
					msg: 'Oops! Algo ha salido mal'
				})
				handleClick()
			}
		} catch (error) {
			console.error(error)
			setSnackbarContent({
				variant: 'error',
				msg: 'Oops! Algo ha salido mal'
			})

			handleClick()
		}
	}

	const handleToDisable = async item => {
		await actions.setPeriodo(item)
		setOpenModalDisabled(true)
	}

	const search = async e => {
		const value = e.target.value
		let _data = []
		value === ''
			? (_data = state.periodosCalendar.map(item => {
					return {
						...item,
						fechaInicioP: item.fechaInicio ? moment(item.fechaInicio).format('DD/MM/YYYY') : 'No definido',
						fechaFinP: item.fechaFin ? moment(item.fechaFin).format('DD/MM/YYYY') : 'No definido',
						fechaCierreP: item.fechaFin ? moment(item.fechaCierre).format('DD/MM/YYYY') : 'No definido'
					}
			  }))
			: (_data = data.filter(x => x.nombre.includes(value)))
		setData(_data)
	}

	const changeState = async () => {
		progressInCard(true)

		const response = await actions.desvincularPeriodoCalendario(state.periodoActivo.id, state.currentCalendar.id)
		await actions.getPeriodosbyCalendar(state.currentCalendar.id)
		progressInCard(false)

		if (response.error) {
			setSnackbarContent({
				variant: 'error',
				msg: response.error
			})
		} else {
			setSnackbarContent({
				variant: 'success',
				msg: 'Registro eliminado con éxito'
			})
		}
		setOpenModalDisabled(false)
	}

	const closeConfirmModal = async () => {
		setOpenModalDisabled(false)
		await actions.setPeriodo(null)
	}

	const onchangeBloque = (key, name, value) => {
		const _bloques = bloques
		if (name === 'fechaInicio' || name === 'fechaFin') {
			const currentDate = new Date(value)
			const fechaFin = new Date(state.currentCalendar?.fechaFinAnioEducativo)
			const fechaInicio = new Date(state.currentCalendar?.fechaInicioAnioEducativo)

			if (currentDate < fechaInicio) {
				setSnackbarContent({
					variant: 'error',
					msg: 'La fecha debe ser mayor que la fecha de inicio del curso lectivo'
				})
				handleClick()
				return
			}

			if (currentDate > fechaFin) {
				setSnackbarContent({
					variant: 'error',
					msg: 'La fecha debe ser menor que la fecha final del curso lectivo'
				})
				handleClick()
				return
			}
		}
		const _newBloques = _bloques.map(item => {
			const data =
				item.key === key
					? {
							...item,
							[name]: value
					  }
					: { ...item }
			return data
		})

		setBloques([..._newBloques])
	}

	const selectPeriodo = async e => {
		await actions.getFechasBloque(e.id, state.currentCalendar.id)
		setPeriod(e)
	}

	return (
		<div>
			{snackbar(snackbarContent.variant, snackbarContent.msg)}
			<Helmet>
				<title>Año educativo - Periodos</title>
			</Helmet>
			<Header className='mb-5'>
				<Search className='search-sm--rounded'>
					<input
						type='text'
						name='keyword'
						id='search'
						placeholder={t(
							'configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>search_placeholder',
							'Usar aquí las palabras clave que desea buscar'
						)}
						onInput={e => {}}
						onChange={e => search(e)}
					/>

					<StyledInputGroupAddon style={{ zIndex: 2 }} addonType='append'>
						<Button
							color='primary'
							className='buscador-table-btn-search'
							onClick={() => {}}
							id='buttonSearchTable'
						>
							{t('general>buscar', 'Buscar')}
						</Button>
					</StyledInputGroupAddon>
				</Search>
				<Button color='primary' onClick={() => addPeriodo()}>
					{t('general>agregar', 'Agregar')}
				</Button>
			</Header>
			<Content>
				{data.length ? (
					data.map((item, i) => {
						return <Item key={i} data={item} onDisabled={handleToDisable} onEdit={editPeriodo} />
					})
				) : (
					<Landing
						txt={t(
							'configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>mensaje_vacio',
							'Todavía no hay periodos agregados. Comienza agregando uno.'
						)}
					/>
				)}
			</Content>

			<SimpleModal
				openDialog={modal}
				onClose={closeModal}
				onConfirm={sendData}
				txtBtn={t('general>guardar', 'Guardar')}
				txtBtnCancel={t('general>cancelar', 'Cancelar')}
				title={txtModalHeader}
			>
				<ModalForm
					onchangeBloque={onchangeBloque}
					selectPeriodo={selectPeriodo}
					period={period}
					periodos={lstPeriodos}
					bloques={bloques}
					name={name}
					editable={editable}
					data={state.periodoActivo}
					errorPorcentaje={errorPorcentaje}
					total={total}
				/>
			</SimpleModal>

			{state.periodoActivo?.id && (
				<ConfirmModal
					openDialog={openModalDisabled}
					onClose={closeConfirmModal}
					onConfirm={changeState}
					colorBtn='primary'
					txtBtn={`Eliminar`}
					txtBtnCancel={t('general>cancelar', 'Cancelar')}
					msg={`¿Está seguro que desea eliminar el Periodo?`}
					title={`Eliminar Periodo`}
				/>
			)}
		</div>
	)
}

const StyledInputGroupAddon = styled(InputGroupAddon)`
	top: 0;
	right: 0;
	position: absolute;
	height: 100%;
	display: flex;
	align-items: center;
`
const Header = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
	align-items: center;
	margin-top: 10px;
`
const Content = styled.div``
const Search = styled.div`
	min-width: 50%;
`
const Empty = styled.div`
	display: flex;
	width: 100%;
	justify-content: center;
	padding: 50px 0;
	font-size: 20px;
`
export default Periodos
