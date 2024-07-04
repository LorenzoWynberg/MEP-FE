import HTMLTable from '../../../../../../../components/HTMLTable'
import React, { useState, useEffect } from 'react'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ContentTab from 'Components/Tab/Content'
import HeaderTab from 'Components/Tab/Header'
import General from './InformacionAcademica/General'
import Calificaciones from './InformacionAcademica/Calificaciones'
import Asistencia from './InformacionAcademica/Asistencia'
import styled from 'styled-components'
import Notification from '../../../../../../../Hoc/Notificaction'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import {
  getInfoAcademica
} from '../../../../../../../redux/VistasUsuarios/actions'

const InfoAcademica = () => {
  const [edit, setEdit] = useState(false)
  const [registerServantModal, setRegisterServantModal] =
    useState<boolean>(false)
  const [activeTab, setActiveTab] = useState(0)
  const [data, setData] = useState({})
  const [listData, setListData] = useState([])
  const toggleEdit = () => {
    setEdit(!edit)
  }
  const optionsTab = ['Información general', 'Calificaciones', 'Asistencia']
  const actions = useActions({
    getInfoAcademica
  })

  const state = useSelector((store) => {
    return {
      identification: store.identification,
      info_academica: store.VistasUsuarios.info_academica
    }
  })

  const handleLoadInfoAcademica = async () => {
    await actions.getInfoAcademica(4, 1, 50)
  }

  useEffect(() => {
    handleLoadInfoAcademica()
  }, [])

  useEffect(() => {
    if (state.info_academica) {
      setListData(state.info_academica)
    }
  }, [state.info_academica])

  const [selected, setSelected] = useState<any>(data)
  return (
    <div>
      {!edit && (
        <div>
          <h3>Datos académicos registrados</h3>
          <HTMLTable
            data={listData}
            hideMultipleOptions
            readOnly
            actionRow={[
              {
                actionName: 'Ver',
                actionDisplay: () => true,
                actionFunction: (el) => {
                  toggleEdit()
                  setData(el)
                }
              }
            ]}
            handlePagination=''
            tableName='mallas.mallas'
            roundedStyle
            toggleModal={() => {
              setRegisterServantModal(true)
            }}
            toggleEditModal={(el) => {
              setData(el)
              toggleEdit()
            }}
            columns={[
              {
                label: 'Año educativo',
                column: 'anioEducativo'
              },
              {
                label: 'Oferta / modalidad / servicio / especialidad',
                column: 'nombreOfertaEducativa'
              },
              {
                label: 'Nivel educativo',
                column: 'nombreNivel'
              },
              {
                label: 'Centro educativo',
                column: 'nombreCentroEducativo'
              },
              {
                label: 'Tipo centro',
                column: 'tipoCentroEducativo'
              },
              {
                label: 'Condición final',
                column: ''
              }
            ]}
          />
        </div>
      )}
      {edit && (
        <div>
          <div style={{ display: 'flex', cursor: 'pointer' }}>
            <ArrowBackIosIcon onClick={toggleEdit} />
            <h3 onClick={() => toggleEdit()}>REGRESAR</h3>
          </div>
          <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
            <table>
              <thead>
                <tr>
                  <Th>Año educativo</Th>
                  <Th>Oferta / modalidad / servicio / especialidad</Th>
                  <Th>Nivel educativo</Th>
                  <Th>Centro educativo</Th>
                  <Th>Tipo centro</Th>
                  <Th>Condición final</Th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ textAlign: 'center' }}>
                  <Td>{data?.anioEducativo}</Td>
                  <Td>{data?.nombreOfertaEducativa}</Td>
                  <Td>{data?.nombreNivel}</Td>
                  <Td>{data?.nombreCentroEducativo}</Td>
                  <Td>{data?.tipoCentroEducativo}</Td>
                  {/* <Td>{data.condicion.toUpperCase()}</Td> */}
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <Notification>
              {(showSnackbar) => {
                return (
                  <>
                    <HeaderTab
                      options={optionsTab}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                    />
                    <ContentTab activeTab={activeTab} numberId={activeTab}>
                      {activeTab === 0 && <General data={data} />}
                      {activeTab === 1 && <Calificaciones />}
                      {activeTab === 2 && <Asistencia />}
                    </ContentTab>
                  </>
                )
              }}
            </Notification>
          </div>
        </div>
      )}
    </div>
  )
}

export default InfoAcademica

const Th = styled.th`
  min-width: 10rem;
  max-width: 15rem;
  text-align: center;
`

const Td = styled.td`
  color: #145388;
  font-weight: bolder;
`
