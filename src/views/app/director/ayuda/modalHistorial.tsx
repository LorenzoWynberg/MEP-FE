import React, { useEffect, useState } from 'react'
import { Button, ModalBody } from 'reactstrap'
import colors from 'Assets/js/colors'
import UpdateIcon from '@mui/icons-material/Update'
import moment from 'moment'
import { getBitacoraAyudaInstitution } from 'Redux/Bitacora/actions'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import SimpleModal from 'Components/Modal/simple'
import TableFilter from 'Components/Table-filter/Table'

const ModalHistorial = (props) => {
  const [modalHistory, setModalHistory] = useState(false)
  const [data, setData] = useState([])

  const state = useSelector((store: any) => {
    return {
      bitacora: store.bitacora.bitacoraAyuda,
      institution: store.authUser.currentInstitution
    }
  })
  const actions = useActions({
    getBitacoraAyudaInstitution
  })

  useEffect(() => {
    const fetch = async () => {
      await actions.getBitacoraAyudaInstitution(state.institution.id)
    }
    fetch()
  }, [])

  useEffect(() => {
    setData(
      state.bitacora.map((el) => {
        return {
          ...el,
          ...JSON.parse(el.json)[0].Datos[0],
          fechaInsercion: moment(el.fechaInsercion).format(
            'DD/MM/yyyy hh:mm a'
          )
        }
      })
    )
  }, [state.bitacora])

  const toggle = () => {
    setModalHistory(!modalHistory)
  }

  const columns = React.useMemo(
    () => [
      {
        Header: 'Usuario',
        accessor: 'Id'
      },
      {
        Header: 'Acción',
        accessor: 'TabActive'
      },
      {
        Header: 'Fecha',
        accessor: 'fechaInsercion'
      }
    ],
    []
  )
  return (
    <>
      <Button
        style={{ backgroundColor: `${colors.primary}` }}
        className='btn-history'
        onClick={toggle}
      >
        <div className='d-flex justify-content-center align-items-center'>
          <UpdateIcon style={{ marginRight: '4px', fontSize: '16px' }} /> LOG
        </div>
      </Button>
      <SimpleModal
        openDialog={modalHistory}
        onClose={() => toggle()}
        title='Historial'
        actions={false}
      >
        <div style={{ padding: '2rem' }}>
          <ModalBody style={{ overflowX: 'scroll', padding: 0 }}>
            <div
              style={{ width: '1275px', margin: '0 auto', minHeight: '14rem' }}
            >
              <TableFilter avoidFilter columns={columns} data={data || []} />
            </div>
          </ModalBody>
        </div>
      </SimpleModal>
    </>
  )
}

export default ModalHistorial
