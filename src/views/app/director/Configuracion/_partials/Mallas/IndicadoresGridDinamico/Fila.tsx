import React, { useState } from 'react'
import { IoMdTrash } from 'react-icons/io'
import { Td, DefButton, TextAreaCelda, CenterDiv } from './Styles'
import useGrid from './useGrid'
import { removeIndicadorRow } from '../../../../../../../redux/IndicadoresAprendizaje/actions'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import { useActions } from 'Hooks/useActions'
import { useTranslation } from 'react-i18next'

const Fila = ({ fila, contenidoIndex, filaIndex }) => {
  const { t } = useTranslation()
  const [dataEliminar, setDataEliminar] = useState(null)
  const [confirmModal, setConfirmModal] = useState<boolean>(false)
  const { onCellChange, onRowNameChange } = useGrid()
  const actions = useActions({ removeIndicadorRow })

  const onRemoveRowEvent = (contenidoIndex, rowIndex) => {
    actions.removeIndicadorRow(rowIndex, contenidoIndex)
    setConfirmModal(false)
  }

  const closeConfirmModal = () => {
    setConfirmModal(false)
    setDataEliminar(null)
  }

  const openMsj = () => {
    setConfirmModal(!confirmModal)
  }

  return (
    <>
      <Td>
        <TextAreaCelda placeholder={t('configuracion>mallas>indicadores>escriba_aqui','Escriba aquí...')} value={fila.nombre || ''} onChange={(e) => onRowNameChange(contenidoIndex, filaIndex, e.currentTarget.value)} />
      </Td>
      {fila.celdas.map((celda, index) => {
        return <Td key={index}><TextAreaCelda placeholder={t('configuracion>mallas>indicadores>escriba_aqui','Escriba aquí...')} value={celda.nombre || ''} onChange={(e) => onCellChange(contenidoIndex, filaIndex, index, e.currentTarget.value)} /></Td>
      })}
      <Td>
        <CenterDiv>
          <ConfirmModal
            openDialog={confirmModal}
            onClose={closeConfirmModal}
            onConfirm={() => onRemoveRowEvent(contenidoIndex, filaIndex)}
            colorBtn='primary'
            msg={t('configuracion>mallas_curriculares>indicadores_aprendizaje>ver>fila>eliminar>mensaje', '¿Está seguro que desea eliminar esta fila?')}
            title={t('configuracion>mallas_curriculares>indicadores_aprendizaje>ver>fila>eliminar', 'Confirmar eliminar')}
          />
          <DefButton style={{ cursor: 'pointer' }} onClick={openMsj}>
            {' '}
            <IoMdTrash
              style={{ fontSize: '40px', color: '#145388' }}
            />{' '}
          </DefButton>
        </CenterDiv>
      </Td>
    </>
  )
}

export default Fila
