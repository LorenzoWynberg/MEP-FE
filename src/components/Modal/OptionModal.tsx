import React from 'react'
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
	RadioGroup
} from '@material-ui/core'
import styles from './OptionModal.css'

interface OptionModalProps {
	isOpen: boolean,
	titleHeader: string,
	onSelect: () => void,
	selectedId: number,
	options: { id, nombre, descripcion }[],
	colLeftSize: number,
	colRightSize: number,
	radioValue: any,
	hideRightCol: boolean,
	onConfirm: () => void,
	onCancel: () => void,
	hideCancel: boolean,
	textCancel: string,
	textConfirm: string,
	size: string,
	hideSubmit: boolean
}
function OptionModal({
	isOpen,
	titleHeader,
	onSelect,
	selectedId,
	options,
	colLeftSize,
	colRightSize,
	radioValue,
	hideRightCol = false,
	onConfirm = () => { },
	onCancel = () => { },
	hideCancel = true,
	textCancel = 'Cancelar',
	textConfirm = 'Confirmar',
	size = 'lg',
	hideSubmit = false,
}: OptionModalProps) {
	return (
		<Modal isOpen={isOpen} size={size} className={styles}>
			<ModalHeader>{titleHeader}</ModalHeader>
			<ModalBody>
				<Container>
					<Row>
						<Col xs={12}>
							<FormControl>
								<RadioGroup aria-labelledby="demo-radio-buttons-group-label" name="radio-buttons-group" value={radioValue}>
									{console.log('options', options)}
									{console.log('options', selectedId)} 
									{options &&
										options.map(item => (
											<Row className="py-2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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

export default OptionModal
