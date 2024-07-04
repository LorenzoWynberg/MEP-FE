import React, { useState } from 'react'
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  ModalFooter
} from 'reactstrap'
import colors from 'Assets/js/colors'
import { IoEyeSharp } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'

const DEFAULT_CONTENIDO_OBJ = {
  nombre: '',
  descripcion: '',
  puntos: false,
  columnas: [
    {
      nombre: 'Inicial',
      color: '#09243b',
      puntos: ''
    },
    {
      nombre: 'Intermedio',
      color: '#0c3354',
      puntos: ''
    },
    {
      nombre: 'Avanzado',
      color: '#10436e',
      puntos: ''
    }
  ],
  filas: [
    {
      nombre: 'Introducción a la etapa de configuración ',
      celdas: [
        {
          nombre: 'Incluye conexión a nuestro tema actual de semestre',
          detalle: ''
        },
        {
          nombre: 'Incluye conexión a nuestro tema actual de semestre',
          detalle: ''
        },
        {
          nombre: 'Incluye conexión a nuestro tema actual de semestre',
          detalle: ''
        }
      ]
    }
  ]
}

const PrevisualizaIndicadores = ({ contenidos = [] }) => {
  const { t } = useTranslation()
  const [modalPrev, setModalPrev] = useState(false)
  const toggle2 = () => {
    setModalPrev(!modalPrev)
  }

  return (
    <>
      <div className='conteiner-btn'>
        <Button color='primary' outline className='btn1' onClick={toggle2}>
          <IoEyeSharp style={{ fontSize: '20px', marginRight: '5px' }} />
          {t('configuracion>mallas_curriculares>indicadores_aprendizaje>ver>boton>previsualizar', 'Previsualizar')}
        </Button>
        <Modal
          size='lg'
          style={{ maxWidth: '1300px', width: '100%' }}
          isOpen={modalPrev}
          toggle={toggle2}
          scrollable
        >
          <ModalHeader toggle={toggle2}>{t('configuracion>mallas_curriculares>indicadores_aprendizaje>boton>previsualizar>previsualización', 'Previsualización')} </ModalHeader>
          <ModalBody>
            <div style={{ height: '700px', overflowY: 'auto' }} className='div-conteiner-cuadricula'>

              {contenidos?.map((contenido, index) => {
                return (
                  <>
                    <div
                      className='modal-title1'
                      style={{ backgroundColor: `${colors.primary}` }}
                    >
                      <h3 style={{ color: '#fff' }}>{contenido.nombre}</h3>
                    </div>
                    <div className='cuadricula-header'>
                      <table>
                        <thead>
                          <div
                            className='aitem'
                            style={{ backgroundColor: `${colors.primary}` }}
                          >
                            <th style={{ color: '#fff', textAlign: 'center', fontSize: 'medium', fontWeight: 'lighter' }}>
                              {t('configuracion>mallas_curriculares>indicadores_aprendizaje>boton>previsualizar>indicadores_de _aprendizaje', 'Indicadores de aprendizaje')}
                            </th>
                          </div>
                          {contenido.columnas.map((columna, index) => {
                            return (
                              <th
                                className='bitem'
                                style={{ backgroundColor: columna.color, color: '#fff', fontSize: 'medium', fontWeight: 'lighter' }}
                                key={index}
                              >
                                {columna.nombre}
                              </th>
                            )
                          })}
                        </thead>
                        <tbody>
                          {contenido.filas.map((fila, ifila) => {
                            return (
                              <tr key={ifila}>
                                <td style={{ textAlign: 'center', boxShadow: '1px 1px 1px 1px rgba(58, 57, 57, 0.1)' }}>
                                    {fila.nombre}
                                  </td>
                                {fila.celdas.map((celda, icelda) => {
                                    return (
                  <td className='bitem' key={icelda}>
                                {' '}
                                {celda.nombre}{' '}
                              </td>
                                    )
                                  })}
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )
              })}
            </div>
          </ModalBody>
          <ModalFooter style={{ display: 'flex', justifyContent: 'center' }}>
            <Button color='primary' onClick={toggle2}>
              {t('configuracion>mallas_curriculares>indicadores_aprendizaje>boton>previsualizar>boton>cerrar', 'Cerrar')}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  )
}

export default PrevisualizaIndicadores
