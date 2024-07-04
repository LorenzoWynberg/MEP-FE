import React, { useEffect, useState } from 'react'
import withRouter from 'react-router-dom/withRouter'
import { TabContent, TabPane, Row, Col, Container } from 'reactstrap'
import Statistics from './Statistics'
import HeaderTab from 'Components/Tab/Header'
import colors from 'Assets/js/colors'
import creadorDeFormulariosItems from 'Constants/creadorDeFormulariosItems'
import AppLayout from 'Layout/AppLayout'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import {
  getForm,
  getAnalizeForm,
  getResponsesForm,
  downloadZip
} from '../../../../redux/FormCreatorV2/actions'
import { useActions } from 'Hooks/useActions'
import SummaryResponses from './SummaryResponses'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import AnswersPerQuestion from './AnswersPerQuestion'
import ResponsesPerUser from './ResponsesPerUser'
import * as XLSX from 'xlsx'

import NProgress from 'nprogress'
import moment from 'moment'
import directorItems from 'Constants/directorMenu'
import { useTranslation } from 'react-i18next'

const Caracteres = [
  { encode: '&aacute;', decode: 'á' },
  { encode: '&eacute;', decode: 'é' },
  { encode: '&iacute;', decode: 'í' },
  { encode: '&oacute;', decode: 'ó' },
  { encode: '&uacute;', decode: 'ú' },
  { encode: '&ntilde;', decode: 'ñ' }
]

const Responses = (props) => {
  const [currentTab, setCurrentTab] = useState(1)
  const [loading, setLoading] = useState(null)
  const [summary, setSummary] = React.useState<Array<any>>([])
  const [responses, setResponses] = React.useState<Array<any>>([])
  const [form, setForm] = useState({ questionContainers: [], questions: {} })
  const { t } = useTranslation()
  const options = [
    t('formularios>respuestas>menu>estadisticas', 'Estadísticas'),
    t('formularios>respuestas>menu>resumen', 'Resumen de respuestas'),
    t('formularios>respuestas>menu>respuestas_pregunta', 'Respuestas por pregunta'),
    t('formularios>respuestas>menu>respuestas_usuario', 'Respuestas por usuario')
  ]

  const state = useSelector((store) => {
    return {
      ...store.creadorFormularios
    }
  })

  const actions = useActions({
    getForm,
    getAnalizeForm,
    getResponsesForm,
    downloadZip
  })

  const toggle = (tab) => {
    if (currentTab !== tab) setCurrentTab(tab)
  }

  useEffect(() => {
    loadData()
  }, [])

  const getStringSpanish = (column) => {
    let _newColumn = column
    Caracteres.map((ca) => {
      _newColumn = _newColumn.replace(ca.encode, ca.decode)
    })
    return _newColumn
  }

  const loadData = async () => {
    NProgress.start()
    await actions.getForm(props.match.params.formId, true)
    const response = await actions.getAnalizeForm(props.match.params.formId)
    await setSummary(response.data?.wrappers || [])
    await actions.getResponsesForm(props.match.params.formId)
    setLoading(false)
    NProgress.done()
  }

  useEffect(() => {
    const tempResponses = []

    state.onlyResponses.forEach((x) => {
      if (x.respuesta !== '{}') {
        tempResponses.push({
          ...x,
          respuestaParse: JSON.parse(x.respuesta)
        })
      }
    })

    setResponses(tempResponses || [])
  }, [state.onlyResponses])

  useEffect(() => {
    const _form = !state.currentForm?.autoguardadoFormulario
      ? {
          questionContainers: [],
          questions: {}
			  }
      : JSON.parse(state.currentForm?.autoguardadoFormulario)
    setForm({
      id: state.currentForm.id,
      titulo: state.currentForm.titulo,
      encabezado: state.currentForm.encabezado,
      categoria: state.currentForm.categoriaId,
      descripcion: state.currentForm.descripcion,
      formulario: state.currentForm.formulario,
      questionContainers: _form.questionContainers || [],
      questions: _form.questions || {}
    })
  }, [state.currentForm])

  const exportResponses = (form, summary) => {
    const _form = form

    let _columnas = []

    const _questions = []
    _form.questionContainers?.map((parent) => {
      _form.questions[parent.id] &&
				_form.questions[parent.id].map((question, index, array) => {
				  const _question = question
				  _columnas.push(
				    _question.label.replace('<p>', '').replace('</p>', '')
				  )

				  _questions.push(_question)
				})
    })

    const _resps = getResponses(_questions)

    _columnas = _columnas.map((c) => {
      return getStringSpanish(c)
    })

    _columnas.push(t('formularios>respuestas>menu>fecha', 'Fecha y Hora de envío'))

    const sheetName = t('formularios>respuestas>menu>datos', 'Datos')
    const data = [_columnas, ..._resps]
    const book = XLSX.utils.book_new()
    const sheet = XLSX.utils.aoa_to_sheet(data)
    XLSX.utils.book_append_sheet(book, sheet, sheetName)
    XLSX.writeFile(book, `${_form.titulo.trim()}.xlsx`)
  }

  const getResponses = (_questions) => {
    const tempRes = []
    responses.map((r) => {
      const _QuestionRespuesta = []
      const _resp = JSON.parse(r.respuesta)
      _questions.map((q) => {
        const _oResp = _resp[q.id]

        if (_oResp) {
          _QuestionRespuesta.push(
            getValueRespuesta(q, _oResp?.respuesta)
          )
        }
      })

      _QuestionRespuesta.push(
        r.fechaEnvio
          ? moment(r.fechaEnvio).format('DD/MM/YYYY hh:mm A')
          : ''
      )
      tempRes.push(_QuestionRespuesta)
    })

    return tempRes
  }

  const getValueRespuesta = (question, respuesta) => {
    if (question.type == 'radio') {
      const _finded = question.options.find((x) => x.idx == respuesta)

      if (_finded) {
        respuesta = _finded.label
      }
    } else if (question.type == 'checklist') {
      respuesta = respuesta.map((el) => {
        const _finded = question.options.find((x) => x.idx == el)

        if (_finded) {
          return _finded.label
        } else {
          return ''
        }
      })
    } else if (question.type == 'matrix') {
      const _datos = []
      respuesta.map((fila, x) => {
        fila.map((colum, y) => {
          if (colum > 0) {
            _datos.push([
              question.columns[y].label,
              question.rows[x].label
            ])
          }
        })
      })

      respuesta = _datos
    } else if (question.type == 'uploadFile') {
      respuesta = respuesta.map((item) => {
        const _aR = item.split('|')
        return _aR[0]
      })
    } else if (question.type == 'dropdown') {
      if (respuesta) {
        const _valueSelected = Object.keys(respuesta)[0]
        const _findOption = question?.options?.find(
          (o) => o.idx == _valueSelected
        )

        if (_findOption != undefined) {
          respuesta = _findOption.label
        }
      }
    }

    if (respuesta !== undefined && respuesta !== null) {
      const _respuestaValue = Array.isArray(respuesta)
        ? JSON.stringify(respuesta)
        : respuesta
      return _respuestaValue
    } else {
      return ''
    }
  }

  const descargarArchivos = async (question) => {
    if (question.type != 'uploadFile') {
      return
    }

    const _files = []

    responses?.map((r) => {
      const _respuesta = r.respuestaParse[question.id]

      if (_respuesta) {
        _respuesta.respuesta?.map((item) => {
          const _aFfiles = item.split('|')
          _files.push(_aFfiles[0])
        })
      }
    })
    const urls = _files

    await actions.downloadZip({ Urls: urls }, NProgress)
  }
  const newMenus = creadorDeFormulariosItems.map((el) => ({
    ...el,
    label: t(`formularios>navigation>${el?.id}`, el?.label)
  }))
  return (
    <AppLayout items={newMenus}>
      <div className='dashboard-wrapper'>
        {loading && (
          <div
            style={{
						  position: 'fixed',
						  bottom: '10px',
						  right: '10px'
            }}
          >
            <div className='loading loading-form' />
          </div>
        )}
        <Container>
          <Row>
            <Back
              onClick={() => {
							  props.history.push('/forms/list')
              }}
            >
              <ArrowBackIcon />
              <BackTitle>{t('general>regresar', 'Regresar')}</BackTitle>
            </Back>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <h1 style={{ fontWeight: 600, fontSize: '2.3rem' }}>
                {t('formularios>respuestas>formulario_de', 'Formulario de')} {state.currentForm.titulo}{' '}
              </h1>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12}>
              <HeaderTab
                options={options}
                activeTab={currentTab}
                setActiveTab={setCurrentTab}
                setParentTab={props.setCurrentTab}
              />
            </Col>
            <Col xs={12}>
              <TabContent
                activeTab={currentTab}
                style={{ width: '100%' }}
              >
                <TabPane tabId={0}>
                  <Statistics
                    formId={props.match.params.formId}
                  />
                </TabPane>
                <TabPane tabId={1}>
                  <SummaryResponses
                    exportResponses={exportResponses}
                    descargarArchivos={descargarArchivos}
                    form={form}
                    summary={summary}
                    responses={responses}
                  />
                </TabPane>
                <TabPane tabId={2}>
                  <AnswersPerQuestion
                    form={form}
                    exportResponses={exportResponses}
                    descargarArchivos={descargarArchivos}
                    responses={responses}
                    summary={summary}
                  />
                </TabPane>
                <TabPane tabId={3}>
                  <ResponsesPerUser
                    form={form}
                    exportResponses={exportResponses}
                    descargarArchivos={descargarArchivos}
                    responses={responses}
                  />
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        </Container>
      </div>
    </AppLayout>
  )
}

const Back = styled.div`
	background: ${colors.primary};
	border: 1px white solid;
	border-radius: 30px;
	color: white;
	padding: 9px 15px;
	cursor: pointer;
	margin-right: 5px;
	display: flex;
	align-items: center;
	cursor: pointer;
	margin-bottom: 20px;
`

const BackTitle = styled.span`
	color: white;
	font-size: 14px;
	font-size: 16px;
`

export default withRouter(Responses)
