import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { Button, InputGroupAddon } from 'reactstrap'
import NombramientosIntegra from './EditarFuncionario/Lecciones/NombramientosIntegra'
import { TableReactImplementation } from 'Components/TableReactImplementation'

const TableIntegra = ({ head, data, title }) => {
  const [showNombIntegra, setShowNombIntegra] = useState(false)
  const [showName, setShowName] = useState(false)
  const [datosPersonaIntegra, setDatosPersonaIntegra] = useState(null)
  const onSelected = (name, identification) => {
    setShowName(true)
    console.log(name, identification)
    setDatosPersonaIntegra([{
      codigoInstitucion: identification,
      nombreEnIntegra: name
    }])
  }

  const buildList = (values) => {
    return (
      <ul style={{ listStyleType: 'none', marginBottom: '0', padding: '0' }}>
        {values.map((item, i) => {
          return <li key={i}>{item}</li>
        })}
      </ul>
    )
  }

  const columns = useMemo(() => {
    return [{
      Header: 'Nombramientos',
      column: 'btn',
      accessor: 'btn',
      label: '',
      Cell: ({ cell }) => {
        return (
          <Button
            onClick={() => {
              setShowNombIntegra(true)
              onSelected(
                cell.row.values.nombreCompleto,
                cell.row.values.identification
              )
            }}
            className='btn-view'
            color='primary'
          >
            Ver
          </Button>
        )
      }
    },
    {
      Header: 'Identificación',
      column: 'identificacion',
      accessor: 'identification',
      label: ''
    },
    {
      Header: 'Nombre completo',
      column: 'nombreCompleto',
      accessor: 'nombreCompleto',
      label: ''
    },
    {
      Header: 'Clase de puesto',
      column: 'clasePuesto',
      accessor: 'position',
      label: '',
      Cell: ({ cell }) => buildList(cell.row.values.position)
    },
    {
      Header: 'Especialidad',
      column: 'especialidad',
      accessor: 'speciality',
      label: '',
      Cell: ({ cell }) => buildList(cell.row.values.speciality)
    },
    {
      Header: 'Grupo profesional',
      column: 'grupoProfesional',
      accessor: 'groupProfessional',
      label: '',
      Cell: ({ cell }) => buildList(cell.row.values.groupProfessional)
    },
    {
      Header: 'Condición',
      column: 'condicion',
      accessor: 'condition',
      label: ''
    },
    {
      Header: 'Cantidad de lecciones',
      column: 'cantidadLecciones',
      accessor: 'cantleccion',
      label: ''
    }]
  }, [])

  return (
    <Box>
      <NombramientosIntegra
        visible={showNombIntegra}
        setVisible={setShowNombIntegra}
        showName={showName}
        datos={datosPersonaIntegra || []}
      />
      <div className='margen'>
        <h4 style={{ fontSize: '1.15rem' }}>{head}</h4>
      </div>
      <div className='padding-side'>
        <TableReactImplementation
          data={data}
          handleGetData={() => {}}
          columns={columns}
          orderOptions={[]}
        />
      </div>
    </Box>
  )
}

export default TableIntegra

const Box = styled.div`
  width: 100%;
  min-height: 30rem;
  max-height: 100%;
  background: #fff;
  border-radius: 10px;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
  margin-top: 1%;
  margin-bottom: 2%;
  overflow: scroll;
`

const SearchContainer = styled.div`
  width: 32vw;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between @media screen and (min-width: 1120px) {
    flex-direction: row;
  }
`
const StyledInputGroupAddon = styled(InputGroupAddon)`
  top: 0;
  right: 0;
  position: absolute;
  height: 100%;
  display: flex;
  align-items: center;
  }
`
