import React, { useEffect } from 'react'
import styled from 'styled-components'
import { FormGroup, Label, Input, Form } from 'reactstrap'
import Select from 'react-select'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface IProps {
  editing: boolean
  errors: object
  register: any
  setValue: any
  control: any
  watch: any
  data: any
}

const AgregarCursoLectivo: React.FC<IProps> = (props) => {
  const { t } = useTranslation()

  const listState = [
    { nombre: t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>agregar>estado>activa', 'Activa'), id: 1 },
    { nombre: t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>agregar>estado>inactiva', 'Inactiva'), id: 0 }
  ]

  const { data, errors, register, control, setValue, watch } = props

  useEffect(() => {
    register('nombre')
    register('description')
    register('estado')
  }, [register])

  useEffect(() => {
    if (data) {
      const _state = listState.find((x) => (x.id === data.estado ? 1 : 0))
      setValue('nombre', data.nombre)
      setValue('estado', _state)
      setValue('description', data.descripcion)
    }
  }, [data])

  return (
    <FormStyled>
      <FormGroup>
        <Label>{t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>agregar>nombre_curso_lectivo', 'Nombre del curso lectivo')} *</Label>
        <Input
          name='nombre'
          innerRef={register({
            required: true
          })}
          // value={watch('nombre')}
          // onChange={(e) => {
          //   setValue('nombre', e?.target?.value)
          // }}
          invalid={Boolean(errors.nombre)}
        />
        {errors.nombre && <ErrorFeedback>{t('general>campo_requerido', 'Campo requerido')}</ErrorFeedback>}
      </FormGroup>
      <FormGroup>
        <Label>{t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>agregar>estado', 'Estado')} *</Label>
        <Controller
          as={
            <Select
              className='react-select'
              classNamePrefix='react-select'
              placeholder=''
              options={listState}
              getOptionLabel={(option: any) => option.nombre}
              getOptionValue={(option: any) => option.id}
            />
          }
          name='estado'
          control={control}
          rules={{ required: true }}
        />
        {errors.estado && <ErrorFeedback>{t('general>campo_requerido', 'Campo requerido')}</ErrorFeedback>}
      </FormGroup>
      <FormGroup>
        <Label>{t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>agregar>descripcion', 'Descripción')} *</Label>
        <Input
          name='description'
          type='textarea'
          innerRef={register({
            required: true
          })}
          // value={watch('description')}
          // onChange={(e) => {
          //   setValue('description', e?.target?.value)
          // }}
        />
        {errors.description && (
          <ErrorFeedback>{t('general>campo_requerido', 'Campo requerido')}</ErrorFeedback>
        )}
      </FormGroup>
    </FormStyled>
  )
}
const FormStyled = styled(Form)`
  min-width: 450px;
`
const ErrorFeedback = styled.span`
  position: absolute;
  color: #bd0505;
  left: 0;
  font-weight: bold;
  font-size: 10px;
  bottom: -19px;
`
export default AgregarCursoLectivo
