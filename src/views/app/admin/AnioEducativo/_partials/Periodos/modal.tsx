import React, { useEffect, useState } from 'react'
import Bloque from './bloque'
import styled from 'styled-components'
import { Row, Col, FormGroup, Input, Button } from 'reactstrap'

import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import { useTranslation } from 'react-i18next'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'

interface IProps {
  editable: boolean
  data: any
  bloques: any
  period: any
  selectPeriodo: any
  onchangeBloque: any

  errorPorcentaje: any
  total: any
  periodos: any[]
}

const columns = [
  { label: 'Nombre del bloque', name: 'nombre', width: '24%', type: 'text' },
  { label: 'Fecha inicio', name: 'fechaInicio', width: '22%', type: 'date' },
  { label: 'Fecha fin', name: 'fechaFin', width: '22%', type: 'date' },
  { label: 'Fecha cierre', name: 'fechaCierre', width: '22%', type: 'date' },
  { label: 'Porcentaje', name: 'porcentaje', width: '80px', type: 'text' }
]
const ModalPerido: React.FC<IProps> = (props) => {
  const {
    editable,
    bloques,
    period,
    onchangeBloque,
    selectPeriodo,

    total,
    errorPorcentaje,
    periodos
  } = props
  const [rows, setRows] = useState<any[]>([])

  useEffect(() => {
    setRows(bloques)
  }, [bloques])

  return (
    <ContentModal>
      <Row>
        <Col xs={12}>
          <FormGroup>
            <h5>Periodos</h5>
            <Select
              components={{
                Input: CustomSelectInput
              }}
              className='react-select'
              classNamePrefix='react-select'
              getOptionLabel={(option: any) => option.nombre}
              getOptionValue={(option: any) => option.id}
              placeholder=''
              options={periodos}
              styles={{
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 999
                })
              }}
              onChange={(e) => selectPeriodo(e)}
              value={period}
            />
          </FormGroup>
        </Col>
        <Col xs={12}>
          <h5>Bloques</h5>

          <Columns>
            {columns.map((column, i) => {
              return (
                <Label key={i} width={column.width}>
                  {column.label}
                </Label>
              )
            })}
          </Columns>
          {rows.length
            ? (
                rows.map((item, i) => {
                  return (
                    <Bloque
                      key={i}
                      editable={editable}
                      columns={columns}
                      data={item}
                      onChange={onchangeBloque}
                    />
                  )
                })
              )
            : (
              <Empty>
                No se encuentran bloques creados a este periodo{' '}
              </Empty>
              )}
          <Footer>
            <div />
            <Total>
              <h5 className='mr-2 mb-0'>Total</h5>
              <InputTotal
                readOnly
                value={total}
                type='text'
                name='total'
              />
              <Label className='ml-1'>%</Label>
            </Total>
          </Footer>
        </Col>
        {errorPorcentaje && (
          <Feedback>
            <InfoOutlinedIcon className='mr-1' />
            <Label>
              El total de la sumatoria debe ser igual al 100%, por
              favor corregir el porcentaje.
            </Label>
          </Feedback>
        )}
      </Row>
    </ContentModal>
  )
}

const Feedback = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 15px;
`
const ContentModal = styled.div`
  width: 800px;
  min-height: 500px;
`
const Empty = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
`
const Footer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 50px;
`
const InputTotal = styled(Input)`
  width: 60px;
`
const Label = styled.div<{ width?: string }>`
  width: ${(props) => props.width};
`
const Total = styled.div`
  width: 100px;
  justify-content: center;
  align-items: center;
  display: flex;
  margin-right: 45px;
  input {
    text-align: center;
  }
`
const Columns = styled.div`
  display: flex;
  width: 100%;
  justify-content: left;
  align-items: center;
`

export default ModalPerido
