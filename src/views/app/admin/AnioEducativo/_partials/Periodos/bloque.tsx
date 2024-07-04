import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import { Input } from 'reactstrap'
import styled from 'styled-components'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es'
registerLocale('es', es)

interface IProps {
	data?: any
	editable: boolean
	onChange: Function
	columns: any[]
}
const BloquePeriodo: React.FC<IProps> = (props) => {
  const { data, onChange } = props

  return (
    <Row>
      <InputName
        value={data.nombre}
        readOnly
        type='text'
        name='nombre'
      />
      <div style={{ width: '22%', marginRight: '5px' }}>
        <DatePickerStyled
          name='fechaInicio'
          locale='es'
          selected={data.fechaInicio}
          onChange={(date) => onChange(data.key, 'fechaInicio', date)}
          dateFormat='dd/MM/yyyy'
        />
      </div>
      <div style={{ width: '22%', marginRight: '5px' }}>
        <DatePickerStyled
          name='fechaFin'
          selected={data.fechaFin}
          locale='es'
          onChange={(date) => onChange(data.key, 'fechaFin', date)}
          dateFormat='dd/MM/yyyy'
        />
      </div>
      <div style={{ width: '22%', marginRight: '5px' }}>
        <DatePickerStyled
          name='fechaCierre'
          selected={data.fechaCierre}
          locale='es'
          onChange={(date) => onChange(data.key, 'fechaCierre', date)}
          dateFormat='dd/MM/yyyy'
        />
      </div>
      <Input
        style={{ width: '80px' }}
        readOnly
        value={data.porcentaje}
        type='text'
        name='porcentaje'
      />
    </Row>
  )
}
const Row = styled.div`
	display: flex;
	width: 100%;
	justify-content: left;
	align-items: center;
`
const DatePickerStyled = styled(DatePicker)`
	padding: 0;
`
const InputName = styled(Input)`
	width: 200px;
	display: flex;
	flex: 0;
	margin-right: 5px;
`

export default BloquePeriodo
