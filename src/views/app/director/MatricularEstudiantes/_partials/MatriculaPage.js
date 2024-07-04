import CollapseCardPlain from 'Components/common/CollapseCardPlain'
import React, { useState, useEffect } from 'react'
import { FormGroup, Label } from 'reactstrap'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { selectEntidadMatriculaId, getNiveles } from '../../../../../redux/matricula/actions'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { useTranslation } from 'react-i18next'

const CardNivel = ({ data, onClick, entidadMatriculaId }) => {
  return (
    <div
      className={
        entidadMatriculaId === data.entidadMatriculaId
          ? 'nivel-container selected'
          : 'nivel-container'
      }
      onClick={() => {
        onClick(data.entidadMatriculaId)
      }}
      style={{ cursor: 'pointer' }}
    >
      <div
        className={`nivel-encabezado ${data.servicioNombre != null && 'green'}`}
      >
        <h2> {data.nivelNombre}</h2>
        <small>
          {' '}
          {data.servicioNombre == null ? 'Sin servicio' : data.servicioNombre}
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

const MatriculaPage = (props) => {
  const { t } = useTranslation()
  const [niveles, setNiveles] = useState([])
  const [institucion, setInstitucion] = useState({ nombre: '', id: 0 })
  const [showSpecialties, setShowSpecialties] = useState({})
  const [especialidades, setEspecialidades] = useState([
    { label: '', value: null }
  ])
  const classes = useStyles()

  const [filtros, setFiltros] = useState([{ modeloOferta: 0, especialidad: 0 }])

  const [ofertas, setOfertas] = useState([])
  const [entidadMatriculaId, setEntidadMatriculaId] = useState(0)

  const actions = useActions({
    selectEntidadMatriculaId,
    getNiveles
  })

  const state = useSelector((store) => {
    return {
      niveles: store.matricula.niveles,
      entidadMatriculaId: store.matricula.entidadMatriculaId,
      authUser: store.authUser,
      matricula: store.matricula
    }
  })

  useEffect(() => {
    if (state.authUser.currentInstitution) {
      setInstitucion(state.authUser.currentInstitution)
      // debugger
      if (state.matricula.cursoLectivo && state.matricula.cursoLectivo.value !== null) {
        const loadData = async () => {
          await actions.getNiveles(state.authUser.currentInstitution.id, state.matricula.cursoLectivo.value)
        }

        loadData()
      }
    }
  }, [])

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
        const _especialidadFinded = state.niveles.find(
          (x) => x.especialidadId === ni
        )
        _especialides.push({
          label: _especialidadFinded.especialidadNombre,
          value: _especialidadFinded.especialidadId
        })
      })

      return {
        Id: item,
        Nombre: moFinded.modeloOfertaNombre,
        permiteDuplicados: moFinded.permiteDuplicados,
        especialidades: _especialides
      }
    })
    // debugger
    _modelosOfertas.forEach((el) => {
      setShowSpecialties({
        [el?.Id]: Boolean(el?.especialidades?.length > 1 || el?.especialidades[0]?.value) 
      })
      if (el?.especialidades?.length === 1 && !el?.especialidades[0]?.value) {
        handleChangeEspecialidad({ value: null, label: null }, el?.Id)
      }
    })
    setOfertas(_modelosOfertas)
  }, [state.niveles, state.entidadMatriculaId, filtros, especialidades])

  const onClickNivel = (id) => {
    actions.selectEntidadMatriculaId(id)
  }

  const handleChangeEspecialidad = (especialidad, modeloOferta) => {
    // debugger
    const _especialidad = [...especialidades, especialidad]

    setEspecialidades(_especialidad)

    const _filtros = [
      ...filtros,
      { modeloOferta, especialidad: especialidad.value }
    ]

    setFiltros(_filtros)
  }

  return (
    <Grid container className={classes.root}>
      <Grid item md={12} xs={12}>
        <Paper className={classes.paper}>
          <p>{t('estudiantes>matricula>seleccione_estudiantil>matricular_estudiante>datos_educativos>matricula', 'Seleccione el nivel a Matricular')}</p>
          {ofertas.map((o, i) => {
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

            return (
              <CollapseCardPlain titulo={o.Nombre} openPlain={i === 0} addItem={() => {}}>
                {_permiteDuplicados && showSpecialties[o.Id]
                  ? (
                    <FormGroup>
                      <Label>{t('estudiantes>matricula>seleccione_estudiantil>matricular_estudiante>datos_educativos>matricula>especialidad', 'Seleccione una especialidad')}</Label>

                      <Select
                        name='especialidad'
                        components={{ Input: CustomSelectInput }}
                        className='react-select'
                        classNamePrefix='react-select'
                        getOptionLabel={(el) => el?.especialidadNombre}
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
                  {/* {
                    !showSpecialties && (
                      <>
                      </>
                    )
                  } */}

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
        </Paper>
      </Grid>
    </Grid>
  )
}
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    '& > *': {}
  },
  paper: {
    minHeight: 250,
    padding: 20
  }
}))
export default MatriculaPage
