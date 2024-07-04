import React from 'react'
import Reporte from './Reporte'
import ReportBar from '../../_partials/ReportBar'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import useFiltroReportes from '../../_partials/useFiltroReportes'
import Loader from 'Components/Loader'

const ReporteAsistenciaFecha = ({ regresarEvent }) => {
  const [state, setState] = React.useState(0)
  const { institucionId, getAllInstitucionInfo } = useFiltroReportes()
  const [reportData, setReportData] = React.useState([])
  const [infoInstitucion, setInfoInstitucion] = React.useState({})
  const printRef = React.useRef()
  const [loader, setLoader] = React.useState(false)
  const loadReportData = async (institucionId, estudianteId, pageNum, pageSize) => {
    try {
      setLoader(true)
      const estudianteParam = estudianteId ? `idEstudiante=${estudianteId}&` : ''
      const institucionParam = institucionId ? `idInstitucion=${institucionId}` : ''
      const response = await axios.get<any>(
				`${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetAllDatosRptAsistenciaEstudiantes?PageNum=${pageNum}&PageSize=${pageSize}&${estudianteParam}${institucionParam}`
      )
      setLoader(false)
      setReportData(response.data)
    } catch (e) {
      console.log(e)
    }
  }
  React.useEffect(() => {
    loadReportData(institucionId, undefined, 1, 500).then(_ => setState(1))
    getAllInstitucionInfo(institucionId).then(info => setInfoInstitucion(info))
  }, [institucionId])
  return (
    <div>
      <ReportBar
        regresarEvent={() => {
			  regresarEvent()
			  setState(0)
        }} imprimirRef={printRef} showBtn={state === 1}
      />
      {/* state === 0 && <Parameters showReportEvent={() => setState(1)} /> */}
      {state === 1 && !loader && <Reporte innerRef={printRef} infoInstitucion={infoInstitucion} reportData={reportData} />}
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

export default ReporteAsistenciaFecha
