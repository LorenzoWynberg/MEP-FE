import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
const formatter = Intl.DateTimeFormat('es-ES', {
  dateStyle: 'full',
  timeStyle: 'short',
  hour12: true
})

const ReportFooter = () => {
  const { t } = useTranslation()
  const state = useSelector<any, any>(store => {
    return { user: store.authUser.authObject.user }
  })
  return (
    <>
      <Linea />
      <Seccion>
        {t('reportes>institucional>emitido_por','Reporte emitido por')} {state.user.userName}, el {formatter.format(new Date(Date.now()))}
      </Seccion>
    </>
  )
}
const Seccion = styled.section`
    text-align:center;
`

const Linea = styled.hr`
	width: 100%;
	background-color: black;
	height: 1px;
	border: none;
`

export default ReportFooter
