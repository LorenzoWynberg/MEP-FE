import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { useTranslation } from 'react-i18next'
interface IProps {
  mostrarContactoInstitucion?: boolean
  regionId?: number
  circuitoId?: number
}

const initialState = {
  regionNombre: '',
  circuitoNombre: ''
}

const ReportHeader: React.FC<IProps> = (
  props = { mostrarContactoInstitucion: true }
) => {
  const { t } = useTranslation()
  const { mostrarContactoInstitucion, regionId, circuitoId } = props

  const [estado, setEstado] = React.useState(initialState)
  const state = useSelector<any, any>((store) => {
    return {
      currentInstituion: store.authUser.currentInstitution
    }
  })

  const isNull = (str, msg) => {
    if (str) return <>{msg + str} </>
    else return <></>
  }

  const fetch = async () => {
    const regionByCircuitoEndpoint = `${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetRegionByCircuitoId?circuitoId=${circuitoId}`
    const regionByIdEndpoint = `${envVariables.BACKEND_URL}/api/Admin/Regional/GetById/${regionId}`
    const circuitoByIdEnpoint = `${envVariables.BACKEND_URL}/api/Admin/Circuito/GetById/${circuitoId}`
    try {
      const retorno: any = {}
      if (circuitoId) {
        const r1 = await axios.get(regionByCircuitoEndpoint)
        retorno.regionByCircuitoData = r1.data
        const r2 = await axios.get(circuitoByIdEnpoint)
        retorno.circuitoByIdData = r2.data
      }
      if (regionId) {
        const response = await axios.get(regionByIdEndpoint)
        retorno.regionByIdData = response.data
      }

      return retorno
    } catch (e) {}
  }

  React.useMemo(() => {
    if (!regionId && !circuitoId) {
      setEstado({
        regionNombre: state.currentInstituion.regionNombre,
        circuitoNombre: state.currentInstituion.circuitoNombre
      })
    } else {
      fetch().then((data: any) => {
        const regionNombre = data?.regionByIdData
          ? data.regionByIdData.nombre
          : data.regionByCircuitoData.nombre
        const circuitoNombre = data?.circuitoByIdData
          ? data.circuitoByIdData.nombre
          : undefined
        setEstado({
          regionNombre,
          circuitoNombre
        })
      })
    }
  }, [])

  return (
    <HeaderContainer>
      <HeaderSide>
        <img alt='Profile' height='43px' src='/assets/img/LogoMepRep.jpg' />
      </HeaderSide>
      <HeaderCenter>
        <ParrafoMEP>
          {t('reportes>institucional>ministro_educacion','MINISTERIO DE EDUCACIÓN PÚBLICA')}
          <br />
          {estado.regionNombre}
          <br />
          {estado.circuitoNombre}
        </ParrafoMEP>
        {mostrarContactoInstitucion
          ? (
            <>
              <Linea />
              <Parrafo>
                {state.currentInstituion?.codigo +
                ' ' +
                state.currentInstituion?.nombre}
                <br />
                {isNull(
                  state.currentInstitution?.telefonoCentroEducativo,
                  'Teléfono: '
                )}
                {isNull(
                  state.currentInstitution?.correoInstitucional,
                  'Correo institucional: '
                )}
              </Parrafo>
            </>
            )
          : (
              ''
            )}
      </HeaderCenter>
      <HeaderSide>
        <img
          alt='saber'
          height='60px'
          src='/assets/img/saber-logo.svg'
        />
      </HeaderSide>
    </HeaderContainer>
  )
}
const ParrafoMEP = styled.p`
  font-size: 14px;
  line-height: 13px;
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 1rem;
`
const Parrafo = styled.p`
  font-size: 14px;
  line-height: 13px;
  margin-top: 1rem;
  margin-bottom: 1rem;
`
const Linea = styled.hr`
  width: 100%;
  background-color: black;
  height: 1px;
  border: none;
  margin: 0;
`

const HeaderContainer = styled.div`
  display: flex;
  width: 100%;

  justify-content: center;
  text-align: center;
`
const HeaderSide = styled.div`
  display: flex;
  width: 20%;
  border: solid 1px;
  justify-content: center;
  justify-items: center;
  align-content: center;
  align-items: center;
`
const HeaderCenter = styled.div`
  display: flex;
  width: 60%;
  flex-direction: column;
  border-top: solid 1px;
  border-bottom: solid 1px;
  justify-content: center;
  justify-items: center;
  align-content: center;
  align-items: center;
`
export default ReportHeader
