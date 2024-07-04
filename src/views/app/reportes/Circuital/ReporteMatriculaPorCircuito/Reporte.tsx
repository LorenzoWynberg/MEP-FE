import React from 'react'
import ReportHedaer from '../../_partials/ReportHeader'
import styled from 'styled-components'
import ReportFooter from '../../_partials/ReportFooter'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const Reporte = ({ reportData, innerRef, reportParameters }) => {
  const { t } = useTranslation()
  const TableData = React.useMemo(() => {
    const mapeador = (item) => {
      return {
        codigo: item.institucionCodigo,
        institucionNombre: item.institucionNombre,
        hombres: item.hombres,
        mujeres: item.mujeres,
        todos: item.hombres + item.mujeres
      }
    }
    const data = reportData?.map(mapeador) || []
    return {
      data
    }
  }, [])

  
  const Row = (index, item) => {
    return (
      <tr key={index}>
        <td>{item.codigo}</td>
        <td>{item.institucionNombre}</td>
        <td>{item.hombres}</td>
        <td>{item.mujeres}</td>
        <td>{item.todos}</td>
      </tr>
    )
  }
  const Summary = (data) => {
    const summaryData = data.reduce(
      (prev, current) => {
        const totalHombres =
					parseInt(prev.hombres) + parseInt(current.hombres)
        const totalMujeres =
					parseInt(prev.mujeres) + parseInt(current.mujeres)

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
        <td>{summaryData.hombres}</td>
        <td>{summaryData.mujeres}</td>
        <td>{summaryData.total}</td>
      </tr>
    )
  }
  const selectedYear = useSelector(store=>store.authUser.selectedActiveYear)
  return (
    <div ref={innerRef}>
      <Card>
        <ReportHedaer
          mostrarContactoInstitucion={false}
          circuitoId={reportParameters.circuitoId.value}
        />
        <Seccion>
        {t("reportes>circuital>resumen_de_estudiantes_matriculados_por_centro_educativo", "Resumen de estudiantes matriculados por centro educativo")}, {selectedYear.nombre}
        </Seccion>
        <section>
          <Table>
            <thead>
              <th>{t("expediente_ce>informacion_general>perfil>codigo", "Código SABER")}</th>
              <th>{t("estudiantes>expediente>header>nombre_ce", "Nombre del centro educativo")}</th>
              <th>{t("estudiantes>expediente>info_gen>datos_adicionales>hombre", "Hombre")}s</th>
              <th>{t("estudiantes>expediente>info_gen>datos_adicionales>mujer", "Mujer")}s</th>
              <th>{t("configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>agregar>total", "Total")}</th>
            </thead>
            <tbody>
              {TableData.data.map((item, index) =>
							  Row(index, item)
              )}
            </tbody>
            <tfoot>{Summary(TableData.data)}</tfoot>
          </Table>
        </section>
        <section>
          <ReportFooter />
        </section>
      </Card>
    </div>
  )
}
const Seccion = styled.section`
	text-align: center;
	font-weight: bold;
	margin-top: 2rem;
	margin-bottom: 2rem;
`

const Card = styled.div`
	border-radius: 15px;
	min-width: 100%;
	min-height: 100%;
	border-color: gray;
	background: white;
	padding: 15px;
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
export default Reporte
