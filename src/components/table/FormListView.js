import React from 'react'
import classnames from 'classnames'
import { ContextMenuTrigger } from 'react-contextmenu'
import { Colxx } from '../../components/common/CustomBootstrap'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import Select from 'react-select'
import {
  Input,
  Col,
  CustomInput
} from 'reactstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const ControllerInput = props => {
  const _value = props.value
  const _width = props.width
  const _input = props.input || 'input'
  const _index = props.index || 'input'
  return (
    <div className='w-sm-100 thumb-column-row' style={{ width: `${_width}%` }}>
      <Col sm='12' className='p-0'>
        {{
          select: <Select className='react-select' classNamePrefix='react-select' isDisabled value={_value} options={[]} components={{ Input: CustomSelectInput }} />,
          input: <Input disabled type='text' value={_value} />,
          textarea: <Input disabled type='textarea' value={_value} style={{ resize: 'none' }} />,
          date: <DatePicker disabled selected={_value} />,
          checkbox: <div>
            <CustomInput type='radio' name={`check-${_index}`} label='Si' inline />
            <CustomInput type='radio' name={`check-${_index}`} label='No' inline />
                    </div>
        }[_input]}
      </Col>
    </div>
  )
}

const FormListView = ({ actionRow, product, isSelect, collect, onCheckItem, columns }) => {
  return (
    <Colxx xxs='12' key={product.id} className='mb-3 p-0 px-2'>
      <ContextMenuTrigger data={product.id} collect={collect}>
        <div
          onClick={() => onCheckItem(product.id)}
          className={classnames('d-flex flex-row align-items-center', {
            active: isSelect
          })}
        >
          <div className='d-flex flex-grow-1 min-width-zero'>
            <div className='card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero  px-0 p-sm-0'>
              {
                columns.map((column, i) => {
                  return <ControllerInput index={product.id} value={product[columns[i].column]} {...column} />
                })
              }
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
    </Colxx>
  )
}

export default React.memo(FormListView)
