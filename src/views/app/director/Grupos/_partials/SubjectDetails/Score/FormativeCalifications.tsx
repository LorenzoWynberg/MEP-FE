import React from 'react'

interface IProps {
    students: any[]
    tableComponents: any
    grades: any[]
    subjectComponents: any[]
}

const FormativeCalifications: React.FC<IProps> = ({ students, tableComponents, grades, subjectComponents }) => {
  return (
    <div>
      <table className='mallasTable-2'>
        <colgroup span='3' />
        <thead>
          <tr>
            <th className='text-center' colspan='3'>Indicadores de aprendizaje esperado</th>
          </tr>
          <tr className='grey-tr'>
            <th className='text-center'>dd</th>
            <th className='text-center'>yyyy</th>
            <th className='text-center'>yyyy</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='text-center'>P</td>
            <td className='text-center'>O</td>
            <td className='text-center'>14</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default FormativeCalifications
