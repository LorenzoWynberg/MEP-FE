import {
	Button,
	Col,
	Container,
	Modal,
	ModalBody,
	ModalHeader,
	Row
} from 'reactstrap'
import { 
	FormControl,
	FormControlLabel, 
	Radio,
	RadioGroup, 
} from '@material-ui/core'
import styles from './OptionModal.css'

function FormModal({
	isOpen,
	titleHeader,
	onConfirm,
	onCancel = () => {},
	hideCancel = false,
	textCancel = 'Cancelar',
	textConfirm = 'Confirmar',
	size = 'lg',
	hideSubmit = false,
	children
}) {
	return (
		<Modal isOpen={isOpen} size={size} className={styles}>
			<ModalHeader>{titleHeader}</ModalHeader>
			<ModalBody>
				<Container>
					<Row>
						<Col xs={12}>{children}</Col>
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
				</Container>
			</ModalBody>
		</Modal>
	)
}

export default FormModal
