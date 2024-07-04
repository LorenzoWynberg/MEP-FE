import React, { useEffect, useState } from 'react'

import {
  Container,
  Form,
  Label,
  Input,
  CustomInput,
  Row,
  Col,
  Button
} from 'reactstrap'
import Select from 'react-select'
import { FormGroup } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { EditButton } from 'Components/EditButton'

interface IProps {
  hookOptions: any
  hasAddAccess: any,
  loading?: any
}

const OfertasAutorizadas = (props: IProps) => {
  const { t } = useTranslation()

  const {
    ofertaId,
    modalidadId,
    servicioId,
    ofertaDropDownCatalog,
    modalidadDropDownCatalog,
    servicioDropDownCatalog,
    editing,
    estadosCatalogo,
    observaciones,
    toggleEditingForm,
    onChangeOfertaDropdown,
    onChangeModalidadDropdown,
    onChangeServicioDropdown,
    onChangeEstadoDropdown,
    onChangeObservaciones,
    estadoId,
    nivelesCheckList,
    especialidadesCheckList,
    onClickCheckNivelEvent,
    onClickCheckEspecialidadEvent,
    updateModelosOfertaRequest,
    onSaveButtonEvent,
    onChangeCodigoPresupuestario,
    codigoPresupuestario,
    estadoOferta,
    anioEducativoCatalog,
    anioEducativo,
    onChangeAnioEducativoSelect
  } = props.hookOptions

  return (
    <Container>
      <div>
        <div>
          <h1>{t('configuracion>centro_educativo>ver_centro_educativo>ofertas_autorizadas>editar>ofertas_educativas', 'Ofertas educativas')}</h1>
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              onSaveButtonEvent()
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ width: '49%' }}>
                <FormGroup>
                  <Label>{t('configuracion>centro_educativo>ver_centro_educativo>oferta', 'Oferta')} *</Label>
                  <Select
                    placeholder={t('general>seleccionar', 'Seleccionar')}
                    isDisabled={!editing}
                    options={ofertaDropDownCatalog}
                    noOptionsMessage={() => t('general>no_registros', 'No hay registros')}
                    name='oferta'
                    value={ofertaId
                      ? ofertaDropDownCatalog.find(
                        (i) => i.value == ofertaId
                      )
                      : null}
                    onChange={onChangeOfertaDropdown}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>{t('configuracion>ofertas_educativas>modalidades>editar>modalidad', 'Modalidad')} *</Label>
                  <Select
                    name='modalidad'
                    placeholder={t('general>seleccionar', 'Seleccionar')}
                    isDisabled={!editing}
                    options={modalidadDropDownCatalog}
                    noOptionsMessage={() => t('general>no_registros', 'No hay registros')}
                    value={modalidadId
                      ? modalidadDropDownCatalog.find(
                        (i) => i.value == modalidadId
                      )
                      : null}
                    onChange={onChangeModalidadDropdown}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>{t('configuracion>ofertas_educativas>servicios>editar>servicio', 'Servicio')} *</Label>
                  <Select
                    name='servicio'
                    placeholder={t('general>seleccionar', 'Seleccionar')}
                    isDisabled={!editing}
                    options={servicioDropDownCatalog}
                    noOptionsMessage={() => t('general>no_registros', 'No hay registros')}
                    value={servicioId
                      ? servicioDropDownCatalog.find(
                        (i) => i.value == servicioId
                      )
                      : null}
                    onChange={onChangeServicioDropdown}
                  />
                </FormGroup>
              </div>
              <div style={{ width: '49%' }}>
                <FormGroup>
                  <Label>{t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>columna_estado', 'Estado')}</Label>
                  <Select
                    placeholder={t('general>seleccionar', 'Seleccionar')}
                    isDisabled={!editing}
                    noOptionsMessage={() => t('general>no_registros', 'No hay registros')}
                    options={estadosCatalogo}
                    value={estadosCatalogo.find((i) => i.value == estadoOferta)}
                    onChange={onChangeEstadoDropdown}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>{t('configuracion>centro_educativo>agregar>codigo_presupuestario', 'Código presupuestario')}</Label>
                  <Input
                    type='input'
                    disabled={!editing}
                    value={codigoPresupuestario}
                    onChange={onChangeCodigoPresupuestario}
                    name='codPresu'
                  />
                </FormGroup>
                <FormGroup>
                  <Label>{t('configuracion>centro_educativo>ver_centro_educativo>ofertas_autorizadas>editar>observacion', 'Observación')}</Label>
                  <Input
                    type='textarea'
                    rowSpan={2}
                    disabled={!editing}
                    value={observaciones}
                    onChange={onChangeObservaciones}
                    name='observaciones'
                  />
                </FormGroup>
                <FormGroup hidden>
                  <Label>Año educativo *</Label>
                  <Select
                    placeholder={t('general>seleccionar', 'Seleccionar')}
                    isDisabled={true}
                    options={anioEducativoCatalog}
                    noOptionsMessage={() => t('general>no_registros', 'No hay registros')}
                    name='oferta'
                    value={anioEducativo}
                    onChange={onChangeAnioEducativoSelect}
                    
                  />
                </FormGroup>
              </div>
            </div>
            <div>
              <Label>{t('configuracion>centro_educativo>ver_centro_educativo>ofertas_autorizadas>editar>niveles', 'Niveles')}</Label>
              <div>
                <ul
                  style={{
                    display: 'flex',
                    padding: 0,
                    listStyle: 'none',
                    flexWrap: 'wrap'
                  }}
                >
                  {nivelesCheckList?.map((lvl, index) => {
                    return (
                      <li
                        style={{
                          display: 'flex',
                          marginRight: '1rem'
                        }}
                      >
                        <CustomInput
                          type='checkbox'
                          style={{
                            marginRight: '.5rem'
                          }}
                          checked={lvl?.estado}
                          disabled={!editing}
                          onClick={() => onClickCheckNivelEvent(lvl.nivelId)}
                        />
                        <p
                          style={{
                            width: 'max-content',
                            margin: 0
                          }}
                        >
                          {lvl?.nivelNombre}
                        </p>
                      </li>
                    )
                  })}
                </ul>
              </div>
              {especialidadesCheckList.length > 0 && (
                <>
                  <Label>Especialidades</Label>
                  <EspecialidadesContainer>
                    <div>
                      {especialidadesCheckList.map((level) => {
                        return (
                          <EspecialidadesNivelContainer>
                            <h6>{level.nivelNombre}</h6>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)'
                              }}
                            >
                              {level.especialidades.map((el) => {
                                return (
                                  <div
                                    style={{
                                      display: 'flex',
                                      marginRight: '1rem'
                                    }}
                                  >
                                    <CustomInput
                                      type='checkbox'
                                      style={{
                                        marginRight: '.5rem'
                                      }}
                                      checked={el?.estado}
                                      disabled={!editing}
                                      onClick={() =>
                                        onClickCheckEspecialidadEvent(
                                          level.nivelId,
                                          el.nivelOfertaid
                                        )}
                                    />
                                    <p
                                      style={{
                                        width: 'max-content',
                                        margin: 0
                                      }}
                                    >
                                      {el?.especialidadNombre}
                                    </p>
                                  </div>
                                )
                              })}
                            </div>
                          </EspecialidadesNivelContainer>
                        )
                      })}
                    </div>
                  </EspecialidadesContainer>
                </>
              )}
            </div>
            <Row>
              <CenteredCol>
                {props.hasAddAccess && (
                  <EditButton
                    editable={editing}
                    setEditable={() => toggleEditingForm()}
                    loading={props.loading}
                  />
                )}
              </CenteredCol>
            </Row>
          </Form>
        </div>
      </div>
    </Container>
  )
}
const EspecialidadesNivelContainer = styled.div`
  margin: 1rem;
`
const EspecialidadesContainer = styled.div`
  overflow: scroll;
`
const CenteredCol = styled(Col)`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem;
`

export default OfertasAutorizadas
