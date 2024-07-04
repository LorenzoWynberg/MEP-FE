import React from 'react'
import SimpleModal from 'Components/Modal/simple'
import styled from 'styled-components'

const foo = [
  {
    idNombramiento: 234156,
    codigoPresupuestario: '123456',
    centroEducativo: '123456',
    codigoInstitucion: '123456',
    nombreEnIntegra: '123456',
    estrato: '123456',
    tipoNombramiento: '123456',

    cantidadLecciones: 24,
    clasePuesto: '123456',
    especialidad: '123456',
    grupoProfesional: '123456',
    condicion: '123456',
    titulo: '123456',

    Rige: '12/05/2021',
    Vence: '12/05/2021',
    estaEnLicencia: 'No',
    estaEnAscenso: 'No',
    estaIncapacitado: 'No',
    fechaDato: '12/07/2021'
  },
  {
    idNombramiento: 234156,
    codigoPresupuestario: '123456',
    centroEducativo: '123456',
    codigoInstitucion: '123456',
    nombreEnIntegra: '123456',
    estrato: '123456',
    tipoNombramiento: '123456',

    cantidadLecciones: 24,
    clasePuesto: '123456',
    especialidad: '123456',
    grupoProfesional: '123456',
    condicion: '123456',
    titulo: '123456',

    Rige: '12/05/2021',
    Vence: '12/05/2021',
    estaEnLicencia: 'No',
    estaEnAscenso: 'No',
    estaIncapacitado: 'No',
    fechaDato: '12/07/2021'
  }
]

const NombramientosIntegra = ({
  visible,
  setVisible,
  showName = false,
  datosIntegra = []
}) => {
  const buildItem = (name, value) => {
    return (
      <div>
        <span>{name}</span>
        <br />
        <span>
          <b>{value}</b>
        </span>
      </div>
    )
  }

  const buildCard = (datos, index) => {
    // const keys = Object.keys(datos)

    return (
      <div>
        {showName && index == 0
          ? (
            <div>
              <h6>Nombre completo: {datos.nombreEnIntegra} </h6>
              <h6>Identificación: {datos.codigoInstitucion} </h6>
            </div>
            )
          : null}
        <Card>
          <span>
            {' '}
            <b>
              ID NOMBRAMIENTO:{' '}
              {datos.idNombramiento || foo[0].codigoPresupuestario}
            </b>
          </span>
          <div style={{ margin: '10px 20px' }} />
          <CardTable>
            {buildItem(
              'Código presupuestario',
              datos.codigoPresupuestario || foo[0].codigoPresupuestario
            )}
            {buildItem(
              'Cantidad de lecciones',
              datos.cantidadLecciones || foo[0].cantidadLecciones
            )}
            {buildItem('Rige', datos.Rige || foo[0].Rige)}
            {buildItem(
              'Centro educativo',
              datos.centroEducativo || foo[0].centroEducativo
            )}
            {buildItem(
              'Clase de puesto',
              datos.clasePuesto || foo[0].clasePuesto
            )}
            {buildItem('Vence', datos.Vence || foo[0].Vence)}
            {buildItem(
              'Código centro educativo',
              datos.codigoInstitucion || foo[0].codigoInstitucion
            )}
            {buildItem(
              'Especialidad',
              datos.especialidad || foo[0].especialidad
            )}
            {buildItem(
              'Está en licencia',
              datos.estaEnLicencia || foo[0].estaEnLicencia
            )}
            {buildItem(
              'Nombre en integra',
              datos.nombreEnIntegra || foo[0].nombreEnIntegra
            )}
            {buildItem(
              'Grupo profesional',
              datos.grupoProfesional || foo[0].grupoProfesional
            )}
            {buildItem(
              'Está en ascenso',
              datos.estaEnAscenso || foo[0].estaEnAscenso
            )}
            {buildItem('Estrato', datos.estrato || foo[0].estrato)}
            {buildItem('Condición', datos.condicion || foo[0].condicion)}
            {buildItem(
              'Está incapacitado',
              datos.estaIncapacitado || foo[0].estaIncapacitado
            )}
            {buildItem(
              'Tipo de nombramiento',
              datos.tipoNombramiento || foo[0].tipoNombramiento
            )}
            {buildItem('Título', datos.titulo || foo[0].titulo)}
            {buildItem('Fecha del dato', datos.fechaDato || foo[0].fechaDato)}
            {/* keys.map(item => {
                    return <div>{buildItem(item, datos[item])}</div>
                }) */}
          </CardTable>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <SimpleModal
        openDialog={visible}
        btnCancel={false}
        onClose={() => setVisible(false)}
        onConfirm={() => setVisible(false)}
        colorBtn='primary'
        txtBtn='Cerrar'
        title='Ver nombramientos en INTEGRA'
      >
        <div style={{ width: '60vw', minWidth: '780px', margin: '0 20px 0 0' }}>
          {foo.map((item, index) => {
            return buildCard(item, index)
          })}
        </div>
      </SimpleModal>
    </div>
  )
}
const Card = styled.div`
  border: 2px solid #7397b5;
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
`
const CardTable = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
`
export default NombramientosIntegra
