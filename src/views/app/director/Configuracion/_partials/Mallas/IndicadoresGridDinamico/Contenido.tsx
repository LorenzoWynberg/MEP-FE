import React, { useEffect, useState } from 'react'
import Grid from './Grid'
import useGrid from './useGrid'
import styled from 'styled-components'
import { BlueButton, DefButton, InputColumnName } from './Styles'
import { BsPlusCircleFill } from 'react-icons/bs'

import { IoMdTrash } from 'react-icons/io'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { Button } from 'reactstrap'
import PrevisualizaIndicadores from './Prev'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import { useActions } from 'Hooks/useActions'
import { removeContenido } from '../../../../../../../redux/IndicadoresAprendizaje/actions'
import useNotification from '../../../../../../../hooks/useNotification'
import { useTranslation } from 'react-i18next'

const Contenido = ({ rubricaData = null, toggleEdit = () => { } }) => {
  const {
    Contenidos,
    onAddContenidoEvent,
    getHabilitarPuntosValue,
    onToggleHabilitarPuntos,
    onContenidoNameChange,
    setDataIndicadorState,
    saveJsonDataEvent
  } = useGrid()
  useEffect(() => {
    if (rubricaData != null) setDataIndicadorState(rubricaData.json)
  }, [])
  const [selectedIndex, setSelectedIndex] = useState(null)
  const { t } = useTranslation()
  const [dataEliminar, setDataEliminar] = useState(null)
  const [confirmModal, setConfirmModal] = useState<boolean>(false)
  const [snackBar, handleClick] = useNotification()
  const [snackbarContent, setSnacbarContent] = useState({
    msg: 'welcome',
    variant: 'info'
  })

  const actions = useActions({ removeContenido })

  const toggleSnackbar = (variant, msg) => {
    setSnacbarContent({
      variant,
      msg
    })
    handleClick()
  }

  const onRemoveContenidoEvent = (contenidoIndex) => {
    setConfirmModal(false)
    actions.removeContenido(contenidoIndex)
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
    <ContenidosContainer>
      <div style={{ marginLeft: '55rem' }}>
        <PrevisualizaIndicadores contenidos={Contenidos} />
      </div>
      <ConfirmModal
        openDialog={confirmModal}
        onClose={closeConfirmModal}
        onConfirm={() => onRemoveContenidoEvent(selectedIndex)}
        colorBtn='primary'
        msg={t('configuracion>mallas_curriculares>indicadores_aprendizaje>ver>indicador_conte_etapa>eliminar>mensaje', '¿Está seguro que desea eliminar estos indicadores?')}
        title={t('configuracion>mallas_curriculares>indicadores_aprendizaje>ver>indicador_conte_etapa>eliminar', 'Confirmar eliminar')}
      />
      {Contenidos?.map((cont, index) => <>
        <div key={-2} style={{ display: 'flex', alignContent: 'center' }}>
          <FormControlLabel
            control={
              <Checkbox checked={cont.puntos} onClick={() => onToggleHabilitarPuntos(index)} />
          }
            label={t('configuracion>mallas_curriculares>indicadores_aprendizaje>ver>habilitar_puntos', 'Habilitar puntos')}
          />
        </div>
        <Bluebox key={-1}>
          <p>{t('configuracion>mallas_curriculares>indicadores_aprendizaje>ver>indicador_conte_etapa', 'Indicador / Contenido Curricular / Etapa')}</p>
          <div style={{ display: 'flex' }} data-key={index}>
            <InputColumnName style={{ padding: '10px', margin: 0 }} onChange={(e) => onContenidoNameChange(index, e.currentTarget.value)} placeholder='Lateralidad' value={cont.nombre || rubricaData.nombre || ''} />
            <DefButton
              style={{ cursor: 'pointer' }} onClick={() => {
                openMsj()
                setSelectedIndex(index)
              }}
            >{' '}
              <IoMdTrash
                style={{ fontSize: '40px', color: 'white' }}
              />{' '}
            </DefButton>
          </div>
        </Bluebox>
        <Grid key={index} contenido={cont} contenidoIndex={index} />
      </>)}
      <div>
        <BlueButton style={{ cursor: 'pointer' }} onClick={() => onAddContenidoEvent()}>
          <BsPlusCircleFill
            style={{
              fontSize: '20px',
              color: 'white',
              marginRight: '5px'
            }}
          />
          {t('boton>general>agregrar', 'Agregar')}
        </BlueButton>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button outline color='primary' style={{ marginRight: '20px' }} onClick={() => toggleEdit()}>{t('boton>general>cancelar', 'Cancelar')} </Button>
        <Button
          onClick={() => {
            saveJsonDataEvent(rubricaData.id)
            toggleEdit()
          }} color='primary'
        >{t('boton>general>guardar', 'Guardar')}
        </Button>
      </div>
    </ContenidosContainer>
  )
}
const Bluebox = styled.div`
  display: block;
  padding: 20px;
  background: #145388;
  color: white;
  margin-bottom: 40px;
`
const ContenidosContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`

export default Contenido
