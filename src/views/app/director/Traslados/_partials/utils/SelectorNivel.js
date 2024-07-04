import CollapseCardPlain from 'Components/common/CollapseCardPlain'
import React, { useState, useEffect } from 'react'
import {
  FormGroup,
  Label,
  Row,
  Col
} from 'reactstrap'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { setNivelEntidadMatriculaId } from 'Redux/traslado/actions'

import CardEstudiante from './CardEstudiante'
import CardSituacionActual from './CardSituacionActual'

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
        <div style={{ top: '80%', right: '10%' }} className='icons-container'>
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

const SelectorNivel = (props) => {
  const [niveles, setNiveles] = useState([])
  const [especialidades, setEspecialidades] = useState([
    { label: '', value: null }
  ])

  const [filtros, setFiltros] = useState([{ modeloOferta: 0, especialidad: 0 }])

  const [ofertas, setOfertas] = useState([])

  const actions = useActions({
    setNivelEntidadMatriculaId
  })

  const state = useSelector((store) => {
    return {
      niveles: store.traslado.niveles,
      entidadMatriculaId: store.traslado.entidadMatriculaId,
      estudianteData: store.traslado.estudianteData
    }
  })

  useEffect(() => {
    setNiveles(state.niveles)

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
          if (_especialidadFinded) {
            _especialides.push({
              label: _especialidadFinded.especialidadNombre,
              value: _especialidadFinded.especialidadId
            })
          }
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
      props.onSelectNivel()
      props.setCurrentStep('step' + (parseInt(props.currentStep.slice(-1)) + 1))
    }
  }

  const handleChangeEspecialidad = (especialidad, modeloOferta) => {
    const _especialidad = [...especialidades, especialidad]

    setEspecialidades(_especialidad)

    const _filtros = [
      { modeloOferta, especialidad: especialidad.value },
      ...filtros
    ]

    setFiltros(_filtros)
  }

  return (
    <div>
      <Row>
        <Col md={6}>
          <CardEstudiante estudiante={state.estudianteData} />
        </Col>
        <Col md={6}>
          {props.tipoTraslado == 0
            ? (
              <CardSituacionActual estudiante={state.estudianteData} />
              )
            : null}
        </Col>
      </Row>

      <h2>Selecciona el nivel en donde se registrará al estudiante</h2>
      {ofertas.map((o) => {
        let _nivelesOferta = niveles.filter((x) => x.modeloOfertaId === o.Id)

        const _permiteDuplicados = o.permiteDuplicados
        const _especialidadSeleccionada = filtros.find(
          (x) => x.modeloOferta === o.Id
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
              item.entidadMatriculaId == state.entidadMatriculaId
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
                      ? o.especialidades.find(
                        (x) =>
                          x.value === _especialidadSeleccionada.especialidad
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
                  entidadMatriculaId={state.entidadMatriculaId}
                  data={nivel}
                />
              )
            })}
          </CollapseCardPlain>
        )
      })}
    </div>
  )
}

export default SelectorNivel
