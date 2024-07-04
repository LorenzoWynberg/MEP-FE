import React, { useRef } from 'react'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import IconMEP from 'Assets/icons/IconMEP'
import IconSABER from 'Assets/icons/IconSABER'
import { Card, CardBody, Button } from 'reactstrap'
import { useReactToPrint } from 'react-to-print'
import moment from 'moment'
import 'moment/locale/es'
import { useSelector } from 'react-redux'

const TemplateDownload = (props) => {
  const componentRef = useRef()

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current
  }, [componentRef.current])

  const handlePrint = useReactToPrint({
    content: reactToPrintContent
  })

  const state = useSelector((store: any) => {
    return {
      selectedActiveYear: store.authUser.selectedActiveYear,
      currentInstitution: store.authUser.currentInstitution,
      institucion: store.institucion.institutionWithCircularRegional
    }
  })

  return (
    <div>
      <Card>
        <div ref={componentRef}>
          <CardBody>
            <HeaderContainer>
              <IconLeft className='LR'>
                <IconMEP />
              </IconLeft>
              <RegionalRow className='REG'>
                <p>Ministerio de Educación pública</p>
                <p>{props.institucion?.regional[0]?.nombre}</p>
                <p>{props.institucion?.circuito[0]?.nombre}</p>
              </RegionalRow>
              <InstitutionRow className='INST'>
                <PUppercase style={{ fontWeight: 600 }}>
                  {props.institucion?.nombre}
                </PUppercase>
                <p>Teléfonos: 2222-2222</p>
                <p>Correo institucional: info@mep.go.cr</p>
              </InstitutionRow>
              <IconRight className='LL'>
                <IconSABER />
              </IconRight>
            </HeaderContainer>
            <Typography gutterBottom variant='h5' className='my-3'>
              {props.typeCertification.title}
            </Typography>
            <DescriptionHeader>
              <div>
                <PUppercase style={{ fontWeight: 600 }}>
                  Año educativo: {state.selectedActiveYear?.nombre}
                </PUppercase>
                <PUppercase style={{ fontWeight: 600 }}>
                  Grupo: {props.group.nombre}
                </PUppercase>
                <PUppercase style={{ fontWeight: 600 }}>
                  Persona Estudiante: {props.student.nombre}
                </PUppercase>
              </div>
              <div style={{ fontWeight: 600 }}>
                {moment().locale('es').format('dddd LL')}
              </div>
            </DescriptionHeader>
            <Content>{props.children}</Content>
            <Signature>
              <h2>Firma</h2>
            </Signature>
          </CardBody>
        </div>
        <ContainerButton className='container-center my-4'>
          <Button
            color='primary'
            size='lg'
            className='top-right-button'
            onClick={handlePrint}
          >
            Descargar certificación
          </Button>
        </ContainerButton>
      </Card>
    </div>
  )
}

TemplateDownload.defaultProps = {
  children: <></>,
  student: {},
  group: {},
  institucion: {},
  typeCertification: {}
}
const ContainerButton = styled.div`
  flex-flow: column;
`
const HeaderContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0px;
  grid-template-areas:
    'LL REG LR'
    'LL INST LR';
  border: 1px solid;
`
const IconLeft = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid;
  grid-area: LL;
`
const IconRight = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 1px solid;
  grid-area: LR;
`
const InstitutionRow = styled.div`
  grid-area: INST;
  padding: 1% 2%;
  p {
    margin: 0;
    font-weight: 600;
    font-size: 14px;
  }
`
const Signature = styled.div`
  display: flex;
  justify-content: center;
  margin: 5% 0 2% 0;
  h2 {
    width: 250px;
    text-align: center;
    border-top: 2px solid;
    line-height: 45px;
  }
`
const Content = styled.div``
const PUppercase = styled.div`
  text-transform: uppercase;
  margin: 0;
`
const RegionalRow = styled.div`
  border-bottom: 1px solid;
  padding: 1% 2%;
  grid-area: REG;
  text-transform: uppercase;

  p {
    margin: 0;
    font-weight: 600;
    font-size: 14px;
  }
`
const DescriptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
`
export default TemplateDownload
