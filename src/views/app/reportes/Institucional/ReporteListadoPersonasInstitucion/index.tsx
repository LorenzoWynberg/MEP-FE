import React from 'react'
import Reporte from './Reporte'
import ReportBar from '../../_partials/ReportBar'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import useFiltroReportes from '../../_partials/useFiltroReportes'
import Loader from 'Components/Loader'

const ReporteListadoPersonasInstitucion = ({ regresarEvent }) => {
  const [state, setState] = React.useState(0)
  const [reportData, setReportData] = React.useState<any>()
  const [loader, setLoader] = React.useState(false)
  const printRef = React.useRef()
  const {
    institucionId
  } = useFiltroReportes()
  const loadReportData = async (institucionId) => {
    try {
      const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetDatosRptListadoEstudiantes?institucionId=${institucionId}`
      )
      setReportData(response.data)
    } catch (e) {
      console.log(e)
    }
  }
  const onShowReportEvent = () => {
    if (!institucionId) return

    loadReportData(institucionId).then(() => {
      setState(1)
    })
  }
  React.useEffect(() => {
    onShowReportEvent()
  }, [institucionId])
  return (
    <div>
      <ReportBar
        regresarEvent={() => {
			  regresarEvent()
			  setState(0)
        }} imprimirRef={printRef} showBtn={state === 1}
      />
      {/* state === 0 && <Parameters showReportEvent={onShowReportEvent} /> */}
      {state === 1 && !loader && <Reporte innerRef={printRef} reportData={reportData} />}
      {loader && (
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
      )}
    </div>
  )
}

export default ReporteListadoPersonasInstitucion
