import React, { useState, useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import {
  CustomInput,
  InputGroupAddon
} from 'reactstrap'
import { useActions } from 'Hooks/useActions'
import search from 'Utils/search'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { GetEstudiantesByNameFromInstitution/*, getStudentsWithoutGroup */ } from 'Redux/grupos/actions'
import CancelIcon from '@material-ui/icons/Cancel'
import AsyncSelect from 'react-select/async'

const ModalEnrollStudents = ({ selectedStudents, setSelectedStudents, notEnrolledStudents, enrolledStudents, items, setItems }) => {
  const [getFromAllSchool, setGetFromAllSchool] = useState<boolean>(false)
  const [filteredData, setFilteredData] = useState<any[]>(notEnrolledStudents)

  const state = useSelector((store: any) => {
    return {
      institution: store.authUser.currentInstitution,
      schoolStudents: store.grupos.filteredStudents
    }
  })

  const actions = useActions({
    GetEstudiantesByNameFromInstitution
    // getStudentsWithoutGroup
  })

  const { data, columns } = useMemo(() => {
    const initialColumns = [
      {
        Header: 'id',
        column: 'matriculaId',
        accessor: 'matriculaId',
        label: '',
        show: false
      },
      {
        Header: '',
        column: 'checked',
        accessor: 'checked',
        label: '',
        Cell: ({ cell }) => buildCheckinput(cell)
      },
      {
        Header: 'Nombre',
        column: 'nombreCompleto',
        accessor: 'nombreCompleto',
        label: ''
      },
      {
        Header: 'Sección',
        column: 'groupId',
        accessor: 'groupId',
        label: ''
      }
    ]

    const buildCheckinput = (cell) => {
      return (
        <input
          checked={cell.row.values.checked}
          className='custom-checkbox mb-0 d-inline-block'
          type='checkbox'
          onClick={(e) => onCheckClick(e, cell)}
        />
      )
    }
    const onCheckClick = (e, cell) => {
      const matriculaId = cell.row.values.matriculaId

      const indexObj = items.findIndex(item => item.matriculaId === matriculaId)
      const newState = [...items]
      const newObj = { ...cell.row.values, checked: !cell.row.values.checked }
      newState[indexObj] = newObj
      setItems([...newState])
    }

    const nColumns = [...initialColumns]
    nColumns[1] = {
      Header: '',
      column: 'checked',
      accessor: 'checked',
      label: '',
      Cell: (rowdata) => buildCheckinput(rowdata.cell)
    }
    return { data: items, columns: nColumns }
  }, [items])

  useEffect(() => {
    setFilteredData(notEnrolledStudents)
  }, [notEnrolledStudents])

  // const handleSearchStudents = async (name: string, callback: (options: any[]) => void): any[] => {
  //   return await actions.getStudentsWithoutGroup(name, state.institution.id, callback, [...selectedStudents, ...enrolledStudents])
  // }

  return (
    <>
      <div className='d-flex justify-content-between w-100'>
        <p>Estudiante</p>
        <p>
          <CustomInput
            className='custom-checkbox mb-0 d-inline-block'
            type='checkbox'
            checked={!!getFromAllSchool}
            id='includeAllLevels'
            onClick={() => {
              setGetFromAllSchool(!getFromAllSchool)
            }}
          />
          <span>Incluir todos los niveles</span>
        </p>
      </div>
      <div className='padding-side' style={{ height: '27rem', overflow: 'auto' }}>
        <AsyncSelect
          name='especialidad'
          components={{ Input: CustomSelectInput }}
          className='react-select'
          classNamePrefix='react-select'
          options={filteredData}
          getOptionLabel={(option) => option.nombreCompleto}
          getOptionValue={(option) => option.id}
          defaultOptions={filteredData}
          loadOptions={(
            inputValue: string,
            callback: (options) => void
          ) => {
            if (getFromAllSchool) {
              handleSearchStudents(inputValue, callback)
              return
            }
            if (inputValue?.length > 0) {
              const filtered = notEnrolledStudents.filter((el) => el?.nombreCompleto.toLowerCase().includes(inputValue.toLowerCase()))
              setFilteredData(filtered)
            } else {
              setFilteredData(notEnrolledStudents)
            }
          }}
          onChange={(data) => {
            setSelectedStudents([...selectedStudents, data])
          }}
        />
        {selectedStudents.map((item, idx) => {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>{item.nombreCompleto}</span>{' '}<CancelIcon
                className='cursorPointer' onClick={() => {
                  setSelectedStudents(selectedStudents.filter((el, i) => i !== idx))
                }}
                                                     />
            </div>
          )
        })}
      </div>

    </>
  )
}

const StyledInputGroupAddon = styled(InputGroupAddon)`
  top: 0;
  right: 0;
  position: absolute;
  height: 100%;
  display: flex;
  align-items: center;
  }
`

export default React.memo(ModalEnrollStudents)
