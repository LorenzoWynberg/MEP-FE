import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import useNotification from 'Hooks/useNotification'

export const ApoyosOrganizativos = () => {
	const [snackBar, handleClick] = useNotification()
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState([])

	const { t } = useTranslation()

	const onAgregarEvent = () => {
		console.log('agregar')
	}

	const columns = useMemo(() => {
		return [
			{
				Header: 'Tipo de apoyo',
				column: 'parentesco',
				accessor: 'parentesco',
				label: ''
			},
			{
				Header: 'Detalle del apoyo',
				column: 'nombre',
				accessor: 'nombre',
				label: ''
			},
			{
				Header: 'Condición del apoyo',
				column: 'primerApellido',
				accessor: 'primerApellido',
				label: ''
			},
			{
				Header: 'Fecha de aprobación',
				column: 'segundoApellido',
				accessor: 'segundoApellido',
				label: ''
			},
			{
				Header: 'Registrado por',
				column: 'registradoPor',
				accessor: 'registradoPor',
				label: ''
			},
			{
				Header: 'Fecha y hora del registro',
				column: 'encargado',
				accessor: 'encargado',
				label: ''
			},
			{
				Header: t('general>acciones', 'Acciones'),
				column: '',
				accessor: '',
				label: '',
				Cell: ({ _, row, data }) => {
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
							<button
								style={{
									border: 'none',
									background: 'transparent',
									cursor: 'pointer',
									color: 'grey'
								}}
								onClick={async () => {
									setLoading(true)
									await events.onEditarClick(fullRow.id)
									setLoading(false)
									// props.authHandler('modificar', () => {
									//   setMemberDetailOpen(true)
									// })
								}}
							>
								<Tooltip title='Actualizar'>
									<IconButton>
										<HiPencil style={{ fontSize: 30 }} />
									</IconButton>
								</Tooltip>
							</button>
							<button
								style={{
									border: 'none',
									background: 'transparent',
									cursor: 'pointer',
									color: 'grey'
								}}
								onClick={() => {
									swal({
										title: 'Eliminar Miembro',
										text: '¿Esta seguro de que desea eliminar el miembro del hogar?',
										icon: 'warning',
										className: 'text-alert-modal',
										buttons: {
											cancel: 'Cancelar',
											ok: {
												text: 'Eliminar',
												value: true,
												className: 'btn-alert-color'
											}
										}
									}).then(async result => {
										if (result) {
											const age = identification.data?.fechaNacimiento
												? moment().diff(identification.data?.fechaNacimiento, 'years', false)
												: 0
											if (
												age < 18 &&
												fullRow.encargado &&
												data.filter(el => el?.encargado).length === 1
											) {
												setSnackbarContent({
													msg: 'No se puede eliminar la relación de encargado con el estudiante, hasta que incluya un nuevo encargado',
													variant: 'error'
												})
												handleClick()

												return
											}
											if (
												(fullRow.encargadoLegal && data.length < 1) ||
												!fullRow.encargadoLegal
											) {
												setSnackbarContent({
													msg: 'No se puede eliminar la relación de encargado con el estudiante, hasta que incluya un nuevo encargado',
													variant: 'error'
												})
												handleClick()
											} else {
												setLoading(true)
												await events.onDeleteClick(fullRow.id)
												await loadFamilyMembers()
												setLoading(false)
											}
										}
									})
								}}
							>
								<Tooltip title='Deshabilitar relación'>
									<IconButton>
										<IoMdTrash style={{ fontSize: 30 }} />
									</IconButton>
								</Tooltip>
							</button>
						</div>
					)
				}
			}
		]
	}, []) //TODO JPBR ver dependencia del use memo

	return (
		<TableReactImplementation
			showAddButton
			msjButton='Agregar'
			onSubmitAddButton={() => onAgregarEvent()}
			data={data}
			columns={columns}
		/>
	)
}
