import React, { useState } from 'react'
import { Input, Label } from 'reactstrap'
import { WebMapView } from '../../director/ExpedienteEstudiante/_partials/contacto/MapView'
import styled from 'styled-components'

enum CatalogoType {
  zona = 'zona',
  regionSocieconomica = 'regionSocioeconomica',
  territorio = 'territorio',
}

const Ubicacion = ({
  infoGeneral,
  zonaCatalog,
  regionSocioEconomicaCatalog,
  territorioCatalog
}) => {
  const [search, setSearch] = useState(null)

  React.useEffect(() => {
    if (search) {
      search.searchTerm = 'CRI'

      if (infoGeneral.longitud && infoGeneral.latitud) {
        search.search([
          infoGeneral.longitud?.replace(/,/g, '.'),
          infoGeneral.latitud?.replace(/,/g, '.')
        ])
      } else {
        search.search(
          `${
            infoGeneral.provincia +
            ',' +
            infoGeneral.canton +
            ',' +
            infoGeneral.distrito
          }`
        )
      }
    }
  }, [search])

  const findNombreByCatalog = (id, type: CatalogoType) => {
    if (!id) return null

    const catalogos = {
      zona: zonaCatalog,
      regionSocioeconomica: regionSocioEconomicaCatalog,
      territorio: territorioCatalog
    }

    const catalogo = catalogos[type].options

    return catalogo.find((i) => i.id == id)?.nombre
  }

  return (
    <div>
      <AdministrativaGeografica>
        <div>
          <h5 style={{ fontWeight: 'bolder' }}>UBICACIÓN ADMINISTRATIVA</h5>
          <div>
            <div style={{ width: '100%' }}>
              <Label>Dirección regional</Label>
              <Input value={infoGeneral.regional} disabled />
            </div>
            <div style={{ width: '100%', marginTop: '3.5%' }}>
              <Label>Circuito</Label>
              <Input value={infoGeneral.circuito} disabled />
            </div>
          </div>
        </div>
        <div>
          <h5 style={{ fontWeight: 'bolder', marginTop: '3%' }}>
            UBICACIÓN POBLACIONAL
          </h5>
          <div>
            <div style={{ width: '100%' }}>
              <Label>Región socioeconómica</Label>
              <Input
                value={findNombreByCatalog(
                  infoGeneral.regionSocioeconomica,
                  CatalogoType.regionSocieconomica
                )}
                disabled
              />
            </div>
            <div style={{ width: '100%', marginTop: '2%' }}>
              <Label>Zona</Label>
              <Input
                value={findNombreByCatalog(infoGeneral.zona, CatalogoType.zona)}
                disabled
              />
            </div>
            <div style={{ width: '100%', marginTop: '2%' }}>
              <Label>Tipo de territorio</Label>
              <Input
                value={findNombreByCatalog(
                  infoGeneral.tipoTerritorio,
                  CatalogoType.zona
                )}
                disabled
              />
            </div>
          </div>
        </div>
      </AdministrativaGeografica>
      <Poblacional>
        <div>
          <h5 style={{ fontWeight: 'bolder' }}>UBICACIÓN GEOGRÁFICA</h5>
          <div className='data'>
            <div style={{ width: '100%' }}>
              <Label>Provincia</Label>
              <Input value={infoGeneral.provincia} disabled />
            </div>
            <div style={{ width: '100%' }}>
              <Label>Cantón</Label>
              <Input value={infoGeneral.canton} disabled />
            </div>
            <div style={{ width: '100%' }}>
              <Label>Distrito</Label>
              <Input value={infoGeneral.distrito} disabled />
            </div>
            <div style={{ width: '100%' }}>
              <Label>Poblado</Label>
              <Input value={infoGeneral.poblado} disabled />
            </div>
            <div style={{ width: '100%' }}>
              <Label>Latitud</Label>
              <Input value={infoGeneral.latitud} disabled />
            </div>
            <div style={{ width: '100%' }}>
              <Label>Longitud</Label>
              <Input value={infoGeneral.longitud} disabled />
            </div>
          </div>
        </div>
      </Poblacional>
      <Mapa>
        <WebMapView
          setSearch={setSearch}
          setLocation={() => {}}
          editable={false}
          setUbicacion={() => {}}
        />
      </Mapa>
    </div>
  )
}

export default Ubicacion

const AdministrativaGeografica = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 7px;
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 7px;
  }
`

const Poblacional = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 20%;
  }
  .data {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 1rem;
  }
`

const Mapa = styled.div`
  width: 100%;
  height: 500px;
  margin-top: 1rem;
`
