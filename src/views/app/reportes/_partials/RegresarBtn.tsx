import styled from 'styled-components'
import React from 'react'
import BackIcon from '@material-ui/icons/ArrowBackIos'
import { useTranslation } from 'react-i18next'

const RegresarBtn = ({ onRegresarEvent }) => {
  const { t } = useTranslation()
  return (
    <>
      <Back onClick={() => onRegresarEvent()}>
        <BackIcon />
        <BackTitle>{t("edit_button>regresar", "Regresar")}</BackTitle>
      </Back>
    </>
  )
}

export default RegresarBtn

const Back = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 0 5px;
	margin-bottom: 20px;
`
const BackTitle = styled.span`
	color: #000;
	font-size: 14px;
	font-size: 16px;
`
