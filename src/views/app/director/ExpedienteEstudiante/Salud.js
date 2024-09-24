import { TableReactImplementation } from 'Components/TableReactImplementation'
import withAuthorization from '../../../../Hoc/withAuthorization'
import useNotification from '../../../../hooks/useNotification'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import IntlMessages from '../../../../helpers/IntlMessages'
import React, { useEffect, useState, useMemo } from 'react'
import { isEmptyNullOrUndefined } from 'Utils/validators'
import CofirmModal from 'Components/common/ConfirmModal'
import BarLoader from 'Components/barLoader/barLoader'
import SaludChart from './_partials/salud/SaludChart'
import SaludForm from './_partials/salud/SaludForm'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { useTranslation } from 'react-i18next'
import Tooltip from '@mui/material/Tooltip'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { connect } from 'react-redux'
import colors from 'Assets/js/colors'
import { clamp } from 'lodash'

import {
	addSalud,
	editSalud,
	deleteSalud,
	getSaludItems,
	setCurrentItem,
	cleanCurrentSaludItem
} from 'Redux/salud/actions'

const Salud = props => {
	const { t } = useTranslation()
	const state = useSelector(store => {
		return {
			identification: store.identification
		}
	})
	const identificacion = state.identification.data.identificacion
	const nacionalItem = state.identification.data.datos.find(
		item => item.catalogoId === 1 && item.elementoId === 1
	)
	const nacional = nacionalItem !== undefined

	const {
		salud,
		identidadId,
		addSalud,
		editSalud,
		deleteSalud,
		getSaludItems,
		setCurrentItem,
		cleanCurrentSaludItem
	} = props

	const [loading, setLoading] = useState(false)
	const [addEdit, setAddEdit] = useState(false)
	const [saludItem, setSaludItem] = useState({})
	const [editable, setEditable] = useState(false)
	const [openConFirm, setOpenConFirm] = useState(false)
	const [itemToDelete, setItemToDelete] = useState({})
	const [snackbarContent, setSnackbarContent] = useState({
		msg: 'welcome',
		variant: 'info'
	})
	const [snackBar, handleClick] = useNotification()

	useEffect(() => {
		const fetchItems = async () => {
			await getSaludItems(identidadId)
		}
		fetchItems()
	}, [identidadId])

	useEffect(() => {
		setSaludItem(salud.currentItem)
	}, [salud.currentItem, editable])

	const clearSaludItem = () => {
		setSaludItem({})
	}

	const columns = useMemo(
		() => [
			{
				column: 'seguroSocial',
				label: 'Número de seguro social',
				Header: t(
					'estudiantes>expediente>salud>col_num_seguro',
					'Número de seguro social'
				),
				accessor: 'seguroSocial'
			},
			{
				column: 'date',
				label: 'Fecha del registro del sistema',
				Header: t(
					'estudiantes>expediente>salud>col_fecha_registro',
					'Fecha del registro del sistema'
				),
				accessor: 'date'
			},
			{
				column: 'usuario',
				label: 'Usuario que registró el dato',
				Header: t(
					'estudiantes>expediente>salud>col_usuario_registro',
					'Usuario que registró el dato'
				),
				accessor: 'usuario'
			},
			{
				column: 'peso',
				label: 'Peso (kg)',
				Header: t('estudiantes>expediente>salud>peso', 'Peso (kg)'),
				accessor: 'peso',
				width: 15,
				sum: 0
			},
			{
				column: 'talla',
				label: 'Talla (cm)',
				Header: t('estudiantes>expediente>salud>talla', 'Talla (cm)'),
				accessor: 'talla',
				width: 15,
				sum: 3
			},
			{
				column: 'imc',
				label: 'Índice de masa corporal (imc)',
				Header: t(
					'estudiantes>expediente>salud>imc',
					'Índice de masa corporal (imc)'
				),
				accessor: 'imc'
			},
			{
				column: 'actions',
				label: 'Acciones',
				Header: t('general>acciones', 'Acciones'),
				accessor: 'actions',
				Cell: ({ row }) => showActions(row)
			}
		],
		[t]
	)

	const showActions = row => {
		return (
			<div
				className="d-flex justify-content-center align-items-center"
				style={{ cursor: 'pointer' }}
			>
				<Tooltip title={t('general>editar', 'Editar')}>
					<EditIcon
						style={
							props.validations.modificar
								? { color: colors.darkGray }
								: { display: 'none' }
						}
						onClick={() => {
							setAddEdit(true)
							setCurrentItem(row.original.id)
							setEditable(true)
						}}
					/>
				</Tooltip>
				<Tooltip title={t('general>eliminar', 'Eliminar')}>
					<DeleteIcon
						style={
							props.validations.eliminar
								? { color: colors.darkGray }
								: { display: 'none' }
						}
						onClick={() => handleDelete(row.original)}
					/>
				</Tooltip>
			</div>
		)
	}

	const handleDelete = data => {
		setItemToDelete(data)
		setOpenConFirm(true)
	}

	const onCloseDialogDelete = () => {
		setOpenConFirm(false)
		setItemToDelete({})
	}

	const onConfirmDialogDelete = () => {
		setLoading(true)
		setOpenConFirm(false)
		onSelectRowDelete()
	}

	const onSelectRowDelete = async () => {
		const response = await deleteSalud(itemToDelete.id)
		if (response.error) {
			setSnackbarContent({
				variant: 'error',
				msg: <IntlMessages id="error.delete" />
			})
		} else {
			setSnackbarContent({
				variant: 'info',
				msg: <IntlMessages id="done.delete" />
			})
		}
		setLoading(false)
		handleClick()
	}

	const handleModal = (data, edit = false) => {
		setAddEdit(true)
		setCurrentItem(edit ? data.id : {})
		setEditable(true)
	}

	const getIMC = (peso, talla) => {
		if (isNaN(peso) || isNaN(talla) || peso === 0 || talla === 0) return ''
		return (peso / Math.pow(talla / 100, 2)).toFixed(2)
	}

	const handleChange = e => {
		const { name, value } = e.target
		let newValue = value

		if (name === 'peso') {
			const parsedValue = parseInt(value, 10)
			newValue = isNaN(parsedValue) ? '' : clamp(parsedValue, 1, 250)
		} else if (name === 'talla') {
			const parsedValue = parseInt(value, 10)
			newValue = isNaN(parsedValue) ? '' : clamp(parsedValue, 1, 250)
		}

		const saludItemChanged = { ...saludItem, [name]: newValue }

		setSaludItem({
			...saludItemChanged,
			seguroSocial: !nacional ? saludItemChanged.seguroSocial : identificacion,
			imc: getIMC(saludItemChanged.peso, saludItemChanged.talla)
		})
	}

	const sendData = async () => {
		let _data = {
			id: saludItem.id,
			identidadId,
			seguroSocial: saludItem.seguroSocial,
			peso: isEmptyNullOrUndefined(saludItem.peso) ? 0 : saludItem.peso,
			talla: isEmptyNullOrUndefined(saludItem.talla) ? 0 : saludItem.talla,
			imc: isEmptyNullOrUndefined(saludItem.imc) ? 0 : saludItem.imc
		}

		let response
		if (!_data.id) {
			response = await addSalud(_data)
		} else {
			response = await editSalud(_data)
		}

		if (response.error) {
			setSnackbarContent({
				variant: 'error',
				msg: response.error
			})
		} else {
			const msgText = !_data.id ? 'agregados' : 'actualizados'
			setSnackbarContent({
				variant: 'success',
				msg: `Datos ${msgText} con exito`
			})
			cleanCurrentSaludItem()
			setAddEdit(false)
			setEditable(false)
		}
		handleClick()
	}

	const showSnackbar = (variant, msg) => {
		setSnackbarContent({
			variant,
			msg
		})
	}

	if (loading) {
		return <BarLoader />
	}

	return (
		<>
			{!addEdit ? (
				<>
					{snackBar(snackbarContent.variant, snackbarContent.msg)}
					<h4>
						{t('estudiantes>expediente>salud>titulo', 'Información de salud')}
					</h4>
					<br />
					{salud.items.length > 0 ? <SaludChart items={salud.items} /> : null}

					<h4>
						{t(
							'estudiantes>expediente>salud>valoracion_nutri',
							'Valoración nutricional'
						)}
					</h4>

					<br />
					<div className="mb-5">
						<TableReactImplementation
							showAddButton={props.validations.agregar}
							onSubmitAddButton={handleModal}
							msjButton="Agregar"
							columns={columns}
							data={salud.items}
							avoidSearch
						/>
					</div>
					{openConFirm && (
						<CofirmModal
							openDialog={openConFirm}
							onClose={onCloseDialogDelete}
							onConfirm={onConfirmDialogDelete}
						/>
					)}
				</>
			) : (
				<>
					<NavigationContainer
						onClick={e => {
							setAddEdit(false)
							clearSaludItem()
						}}
					>
						<ArrowBackIosIcon />
						<h4>{t('edit_button>regresar', 'REGRESAR')}</h4>
					</NavigationContainer>
					<SaludForm
						setEditable={value =>
							props.authHandler(
								'modificar',
								() => setEditable(value),
								showSnackbar
							)
						}
						editable={editable}
						handleChange={handleChange}
						loading={salud.loading}
						sendData={() =>
							props.authHandler('modificar', sendData, showSnackbar)
						}
						data={saludItem}
						fields={salud.errorFields}
						messages={salud.errorMessages}
						clearSaludItem={clearSaludItem}
						identificacion={identificacion}
						nacional={nacional}
					/>
				</>
			)}
		</>
	)
}

const NavigationContainer = styled.span`
	display: flex;
	cursor: pointer;
`

const mapStateToProps = reducers => {
	return {
		salud: { ...reducers.salud },
		identidadId: reducers.identification.data.id
	}
}

const mapActionsToProps = {
	addSalud,
	editSalud,
	deleteSalud,
	getSaludItems,
	setCurrentItem,
	cleanCurrentSaludItem
}

export default withAuthorization({
	id: 11,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Salud',
	Seccion: 'Salud'
})(connect(mapStateToProps, mapActionsToProps)(Salud))
