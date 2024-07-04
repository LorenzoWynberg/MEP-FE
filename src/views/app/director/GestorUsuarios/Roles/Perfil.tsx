import React, { useEffect } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import styled from 'styled-components'

const actions = [
  { name: 'agregar' },
  { name: 'modificar' },
  { name: 'leer' },
  { name: 'eliminar' }
]

const Perfil = (props) => {
  const { data } = props

  const onChange = async (action, value) => {
    const perfilId = data.id
    const _data = {
      ...data,
      PerfilId: perfilId,
      [action]: value
    }
    await props.update(perfilId, _data)
  }

  return (
    <Container>
      {data
        ? (
            actions.map((action, i) => {
              const isCheck = data ? data[action.name] : false
              return (
                <FormControlLabelStyled
                  key={i}
                  control={
                    <Checkbox
                      checked={isCheck}
                      name={action.name}
                      onClick={(e) => {
                        onChange(action.name, !isCheck)
                      }}
                    />
              }
                  label={action.name[0].toUpperCase() + action.name.substring(1)}
                />
              )
            })
          )
        : (
          <span>No se encuentra un perfil creado para está sección</span>
          )}
    </Container>
  )
}
const FormControlLabelStyled = styled(FormControlLabel)`
  span {
    font-size: 12px !important;
  }
`
const Container = styled.div`
  position: relative;
  width: 100%;
  float: left;
`

export default Perfil
