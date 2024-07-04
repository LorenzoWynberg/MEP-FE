import React from 'react'
import ConfirmModal from 'Components/Modal/ConfirmModal'

const ConfirmarGemeloModal = ({ visible, setVisible, onConfirmModal, onClose }) => {
  return (
    <ConfirmModal
      openDialog={visible}
      onConfirm={() => onConfirmModal()}
      onClose={() => {
        onClose()
        setVisible(false)
      }}
      title='Confirmación'
      btnCancel
      msg='Usted está a punto de iniciar el proceso de registro de una persona gemela idéntica, esto significa que usted realizó el proceso administrativo correspondiente para validar, verificar y comprobar que efectivamente se trata de persona gemela. Por lo anterior, usted asume la responsabilidad de continuar con el registro de identidad de esta nueva persona. ¿Desea continuar?'
    />
  )
}

export default ConfirmarGemeloModal
