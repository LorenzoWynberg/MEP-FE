import CollapseCardPlain from 'Components/common/CollapseCardPlain'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { useActions } from 'Hooks/useActions'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import {
  Button,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader
} from 'reactstrap'
import {
  getDataNiveles,
  setNivelEntidadMatriculaId,
  clearNivelesData
} from 'Redux/traslado/actions'

const CardNivel = ({ data, onClick, entidadMatriculaId }) => {
  return (
    <div
      className={
        entidadMatriculaId === data.entidadMatriculaId
          ? 'nivel-container selected'
          : 'nivel-container'
      }
      onClick={() => {
        onClick(data)
      }}
      style={{ cursor: 'pointer' }}
    >
      <div className='nivel-encabezado'>
        <h2> {data.nivelNombre}</h2>
        <small>
          {' '}
          {data.servicioNombre == null ? 'Sin servicio' : data.servicioNombre}
        </small>
        <br />
        <small>
          {' '}
          {data.especialidadNombre == null
            ? 'SIN ESPECIALIDAD'
            : data.especialidadNombre}
        </small>
      </div>
      <div className='nivel-detalle'>
        <h3>{data.modalidadNombre}</h3>
        <span>{data.mujeres + data.hombres} estudiantes matriculados</span>
        <span>{data.limiteEstudiantes} Matrícula proyectada</span>
        <div className='icons-container'>
          <small className='color-female'>
            {' '}
            <i className='simple-icon-user-female' />
            {data.mujeres}
          </small>
          <small className='color-male'>
            {' '}
            <i className='simple-icon-user' />
            {data.hombres}
          </small>
        </div>
      </div>
    </div>
  )
}

const SelectorNivelDesde = (props) => {
  const [niveles, setNiveles] = useState([])
  const [especialidades, setEspecialidades] = useState([
    { label: '', value: null }
  ])

  const [filtros, setFiltros] = useState([{ modeloOferta: 0, especialidad: 0 }])

  const [ofertas, setOfertas] = useState([])
  const [entidadMatriculaId, setEntidadMatriculaId] = useState(0)

  const actions = useActions({
    setNivelEntidadMatriculaId,
    getDataNiveles,
    clearNivelesData
  })

  const state = useSelector((store) => {
    return {
      niveles: store.traslado.niveles,
      entidadMatriculaId: store.traslado.entidadMatriculaId,
      authUser: store.authUser
    }
  })

  const fetchTraslados = async () => {
    if (state.authUser.currentInstitution?.id) {
      if (props.openModal) {
        await actions.getDataNiveles(
          state.authUser.currentInstitution?.id,
          state.authUser.periodosLectivos[0]?.idCurso
        )
      }
    }
  }
  useEffect(() => {
    fetchTraslados()
  }, [props.openModal, state.authUser.currentInstitution?.id])

  useEffect(() => {
    setEntidadMatriculaId(0)
  }, [state.estudianteData])

  useEffect(() => {
    setNiveles(state.niveles)
    setEntidadMatriculaId(state.entidadMatriculaId)

    const _modelosOfertasIds = [
      ...new Set(state.niveles.map((item) => item.modeloOfertaId))
    ]
    const _modelosOfertas = _modelosOfertasIds.map((item) => {
      const moFinded = state.niveles.find((x) => x.modeloOfertaId === item)

      const _niveles = state.niveles.filter((x) => x.modeloOfertaId === item)

      const _especialides = []

      const _uniqueEspecialidadesId = [
        ...new Set(_niveles.map((item) => item.especialidadId))
      ]

      _uniqueEspecialidadesId.map((ni) => {
        if (ni) {
          const _especialidadFinded = state.niveles.find(
            (x) => x.especialidadId === ni
          )
          _especialides.push({
            label: _especialidadFinded.especialidadNombre,
            value: _especialidadFinded.especialidadId
          })
        } else {
          _especialides.push({
            label: 'SIN ESPECIALIDADES',
            value: null
          })
        }
      })

      return {
        Id: item,
        Nombre: moFinded.modeloOfertaNombre,
        permiteDuplicados: moFinded.permiteDuplicados,
        especialidades: _especialides
      }
    })

    setOfertas(_modelosOfertas)
  }, [state.niveles, state.entidadMatriculaId, filtros, especialidades])

  const onClickNivel = (nivel) => {
    actions.setNivelEntidadMatriculaId(nivel)
    if (props.onSelectNivel) {
      props.onSelectNivel(2)
    }
  }

  const handleChangeEspecialidad = (especialidad, modeloOferta) => {
    const _especialidad = [...especialidades, especialidad]

    setEspecialidades(_especialidad)

    const _filtros = [
      ...filtros,
      { modeloOferta, especialidad: especialidad.value }
    ]

    setFiltros(_filtros)
  }
  const onCancel = async () => {
    await actions.clearNivelesData()
    props.onSelectNivel(0)
  }

  return (
    <Modal isOpen={props.openModal} size='lg' style={{ maxWidth: '90%' }}>
      <ModalHeader>Completar datos requeridos</ModalHeader>
      <ModalBody>
        <div>
          <p>Selecciona el nivel en donde se registrará al estudiante</p>
          {ofertas.map((o) => {
            let _nivelesOferta = niveles.filter(
              (x) => x.modeloOfertaId === o.Id
            )

            const _permiteDuplicados = o.permiteDuplicados
            const _especialidadSeleccionada = filtros.find(
              (x) => x.modeloOferta == o.Id
            )
            if (_permiteDuplicados) {
              if (_especialidadSeleccionada) {
                _nivelesOferta = niveles.filter(
                  (x) =>
                    x.modeloOfertaId === o.Id &&
                    x.especialidadId === _especialidadSeleccionada.especialidad
                )
              } else {
                _nivelesOferta = []
              }
            }

            const openPlain =
              _nivelesOferta.find(
                (item) =>
                  item.modeloOfertaId == o.Id &&
                  item.entidadMatriculaId == entidadMatriculaId
              ) != undefined
            return (
              <CollapseCardPlain
                titulo={o.Nombre}
                addItem={() => {}}
                openPlain={openPlain}
              >
                {_permiteDuplicados
                  ? (
                    <FormGroup>
                      <Label>Seleccione una especialidad</Label>

                      <Select
                        name='especialidad'
                        components={{ Input: CustomSelectInput }}
                        className='react-select'
                        classNamePrefix='react-select'
                        options={o.especialidades}
                        placeholder=''
                        value={
                        _especialidadSeleccionada
                          ? especialidades.find(
                            (x) =>
                              x.value ===
                                _especialidadSeleccionada.especialidad
                          )
                          : { label: '', value: null }
                      }
                        onChange={(data) => {
                          handleChangeEspecialidad(data, o.Id)
                        }}
                      />
                    </FormGroup>
                    )
                  : null}

                {_nivelesOferta.map((nivel) => {
                  return (
                    <CardNivel
                      onClick={onClickNivel}
                      entidadMatriculaId={entidadMatriculaId}
                      data={nivel}
                    />
                  )
                })}
              </CollapseCardPlain>
            )
          })}
        </div>

        <div className='wizard-buttons justify-content-center'>
          <Button color='primary' outline onClick={() => onCancel()}>
            {props.messages['wizard.cancel']}
          </Button>

          <Button
            color='primary'
            onClick={async () => {
              if (state.entidadMatriculaId > 0) {
                return props.onSelectNivel(2)
              }

              props.setSnackbarContent({
                variant: 'warning',
                msg: 'Aún no eliges el nivel'
              })

              return props.handleClick()
            }}
          >
            {props.messages['wizard.save']}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default SelectorNivelDesde
