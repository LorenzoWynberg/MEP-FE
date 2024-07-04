import React from 'react'
import Icon from 'Assets/icons/calendarioPreviewCursoLectivos'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const CalendarioLanding = () => {
  const { t } = useTranslation()

  return (
    <ContainerLanding>
      <Icon />
      <LabelStyled>
        {t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>mensaje_seleccione', 'Selecciona un curso lectivo para ver los calendarios asociados')}
      </LabelStyled>
    </ContainerLanding>
  )
}

const ContainerLanding = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  flex-flow: column;
  padding: 30px 10px;
  background: #f2f2f2;
`
const LabelStyled = styled.label`
  width: 308px;
  text-align: center;
  margin: auto;
  font-size: 16px;
  margin-top: 10px;
  line-height: 16px;
`

export default CalendarioLanding
