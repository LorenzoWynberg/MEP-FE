import React from 'react'
import {
	Button,
	Col,
	Container,
	Modal,
	ModalBody,
	ModalHeader,
	Row,
	Input,
	Label
} from 'reactstrap'
import {
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup
} from '@material-ui/core'
import colors from 'Assets/js/colors'
import styles from './OptionModal.css'
import { CustomInput } from 'Components/CommonComponents'

interface OptionModalProps {
	isOpen: boolean,
	titleHeader: string,
	onSelect: (item: object) => void,
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
	hideSubmit: boolean,
	disabled: boolean
}
function OptionModal({
	isOpen,
	titleHeader,
	onSelect,
	selectedId,
	options,
	colLeftSize = 4,
	colRightSize = 8,
	radioValue,
	hideRightCol = false,
	onConfirm = () => { },
	onCancel = () => { },
	hideCancel = true,
	textCancel = 'Cancelar',
	textConfirm = 'Confirmar',
	size = 'lg',
	hideSubmit = false,
	disabled = false
}: OptionModalProps) {
	return (
		<Modal isOpen={isOpen} size={size} className={styles}>
			<ModalHeader>{titleHeader}</ModalHeader>
			<ModalBody>
				<Container>
					<Row >
						<Col xs={12}>
							<FormControl component="fieldset">
								<RadioGroup
									aria-labelledby="sb_condicionId"
									name="sb_condicionId"
									value={radioValue}
								>
									{options.map((item, i) => (
										<Row
											className="py-2"
											style={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												borderBottom: `1px solid ${colors.opaqueGray}`
											}}
										>
											<Col sm={hideRightCol ? 12 : colLeftSize}>
												<FormControlLabel
													value={item.id}
													control={
														<Radio
															onClick={() => onSelect(item)}

															checked={selectedId == item.id}
															style={{ color: colors.primary }}
															disabled={disabled}
														/>
													}
													label={item.nombre}
												/>
											</Col>
											{!hideRightCol && <Col sm={colRightSize}>{item.detalle && item.detalle || item.descripcion && item.descripcion}</Col>}
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
