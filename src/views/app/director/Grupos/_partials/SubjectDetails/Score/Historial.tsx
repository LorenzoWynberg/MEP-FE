import React, { useEffect, useState } from 'react'
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap'
import { useActions } from 'Hooks/useActions'
import colors from 'Assets/js/colors'
import UpdateIcon from '@mui/icons-material/Update'
import TableFilter from '../../../../../../../components/Table-filter/Table'
import moment from 'moment'
import { getBitacoraBySubject } from 'Redux/Calificaciones/actions'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const ModalScore = (props) => {
    const { t } = useTranslation()
    const [modalHistory, setModalHistory] = useState(false)
    const [bitacoraData, setBitacoraData] = useState([])
    const state = useSelector((store) => {
        return {
            ...store.calificaciones
        }
    })
    const actions = useActions({
        getBitacoraBySubject
    })

    useEffect(() => {
        if (props.subject.sb_gruposId) {
            actions.getBitacoraBySubject(props.subject.datosMallaCurricularAsignaturaInstitucion.sb_asignaturaId,props.subject.sb_gruposId)
        }
    }, [props.groupId, modalHistory])

    useEffect(() => {
        setBitacoraData(
            state.bitacora.map((el) => {
                const parsedData = JSON.parse(el.json || '')
                let dataObj = {}
                if (parsedData[0]) {
                    dataObj = parsedData[0].Datos[0]
                }

                return {
                    ...el,
                    ...dataObj,
                    fechaInsercion: moment(dataObj.updatetime).format(
                        'DD/MM/YYYY'
                    ),
                    hora: moment(dataObj.updatetime).format('hh:mm A')
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
                Header: t(
                    'estudiantes>buscador_per>info_cuenta>historial_cambios>colum_fecha',
                    'Fecha'
                ),
                accessor: 'fechaInsercion'
            },
            {
                Header: t(
                    'estudiantes>buscador_per>info_cuenta>historial_cambios>colum_hora',
                    'Hora'
                ),
                accessor: 'hora'
            },
            {
                Header: t(
                    'gestion_grupo>calificaciones>historia>nota_final',
                    'Nota final'
                ),
                accessor: 'notaFinal'
            },
            {
                Header: t('gestion_grupo>asistencia>estudiante', 'Estudiante'),
                accessor: 'NombreEstudiante',
                width: '14rem'
            },
            {
                Header: t(
                    'estudiantes>buscador_per>info_cuenta>historial_cambios>colum_usuario',
                    'Usuario'
                ),
                accessor: 'NombreUsuario'
            }
        ],
        [t]
    )
    
    return (
        <>
            <Button
                style={{ backgroundColor: `${colors.primary}` }}
                className="btn-history"
                onClick={toggle}
            >
                <div className="d-flex justify-content-center align-items-center">
                    <UpdateIcon
                        style={{ marginRight: '4px', fontSize: '16px' }}
                    />{' '}
                    {t(
                        'gestion_grupos>asistencia>historia>boton',
                        'Historial de cambios'
                    )}
                </div>
            </Button>
            <Modal
                size="lg"
                style={{ maxWidth: '1400px', width: '80%' }}
                isOpen={modalHistory}
                toggle={toggle}
                scrollable
            >
                <ModalHeader toggle={toggle}>
                    {t(
                        'gestion_grupos>asistencia>historia>boton',
                        'Historial de cambios'
                    )}
                </ModalHeader>
                <div style={{ padding: '2rem' }}>
                    <ModalBody style={{ overflowX: 'scroll', padding: 0 }}>
                        <div
                            style={{
                                width: '1275px',
                                margin: '0 auto',
                                minHeight: '14rem'
                            }}
                        >
                            <TableFilter
                                avoidFilter
                                columns={columns}
                                data={bitacoraData}
                            />
                        </div>
                    </ModalBody>
                </div>
                <ModalFooter
                    style={{ display: 'flex', justifyContent: 'center' }}
                >
                    <Button color="primary" onClick={toggle}>
                        {t(
                            'configuracion>mallas_curriculares>indicadores_aprendizaje>boton>previsualizar>boton>cerrar',
                            'Cerrar'
                        )}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default ModalScore
