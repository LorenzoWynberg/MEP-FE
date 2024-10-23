import React from 'react'
import { Row, Col, Container, Input, Label } from 'reactstrap' 
import FormModal from 'Components/Modal/OptionModal'

const Subsidio = props => {
	const { open, titulo, toggleModal } = props

	return (
		<OptionModal isOpen={open} radioValue={props.currentSubsidio.id  } onSelect={props.handleChangeSubsidio}
		selectedId={props.currentSubsidio.id } onConfirm={() => toggleModal(true)}
		titleHeader={titulo || 'Tipo de subsidio MEP'} options={props.tipos}   />
	)
}

export default Subsidio
