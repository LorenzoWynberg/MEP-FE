import React from 'react'
import ReportParameterCard from '../../_partials/ReportParameterCard'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { uniqWith } from 'lodash'
import useFiltroReportes from '../../_partials/useFiltroReportes'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import data from './data'
const Parameters = ({ showReportEvent, reportLoader = false }) => {
  // const [selects, setSelects] = React.useState(intialState)
  const { t } = useTranslation()
  const initialState = [
    {
      key: 'regionId',
      label: t("gestion_usuario>usuarios>regional", "Regional"),
      items: [],
      onChange: null
    },
    {
      key: 'circuitoId',
      label: t("buscador_ce>ver_centro>ubicacion_administrativa>circuito", "Circuito"),
      items: [],
      onChange: null
    }
  ]
  const [loader, setLoader] = React.useState(false)
  const { setSelectInitialState, setSelectItems, selects } = useFiltroReportes()
  const selectedYear = useSelector(store=>store.authUser.selectedActiveYear)
  const fetch = async () => {
    try {
      setLoader(true)
      const response = await axios.get<any>(
        `${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/GetAccesibilidadByUsuarioLogeadoId/2`
      )
      setLoader(false)
      const mapeador = (item) => ({ label: item.nombre, value: item.id })
      const allData = response.data
      console.log('response.data',response.data)
      const regionales = uniqWith(allData, function (a: any, b: any) {
        return a.idRegiondelCircuito == b.idRegiondelCircuito
      })
      const onChangeRegion = (obj) => {
        const filtrado = allData
          .filter((item) => item.idRegiondelCircuito == obj.value)
          .map(mapeador)
        setSelectItems(1, filtrado, null)
      }
      setSelectItems(
        0,
        regionales.map((item) => ({
          value: item.idRegiondelCircuito,
          label: item.nombreRegiondelCircuito
        })),
        onChangeRegion
      )
      return response.data
    } catch (e) {
      console.log(e)
    }
  }
  React.useMemo(() => {
    setSelectInitialState(initialState)
    fetch()
  }, [selectedYear])

  return (
    <div>
      <ReportParameterCard
        titulo={t("reportes>circuital>resumen_de_estudiantes_matriculados_por_centro_educativo", data.title)}
        texto={t('reportes>seleccionar_circuito','Seleccione el circuito')}
        selects={selects}
        loader={loader || reportLoader}
        onBtnGenerarEvent={(obj) => {
          if (showReportEvent) showReportEvent(obj)
        }}
      />
    </div>
  )
}

export default Parameters
