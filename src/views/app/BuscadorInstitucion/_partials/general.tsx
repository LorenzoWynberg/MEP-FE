import React, { useState } from 'react'
import { Input, Label } from 'reactstrap'
import styled from 'styled-components'
import StyledMultiSelect from 'Components/styles/StyledMultiSelect'
import { ReactComponent as Institucion } from 'assets/images/Institucion.svg'
import moment from 'moment'

const General = ({ infoGeneral }) => {
  return (
    <div style={{ marginTop: '1rem' }}>
      <h5 style={{ fontWeight: 'bolder' }}>CENTRO EDUCATIVO</h5>
      <div style={{ width: '100%' }}>
        <PrimeraFila>
          <div style={{ width: '100%', marginRight: '3%' }}>
            <Label>Nombre oficial</Label>
            <InputReact
              value={infoGeneral.nombreInstitucion}
              disabled
            />
          </div>
          <div style={{ width: '100%' }}>
            <Label>Estado del centro</Label>
            <InputReact value={infoGeneral.estadocentro} disabled />
          </div>
        </PrimeraFila>
        <SegundaFila>
          <div style={{ width: '100%' }}>
            <Label>Código</Label>
            <InputReact value={infoGeneral.codigoSaber} disabled />
          </div>
          <div style={{ width: '100%' }}>
            <Label>Código presupuestario</Label>
            <InputReact
              value={infoGeneral.codigoPresupuestario}
              disabled
            />
          </div>
          <div style={{ width: '100%' }}>
            <Label>Conocido como</Label>
            <InputReact value={infoGeneral.conocidoComo} disabled />
          </div>
          {infoGeneral.fechaFundacion && (
            <div style={{ width: '100%' }}>
              <Label>Fecha de fundación</Label>
              <InputReact
                value={moment(
								  infoGeneral.fechaFundacion
                ).format('DD/MM/YYYY')}
                disabled
              />
            </div>
          )}
        </SegundaFila>
        <TerceraFila>
          <div style={{ marginTop: '2%' }}>
            <Label>Tipo de centro educativo</Label>
            <InputReact
              value={infoGeneral.tipoCentroEducativo}
              disabled
            />
            <Label style={{ marginTop: '2%' }}>
              Categorías vinculadas al centro
            </Label>
            <StyledMultiSelect
              selectedOptions={[]}
              editable={false}
              stagedOptions={[]}
              options={infoGeneral.integracionBuscadorInstitucion}
              handleChangeItem={() => {}}
              columns={1}
              height='5rem'
            />
          </div>
          <div
            style={{
						  width: '100%',
						  display: 'flex',
						  justifyContent: 'center',
						  alignItems: 'center',
						  alignContent: 'center'
            }}
          >
            <Avatar
              src={
								infoGeneral.imagen ||
								'/assets/img/centro-educativo.png'
							}
              alt='Profile picture'
            />
          </div>
        </TerceraFila>
      </div>
    </div>
  )
}

export default General

const Avatar = styled.img`
	width: 200px;
	height: 200px;
	border-radius: 50%;
`
const InputReact = styled(Input)`
	width: 100%;
`

const PrimeraFila = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
	margin-top: 1rem;
	@media (max-width: 768px) {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		margin-top: 1%;
	}
`

const SegundaFila = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	gap: 1rem;
	margin-top: 1rem;
	@media (max-width: 768px) {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		margin-top: 1%;
	}
`

const TerceraFila = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
	@media (max-width: 768px) {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		margin-top: 1%;
	}
`
