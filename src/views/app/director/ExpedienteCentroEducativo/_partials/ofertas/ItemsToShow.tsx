import React from 'react'
import { Button, Card, CardBody, Col } from 'reactstrap'
import LaunchIcon from '@material-ui/icons/Launch'
import DeleteIcon from '@material-ui/icons/Delete'
import { useTranslation } from 'react-i18next'

const ItemsToShow = (props) => {
  const { t } = useTranslation()

  const {
    state,
    stagedAsignaturas,
    data,
    toggleCreateMallaAsignatura,
    deleteMultiple,
    toggleCreateAsignatura,
    currentSpeciality,
    currenNivelesOferta,
    readOnly,
    sortedLevels,
    asignaturasParsed,
    disableButton = false,
    hasEditAccess = true,
    hasDeleteAccess = true
  } = props

  return (
    <Card>
      <CardBody>
        <h3>{data.nombreModeloOferta}</h3>
        <table className='mallasTable'>
          <thead>
            <tr>
              <td scope='col'>{t('configuracion>mallas_curriculares>ver>nombre_asignatura_figura_afin', 'Nombre de la asignatura/figura afín')}2</td>

              {sortedLevels.map((el) => {
                return <td scope='col'>{el.nombre}</td>
              })}
              {!readOnly && <td scope='col' />}
            </tr>
          </thead>
          <tbody>
            {asignaturasParsed.map((_asignatura) => {
              return (
                <tr>
                  <td scope='row'>{_asignatura?.nombre}</td>
                  {sortedLevels.map((level) => {
                    let levelAsignatura = null
                    let currentNivelOferta = null
                    if (currentSpeciality) {
                      const levels = state.currenNivelesOferta.filter(
                        (lvlOffer) => {
                          return (
                            lvlOffer.nivelId === level.id &&
                            (lvlOffer.especialidadId === currentSpeciality.id ||
                              (currentSpeciality.id === 0 &&
                                !lvlOffer.especialidadId))
                          )
                        }
                      )
                      currentNivelOferta =
                        levels.length > 1
                          ? levels.find((el) => el.calendarioId)
                          : levels[0]
                    }
                    levelAsignatura = stagedAsignaturas[
                      _asignatura.asignaturasAgrupadas
                    ]?.find((j) => {
                      if (currentNivelOferta) {
                        return j.nivelOfertaId === currentNivelOferta.id
                      }
                      return j.nivelId === level.id
                    })

                    return (
                      <td>
                        {levelAsignatura
                          ? (
                            <span className='hoverController'>
                              {levelAsignatura.cantidadLecciones}{' '}
                              {
                              hasEditAccess && (
                                <LaunchIcon
                                  className='hoverItem'
                                  onClick={() => {
                                    // debugger
                                    toggleCreateMallaAsignatura(
                                      _asignatura,
                                      level,
                                      levelAsignatura,
                                    )
                                  }}
                                />
                              )
                            }
                            </span>
                            )
                          : (
                            <span className='hoverController'>
                              {' '}
                              -{' '}
                              <LaunchIcon
                                className='hoverItem'
                                onClick={() => {
                                  // debugger
                                  toggleCreateMallaAsignatura(
                                    _asignatura,
                                    level,
                                    {
                                      mallaCurricularInstitucionId: data.mallaCurricularInstitucionId
                                    }
                                  )
                                }}
                              />
                            </span>
                            )}
                      </td>
                    )
                  })}
                  {!readOnly && hasDeleteAccess && (
                    <td>
                      <DeleteIcon
                        className='cursor-pointer'
                        color='primary'
                        onClick={() => {
                          const test = sortedLevels
                            .filter(
                              (item) =>
                                item.modeloOfertaId == data.ofertaId ||
                                item.modeloOfertaId == data.sb_modeloOfertaId
                            )
                            .map((level) => {
                              let levelAsignatura = null
                              const currentNivelOferta = null
                              levelAsignatura = stagedAsignaturas[
                                _asignatura.asignaturasAgrupadas
                              ].find((j) => {
                                if (currentNivelOferta) {
                                  return (
                                    j.nivelOfertaId === currentNivelOferta.id
                                  )
                                }
                                return j.nivelId === level.id
                              })
                              if (levelAsignatura) {
                                return levelAsignatura.mallaCurricularAsignaturaInstitucionId
                              }
                              return null
                            })
                          deleteMultiple(test, _asignatura.id)
                        }}
                      />
                    </td>
                  )}
                </tr>
              )
            })}
            <tr>
              <td scope='row' className='lastItem'>
                {t("configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>agregar>total", "Total")}
              </td>
              {sortedLevels
                .filter(
                  (item) =>
                    item.modeloOfertaId == data.ofertaId ||
                    item.modeloOfertaId == data.sb_modeloOfertaId
                )
                .map((level) => {
                  return (
                    <td className='lastItem'>
                      {state.mallasAsignaturasInstitucion?.reduce(
                        (prevValue, currentValue) => {
                          const currentNivelOferta = null

                          if (
                            currentNivelOferta &&
                            currentValue.nivelOfertaId ===
                              currentNivelOferta.id &&
                            currentValue.cantidadLecciones
                          ) {
                            return prevValue + currentValue.cantidadLecciones
                          }
                          if (
                            !currentNivelOferta &&
                            currentValue.nivelId === level.id &&
                            currentValue.cantidadLecciones
                          ) {
                            return prevValue + currentValue.cantidadLecciones
                          }
                          return prevValue
                        },
                        0
                      )}
                    </td>
                  )
                })}
              {!readOnly && <td className='lastItem' />}
            </tr>
          </tbody>
        </table>
        <br />
        {!readOnly && !disableButton && (
          <Col sm='12'>
            <Button color='primary' onClick={toggleCreateAsignatura}>
              {t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>agregar_asignatura', 'Agregar asignatura/figura afín')}
            </Button>
          </Col>
        )}
      </CardBody>
    </Card>
  )
}

export default ItemsToShow
