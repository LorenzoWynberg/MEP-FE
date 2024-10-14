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
	onCancel = () => { },
	hideCancel = false,
	textCancel = 'Cancelar',
	textConfirm = 'Confirmar',
	size = 'lg',
	hideSubmit = false,
	onSelect,
	selectedId,
	data
}) {
	return (
		<Modal isOpen={isOpen} size={size} className={styles}>
			<ModalHeader>{titleHeader}</ModalHeader>
			<ModalBody>
				<Container>
					<Row>
						<Col xs={12}>
							<FormControl>
								<RadioGroup
									aria-labelledby="demo-radio-buttons-group-label"
									name="radio-buttons-group"
								>
									{data &&
										data.map(item => (
											<Row
												className="py-2"
												style={{
													display: 'flex',
													justifyContent: 'center',
													alignItems: 'center',
													borderBottom: '1px solid #d7d7d7'
												}}
											>
												<Col sm={4}>
													<FormControlLabel
														value={item.id}
														onClick={onSelect}
														checked={selectedId == item.id}
														control={<Radio />}
														label={item.nombre}
													/>
												</Col>
												<Col sm={8}>{item.descripcion}</Col>
											</Row>
										))}
								</RadioGroup>
							</FormControl>
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
				</Container>
			</ModalBody>
		</Modal>
	)
}

export default FormModal
