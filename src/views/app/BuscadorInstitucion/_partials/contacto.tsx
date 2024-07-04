import React, { useMemo, useState } from 'react'
import { Label, Input } from 'reactstrap'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import RedesSociales from 'Components/JSONFormParser/InputTypes/_partials/RedesSociales'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

const Contacto = ({ infoGeneral }) => {
  const socialNetworks = [
    {
      id: 1,
      name: 'facebook',
      linkBase: 'https://facebook.com/',
      text: infoGeneral.facebook
    },
    {
      id: 2,
      name: 'instagram',
      linkBase: 'https://instagram.com/',
      text: infoGeneral.instagram
    },
    {
      id: 3,
      name: 'whatsapp',
      linkBase: 'https://whatsapp.com/',
      text: infoGeneral.whatsapp
    },
    {
      id: 4,
      name: 'twitter',
      linkBase: 'https://twitter.com/',
      text: infoGeneral.whatsapp
    }
  ]
  const [redes, setRedes] = useState(socialNetworks)

  const telefonosMetadata = useMemo(() => {
    const columns = [
      {
        Header: 'Teléfonos',
        column: 'telefono',
        accessor: 'telefono',
        label: ''
      },
      {
        Header: 'Descripción',
        column: 'descripcion',
        accessor: 'descripcion',
        label: ''
      },
      {
        Header: 'Extensión',
        column: 'extension',
        accessor: 'extension',
        label: ''
      }
    ]
    let rows = []
    if (
      infoGeneral.telefonosAsociados &&
      typeof infoGeneral.telefonosAsociados === 'string'
    ) {
      rows = JSON.parse(infoGeneral.telefonosAsociados).map((i) => {
        return {
          telefono: i.numero,
          descripcion: i.nombre,
          extension: ''
        }
      })
    }

    return {
      columns,
      rows
    }
  }, [])
  return (
    <div>
      <ContactoElectronico>
        <div>
          <h5 style={{ fontWeight: 'bolder' }}> INFORMACIÓN DE CONTACTO </h5>
          <div>
            <Label>Horarios de atención</Label>
            <Input
              style={{ height: '8rem' }}
              value={infoGeneral.horarios}
              type='textarea'
              disabled
            />
          </div>
        </div>
        <div>
          <h5 style={{ fontWeight: 'bolder' }}> CONTACTOS ELECTRÓNICOS</h5>
          <div>
            <Label>Correo electrónico</Label>
            <Input value={infoGeneral.correoInstitucional} disabled />
          </div>
          <div style={{ marginTop: '10px' }}>
            <Label>Dirección web</Label>
            <Input value={infoGeneral.direccionWeb} disabled />
          </div>
        </div>
      </ContactoElectronico>
      <TelefonoRedes>
        <div>
          <h5 style={{ fontWeight: 'bolder' }}> TELÉFONOS ASOCIADOS</h5>
          <div>
            <TableReactImplementation
              data={telefonosMetadata.rows}
              handleGetData={() => {}}
              columns={telefonosMetadata.columns}
              orderOptions={[]}
              avoidSearch
            />
          </div>
        </div>
        <div>
          <h5 style={{ fontWeight: 'bolder' }}> REDES SOCIALES</h5>
          <RedesSociales
            hasEditable={false}
            socialNetworks={redes}
            handleAdd={() => {}}
            handleDelete={() => {}}
          />
        </div>
      </TelefonoRedes>
    </div>
  )
}

export default Contacto

const ContactoElectronico = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }
`

const TelefonoRedes = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }
`
