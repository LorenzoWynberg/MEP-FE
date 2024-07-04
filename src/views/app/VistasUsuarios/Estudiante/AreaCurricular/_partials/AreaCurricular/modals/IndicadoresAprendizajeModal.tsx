import React from 'react'
import { Modal, ModalBody, ModalHeader, Button, ModalFooter } from 'reactstrap'
import colors from 'Assets/js/colors'
import styled from 'styled-components'

interface IProp {
    contenidos: any[]
    showModal: boolean
    setShowModal: Function
}

const IndicadoresAprendizajeModal: React.FC<IProp> = (prop) => {
  const { contenidos, showModal, setShowModal } = prop
  return (
    <>
      <ConteinerBtn>
        <Modal
          size='lg'
          style={{ maxWidth: '1300px', width: '100%' }}
          isOpen={showModal}
          toggle={() => setShowModal(false)}
          scrollable
        >
          <ModalHeader toggle={() => setShowModal(false)}>
            Indicadores
          </ModalHeader>
          <ModalBody>
            <div
              style={{ height: '700px', overflowY: 'auto' }}
            >
              {contenidos?.map((contenido, index) => {
                return (
                  <>
                    <div
                        className='modal-title1'
                        style={{
                            backgroundColor: `${colors.primary}`
                          }}
                      >
                        <h3 style={{ color: '#fff' }}>
                            {contenido.nombre}
                          </h3>
                      </div>
                    <CuadriculaHeader>
                        <table>
                            <thead>
                                <Aitem
                                    style={{
                                        backgroundColor: `${colors.primary}`
                                      }}
                                  >
                                    <th
                                        style={{
                                            color: '#fff',
                                            textAlign:
                                                                    'center',
                                            fontSize:
                                                                    'medium',
                                            fontWeight:
                                                                    'lighter'
                                          }}
                                      >
                                                          Indicadores de
                                                          aprendizaje
                                      </th>
                                  </Aitem>
                                {contenido.columnas.map(
                                    (columna, index) => {
                                      return (
                                          <Bitem
                                              style={{
                                                  backgroundColor:
                                                                            columna.color,
                                                  color: '#fff',
                                                  fontSize:
                                                                            'medium',
                                                  fontWeight:
                                                                            'lighter'
                                                }}
                                              key={index}
                                            >
                                              {
                                                                        columna.nombre
                                                                    }
                                            </Bitem>
                                      )
                                    },
                                  )}
                              </thead>
                            <tbody>
                                {contenido.filas.map(
                                    (fila, ifila) => {
                                      return (
                                          <tr key={ifila}>
                                              <td
                                                  style={{
                                                      textAlign:
                                                                                'center',
                                                      boxShadow:
                                                                                '1px 1px 1px 1px rgba(58, 57, 57, 0.1)'
                                                    }}
                                                >
                                                  {
                                                                            fila.nombre
                                                                        }
                                                </td>
                                              {fila.celdas.map(
                                                  (
                                                    celda,
                                                    icelda,
                                                  ) => {
                                                    return (
                                                        <BitemTd
                                                            key={
                                                                                        icelda
                                                                                    }
                                                          >
                                                            {' '}
                                                            {
                                                                                        celda.nombre
                                                                                    }{' '}
                                                          </BitemTd>
                                                    )
                                                  },
                                                )}
                                            </tr>
                                      )
                                    },
                                  )}
                              </tbody>
                          </table>
                      </CuadriculaHeader>
                  </>
                )
              })}
            </div>
          </ModalBody>
          <ModalFooter
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              color='primary'
              onClick={() => setShowModal(false)}
            >
              Cerrar
            </Button>
          </ModalFooter>
        </Modal>
      </ConteinerBtn>
    </>
  )
}

const Aitem = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    height: 7.5rem;
    width: 15rem;
    max-width: 15rem;
    box-shadow: 1px 1px 1px 1px rgba(235, 232, 232, 0.836);
`

const Bitem = styled.th`
    text-align: center;
    height: 7.5rem;
    width: 25rem;
    max-width: 100%;
    box-shadow: 1px 1px 1px 1px rgba(22, 22, 22, 0.1);
    padding: 1.5%;
`
const BitemTd = styled.td`
    text-align: center;
    height: 7.5rem;
    width: 25rem;
    max-width: 100%;
    box-shadow: 1px 1px 1px 1px rgba(22, 22, 22, 0.1);
    padding: 1.5%;
`

const CuadriculaHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    align-content: center;
    width:100%
`

const ModalTitle1 = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    height: 60px;
    border-bottom: 1px solid rgba(241, 235, 235, 0.747);
    margin-top: 2%;
`

const ConteinerBtn = styled.div`
    display: flex;
    justify-content: center;
    justify-content: right;
`

export default IndicadoresAprendizajeModal
