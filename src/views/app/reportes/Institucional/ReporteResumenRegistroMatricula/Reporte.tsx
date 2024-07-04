import React from 'react'
import ReportHeader from '../../_partials/ReportHeader'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const formatter = Intl.DateTimeFormat('es-ES', {
  dateStyle: 'full',
  timeStyle: 'short',
  hour12: true
})

const ReporteRegistroMatricula = ({ innerRef, reportData }) => {
  const { t } = useTranslation()
  const state = useSelector<any, any>((store) => {
    return {
      currentInstituion: store.authUser.currentInstitution,
      accessRole: store.authUser.currentRoleOrganizacion.accessRole,
      user: store.authUser.authObject.user,
      anio: store.authUser.selectedActiveYear.nombre
    }
  })
  const Row = (key, item) => {
    return (
      <tr key={key}>
        <td>{item.oferta}</td>
        <td>{item.modalidad}</td>
        <td>{item.servicioEspecialidad}</td>
        <td>{item.nivel}</td>
        <td>{item.hombres}</td>
        <td>{item.mujeres}</td>
        <td>{item.total}</td>
      </tr>
    )
  }
  const Summary = (data) => {
    const summaryData = data.reduce(
      (prev, current) => {
        const totalHombres = parseInt(prev.hombres) + parseInt(current.hombres)
        const totalMujeres = parseInt(prev.mujeres) + parseInt(current.mujeres)

        return {
          hombres: totalHombres,
          mujeres: totalMujeres,
          total: totalHombres + totalMujeres
        }
      },
      { hombres: 0, mujeres: 0, total: 0 }
    )
    return (
      <tr>
        <td />
        <td />
        <td />
        <td />

        <td>{summaryData.hombres}</td>
        <td>{summaryData.mujeres}</td>
        <td>{summaryData.total}</td>
      </tr>
    )
  }
  const TableData = React.useMemo(() => {
    const mapeador = (item: any) => {
      const isNull = (str: string, msg: string) =>
        str == null || str == undefined ? msg : str
      return {
        oferta: item.ofertaNombre,
        modalidad: item.modalidadNombre,
        servicioEspecialidad: item.servicio + ' / ' + item.especialidad,
        nivel: item.nivelNombre,
        hombres: item.hombres,
        mujeres: item.mujeres,
        total: parseInt(item.hombres) + parseInt(item.mujeres)
      }
    }

    /* const data = [
			{
				oferta: 'EDUCACIÓN TÉCNICA',
				modalidad: 'TÉCNICO DIURNO – INDUSTRIAL',
				servicioEspecialidad: 'SIN SERVICIO / MANTENIMIENTO INDUSTRIAL',
				nivel: 'DÉCIMO AÑO',
				hombres: 15,
				mujeres: 16,
				total: 	31
			},{
				oferta: 'EDUCACIÓN TÉCNICA',
				modalidad: 'TÉCNICO DIURNO – INDUSTRIAL',
				servicioEspecialidad: 'SIN SERVICIO / MANTENIMIENTO INDUSTRIAL',
				nivel: 'UNDÉCIMO AÑO',
				hombres: 10,
				mujeres: 10,
				total: 20,
			},{
				oferta: 'EDUCACIÓN TÉCNICA',
				modalidad: 'TÉCNICO DIURNO – INDUSTRIAL',
				servicioEspecialidad: 'SIN SERVICIO / MANTENIMIENTO INDUSTRIAL',
				nivel: 'DOUDÉCIMO AÑO',
				hombres: 11,
				mujeres: 11,
				total: 22,
			}
		] */
    const data = reportData?.map(mapeador) || []
    return {
      data
    }
  }, [])

  return (
    <div ref={innerRef}>
      <Card>
        <ReportHeader />
        <SeccionCentrada>
          <p>
            <b>{t("reportes>institucional>resumen_de_registro_de_matricula", "Resumen de registro de matrícula")} {state.anio}</b>
          </p>
        </SeccionCentrada>
        <SeccionTexto>
          {t('reportes>institucional>en_calidad_de_director(a_del_centro_educativo','En calidad de director(a) del centro educativo')}{' '}
          <b>
            {state.currentInstituion.codigo +
              ' ' +
              state.currentInstituion.nombre}
            , {state.currentInstituion.circuitoNombre},{' '}
            {state.currentInstituion.regionNombre}{' '}
          </b>
          {t('reportes>institucional>hago_constar_etc',', hago constar que he realizado el registro de los estudiantes matriculados en el centro educativo a mi cargo, tal y como se detalla a continuación:')}
        </SeccionTexto>
        <Table>
          <thead>
            <th>{t("configuracion>centro_educativo>ver_centro_educativo>oferta_educativa", "Oferta educativa")}</th>
            <th>{t("configuracion>centro_educativo>ver_centro_educativo>ofertas_autorizadas>modalidad", "Modalidad")}</th>
            <th>{t('reportes>servicio_especialidad','Servicio / Especialidad')}</th>
            <th>{t("configuracion>ofertas_educativas>niveles>agregar>nivel", "Nivel")}</th>
            <th>{t("estudiantes>expediente>info_gen>datos_adicionales>hombre", "Hombre")}s</th>
            <th>{t("estudiantes>expediente>info_gen>datos_adicionales>mujer", "Mujer")}s</th>
            <th>{t("configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>agregar>total", "Total")}</th>
          </thead>
          <tbody>{TableData.data.map((item, index) => Row(index, item))}</tbody>
          <tfoot>{Summary(TableData.data)}</tfoot>
        </Table>
        <SeccionEmision>
          {t('general>emite_documento','Se emite el presente documento el')}{' '}
          {formatter.format(new Date(Date.now()))}.
        </SeccionEmision>
        <SeccionFirma>
          _______________________
          <br />
          {state.user.nombre +
            ' ' +
            state.user.primerApellido +
            ' ' +
            state.user.segundoApellido}
          <br />
          {state.accessRole.rolNombre}
          <br />
          {state.currentInstituion.codigo +
            ' ' +
            state.currentInstituion.nombre}
          <br />
        </SeccionFirma>
      </Card>
    </div>
  )
}
const Card = styled.div`
  border-radius: 15px;
  min-width: 100%;
  min-height: 100%;
  border-color: gray;
  background: white;
  padding: 15px;
`
const SeccionTexto = styled.section`
  text-align: left;
  margin-top: 1rem;
  margin-bottom: 2rem;
`

const SeccionEmision = styled.section`
  text-align: left;
  margin-top: 2rem;
  margin-bottom: 5rem;
`

const SeccionFirma = styled.section`
  text-align: left;
  margin-bottom: 5rem;
`

const SeccionCentrada = styled.section`
  font-weight: bold;
  text-align: center;
  margin-top: 1rem;
`
const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  thead {
    font-width: bold;
    text-align: center;
  }
  th {
    padding: 5px;
    border: solid 1px;
  }
  td {
    text-align: center;
    border: solid 1px;
    padding: 5px;
  }
`

export default ReporteRegistroMatricula
