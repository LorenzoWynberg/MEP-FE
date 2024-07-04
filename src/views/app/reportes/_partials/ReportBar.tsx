import React from 'react'
import styled from 'styled-components'
import { useReactToPrint } from 'react-to-print'
import RegresarBtn from '../_partials/RegresarBtn'
import { Button } from 'reactstrap'
import { BiExport } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { SiMicrosoftexcel } from 'react-icons/si'
interface IProps {
  regresarEvent?: Function
  imprimirRef: any
  showBtn: boolean
  onExcelBtnEvent?: Function
}
const ReportBar:React.FC<IProps> = (props) => {
  const { t } = useTranslation()
  const { regresarEvent, imprimirRef, showBtn, onExcelBtnEvent } = props
  const reactToPrintContent = React.useCallback(() => {
    return imprimirRef.current
  }, [imprimirRef.current])

  const handlePrint = useReactToPrint({
    content: reactToPrintContent
  })

  return (
    <Container>
      <div>
        {/* <RegresarBtn onRegresarEvent={regresarEvent} /> */}
      </div>
      <div>
        {showBtn && onExcelBtnEvent && (<Button color='primary' onClick={onExcelBtnEvent}><SiMicrosoftexcel color='WHITE' size='1rem' />{t('general>boton>exportar_excel','Exportar a Excel')}</Button>)}
        {showBtn && <Button color='primary' onClick={handlePrint}><BiExport color='WHITE' size='1rem' />{t('general>boton>imprimir','Imprimir')}</Button>}
      </div>
    </Container>
  )
}

const Container = styled.div`
    display: flex;
    justify-content: space-between;
`

export default ReportBar
