import React from 'react'
import styled from 'styled-components'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { useTranslation } from 'react-i18next'

const Reporte = ({ reportData, infoInstitucion, innerRef }) => {
  const { t } = useTranslation()
  const { institucionNombre } = infoInstitucion
  const tableMetadata = React.useMemo(() => {
    const columns = [
      {
        Header: t("estudiantes>buscador_per>info_cuenta>historial_cambios>colum_fecha", "Fecha"),
        accessor: 'fecha',
        label: '',
        column: ''
      },
      {
        Header: t("estudiantes>expediente>header>grupo", "Grupo"),
        accessor: 'grupo',
        label: '',
        column: ''
      },
      {
        Header: t("configuracion>centro_educativo>ver_centro_educativo>mallas_curriculares>asignatura", "Asignatura"),
        accessor: 'asignatura',
        label: '',
        column: ''
      },
      {
        Header: t("expediente_ce>horario>leccion", "Lección"),
        accessor: 'leccion',
        label: '',
        column: ''
      },
      {
        Header: t('reportes>columna>persona_estudiante','Persona Estudiante'),
        accessor: 'personaEstudiante',
        label: '',
        column: ''
      },
      {
        Header: t('reportes>columna>incidencia','Incidencia'),
        accessor: 'incidencia',
        label: '',
        column: ''
      }
    ]
    const mapear = (item) => {
      return {
        fecha: item.fechaAsistencia,
        grupo: item.grupo,
        asignatura: item.nombreAsignatura,
        leccion: item.leccion,
        personaEstudiante: item.estudiante,
        incidencia: item.incidencia
      }
    }
    const data = reportData ? reportData?.map(mapear) : []

    return {
      columns,
      data
    }
  }, [t])
  return (
    <div ref={innerRef}>
      <Card>
        <h3>{t('reportes>asistencia_por_fecha','ASISTENCIA POR FECHA')}</h3>
        <p style={{textTransform: 'uppercase'}}>{t("expediente_ce>ofertas_educativas>curso_lectivo_año educativo", "Año educativo")}: 2021</p>
        <p>{t("estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>centro_ed", "CENTRO EDUCATIVO:")} {institucionNombre}</p>
        {/* <p>DIRECCION REGIONAL: ALAJUELA</p>
				<p>CIRCUITO: 01</p>
				<p>INSTITUCION: 6800 - BILINGUE LLAMA DEL BOSQUE</p> */}
        <TableReactImplementation
          avoidSearch
          columns={tableMetadata.columns}
          data={tableMetadata.data}
        />
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

export default Reporte
