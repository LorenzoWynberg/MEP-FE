import React from 'react'
import ReportParameterCard from '../../_partials/ReportParameterCard'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { useSelector } from 'react-redux'
import useFiltroReportes from '../../_partials/useFiltroReportes'
import { uniqWith } from 'lodash'
import { useTranslation } from 'react-i18next'

const Parameters = ({ showReportEvent, reportLoader = false }) => {
  const { t } = useTranslation()
  const initialState = [
    {
      key: 'nivelId',
      label: t('reportes>institucional>oferta_modalidad_servicio','Oferta | Modalidad | Servicio'),
      items: [],
      onChange: null
    },
    {
      key: 'nivelOfertaId',
      label: t('reportes>institucional>nivel_especialidad','Nivel | Especialidad'),
      items: [],
      onChange: null
    }
  ]
  // const [selects, setSelects] = React.useState(initialState)
  const [loader, setLoader] = React.useState(false)
  
  const state = useSelector<any, any>((store) => {
    return { 
      institutionId: store.authUser.currentInstitution.id,
      selectedYear: store.authUser.selectedActiveYear 
    }
  })
  const { setSelectInitialState, setSelectItems, selects } = useFiltroReportes()
  const buildLabel = (item) => {
    return `${item.ofertaNombre} | ${item.modalidadNombre} | ${item.servicio}`
  }
  const mapeador = (item) => {
    const label = `${item.nivelNombre} | ${item.especialidad}`
    const reportLabel = buildLabel(item) + ' | ' + label
    return {
      reportLabel,
      label,
      value: item.nivelOfertaId,
      nivelOfertaId: item.nivelOfertaId,
      nivelId: item.nivelId,
      nivelNombre: item.nivelNombre,
      especialidadId: item.especialidadId,
      especialidadNombre: item.especialidadNombre,
      modeloOfertaId: item.modeloOfertaId,
      modeloOfertaNombre: item.modeloOfertaNombre,
      ofertaId: item.ofertaId,
      ofertaNombre: item.ofertaNombre,
      modalidadId: item.modalidadId,
      modalidadNombre: item.modalidadNombre,
      servicioId: item.servicioId,
      servicioNombre: item.servicioNombre,
      total: item.total,
      mujeres: item.mujeres,
      hombres: item.hombres,
      grupos: item.grupos,
      anioId: item.anioId,
      entidadMatriculaId: item.entidadMatriculaId,
      anio: item.anio
    }
  }
  const getUniqueNiveles = (data) => {
    const dictionary = {}
    data.forEach((item) => {
      dictionary[item.nivelId] = item.nivelNombre
    })
    const keys = Object.keys(dictionary)
    const arr = keys.map((key) => {
      return { nivelId: key, nivelNombre: dictionary[key] }
    })
    return arr
  }
  const fetch = async (institucionId) => {
    try {
      setLoader(true)
      const response = await axios.get<any>(
        `${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetOfertasMatriculasPorGenero?InstitucionId=${institucionId}`
      )
      setLoader(false)
      const allData = response.data

      const ofertaModalServValues = uniqWith(
        allData,
        function (a: any, b: any) {
          return a.ofertaModalServId == b.ofertaModalServId
        }
      )

      const onChangeModelOferta = (obj) => {
        const filtrado = allData.filter(
          (item: any) => item.ofertaModalServId == obj.ofertaModalServId
        )
        setSelectItems(1, filtrado.map(mapeador), null)
      }
      setSelectItems(
        0,
        ofertaModalServValues.map((item) => {
          return {
            label: buildLabel(item),
            value: item.ofertaModalServId,
            ...item
          }
        }),
        onChangeModelOferta
      )

      return response.data
    } catch (e) {
      console.log(e)
    }
  }
  React.useEffect(() => {
    setSelectInitialState(initialState)
    if (state.institutionId) fetch(state.institutionId)
  }, [state.institutionId,state.selectedYear])
  return (
    <div>
      <ReportParameterCard
        titulo={t('reportes>institucional>reporte_de_registro_de_estudiantes_matriculados','Reporte de Registro de estudiantes matriculados')}
        texto={t('reportes>seleccionar_parametros','Seleccione los parámetros del reporte')}
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
