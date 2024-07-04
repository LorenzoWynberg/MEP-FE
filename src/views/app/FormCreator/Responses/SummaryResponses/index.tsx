import React from 'react'
import { Card, CardBody, Row, Col, CardTitle } from 'reactstrap'
import PrintIcon from '@material-ui/icons/Print'
import NavigationCard from '../../Edit/NavigationCard'
import GetAppIcon from '@material-ui/icons/GetApp'
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView'
import ReactFC from 'react-froalacharts'
import FroalaCharts from 'froalacharts'
import FroalaTheme from 'froalacharts/themes/froalacharts.theme.froala'
import HTMLTable from 'Components/HTMLTable'
import styled from 'styled-components'
import '../styles.scss'
import TextFieldsIcon from '@material-ui/icons/TextFields'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import PanoramaIcon from '@material-ui/icons/Panorama'
import StarsIcon from '@material-ui/icons/Stars'
import SubjectIcon from '@material-ui/icons/Subject'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import Percentage from '../../Edit/PercentageDiv'
import MatrixIcon from '../../Edit/MatrixIcon'
import moment from 'moment'
import ReactToPrint from 'react-to-print'
import ItemsShow from './ItemsShow'
import { useTranslation } from 'react-i18next'

ReactFC.fcRoot(FroalaCharts, FroalaTheme)

const getIcon = (el, style?: {}) => {
  switch (el) {
    case 'text':
      return <TextFieldsIcon style={style} color='primary' />
    case 'date':
      return <CalendarTodayIcon style={style} color='primary' />
    case 'radio':
      return <RadioButtonCheckedIcon style={style} color='primary' />
    case 'checklist':
      return <CheckBoxIcon style={style} color='primary' />
    case 'dropdown':
      return <ArrowDropDownCircleIcon style={style} color='primary' />
    case 'uploadFile':
      return <CloudUploadIcon style={style} color='primary' />
    case 'imageSelector':
      return <PanoramaIcon style={style} color='primary' />
    case 'percentage':
      return <Percentage style={style} />
    case 'matrix':
      return <MatrixIcon style={style} />
    case 'rate':
      return <StarsIcon style={style} color='primary' />
    case 'richText':
      return <SubjectIcon style={style} color='primary' />
    case 'textInputs':
      return <FormatListNumberedIcon style={style} color='primary' />
    case 'pairing':
  }
}

type IProps = {
	summary: any[]
	responses: any[]
	form: any
}

const SummaryResponses: React.FC<IProps> = (props) => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [printRef, setPrintRef] = React.useState(null)
  const [print, setPrint] = React.useState(false)
  const { t } = useTranslation()
  const [currentQuestion, setCurrentQuestion] = React.useState<any>()

  const getResponses = (id) => {
    const tempRes = []
    props.summary?.map((item) => {
      if (item.question.id == id) {
        if (item.responses?.length == 0) {
          tempRes.push(
            <Card
              style={{
							  backgroundColor: '#C8C8C8',
							  borderRadius: '4px',
							  position: 'sticky',
							  width: '100%',
							  minHeight: '5vh',
							  maxHeight: '15vh',
							  marginBottom: '15px'
              }}
            >
              <PAnswer>Sin respuestas</PAnswer>
            </Card>
          )
        } else {
          if (item.question.type == 'radio') {
            const dataSource = {
              chart: {
                use3DLighting: '0',
                showPercentValues: '1',
                decimals: '1',
                useDataPlotColorForLabels: '1',
                exportEnabled: '1',
                theme: 'froala'
              },
              data: item.analizer
            }

            const chartConfigs = {
              type: 'pie',
              width: 400,
              height: 300,
              dataFormat: 'json',
              dataSource
            }

            tempRes.push(<ReactFC {...chartConfigs} />)
          } else if (item.question.type == 'rate') {
            const maxInt = item.question.max
            const data = {
              chart: {
                lowerlimit: '0',
                upperlimit: maxInt,
                showvalue: '1',
                numbersuffix: '',
                theme: 'froala'
              },
              colorrange: {
                color: [
                  {
                    minvalue: 0,
                    maxvalue: 0.5 * maxInt,
                    code: '#F2726F'
                  },
                  {
                    minvalue: 0.5 * maxInt,
                    maxvalue: 0.7 * maxInt,
                    code: '#FFC533'
                  },
                  {
                    minvalue: 0.7 * maxInt,
                    maxvalue: maxInt,
                    code: '#62B58F'
                  }
                ]
              },
              dials: {
                dial: [
                  {
                    value:
											(item.analizer.value / 100) * maxInt
                  }
                ]
              }
            }

            const chartConfigs = {
              type: 'angulargauge',
              width: 400,
              height: 300,
              dataFormat: 'json',
              dataSource: data
            }

            tempRes.push(<ReactFC {...chartConfigs} />)
          } else if (item.question.type == 'dropdown') {
            const _dataChart = []
            item.analizer?.map((el) => {
              const _filterResponse = item.responses?.filter(
                (r) => r?.respuesta[el.key] !== undefined
              )
              if (_filterResponse) {
                _dataChart.push({
                  label: el.label,
                  value: item.analizer?.length
                })
              }
            })

            const dataSource = {
              chart: {
                use3DLighting: '0',
                showPercentValues: '1',
                decimals: '1',
                useDataPlotColorForLabels: '1',
                exportEnabled: '1',
                theme: 'froala'
              },
              data: _dataChart
            }

            const chartConfigs = {
              type: 'pie',
              width: 400,
              height: 300,
              dataFormat: 'json',
              dataSource
            }

            tempRes.push(<ReactFC {...chartConfigs} />)
          } else if (item.question.type == 'text') {
            item.responses?.map((respo) => {
              tempRes.push(
                <Card
                  style={{
									  backgroundColor: '#C8C8C8',
									  borderRadius: '4px',
									  position: 'sticky',
									  width: '100%',
									  minHeight: '5vh',
									  maxHeight: '15vh',
									  marginBottom: '15px'
                  }}
                >
                  <PAnswer>{respo.respuesta}</PAnswer>
                </Card>
              )
            })
          } else if (item.question.type == 'date') {
            item.responses?.map((respo) => {
              tempRes.push(
                <Card
                  style={{
									  backgroundColor: '#C8C8C8',
									  borderRadius: '4px',
									  position: 'sticky',
									  width: '100%',
									  minHeight: '5vh',
									  maxHeight: '15vh',
									  marginBottom: '15px'
                  }}
                >
                  <PAnswer>
                    {respo.respuesta &&
											moment(
											  respo.respuesta,
											  'YYYY-MM-DD'
											).format('DD/MM/YYYY')}
                  </PAnswer>
                </Card>
              )
            })
          } else if (item.question.type == 'richText') {
            item.responses.map((respo) => {
              tempRes.push(
                <Card
                  style={{
									  backgroundColor: '#C8C8C8',
									  borderRadius: '4px',
									  position: 'sticky',
									  width: '100%',
									  minHeight: '5vh',
									  maxHeight: !print && '15vh',
									  overflow: !print && 'auto',
									  marginBottom: '15px'
                  }}
                >
                  <PAnswer>
                    <FroalaEditorView
                      model={respo?.respuesta}
                    />
                  </PAnswer>
                </Card>
              )
            })
          } else if (item.question.type == 'textInputs') {
            const columns = item.question.options.map((x) => {
              return { column: x.idx, label: x.label }
            })
            const rows = item.responses.map((x) => {
              const keys = Object.keys(x.respuesta)

              const r = {}

              keys.forEach((y) => {
                r[y] = x.respuesta[y].respuesta
              })

              return r
            })

            tempRes.push(
              <HTMLTable
                columns={columns}
                selectDisplayMode='datalist'
                pageSize={print ? rows.length : null}
                data={rows || []}
                isBreadcrumb={false}
                tableName='label.ofertas.educativas'
                modalOpen={false}
                showHeaders
                editModalOpen={false}
                modalfooter
                loading={false}
                orderBy={false}
                totalRegistro={0}
                labelSearch=''
                handlePagination={() => null}
                handleCardClick={(_: any) => null}
                hideMultipleOptions
                roundedStyle
                readOnly
                search={false}
                listView
                disableSearch
                toggleEditModal={() => {}}
              />
            )
          } else if (item.question.type == 'percentage') {
            const _dataChart = []
            item.responses?.map((res) => {
              item.question?.options?.map((o, i) => {
                _dataChart.push({
                  label: o.label,
                  value: res.respuesta[i],
                  idx: o.idx
                })
              })
            })

            let _ordered = _dataChart.sort(function (a, b) {
              return a.label.localeCompare(b.label)
            })

            let _antObject = ''

            const _sumDataChart = []

            let _valueSum = 0
            _ordered = _ordered.map((el, i) => {
              if (i == 0) {
                if (el.value != null && el.value != '') {
                  _valueSum += parseInt(el.value)
                }

                _antObject = el.label
              } else {
                if (_antObject == el.label) {
                  if (el.value != null && el.value != '') {
                    _valueSum += parseInt(el.value)
                  }
                  _antObject = el.label
                  if (i == _ordered.length - 1) {
                    _sumDataChart.push({
                      label: _antObject,
                      value: _valueSum
                    })
                    _valueSum = 0
                    _antObject = ''
                  }
                } else {
                  _sumDataChart.push({
                    label: _antObject,
                    value: _valueSum
                  })
                  if (el.value != null && el.value != '') {
                    _valueSum = parseInt(el.value)
                  }
                  _antObject = el.label
                }
              }
            })
            const finalTotal = _sumDataChart.reduce(
              (prevValue, currentValue) => {
                return prevValue + currentValue.value
              },
              0
            )
            const dataSource = {
              chart: {
                use3DLighting: '0',
                showPercentValues: '1',
                decimals: '1',
                useDataPlotColorForLabels: '1',
                exportEnabled: '1',
                theme: 'froala'
              },
              data: _sumDataChart.map((el) => ({
                ...el,
                value: (el.value * 100) / finalTotal
              }))
            }
            const chartConfigs = {
              type: 'pie',
              width: 400,
              height: 300,
              dataFormat: 'json',
              dataSource
            }

            tempRes.push(<ReactFC {...chartConfigs} />)
          } else if (item.question.type == 'uploadFile') {
            item.responses?.map((respo) => {
              respo.respuesta?.map((fil) => {
                const _a = fil.split('|')
                const _url = _a[0]
                const _fileName = _a[1]
                const _size = _a[2]

                tempRes.push(
                  <Card
                    style={{
										  backgroundColor: '#C8C8C8',
										  borderRadius: '4px',
										  position: 'sticky',
										  width: '100%',
										  minHeight: '5vh',
										  maxHeight: '15vh',
										  overflow: 'auto',
										  marginBottom: '15px'
                    }}
                  >
                    <PAnswer>
                      <a href={_url} target='_blank' rel='noreferrer'>
                        {_fileName}
                      </a>
                    </PAnswer>
                  </Card>
                )
              })
            })
          } else if (item.question.type == 'checklist') {
            const dataSource = {
              chart: {
                placevaluesinside: '1',
                showvalues: '0',
                theme: 'froala'
              },
              categories: [
                {
                  category: item.analizer
                }
              ],
              dataset: [
                {
                  data: item.analizer
                }
              ]
            }

            const chartConfigs = {
              type: 'bar',
              width: 400,
              height: 300,
              dataFormat: 'json',
              dataSource
            }

            tempRes.push(<ReactFC {...chartConfigs} />)
          } else if (item.question.type == 'matrix') {
            tempRes.push(
              <table style={{ width: '100%' }}>
                <tr>
                  <th style={{ border: '1px solid gray' }} />
                  {item.question.columns.map((el) => {
									  return (
  <th
    style={{
												  border: '1px solid gray',
												  textAlign: 'center'
    }}
  >
    {el.label}
  </th>
									  )
                  })}
                </tr>
                {item.question.rows.map((row, i) => {
								  return (
  <tr
    style={{
											  border: '1px solid gray',
											  backgroundColor:
													i % 2 !== 0
													  ? 'white'
													  : '#D5D5D5'
    }}
  >
    <td
      style={{
												  border: '1px solid gray',
												  textAlign: 'left',
												  fontWeight: 'bold',
												  paddingLeft: 5
      }}
    >
      {row.label}
    </td>
    {item.question.columns.map(
											  (col, idx) => {
											    return (
  <td
    style={{
															  border: '1px solid gray',
															  textAlign:
																	'center'
    }}
  >
    <p>
      {
																	item
																	  .analizer[
																	    i
																	  ][idx]
																}
    </p>
  </td>
											    )
											  }
    )}
  </tr>
								  )
                })}
              </table>
            )
          } else {
            tempRes.push(
              <Card
                style={{
								  backgroundColor: '#C8C8C8',
								  borderRadius: '4px',
								  position: 'sticky',
								  width: '100%',
								  minHeight: '5vh',
								  maxHeight: '15vh',
								  overflow: 'auto',
								  marginBottom: '15px'
                }}
              >
                <PAnswer>{t('formularios>respuestas>estadisticas>sin_respuestas', 'Sin respuestas')}</PAnswer>
              </Card>
            )
          }
        }
      }
    })
    return tempRes
  }

  const highlightDiv = (id) => {
    const element = document.getElementById(id)
    element.classList.add('hightlight-div')
    setTimeout(function () {
      element.classList.remove('hightlight-div')
    }, 1500)
  }

  return (
    <div style={{ paddingTop: '20px' }}>
      <Row>
        <Col xs={12} md={8}>
          <Card style={{ paddingTop: '20px' }}>
            <CardBody>
              <Row>
                <Col md={8}>
                  <h1
                    style={{
										  fontSize: '2rem',
										  fontWeight: 'bold'
                  }}
                  >
                    {' '}
                    {props.responses.length} {t('formularios>respuestas>estadisticas>respuestas', 'Respuestas')}
                  </h1>
                </Col>
                <Col md={4} style={{ textAlign: 'end' }}>
                  <ReactToPrint
                    trigger={() => (
                    <PrintIcon
                    style={{
												  marginRight: '10px',
												  cursor: 'pointer'
                  }}
                    fontSize='large'
                    onClick={() => {}}
                  />
                  )}
                    onAfterPrint={() => {
										  setPrint(false)
                  }}
                    onBeforeGetContent={() => {
										  setPrint(true)
                  }}
                    content={() => printRef}
                  />

                  <GetAppIcon
                    style={{
										  marginRight: '10px',
										  cursor: 'pointer'
                  }}
                    fontSize='large'
                    title='Exportar respuestas en archivo excel.'
                    onClick={() => {
										  props.exportResponses(props.form)
                  }}
                  />
                </Col>
              </Row>
              <hr />
              <Row>
                <Col
                  md={12}
                  style={{
									  paddingBottom: '40px',
									  paddingTop: '10px'
                  }}
                >
                  <ItemsShow
                    {...props}
                    print={print}
                    getIcon={getIcon}
                    getResponses={getResponses}
                    ref={(el) => setPrintRef(el)}
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col xs={12} md={4} className='d-none d-lg-block'>
          <Card
            style={{
						  backgroundColor: 'white',
						  borderRadius: '8px',
						  position: 'sticky',
						  width: '100%',
						  minHeight: '38vh',
						  maxHeight: '70vh',
						  overflow: 'auto'
            }}
          >
            <CardBody>
              <CardTitle
                tag='h5'
                style={{
								  fontWeight: 'bold',
								  fontSize: '0.95rem',
								  paddingTop: '10px',
								  marginBottom: '1px'
                }}
              >
                {t('formularios>respuestas>estadisticas>navegacion', 'Navegación')}
              </CardTitle>
              {props.form.questionContainers?.map((container) => {
							  return props.form.questions[container.id]?.map(
							    (item) => {
							      return (
  <NavigationCard
    style={{ cursor: 'pointer' }}
    scrollTo={(e) => {
												  document
												    .getElementById(
												      'question-' +
																item.id
												    )
												    .scrollIntoView({
												      behavior: 'smooth',
												      block: 'center'
												    })
												  highlightDiv(
												    'question-' + item.id
												  )
    }}
    question={item}
  />
							      )
							    }
							  )
              })}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

const PAnswer = styled.span`
	margin-left: 15px;
	margin-right: 15px;
	margin-bottom: 10px;
	margin-top: 10px;
	font-size: 0.8rem;
`

export default SummaryResponses
