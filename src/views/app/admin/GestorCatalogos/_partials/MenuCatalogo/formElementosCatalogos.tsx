import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FormGroup, Label, Input, Form, FormFeedback } from 'reactstrap'

interface IProps {
  editing: boolean
  errors: object
  register: any
  setValue: any
  control: any
  watch: any
  dataElementosCatalogos: any
  dataTipoCatalogo: any
  currentCatalogo: any
}
const listState = [
  { nombre: 'ACTIVA', id: 1 },
  { nombre: 'INACTIVA', id: 0 }
]

const AgregarElementosCatalogos: React.FC<IProps> = (props) => {
  const {
    dataElementosCatalogos,
    dataTipoCatalogo,
    currentCatalogo,
    errors,
    register,
    control,
    setValue,
    watch
  } = props
  const [editable, setEditable] = useState(false)

  useEffect(() => {
    if (dataElementosCatalogos) {
      setValue('id', dataElementosCatalogos.id)
      setValue('estado', dataElementosCatalogos.estado)
      setValue('nombre', dataElementosCatalogos.nombre)
      setValue('orden', dataElementosCatalogos.orden)
      setValue('codigo', dataElementosCatalogos.codigo)
      setValue('codigo2', dataElementosCatalogos.codigo2)
      setValue('codigo3', dataElementosCatalogos.codigo3)
      setValue('otro', dataElementosCatalogos.otro)
      setValue('descripcion', dataElementosCatalogos.descripcion)
      setValue('tiposCatalogo', dataElementosCatalogos.tiposCatalogo)
    }
  }, [dataElementosCatalogos])

  const RequiredField = (props) => (
    <FormFeedback>Este campo es requerido {props.extraMsg}</FormFeedback>
  )

  return (
    <FormStyled>
      <FormGroup>
        <Input
          hidden
          name='id'
          type='text'
          value={dataElementosCatalogos.id}
          style={{ marginBottom: '1rem' }}
          innerRef={register}
        />
      </FormGroup>
      <FormGroup>
        <Label>Nombre del elemento de catálogo*</Label>
        <Input
          name='nombre'
          innerRef={register({
            required: true
          })}
          onChange={(e) => {
            setValue('nombre', e.target.value.toUpperCase())
          }}
          invalid={Boolean(errors.nombre)}
        />
        {errors.nombre && <ErrorFeedback>Campo requerido</ErrorFeedback>}
      </FormGroup>
      <FormGroup>
        <Label>Codigo*</Label>
        <Input
          name='codigo'
          innerRef={register({
            required: true
          })}
          invalid={Boolean(errors.codigo)}
        />
        {errors.codigo && <ErrorFeedback>Campo requerido</ErrorFeedback>}
      </FormGroup>
      <FormGroup>
        <Label>Orden*</Label>
        <Input
          type='number'
          invalid={errors.orden}
          name='orden'
          innerRef={register({
            min: 1,
            valueAsNumber: true,
            required: true
          })}
          invalid={Boolean(errors.orden)}
        />
        {errors.orden && <RequiredField extraMsg='y debe ser mayor a 0' />}
      </FormGroup>
      <FormGroup>
        <Label>Estado*</Label>
        <Input
          type='select'
          name='estado'
          innerRef={register({ required: true })}
          invalid={Boolean(errors.estado)}
        >
          <option value>Activo</option>
          <option value={false}>Inactivo</option>
        </Input>
        {errors.estado && <ErrorFeedback>Campo requerido</ErrorFeedback>}
        <br />
      </FormGroup>
      <FormGroup>
        <Label>Descripción*</Label>
        <Input
          name='descripcion'
          type='textarea'
          innerRef={register({
            required: false
          })}
        />
      </FormGroup>
      <FormGroup>
        <Label>Tipo de Catálogo</Label>
        <Input
          type='select'
          disabled
          value={currentCatalogo.id}
          name='tiposCatalogo'
          innerRef={register({ required: true })}
          invalid={Boolean(errors.tiposCatalogo)}
        >
          <option value={0}>Seleccione el tipo de catálogo</option>
          {dataTipoCatalogo.map((category) => {
            return <option value={category.id}>{category.nombre}</option>
          })}
        </Input>
        {errors.tiposCatalogo && (
          <ErrorFeedback>Campo requerido</ErrorFeedback>
        )}
        <br />
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
export default AgregarElementosCatalogos
