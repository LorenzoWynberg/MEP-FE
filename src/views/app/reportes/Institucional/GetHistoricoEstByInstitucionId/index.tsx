import React from 'react'
import Parameters from './Parameters'
import Reporte from './Reporte'
import ReportBar from '../../_partials/ReportBar'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
import Loader from 'Components/Loader'
import useFiltroReportes from '../../_partials/useFiltroReportes'

const GetHistoricoEstByInstitucionId = ({ regresarEvent }) => {
  const [state, setState] = React.useState(0)
  const printRef = React.useRef()
  const [reportData, setReportData] = React.useState<any>()
  const [reportParameters, setReportParameters] = React.useState<any>()
  const [loader, setLoader] = React.useState(true)

  const {
    institucionId
  } = useFiltroReportes()
  const loadReportData = async (institucionId) => {
    try {
      const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/ServicioComunal/Reportes/GetHistoricoEstByInstitucionId/${institucionId}`
      )
      setReportData(response.data)
    } catch (e) {
      console.log(e)
    }
  }

  const onShowReportEvent = () => {

    loadReportData(institucionId).then(() => {
      setLoader(false)
    }) 
  }

  React.useEffect(() => {
    onShowReportEvent()
  }, [institucionId])
  return (
    <div><ReportBar
      regresarEvent={() => {
        regresarEvent()
        setState(0)
      }} imprimirRef={printRef} showBtn={state === 1}
    />
      {loader ? (
        <div style={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 20
        }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <Loader />
          </div>
        </div>
      ) : <Reporte innerRef={printRef} reportData={reportData} reportParameters={reportParameters} />}

    </div>
  )
}

export default GetHistoricoEstByInstitucionId
