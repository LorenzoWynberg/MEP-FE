import React, { useState } from 'react'
import { Th, DefButton, InputColumnName } from './Styles'
import { ChromePicker } from 'react-color'
import styled from 'styled-components'
import useGrid from './useGrid'
import { IoMdTrash } from 'react-icons/io'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import { useActions } from 'Hooks/useActions'
import { removeIndicadorColumn } from '../../../../../../../redux/IndicadoresAprendizaje/actions'
import { useTranslation } from 'react-i18next'

function useOutsideAlerter (ref, callback) {
  React.useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside (event) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (callback) callback()
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])
}
const Columna = ({ columna, contenidoIndex, columnIndex, contenido }) => {
  const { t } = useTranslation()
  const [showColor, setShowColor] = useState<boolean>(false)
  const [dataEliminar, setDataEliminar] = useState(null)
  const [confirmModal, setConfirmModal] = useState<boolean>(false)
  const { getColor, onChangeColor, onColumnNameChange, onChangePuntosEvent } =
    useGrid()
  const actions = useActions({ removeIndicadorColumn })
  const wrapperRef = React.useRef(null)
  useOutsideAlerter(wrapperRef, () => setShowColor(false))

  const onRemoveColumnEvent = () => {
    setConfirmModal(false)
    actions.removeIndicadorColumn(columnIndex, contenidoIndex)
    setDataEliminar(null)
  }

  const openMsj = () => {
    setConfirmModal(!confirmModal)
  }

  const closeConfirmModal = () => {
    setConfirmModal(false)
    setDataEliminar(null)
  }

  return (
    <>
      <Th style={{ background: getColor(contenidoIndex, columnIndex) }}>
        <InputColumnName
          placeholder={t('configuracion>mallas>indicadores>escriba_aqui','Escriba aquí...')}
          value={columna.nombre || ''}
          onChange={(e) =>
            onColumnNameChange(
              contenidoIndex,
              columnIndex,
              e.currentTarget.value
            )}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row-reverse',
            justifyContent: 'flex-start',
            alignItems: 'center',
            alignContent: 'center'
          }}
        >
          <DefButton style={{ cursor: 'pointer' }} onClick={openMsj}>
            <IoMdTrash style={{ fontSize: '40px', backgroundColor: 'rgba(0, 0, 0, 0.08)', color: '#fff', padding: '0px', borderRadius: '50%', boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.1)' }} />
          </DefButton>
          <BtnColor
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setShowColor(!showColor)
            }}
          />
          <h6 style={{ margin: '5px', textShadow: '0px 0px 6px #000' }}>{t("configuracion>centro_educativo>agregar>color", "Color")}</h6>
          {showColor && (
            <ChromeContainer ref={wrapperRef}>
              <ChromePicker
                color={getColor(contenidoIndex, columnIndex)}
                onChange={(color) => {
                  onChangeColor(contenidoIndex, columnIndex, color.hex)
                }}
              />
            </ChromeContainer>
          )}
          <ConfirmModal
            openDialog={confirmModal}
            onClose={closeConfirmModal}
            onConfirm={onRemoveColumnEvent}
            colorBtn='primary'
            msg={t('configuracion>mallas_curriculares>indicadores_aprendizaje>ver>eliminar_columna>mensaje', '¿Está seguro que desea eliminar esta columna?')}
            title={t('configuracion>mallas_curriculares>indicadores_aprendizaje>ver>eliminar_columna>confirm', 'Confirmar eliminar')}
          />
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'left',
            width: '45%',
            alignItems: 'center'
          }}
          >
            <div>
              <InputColumnName
                style={{ height: '40px', width: '70px' }}
                type='number'
                step='1'
                min='0'
                max='100'
                hidden={!contenido.puntos}
                placeholder={t('configuracion>mallas>indicadores>puntos','Puntos')}
                value={columna.puntos || ''}
                onChange={(e) =>
                  onChangePuntosEvent(
                    contenidoIndex,
                    columnIndex,
                    e.currentTarget.value
                  )}
              />
            </div>
          </div>
        </div>
      </Th>
    </>
  )
}

const ChromeContainer = styled.div`
  position: absolute;
  z-index: 2;
  transform: translate(100px, 150px);
`

const BtnColor = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 1px solid #fff;
  background-color: transparent;
  box-shadow: 0px 0px 5px #444;
`

export default Columna
