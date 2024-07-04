import React from 'react'

import SimpleModal from 'Components/Modal/simple'
import { Input } from 'reactstrap'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

const VerAccion = ({ open = false, onClose, data }) => {
	return (
		<div>
			<SimpleModal openDialog={open} onClose={onClose} title='Visualizar la acción' btnSubmit={false}>
				<div>
					<div style={{ fontSize: '1rem' }}>
						Registre los eventos que permiten dar seguimiento a la alerta registrada:
					</div>
					<div className='my-3'>
						<p>Estado:</p>
						<Input disabled type='text' style={{ width: '50%' }} value={data.estadoAlerta} />
					</div>
					<div className='my-3'>
						<div>Descripción del estado:</div>
						<textarea
							name='descripcion'
							id='descripcion'
							rows={3}
							value={data.descripcion}
							style={{
								resize: 'none',
								width: '100%'
							}}
							disabled
						/>
					</div>
					<div className='my-3'>
						<div>Observación:</div>
						<textarea
							disabled
							name='observacion'
							id='observacion'
							rows={3}
							value={data.observacion}
							style={{
								resize: 'none',
								width: '100%'
							}}
						/>
					</div>
					<div className='my-3'>
						<p>Fecha del evento:</p>
						<div style={{ width: '50%' }}>
							
							<Input
								disabled
								style={{ width: '50%' }}
								value={moment(data.fechaEvento).format('DD/MM/YYYY')}
							/>
						</div>
					</div>
					<div className='my-3'>
						<p>Registrador de la alerta:</p>
						<Input disabled type='text' style={{ width: '50%' }} value={data.usuario} />
					</div>
				</div>
			</SimpleModal>
		</div>
	)
}

export default VerAccion
