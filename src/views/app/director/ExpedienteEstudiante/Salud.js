import React, { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import SaludForm from './_partials/salud/SaludForm'
import HTMLTable from '../../../../components/HTMLTable'
import IntlMessages from '../../../../helpers/IntlMessages'
import SaludChart from './_partials/salud/SaludChart'
import { Button } from 'reactstrap'
import styled from 'styled-components'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import { connect } from 'react-redux'
import useNotification from '../../../../hooks/useNotification'
import CofirmModal from 'Components/common/ConfirmModal'
import EditIcon from '@material-ui/icons/Edit'
import colors from 'Assets/js/colors'
import Tooltip from '@mui/material/Tooltip'

import {
	addSalud,
	editSalud,
	deleteSalud,
	getSaludItems,
	setCurrentItem,
	cleanCurrentSaludItem
} from 'Redux/salud/actions'

import { isEmptyNullOrUndefined } from 'Utils/validators'
import withAuthorization from '../../../../Hoc/withAuthorization'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { useTranslation } from 'react-i18next'

const Salud = props => {
	const { t } = useTranslation()
	const state = useSelector(store => {
		return {
			identification: store.identification
		}
	})
	const identificacion = state.identification.data.identificacion
	const nacionalItem = state.identification.data.datos.find(item => item.catalogoId === 1 && item.elementoId === 1)
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

	const [addEdit, setAddEdit] = useState(false)
	const [editable, setEditable] = useState(false)
	const [saludItem, setSaludItem] = useState({})
	const [openConFirm, setOpenConFirm] = useState(false)
	const [itemToDelete, setItemToDelete] = useState({})

	const [snackbarContent, setSnacbarContent] = useState({
		msg: 'welcome',
		variant: 'info'
	})
	const [snackBar, handleClick] = useNotification()

	useEffect(() => {
		console.log('initialProps', state)
		const fetchItems = async () => {
			const response = await getSaludItems(identidadId)
		}

		fetchItems()
	}, [getSaludItems, identidadId])

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
				Header: t('estudiantes>expediente>salud>col_num_seguro', 'Número de seguro social'),
				accessor: 'seguroSocial'
			},
			{
				column: 'date',
				label: 'Fecha del registro del sistema',
				Header: t('estudiantes>expediente>salud>col_fecha_registro', 'Fecha del registro del sistema'),
				accessor: 'date'
			},
			{
				column: 'usuario',
				label: 'Usuario que registró el dato',
				Header: t('estudiantes>expediente>salud>col_usuario_registro', 'Usuario que registró el dato'),
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
				Header: t('estudiantes>expediente>salud>imc', 'Índice de masa corporal (imc)'),
				accessor: 'imc'
			},
			{
				column: 'actions',
				label: 'Acciones',
				Header: t('general>acciones', 'Acciones'),
				accessor: 'actions',
				Cell: ({ row }) => (
					<div className='d-flex justify-content-center align-items-center' style={{ cursor: 'pointer' }}>
						<Tooltip title={t('general>editar', 'Editar')}>
							<EditIcon
								style={{
									color: colors.darkGray
								}}
								onClick={() => {
									setAddEdit(true)
									setCurrentItem(row.original.id)
									setEditable(true)
								}}
							/>
						</Tooltip>
					</div>
				)
			}
		],
		[t]
	)

	const handleDelete = data => {
		setOpenConFirm(true)
		setItemToDelete(data)
	}
	const onCloseDialogDelete = () => {
		setOpenConFirm(false)
		setItemToDelete({})
	}
	const onConfirmDialogDelete = () => {
		setOpenConFirm(false)
		setTimeout(() => {
			onSelectRowDelete()
		}, 500)
	}
	const onSelectRowDelete = async () => {
		const response = await deleteSalud(itemToDelete.id)

		if (response.error) {
			setSnacbarContent({
				variant: 'error',
				msg: <IntlMessages id='error.delete' />
			})
		} else {
			setSnacbarContent({
				variant: 'info',
				msg: <IntlMessages id='done.delete' />
			})
		}
		handleClick()
	}
	const handleEdit = data => {
		setAddEdit(true)
		setCurrentItem(data.id)
		setEditable(true)
	}

	const actionRow = [
		{
			actionName: 'button.edit',
			actionFunction: handleEdit,
			actionDisplay: data => {
				return data.showActionRow
			}
		}
	]

	const getIMC = (peso, talla) => {
		peso = isEmptyNullOrUndefined(peso) ? 0 : peso
		talla = isEmptyNullOrUndefined(talla) ? 0 : talla
		return [peso, talla].includes(0) ? '' : parseFloat(peso / Math.pow(talla / 100, 2)).toFixed(2)
	}

	const handleChange = e => {
		const { name, value } = e.target
		const saludItemChanged = { ...saludItem, [name]: value }

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
		// if (nacional) {
		// 	_data = {
		// 		..._data,
		// 		seguroSocial: identificacion
		// 	}
		// }

		let response
		if (!_data.id) {
			response = await addSalud(_data)
		} else {
			response = await editSalud(_data)
		}

		if (response.error) {
			setSnacbarContent({
				variant: 'error',
				msg: response.error
			})
		} else {
			const msgText = !_data.id ? 'agregado' : 'actualizado'
			setSnacbarContent({
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
		setSnacbarContent({
			variant,
			msg
		})
	}
	return (
		<>
			{!addEdit ? (
				<>
					{snackBar(snackbarContent.variant, snackbarContent.msg)}
					<h4>{t('estudiantes>expediente>salud>titulo', 'Información de salud')}</h4>
					<br />
					{salud.items.length > 0 ? <SaludChart items={salud.items} /> : null}

					<h4>{t('estudiantes>expediente>salud>valoracion_nutri', 'Valoración nutricional')}</h4>

					<br />
					<div className='mb-5'>
						<TableReactImplementation
							showAddButton
							onSubmitAddButton={() => {
								props.authHandler(
									'agregar',
									() => {
										setAddEdit(true)
										setCurrentItem()
										setEditable(true)
									},
									showSnackbar
								)
							}}
							msjButton
							columns={columns}
							data={salud.items}
							avoidSearch
						/>
					</div>
					{/* <HTMLTable
            columns={columns}
            selectDisplayMode="datalist"
            data={salud.items}
            tableName="label.salud"
            showHeaders={true}
            loading={salud.loading}
            actionRow={actionRow}
            showMenu={(data) => {
              return data.showActionRow;
            }}
            PageHeading={false}
            readOnly
            disableSearch
            toggleEditModal={() => null}
            hideMultipleOptions={true}
            showHeadersCenter={false}
          /> */}
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
						setEditable={value => props.authHandler('modificar', () => setEditable(value), showSnackbar)}
						editable={editable}
						handleChange={handleChange}
						loading={salud.loading}
						sendData={() => props.authHandler('modificar', sendData, showSnackbar)}
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
