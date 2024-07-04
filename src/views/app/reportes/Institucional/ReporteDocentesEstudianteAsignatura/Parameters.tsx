import React from 'react'
import ReportParameterCard from '../../_partials/ReportParameterCard'
import useFiltroReportes from '../../_partials/useFiltroReportes'
const initialState = [
  {
    key: 'grupoId',
    label: 'Grupo',
    items: []
  },
  {
    key: 'personaId',
    label: 'Persona Estudiante',
    items: []
  }
]
const Parameters = ({ showReportEvent, reportLoader = false }) => {
  const {
    selects, setSelectInitialState, setSelectItems,
    institucionId, getGruposByInstitucionId, getEstdiantesByGrupoId
  } = useFiltroReportes()

  const [loader, setLoader] = React.useState(false)

  React.useEffect(() => {
    setSelectInitialState(initialState)
    const fetch = async () => {
      setLoader(true)
      const gruposArr = await getGruposByInstitucionId(institucionId)
      const mapeador = (item) => {
        return { value: item.id, label: item.nombre }
      }
      setLoader(false)
      const onChange = (obj) => {
        getEstdiantesByGrupoId(obj.value).then((estudianteArr) => {
          setSelectItems(1, estudianteArr.map(mapeador), null)
        })
      }
      setSelectItems(0, gruposArr.map(mapeador), onChange)
    }
    fetch()
  }, [])

  return (
    <div>
      <ReportParameterCard
        titulo='Docentes por todos personas estudiante por asignatura'
        texto='Seleccione el grupo y la persona estudiante'
        selects={selects}
        loader={(loader || reportLoader)}
        onBtnGenerarEvent={(obj) => {
          if (showReportEvent) { showReportEvent(obj) }
        }}
      />
    </div>
  )
}

export default Parameters
