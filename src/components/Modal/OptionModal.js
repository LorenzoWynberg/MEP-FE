import { Button, Col, Container, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'

function OptionModal({
	isOpen,
	titleHeader,
	onConfirm,
	onCancel,
	textCancel = 'Cancelar',
	textConfirm = 'Confirmar',
	size = 'lg',
	children
}) {
	return (
		<Modal isOpen={isOpen} size={size}>
			<ModalHeader>{titleHeader}</ModalHeader>
			<ModalBody>
				<Container>
					<Row>
						<Col xs={12}>{children}</Col>
					</Row>
					<Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<Button onClick={onCancel} color='primary' outline style={{ marginRight: 10 }}>
							{textCancel}
						</Button>
						<Button color='primary' onClick={onConfirm}>
							{textConfirm}
						</Button>
					</Row>
				</Container>
			</ModalBody>
		</Modal>
	)
}

export default OptionModal
