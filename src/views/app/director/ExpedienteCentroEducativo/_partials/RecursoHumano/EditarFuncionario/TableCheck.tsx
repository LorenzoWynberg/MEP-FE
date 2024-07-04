import React from 'react'
import { Form, FormGroup, Label, Input } from 'reactstrap'
import './general.css'

const TableCheck = () => {
  const edit = [
    { check: 'LEER' },
    { check: 'ESCRIBIR' },
    { check: 'MODIFICAR' },
    { check: 'ELIMINAR' }
  ]

  const title = [
    { title: 'INFORMACIÓN GENERAL', edit },
    { title: 'INFORMACIÓN DE CONTACTO', edit },
    { title: 'INFORMACIÓN DE RESIDENCIA', edit },
    { title: 'INFORMACIÓN DE DOMICILIO TEMPORAL', edit },
    { title: 'DATOS SOCIOECONÓMICOS', edit },
    { title: 'MIEMBROS DEL HOGAR', edit },
    { title: 'BENEFICIOS POR PARTE DEL ESTADO', edit },
    { title: 'BENEFICIO POR PARTE DEL MEP', edit },
    { title: 'APOYOS EDUCATIVOS', edit },
    { title: 'PARTICIPACIÓN ACTIVIDADES CURRICULARES', edit },
    { title: 'VALORACIÓN NUTRICIONAL', edit },
    { title: 'OTROS DATOS DE SALUD', edit }
  ]

  const cut = (n, m) => {
    return (
      <div>
        {title.slice(n, m).map((item) => (
          <div>
            {' '}
            <div style={{ fontWeight: 'bolder' }}>{item.title}</div>
            <div style={{ display: 'flex' }}>
              {item.edit.map((e) => (
                <Form>
                  <FormGroup check inline>
                    <Label check>
                      <Input
                        className={
                          e.check === 'LEER' ? 'input-check' : 'input-check2'
                        }
                        type='checkbox'
                      />{' '}
                      {e.check}
                    </Label>
                  </FormGroup>
                </Form>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='css-grid'>
      <div>{cut(0, 6)}</div>
      <div className='margen2'>{cut(6, 13)}</div>
    </div>
  )
}

export default TableCheck
