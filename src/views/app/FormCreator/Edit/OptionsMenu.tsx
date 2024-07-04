import React from 'react'
import { MenuItem } from '@material-ui/core'
import colors from 'Assets/js/colors'
import {
  ModalHeader,
  Modal,
  ModalBody,
  Row,
  Col
} from 'reactstrap'

const ItemMenu = (props) => {
  return (
    <Modal
      size='lg'
      isOpen={props.open}
      toggle={props.handleClose}
    >
      <ModalHeader toggle={props.handleClose}>Elige un tipo de pregunta</ModalHeader>
      <ModalBody>
        <Row style={{ padding: '10px', display: 'flex' }}>
          {Object.keys(props.fields).map(item => {
            return (
              <Col sm='4' style={{ marginBottom: '15px' }}>
                <MenuItem onClick={() => {
                  props.addQuestion(props.parentId, props.fields[item], props.questionId)
                  props.handleClose()
                }}
                ><span style={{ backgroundColor: '#D0DDE7', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '6px', marginRight: '4px' }}>{props.getIcon(item, colors.primary)}</span><span>{props.fields[item].typeLabel}</span>
                </MenuItem>
              </Col>
            )
          })}
        </Row>
      </ModalBody>
    </Modal>
  )
}

export default ItemMenu
