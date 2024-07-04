import React from 'react'
import {
  Table
} from 'reactstrap'

const CustomTable = (props) => {
  return (
    <>
      <div className={`registered-table mb-5 ${props.className}`}>
        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Name</th>
              <th>1er apellido</th>
              <th>2do apellido</th>
              <th>Sexo</th>
              <th>{'  '}</th>
            </tr>
          </thead>
          <tbody>
            {props.items && props.items.map((item, index) => {
					  return (
  <tr key={index}><th scope='row'>{index + 1}</th><td>{item.cardId}</td><td>{item.names}</td>
    <td>{item.lastName}</td>
    <td>{item.secondLastName}</td>
    <td>{item.genderId === 1 ? 'M' : 'F'}</td>
  </tr>
					  )
            })}
          </tbody>
        </Table>
      </div>
    </>
  )
}

export default CustomTable
