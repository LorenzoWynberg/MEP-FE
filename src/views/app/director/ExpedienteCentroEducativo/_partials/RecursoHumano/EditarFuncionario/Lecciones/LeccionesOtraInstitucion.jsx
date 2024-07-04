import React from 'react'
import SimpleModal from 'Components/Modal/simple'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const foo = [
  {
    institucion: 'San Juan Sur',
    asignatura: 'Artes industriales',
    grupo: '7-1',
    cantidadLecciones: 5
  }, {
    institucion: 'San Juan Sur',
    asignatura: 'Artes plasticas',
    grupo: '7-2',
    cantidadLecciones: 8
  }, {
    institucion: 'San Juan Sur',
    asignatura: 'Ciencias',
    grupo: '7-3',
    cantidadLecciones: 5
  }, {
    institucion: 'San Juan Sur',
    asignatura: 'Ciencias(Biología)',
    grupo: '7-4',
    cantidadLecciones: 7
  }, {
    institucion: 'San Juan Sur',
    asignatura: 'Ciencias(Fisica)',
    grupo: '8-1',
    cantidadLecciones: 2
  }, {
    institucion: 'San Juan Sur',
    asignatura: 'Ciencias(Quimica)',
    grupo: '8-2',
    cantidadLecciones: 1
  }, {
    institucion: 'San Juan Sur',
    asignatura: 'Club',
    grupo: '8-3',
    cantidadLecciones: 6
  }, {
    institucion: 'San Juan Sur',
    asignatura: 'Geologia',
    grupo: '8-4',
    cantidadLecciones: 2
  }, {
    institucion: 'San Juan Sur',
    asignatura: 'Consejo de profesores',
    grupo: '-',
    cantidadLecciones: 1
  }
]

const LeccionesOtraInstitucion = ({ visible, setVisible }) => {
  const { t } = useTranslation()
  return (
    <>
      <SimpleModal
        openDialog={visible}
        btnCancel={false}
        onClose={() => setVisible(false)}
        onConfirm={() => setVisible(false)}
        colorBtn='primary'
        txtBtn='Cerrar'
        title={t('expediente_ce>recurso_humano>fun_ce>lecciones>ver_lecciones_otros_centros', 'Ver lecciones en otro centro educativo')}
      >
        <Table>
          <thead>
            <tr>
              <th>{t('buscador_ce>ver_centro>centro_educativo', 'Centro educativo')}</th>
              <th>{t('expediente_ce>recurso_humano>fun_ce>lecciones>asignatura', 'Asignatura')}</th>
              <th style={{ textAlign: 'center' }}>{t('expediente_ce>recurso_humano>fun_ce>lecciones>grupo', 'Grupo')}</th>
              <th style={{ textAlign: 'center' }}>{t('expediente_ce>recurso_humano>fun_ce>lecciones>cantidad_lecciones_semanales', 'Cantidad de lecciones semanales')}</th>
            </tr>
          </thead>
          <tbody>
            {foo.map((item, index) => {
					  return (
  <tr key={index}>
    <td>{item.institucion}</td>
    <td>{item.asignatura}</td>
    <td style={{ textAlign: 'center' }}>{item.grupo}</td>
    <td style={{ textAlign: 'center' }}>{item.cantidadLecciones}</td>
  </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td />
              <td />
              <td />
              <td style={{ textAlign: 'center' }}>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>agregar>total', 'Total')}: {foo.reduce((p, c) => ({ cantidadLecciones: p.cantidadLecciones + c.cantidadLecciones })).cantidadLecciones}</td>
            </tr>
          </tfoot>
        </Table>
      </SimpleModal>
    </>
  )
}

const Table = styled.table`
  width: 100%; 
  border-collapse: separate;
  border-spacing: 0px;

  thead th {
    padding: .5rem;
    background-color #145388;
    border: 1px solid #cdcdcd;
    color: #fff;
	&:last-child {
		border:1px solid #cdcdcd;
		border-radius:0 10px 0 0;
		border-radius:0 10px 0 0;
	}
	&:first-child {
		border:1px solid #cdcdcd;
		border-radius:10px 0 0 0;
	}
  }

  tbody tr {
	color: #909090;
	border:'1px solid #cdcdcd';
    &:nth-child(odd) {
      background-color: 'white';
    }
	&:nth-child(even) {
		background-color: #f2f2f2;
	}
    td {
      padding: .5rem;
      border-right: 1px solid #cdcdcd;
      border-left: 1px solid #cdcdcd;
	  border-bottom: 1px solid #cdcdcd;
    }
  }	
  tfoot tr {
	color: #909090;
	background-color: #f2f2f2;
	border:'1px solid #cdcdcd';
	&:last-child td:first-child { 
		border-bottom-left-radius: 10px; 
		border-left: 1px solid #cdcdcd;
	}
	&:last-child td:last-child { 
		border-bottom-right-radius: 10px; 
		border-right: 1px solid #cdcdcd;
	}
	td {
		padding: .5rem;
		border-bottom: 1px solid #cdcdcd;
	}
  }
`

export default LeccionesOtraInstitucion
