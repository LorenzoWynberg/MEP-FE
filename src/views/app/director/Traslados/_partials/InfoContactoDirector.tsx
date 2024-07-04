import React, { useMemo } from 'react'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import Typography from '@material-ui/core/Typography'

interface IProps {
	director: any
}

const InfoContactoDirector: React.FC<IProps> = (props) => {
  const { director } = props

  const columns = useMemo(() => {
    return [
      {
        Header: 'Código',
        column: 'codigoCentro',
        accessor: 'codigoCentro',
        label: ''
      },
      {
        Header: 'Centro educativo',
        column: 'centro',
        accessor: 'centro',
        label: ''
      },
      {
        Header: 'Director(a)',
        column: 'nombre',
        accessor: 'nombre',
        label: ''
      },
      {
        Header: 'Teléfono',
        column: 'telefono',
        accessor: 'telefono',
        label: ''
      },
      {
        Header: 'Correo electrónico',
        column: 'correo',
        accessor: 'correo',
        label: ''
      }
    ]
  }, [director])

  return (
    <div>
      <Typography variant='body1' className='mb-2'>
        Le comunicamos que la solicitud de traslado se ha concretado. Se
        notificó al correo registrado del otro centro educativo,
        recordando que debe <strong>Aceptar </strong> o{' '}
        <strong>Rechazar </strong> la solicitud que se ha realizado.
      </Typography>
      <Typography variant='body1' className='mb-2'>
        Es importante indicarle que hasta que no se acepte la solicitud,
        la persona estudiante no estará matriculada(o) en el centro
        educativo. <br />
        Puede contactar al Director(a) para agilizar el trámite
      </Typography>

      <p>
        <strong>Datos de contacto del director</strong>
      </p>
      <TableReactImplementation
        data={[{ ...director }]}
        columns={columns}
        orderOptions={[]}
        pageSize={5}
        avoidSearch
      />
    </div>
  )
}

export default InfoContactoDirector
