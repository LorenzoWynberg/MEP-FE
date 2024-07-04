import React, { useMemo, useState } from 'react'
import SimpleModal from 'Components/Modal/simple'
import Select from 'react-select'
import { Input } from 'reactstrap'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import moment from 'moment'
import { useSelector } from 'react-redux'
import swal from 'sweetalert'
import { useActions } from 'Hooks/useActions'
import { trasladoExterior } from 'Redux/traslado/actions.js'
import { getEstudiantesByNivelOfertaSinFallecidos } from 'Redux/grupos/actions'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { useTranslation } from 'react-i18next'

const ModalTrasladosACentroNoIdentificado = ({
  openModal = false,
  setOpenModal = (e) => {},
  selectedMatriculasId = [],
  nivelOfertaId = 0
}) => {
  const students = useSelector((state) => state.grupos.allGroupMembers)
  const [selectedOption, setSelectedOption] = useState(null)
  const [tab, setTab] = useState(0)
  const [inputValues, setInputValues] = useState({
    name: '',
    motivo: ''
  })
  const { currentInstitution } = useSelector((state) => state.authUser)
  const { t } = useTranslation()

  const calculateAge = (birthday) => {
    // birthday is a date
    const ageDifMs = Date.now() - birthday
    const ageDate = new Date(ageDifMs) // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970)
  }

  const actions = useActions({
    trasladoExterior,
    getEstudiantesByNivelOfertaSinFallecidos
  })

  const columns = useMemo(() => {
    return [
      {
        Header: t('estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>acciones>columna_identificacion', 'Identificación'),
        accessor: 'identificacion',
        label: '',
        column: ''
      },
      {
        Header: t('estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>acciones>columna_nombre', 'Nombre completo'),
        accessor: 'nombreCompleto',
        label: '',
        column: ''
      },
      {
        Header: t('estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>acciones>columna_nacionalidad', 'Nacionalidad'),
        accessor: 'nacionalidad',
        label: '',
        column: '',
        Cell: ({ row }) => {
          return (
            <div>
              {row.original?.nacionalidades &&
                row.original?.nacionalidades[0]?.nacionalidad}
            </div>
          )
        }
      },
      {
        Header: t('estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>acciones>columna_fecha_nacimiento', 'Fecha de nacimiento'),
        accessor: 'fechaNacimiento',
        label: '',
        column: '',
        Cell: ({ row }) => {
          return (
            <div>
              {row.original?.fechaNacimiento &&
                moment(row.original?.fechaNacimiento).format(
                  'DD/MM/yyyy'
                )}
            </div>
          )
        }
      },
      {
        Header: t('estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>acciones>columna_edad', 'Edad cumplida'),
        accessor: 'edad',
        label: '',
        column: '',
        Cell: ({ row }) => {
          return (
            <div>
              {row.original?.fechaNacimiento &&
								calculateAge(
								  new Date(row.original?.fechaNacimiento)
								)}{' '}
              {t("general>años",'años')}
            </div>
          )
        }
      },
      {
        Header: t('estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>acciones>columna_identidad_genero', 'Identidad de género'),
        accessor: 'genero',
        label: '',
        column: '',
        Cell: ({ row }) => {
          return (
            <div>
              {row.original?.genero[0] &&
                row.original?.genero[0]?.nombre}
            </div>
          )
        }
      }
    ]
  }, [students,t])

  const data = useMemo(() => {
    return students.filter((el) =>
      selectedMatriculasId.includes(el.matriculaId)
    )
  }, [students, selectedMatriculasId])

  const options = [
    {
      label: t('estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>acciones>opc_1', 'Centro educativo no acreditado'),
      value: 0
    },
    {
      label: t('estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>acciones>opc_2', 'Centro educativo fuera del país'),
      value: 1
    }
  ]
  return (
    <SimpleModal
      openDialog={openModal}
      title={t('estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>acciones>traslado_centro_no_identificado', 'Traslado a centro educativo no identificado')}
      onClose={() => {
        setOpenModal(false)
        setTab(0)
        setInputValues({
          name: '',
          motivo: ''
        })
        // setSelectedLevel(null)
      }}
      onConfirm={() => {
        if (tab === 0 && selectedOption === 0) {
          setTab(1)
        }
        if (tab === 0 && selectedOption === 1) {
          setTab(2)
        }
        if (tab === 1) {
          setTab(2)
        }
        if (tab === 2) {
          swal({
            title: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>acciones>estudiante_trasladar>titulo_trasladar', 'Traslado a centro no identificado'),
            text: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>acciones>estudiante_trasladar>mensaje_trasladar', 'Está seguro que desea realizar el traslado, le informamos que después de esta confirmación no podrá revertir la acción'),
            icon: 'warning',
            className: 'text-alert-modal',
            buttons: {
              cancel: t('boton>general>cancelar', 'Cancelar'),
              ok: {
                text: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>acciones>estudiante_trasladar>boton_aceptar', 'Aceptar traslado'),
                value: true,
                className: 'btn-alert-color'
              }
            }
          }).then(async (res) => {
            const index = students.findIndex(
              (el) => el?.matriculaId === selectedMatriculasId[0]
            )
            const selectedStudent =
              index !== -1 ? students[index] : null
            if (res) {
              if (index !== -1) {
                const response = await actions.trasladoExterior(
                  {
                    matriculaId: selectedMatriculasId[0],
                    institucionOrigenId:
                      selectedStudent?.institucionId,
                    entidadMatriculaId:
                      null,
                    motivoTraslado: inputValues?.motivo,
                    nombreInstitucionDestino:
                      inputValues?.name
                  }
                )
                if (!response?.error) {
                  await actions.getEstudiantesByNivelOfertaSinFallecidos(
                    nivelOfertaId,
                    currentInstitution?.id
                  )
                  swal({
                    title: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>acciones>estudiante_trasladar>mensaje_exito', 'Traslado realizado con exito'),
                    text: '',
                    icon: 'success',
                    className: 'text-alert-modal',
                    buttons: {
                      ok: {
                        text: t('general>aceptar', 'Aceptar'),
                        value: true,
                        className: 'btn-alert-color'
                      }
                    }
                  }).then(() => {
                    setOpenModal(false)
                    setTab(0)
                    setInputValues({
                      name: '',
                      motivo: ''
                    })
                  })
                }
              } else {
                swal({
                  title: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>acciones>estudiante_trasladar>mensaje_error', 'Ha ocurrido un error'),
                  text: '',
                  icon: 'error',
                  className: 'text-alert-modal',
                  buttons: {
                    ok: {
                      text: t('general>aceptar', 'Aceptar'),
                      value: true,
                      className: 'btn-alert-color'
                    }
                  }
                }).then(() => {
                  setOpenModal(false)
                  setTab(0)
                  setInputValues({
                    name: '',
                    motivo: ''
                  })
                })
              }
            }
          })
        }
      }}
    >
      <div>
        {tab === 0 && (
          <div>
            <h6>{t('estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>acciones>seleccione_tipo', 'Seleccione el tipo de centro')}</h6>
            <Select
              placeholder={t('estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>acciones>seleccione_opcion', 'Seleccione una opción')}
              options={options}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999
                })
              }}
              onChange={({ value }) => {
                setSelectedOption(value)
              }}
              className='react-select'
              classNamePrefix='react-select'
              components={{ Input: CustomSelectInput }}
            />
          </div>
        )}

        {tab === 1 && (
          <>
            <h6>
              {t('estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>acciones>nombre_no_acreditado', 'Si conoce el nombre del centro educativo escríbalo aquí')}
            </h6>
            <Input
              type='text'
              value={inputValues.name}
              onChange={(e) => {
                setInputValues({
                  ...inputValues,
                  name: e.target.value
                })
              }}
              name='name'
            />
          </>
        )}
        {tab === 2 && (
          <>
            <h4>
              {t("gestion_grupo>asistencia>estudiante",'Estudiante')}{students.length > 1 ? 's' : ''} {t('gestion_traslados>a_trasladar','a trasladar')}
              
            </h4>
            <h6>
              {t('gestion_traslados>verifique_los_datos','Verifique los datos')}{' '}
              {students.length > 1
							  ? t('gestion_traslados>de_los_studiantes','de los estudiantes')
							  : t('gestion_traslados>del_estudiante','del estudiante')}{' '}
              {t('gestion_traslados>a_trasladar','a trasladar')}
            </h6>
            <TableReactImplementation
              avoidSearch
              columns={columns}
              data={data}
            />
            <div className='d-flex justify-content-between'>
              <div
                style={{ width: '49%', margin: '1rem 0' }}
                className='d-flex flex-column'
              >
                <h4 style={{ fontWeight: 'bold' }}>
                  {t('estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>acciones>motivo', 'Motivo del traslado')}
                </h4>
                <h6>
                  *{t('estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>acciones>motivo_texto', 'Por favor indique el motivo por el que se realiza el traslado')}
                </h6>
                <textarea
                  rows={4}
                  //  resize={false}
                  value={inputValues.motivo}
                  onChange={(e) => {
                    setInputValues({
                      ...inputValues,
                      motivo: e.target.value
                    })
                  }}
                  style={{
                    resize: 'none'
                  }}
                />
              </div>
              <div
                style={{ width: '49%', margin: '1rem' }}
                className='d-flex flex-column'
              >
                <h4 style={{ fontWeight: 'bold' }}>
                  {t('estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>acciones>condicion', 'Condición propuesta')}
                </h4>
                <h6>
                  {t('estudiantes>traslados>gestion_traslados>traslado_centro_no_identificado>estudiantes_matriculados>acciones>condicion_texto', 'Verifique los datos de la condición propuesta')}
                </h6>
                <div
                  style={{
                    padding: '.5rem',
                    background: '#f3f3f3',
                    fontSize: '0.8rem'
                  }}
                >
                  <div style={{ fontSize: '0.6rem' }}>
                    {t('gestion_traslados>tipo_traslado','TIPO DE TRASLADO')}
									</div>
                  {selectedOption === 0
									  ? t('gestion_traslado>a_centro_privado_no_acreditado','A centro educativo privado no acreditado')
									  : t('gestion_traslado>a_centro_educativo_fuera_del_pais','A centro educativo fuera del país')}
                  <div style={{ fontSize: '0.6rem' }}>
                    {t('gestion_traslados>lugar_traslado','LUGAR DE TRASLADO')}
									</div>
                  {inputValues.name}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </SimpleModal>
  )
}

export default ModalTrasladosACentroNoIdentificado
