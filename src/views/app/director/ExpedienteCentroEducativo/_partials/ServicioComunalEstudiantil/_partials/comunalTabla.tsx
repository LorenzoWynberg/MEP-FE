import React, { useState, useEffect, useMemo } from 'react'
import { TableReactImplementationServicio } from 'Components/TableReactImplementationServicio'
import { Card, CardBody } from 'reactstrap'
import colors from 'Assets/js/colors'
import { useTranslation } from 'react-i18next'
import { Button } from 'Components/CommonComponents'

interface IProps {
  onlyViewModule: any
  avoidSearch: any
  hasEditAccess: any
  setEstudiantes: any
  estudiantes: any
  closeContextualMenu: any
  data: Array<any>
  handleGetData?: Function
  button: any
}

const ComunalTabla: React.FC<IProps> = props => {
  const { t } = useTranslation()
  const { data } = props

  const [students, setStudents] = useState([])

  useEffect(() => {
    const _data = data.map(mapper)
    setStudents(_data)
  }, [data])

  const mapper = el => {
    return {
      ...el,
      id: el.matriculaId,
      image: el.img,
      edad: el.edad,
      fechaNacimiento: el.fechaNacimiento,
      nacionalidad: el.nacionalidad ? el.nacionalidad : '',
      genero: el.genero ? el.genero : '',
      cuentaCorreoOffice: el.cuentaCorreoOffice ? 'Sí' : 'No'
    }
  }

  const columns = useMemo(() => {
    return [
      {
        Header: t(
          'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_id',
          'Identificación'
        ),
        accessor: 'identificacion',
        label: '',
        column: ''
      },
      {
        Header: t(
          'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_nombre',
          'Nombre completo'
        ),
        accessor: 'nombreEstudiante',
        label: '',
        column: ''
      },
      {
        Header: t(
          'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_nacionalidad',
          'Nacionalidad'
        ),
        accessor: 'nacionalidad',
        label: '',
        column: ''
      },
      {
        Header: t(
          'servicio_comunal>registro_servicio_comunal>genero',
          'genero'
        ),
        accessor: 'genero',
        label: '',
        column: ''
      },
      {
        Header: t(
          'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_fecha_nacimi',
          'Fecha de nacimiento'
        ),
        accessor: 'fechaNacimiento',
        label: '',
        column: ''
      },
      {
        Header: t('servicio_comunal>registro_servicio_comunal>edad', 'Edad'),
        accessor: 'edad',
        label: '',
        column: ''
      },

      {
        Header: t(
          'servicio_comunal>registro_servicio_comunal>discapacidad',
          'Discapacidad'
        ),
        accessor: 'discapacidad',
        label: '',
        column: ''
      },
      {
        Header: t(
          'servicio_comunal>registro_servicio_comunal>acciones',
          'Acciones'
        ),
        column: '',
        accessor: '',
        label: '',
        Cell: ({ cell, row, data }) => {
          return (
            <Button
              color="primary"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                const _row = data[row.index]
                let newEstudiantes = [...props.estudiantes]

                newEstudiantes = newEstudiantes.filter(function (obj) {
                  return obj.idEstudiante !== _row.idEstudiante
                })

                props.setEstudiantes(newEstudiantes)
              }}
            >
              {/* TODO: i18n */}
              Eliminar
            </Button>
          )
        }
      }
    ]
  }, [students])

  return (
    <Card className="my-3">
      <CardBody>
        {/* <h4>
					{t('servicio_comunal>registro_servicio_comunal>titulo', 'título')}
					<span style={{ textAlign: 'right' }}>{props.button ?? props.button}</span>
				</h4> */}
        <h4
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {t('servicio_comunal>registro_servicio_comunal>titulo', 'título')}
          <p className="m-0">{props.button ?? props.button}</p>
        </h4>
        <TableReactImplementationServicio
          avoidSearch={props.avoidSearch}
          handleGetData={() => {
            props.handleGetData()
          }}
          orderOptions={[]}
          columns={columns}
          data={students}
        />
      </CardBody>
    </Card>
  )
}

export default ComunalTabla
