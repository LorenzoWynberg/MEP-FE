import {
	Button, 
	Modal,
	ModalBody,
	ModalHeader,
	Row, Col, CustomInput
} from 'reactstrap' 
import styles from './OptionModal.css'

function CheckboxModal({
	isOpen,
	titleHeader,
	onSelect, 
	options,
	colLeftSize = 4,
	colRightSize = 8,
	hideRightCol = false,
	onConfirm = () => { },
	onCancel = () => { },
	hideCancel = true,
	textCancel = 'Cancelar',
	textConfirm = 'Confirmar',
	size = 'lg',
	hideSubmit = false,
}) {
	return (
		<Modal isOpen={isOpen} size={size} className={styles}>
			<ModalHeader>{titleHeader}</ModalHeader>
			<ModalBody>

				<Row>
					<Col xs={12}>
						{options.map((item, i) => {
							return (
								<Row key={i}>
									<Col xs={hideRightCol ? 12 : colLeftSize} className="modal-detalle-subsidio-col">
										<div>
											<CustomInput
												type="checkbox"
												label={item.nombre}
												inline
												onClick={() => onSelect(item)}
												checked={item.newChecked}
											/>
										</div>
									</Col>
									{!hideRightCol && <Col xs={colRightSize} className="modal-detalle-subsidio-col">
										<div>
											<p>
												{item.descripcion
													? item.descripcion
													: item.detalle
														? item.detalle
														: 'Elemento sin detalle actualmente'}
											</p>
										</div>
									</Col>}
								</Row>
							)
						})}
					</Col>
				</Row>
				<Row
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						paddingTop: 16
					}}
				>
					{!hideCancel && (
						<Button
							onClick={onCancel}
							color="primary"
							outline
							style={{ marginRight: 10 }}
						>
							{textCancel}
						</Button>
					)}
					{!hideSubmit && (
						<Button color="primary" onClick={onConfirm}>
							{textConfirm}
						</Button>
					)}
				</Row>
			</ModalBody>
		</Modal >
	)
}

export default CheckboxModal
