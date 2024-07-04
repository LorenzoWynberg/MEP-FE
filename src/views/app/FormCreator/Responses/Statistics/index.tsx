import React, { useEffect } from 'react'
import {
  Card, CardBody,
  Row, Col
} from 'reactstrap'
import HTMLTable from 'Components/HTMLTable'
import {
  getResponsesFormPaginated,
  getForm,
  getStatisticsForm
} from '../../../../../redux/FormCreatorV2/actions'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

type IProps = {
  formId: any;
}

const Statistics: React.FC<IProps> = (props) => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [responses, setResponses] = React.useState<Array<any>>([])
  const { t } = useTranslation()
  const state = useSelector((store) => {
    return {
      ...store.creadorFormularios,
      configuracion: store.creadorFormularios.currentForm.configuracion
        ? JSON.parse(
          store.creadorFormularios.currentForm.configuracion
        )
        : {}
    }
  })

  const actions = useActions({
    getResponsesFormPaginated,
    getForm,
    getStatisticsForm
  })

  const columns = [
    {
      column: 'nombreUsuario',
      label: t('formularios>respuestas>estadisticas>nombre', 'Nombre')
    },
    {
      column: 'invitacionEmail',
      label: t('formularios>respuestas>estadisticas>correo', 'Correo electrónico')
    },
    {
      column: 'esCompleto',
      label: t('formularios>respuestas>estadisticas>completo_formulario', '¿Completó el formulario?')
    },
    {
      column: 'fechaRespuesta',
      label: t('formularios>respuestas>estadisticas>fecha_envio', 'Fecha de envío')
    },
    {
      column: 'fechaEnvio',
      label: t('formularios>respuestas>estadisticas>fecha_respuesta', 'Fecha de respuesta')
    }
  ]

  useEffect(() => {
    const loadPagination = async () => {
      await actions.getResponsesFormPaginated(props.formId)
      setLoading(false)
    }

    const loadStatistics = async () => {
      await actions.getStatisticsForm(props.formId, true)
      setLoading(false)
    }

    loadPagination()
    loadStatistics()
  }, [])

  useEffect(() => {
    setResponses(state.responses.entityList?.map((item) => {
      return {
        ...item,
        esCompleto: item.completado ? 'si' : 'no',
        fechaRespuesta: item.fechaAutoguardadoActualizado
          ? moment(item.fechaAutoguardadoActualizado).format(
            'DD/MM/YYYY hh:mm A'
          )
          : '',
        fechaEnvio: item.fechaEnvio
          ? moment(item.fechaEnvio).format('DD/MM/YYYY hh:mm A')
          : ''
      }
    }) || [])
  }, [state.responses])

  const actionRow = [

  ]

  return (
    <div style={{ paddingTop: '20px' }}>
      <Card>
        <CardBody>
          <Row>
            <Col style={{ borderRight: '1px solid #eaeaea' }}>
              <Row style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Col md={2}>
                  <h3 style={{ fontWeight: 'bold' }}>
                    {state.statistics.enviados}
                  </h3>
                </Col>
                <Col md={10}>
                  <h3 style={{ fontWeight: 'bold' }}>{t('formularios>respuestas>estadisticas>enviados', 'enviados')}</h3>
                </Col>
              </Row>

              <Row style={{ paddingBottom: '10px' }}>
                <Col md={2}>
                  <h3>{state.statistics.completados}</h3>
                </Col>
                <Col md={10}>
                  <h3>{t('formularios>respuestas>estadisticas>completados', 'completados')}</h3>
                </Col>
              </Row>

              <Row style={{ paddingBottom: '10px' }}>
                <Col md={2}>
                  <h3>{state.statistics.noCompletados}</h3>
                </Col>
                <Col md={10}>
                  <h3>{t('formularios>respuestas>estadisticas>sin_completar', 'Sin completa')}r</h3>
                </Col>
              </Row>
            </Col>
            <Col>
              <div>
                <p>Fecha de comienzo</p>
                <h3 style={{ fontWeight: 'bold', paddingBottom: '10px' }}>
                  {state.configuracion.fechaHoraInicio
                    ? moment(state.configuracion.fechaHoraInicio).format(
                      'DD/MM/YYYY hh:mm A'
                    )
                    : t('formularios>respuestas>estadisticas>fecha_no_asiganada', 'Fecha no asignada')}
                </h3>
              </div>
              <div>
                <p>Fecha de fin</p>
                <h3 style={{ fontWeight: 'bold' }}>
                  {state.configuracion.fechaHoraFin
                    ? moment(state.configuracion.fechaHoraFin).format(
                      'DD/MM/YYYY hh:mm A'
                    )
                    : t('formularios>respuestas>estadisticas>fecha_no_asiganada', 'Fecha no asignada')}
                </h3>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <h2 style={{ paddingTop: '30px', paddingBottom: '20px' }}>
        {t('formularios>respuestas>estadisticas>listado', 'Listado de envíos del formulario')}
      </h2>
      <HTMLTable
        columns={columns}
        selectDisplayMode='datalist'
        showHeaders
        data={responses}
        pagination
        actions={[]}
        isBreadcrumb={false}
        showHeadersCenter={false}
        actionRow={actionRow}
        modalOpen={false}
        totalRegistro={state.responses.totalCount}
        handlePagination={async (
          pageNumber: number,
          selectedPageSize: number
        ) => {
          await actions.getResponsesFormPaginated(
            props.formId,
            pageNumber,
            selectedPageSize
          )
        }}
        handleSearch={async (
          searchValue: string,
          selectedColumn: string,
          selectedPageSize: number,
          page: number
        ) => {
          if (searchValue == '') {
            await actions.getResponsesFormPaginated(
              props.formId,
              page,
              selectedPageSize
            )
          } else {
            await actions.getResponsesFormPaginated(
              props.formId,
              page,
              selectedPageSize,
              selectedColumn,
              searchValue
            )
          }
        }}
        toggleEditModal={() => null}
        editModalOpen={false}
        modalfooter
        loading={loading}
        roundedStyle
        filterdSearch
        orderOptions={columns}
        readOnly
        hideMultipleOptions
        preferences={false}
        buttonSearch
        backendPaginated
        esBuscador
        newResource={false}
      />
    </div>
  )
}

export default Statistics
