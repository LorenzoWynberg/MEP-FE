import React from 'react'
import { Row, Col, Container, Input, Label } from 'reactstrap'
import FormModal from 'Components/Modal/FormModal'

const Subsidio = props => {
	const { open, titulo, toggleModal } = props

	return (
		<FormModal
			isOpen={open}
			titleHeader={titulo || 'Tipo de subsidio MEP'}
			onCancel={toggleModal}
			onConfirm={() => toggleModal(true)}
		>
			<Container className="modal-detalle-subsidio">
				<Row>
					<Col xs={12}>
						{props.tipos.map(item => {
							return (
								<Row
									className="py-2"
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										borderBottom: '1px solid #d7d7d7'
									}}
								>
									<Col sm={4} className="">
										<Label className="cursor-pointer">
											<Input
												type="radio"
												inline
												onClick={() => props.handleChangeSubsidio(item)}
												checked={props.currentSubsidio.id === item.id}
											/>
											<p>{item.nombre}</p>
										</Label>
									</Col>
									<Col xs={8} className="">
										<p>
											{item.detalle
												? item.detalle
												: item.descripcion
												? item.descripcion
												: 'Elemento sin detalle actualmente'}
										</p>
									</Col>
								</Row>
							)
						})}
					</Col>
				</Row>
			</Container>
		</FormModal>
	)
}

export default Subsidio
