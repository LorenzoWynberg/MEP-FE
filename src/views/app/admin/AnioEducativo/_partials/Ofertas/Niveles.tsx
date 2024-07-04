import React from 'react'
import styled from 'styled-components'
import { FormGroup, Label } from 'reactstrap'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { useTranslation } from 'react-i18next'

type IProps = {
	ofertas: any[]
	currentYear: any
	currentOffer: any
	handleCurrentOffer: any
	currentEspecialidades: any
	currentNiveles: any[]
	niveles: any[]
	especialidades: any[]
	setCurrentNiveles: any
	setCurrentEspecialidades: any
	editable: any
	errors: any
}

export const Niveles: React.FC<IProps> = (props) => {
  const { t } = useTranslation()

  const {
    ofertas,
    especialidades,
    niveles,
    currentNiveles,
    currentEspecialidades,
    handleCurrentOffer,
    setCurrentNiveles,
    setCurrentEspecialidades,
    currentOffer,
    errors,
    editable
  } = props

  return (
    <Wrapper>
      <FormGroup>
        <Label>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>ofertas_relacionadas>columna_acciones>editar>nombre_oferta', 'Nombre de oferta')} {editable ? '*' : null}</Label>
        <Select
          options={ofertas.map((item) => {
					  return { ...item, label: item.nombre, value: item.id }
          })}
          value={currentOffer}
          onChange={(data) => {
					  handleCurrentOffer(data)
          }}
          isDisabled={!editable}
          components={{ Input: CustomSelectInput }}
          className={
						errors.oferta
						  ? 'react-select is-invalid'
						  : 'react-select'
					}
          classNamePrefix='react-select'
          placeholder=''
          noOptionsMessage={() => 'Sin ofertas'}
        />
        {errors.oferta && <Label>{errors.oferta}</Label>}
      </FormGroup>
      <FormGroup>
        <Label>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>ofertas_relacionadas>columna_acciones>editar>especialidades', 'Especialidades')} {editable ? '*' : null}</Label>
        <Select
          options={especialidades.map((item) => {
					  return { ...item, label: item.nombre, value: item.id }
          })}
          value={currentEspecialidades}
          onChange={(data) => {
					  setCurrentEspecialidades(data)
          }}
          isDisabled={!editable}
          isMulti
          components={{ Input: CustomSelectInput }}
          className={
						errors.especialidades
						  ? 'react-select is-invalid'
						  : 'react-select'
					}
          classNamePrefix='react-select'
          placeholder=''
          noOptionsMessage={() => 'Sin especialidades'}
        />
        {errors.especialidades && (
          <Label>{errors.especialidades}</Label>
        )}
      </FormGroup>
      <FormGroup>
        <Label>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>ofertas_relacionadas>columna_acciones>editar>nivelese', 'Niveles')} {editable ? '*' : null}</Label>
        <Select
          options={niveles.map((item) => {
					  return { ...item, label: item.nombre, value: item.id }
          })}
          value={currentNiveles}
          onChange={(data) => {
					  setCurrentNiveles(data)
          }}
          isDisabled={!editable}
          noOptionsMessage={() => 'Sin niveles'}
          isMulti
          components={{ Input: CustomSelectInput }}
          className={
						errors.niveles
						  ? 'react-select is-invalid'
						  : 'react-select'
					}
          classNamePrefix='react-select'
          placeholder=''
        />
        {errors.niveles && <Label>{errors.niveles}</Label>}
      </FormGroup>
    </Wrapper>
  )
}

const Wrapper = styled.div`
	width: 500px;
`

export default Niveles
