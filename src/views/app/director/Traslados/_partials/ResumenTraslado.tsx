import React, { useMemo } from 'react'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { calculateAge } from 'Utils/years'
import moment from 'moment'
import { Input, Col, Row, Container } from 'reactstrap'
import style from 'styled-components'

import { useTranslation } from 'react-i18next'

interface IProps {
	students: any[]
	columnasExtras: any[]
	institution: any
	motivoSolicitud: string
	setMotivoSolicitud: Function
}
const ResumenTraslado = (props: IProps) => {
  const { t } = useTranslation()
  const {
    students,
    institution,
    setMotivoSolicitud,
    motivoSolicitud,
    columnasExtras
  } = props

  const columns = useMemo(() => {
    return [
      {
        Header: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>acciones>condicion_propuesta>columna_codigo', 'Código'),
        column: 'codigo',
        accessor: 'codigo',
        label: ''
      },
      {
        Header: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>acciones>condicion_propuesta>columna_nombre', 'Nombre'),
        column: 'nombre',
        accessor: 'nombre',
        label: ''
      },
      {
        Header: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>acciones>condicion_propuesta>columna_tipo_centro', 'Tipo de centro educativo'),
        column: 'tipoInstitucion',
        accessor: 'tipoInstitucion',
        label: ''
      },
      {
        Header: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>acciones>condicion_propuesta>columna_ubi_administrativa', 'Ubicación administrativa'),
        column: 'regional',
        accessor: 'regional',
        label: ''
      },
      ...columnasExtras
    ]
  }, [institution, columnasExtras])

  const columnsStudents = useMemo(() => {
    return [
      {
        Header: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>acciones>estudiante_trasladar>columna_id', 'Identificación'),
        accessor: 'identificacion',
        label: '',
        column: ''
      },
      {
        Header: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>acciones>estudiante_trasladar>columna_nombre', 'Nombre completo'),
        accessor: 'nombreEstudiante',
        label: '',
        column: ''
      },
      {
        Header: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>acciones>estudiante_trasladar>columna_nacionalidad', 'Nacionalidad'),
        accessor: 'nacionalidad',
        label: '',
        column: ''
      },
      {
        Header: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>acciones>estudiante_trasladar>columna_fecha_nacimiento', 'Fecha de nacimiento'),
        accessor: 'fechaNacimiento',
        label: '',
        column: '',
        Cell: ({ row }) => {
          return (
            <div>
              {row.original?.fechaNacimiento &&
								moment(row.original?.fechaNacimiento).format(
								  'DD/MM/yyyy'
								)}
            </div>
          )
        }
      },
      {
        Header: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>acciones>estudiante_trasladar>columna_edad_cumplida', 'Edad cumplida'),
        accessor: 'edad',
        label: '',
        column: '',
        Cell: ({ row }) => {
          return (
            <div>
              {row.original?.fechaNacimiento &&
								calculateAge(row.original?.fechaNacimiento)}
            </div>
          )
        }
      },
      {
        Header: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>acciones>estudiante_trasladar>columna_nivel_actual', 'Nivel actual'),
        accessor: 'nivel',
        label: '',
        column: ''
      }
    ]
  }, [students, t])

  return (
    <Container>
      <h6 className='mb-0'>
        <strong>{t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>acciones>estudiante_trasladar', 'Estudiante a trasladar')}</strong>
      </h6>
      <p>{t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>acciones>estudiante_trasladar>texto', 'Verifique los datos del estudiante a trasladar.')}</p>
      <TableReactImplementation
        data={students}
        columns={columnsStudents}
        orderOptions={[]}
        pageSize={5}
        avoidSearch
      />
      <Row>
        <Col sm='12'>
          <h6 className='mt-2 mb-0'>
            <strong>{t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>acciones>motivo_traslado', 'Motivo del traslado')}</strong>
          </h6>
        </Col>
        <Col sm='12'>
          <p>
            {t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>acciones>motivo_traslado>texto', 'Por favor indique el motivo por el que se realiza el traslado *.')}
          </p>
        </Col>
        <Col sm='12' md='6'>
          <Input
            value={motivoSolicitud}
            type='textarea'
            name='text'
            id='exampleText'
            style={{}}
            onChange={(e) => setMotivoSolicitud(e.target.value)}
          />
        </Col>
      </Row>
      <h6 className='mt-2 mb-0'>
        <strong>{t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>acciones>condicion_propuesta', 'Condición propuesta')}</strong>
      </h6>
      <p>{t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>acciones>condicion_propuesta>texto', 'Verifique los datos de la condición propuesta.')}</p>
      <TableReactImplementation
        data={[{ ...institution }]}
        columns={columns}
        orderOptions={[]}
        pageSize={5}
        avoidSearch
      />
    </Container>
  )
}

export default ResumenTraslado
