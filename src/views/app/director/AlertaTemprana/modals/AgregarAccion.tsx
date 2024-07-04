import React, { useEffect, useMemo, useState } from 'react'

import SimpleModal from 'Components/Modal/simple'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { Input, CustomInput } from 'reactstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useSelector } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import { saveAccionAlerta } from 'Redux/alertaTemprana/actionsAlerts'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'

const AgregarAccion = ({ open = false, student, onClose, idAlerta }: any) => {
	const { institucionId } = useSelector((store: any) => {
		const currentInstitution = store.authUser.currentInstitution
		return {
			institucionId: currentInstitution?.id
		}
	})
	const { estadosAlertas } = useSelector((state: any) => state.alertaTemprana)
	const { user } = useSelector((state: any) => state.authUser.authObject)
	const [snackbar, handleClick] = useNotification()
	const [snackbarContent, setSnackbarContent] = useState({
		msg: '',
		variant: ''
	})
	const [selectedId, setSelectedId] = useState<number>()
	const [Observaciones, setObservaciones] = useState<string>()
	const [fecha, setFecha] = useState()
	const [data, setData] = useState([])

	const actions = useActions({
		saveAccionAlerta
	})

	useEffect(() => {
		setData(estadosAlertas)
	}, [estadosAlertas])

	const columns = useMemo(() => {
		return [
			{
				Header: 'Seleccione',
				accessor: 'select',
				column: 'select',
				label: 'Seleccione',
				Cell: ({ row }) => {
					return (
						<CustomInput
							type='radio'
							name='selected'
							check={true}
							onClick={() => {
								setSelectedId(row.original.id)
							}}
						/>
					)
				}
			},
			{
				Header: 'Estado',
				accessor: 'nombre',
				column: 'nombre',
				label: 'Estado'
			},
			{
				Header: 'Descripción',
				accessor: 'descripcion',
				column: 'descripcion',
				label: 'Descripción'
			}
		]
	}, [data])

	const onSave = async () => {
		const _data = {
			Observacion: Observaciones,
			Sb_alertasPorEstudianteId: idAlerta,
			SB_EstadosAlerta_id: selectedId,
			SB_matricula_id: student?.matriculaId,
			SB_institucion_id: institucionId,

			FechaEvento: fecha
		}
		const response = await actions.saveAccionAlerta(_data)
		if (response.error) {
			setSnackbarContent({
				variant: 'error',
				msg: 'Debe completar los campos requeridos'
			})
			handleClick()
		} else {
			onClose()
		}
	}
	return (
		<SimpleModal
			openDialog={open}
			onClose={onClose}
			title='Registro de acciones de seguimiento'
			onConfirm={onSave}
			txtBtn='Guardar'
			txtBtnCancel='Cerrar'
		>
			<div style={{ minWidth: '50rem' }}>
				{snackbar(snackbarContent?.variant, snackbarContent?.msg)}

				<Typography variant='subtitle1'>
					Permite registrar el estado y las acciones de seguimiento de la alerta temprana:
				</Typography>
				<TableReactImplementation avoidSearch columns={columns} data={data} />
				<div className='my-3'>
					<div>Observación</div>
					<textarea
						name='observacion'
						rows={3}
						style={{
							resize: 'none',
							width: '50%'
						}}
						value={Observaciones}
						onChange={e => {
							setObservaciones(e.target.value)
						}}
					/>
				</div>
				<div className='my-3' style={{ width: '50%' }}>
					<p> Fecha del evento</p>
					<DatePicker
						selected={fecha}
						onChange={e => {
							setFecha(e)
						}}
					/>
				</div>
				<div className='mt-3 mb-1' style={{ width: '50%' }}>
					<p>Registrador de la alerta</p>
					<Input type='text' value={user.nombre} disabled />
				</div>
			</div>
		</SimpleModal>
	)
}

export default AgregarAccion
