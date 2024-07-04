import React, { useEffect, useState } from 'react'
import {
  Container,
  Card,
  CardBody,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CardTitle
} from 'reactstrap'
import PrintIcon from '@material-ui/icons/Print'
import NavigationCard from '../../Edit/NavigationCard'
import GetAppIcon from '@material-ui/icons/GetApp'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
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
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView'
import Percentage from '../../Edit/PercentageDiv'
import MatrixIcon from '../../Edit/MatrixIcon'
import ItemsShow from './ItemsShow'
import ReactToPrint from 'react-to-print'
import useNotification from 'Hooks/useNotification'
import { useTranslation } from 'react-i18next'

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
    case 'rate':
      return <StarsIcon style={style} color='primary' />
    case 'richText':
      return <SubjectIcon style={style} color='primary' />
    case 'textInputs':
      return <FormatListNumberedIcon style={style} color='primary' />
    case 'percentage':
      return <Percentage style={style} />
    case 'matrix':
      return <MatrixIcon style={style} />
    case 'pairing':
  }
}

type IProps = {
	responses: any[]
	form: any
}
const AnswersPerQuestion: React.FC<IProps> = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [printRef, setPrintRef] = React.useState(null)
  const [print, setPrint] = React.useState(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [currentQuestion, setCurrentQuestion] = React.useState<any>(null)
  const [currentResponses, setCurrentResponses] = React.useState<any>()
  const [calledBefore, setCalledBefore] = React.useState<any>(false)
  const [snackBar, handleSnackBarClick] = useNotification()
  const [snackbarContent, setSnacbarContent] = useState({
    msg: 'welcome',
    variant: 'info'
  })
  useEffect(() => {
    if (props.form.questionContainers[0]) {
      const _question = getQuestion(
        props.form.questions[props.form.questionContainers[0].id][0]?.id
      )
      setCurrentQuestion(_question)
      setCurrentResponses(getResponses(_question))
      setCalledBefore(true)
    }
  }, [props.responses])

  useEffect(() => {
    if (calledBefore && currentQuestion) {
      const res = getResponses()
      setCurrentResponses(res)
    }
  }, [currentQuestion])

  const toggle = () => setDropdownOpen((prevState) => !prevState)

  const getQuestionsCount = () => {
    let count = 0
    props.form.questionContainers?.forEach((container) => {
      props.form.questions[container.id]?.forEach((item) => {
        count++
      })
    })
    return count
  }

  const getQuestion = (id) => {
    let question = null

    for (let i = 0; i < props.form.questionContainers.length; i++) {
      for (
        let j = 0;
        j <
				props.form.questions[props.form.questionContainers[i].id]
				  .length;
        j++
      ) {
        const item =
					props.form.questions[props.form.questionContainers[i].id][j]
        if (item.id == id) {
          question = item
          break
        }
      }
    }

    return question
  }
  const handleSnackbarShow = (msg, type) => {
    setSnacbarContent({
      variant: type,
      msg
    })
    handleSnackBarClick()
  }
  const getResponses = (question = null) => {
    const _question = !question ? currentQuestion : question
    const tempRes = []
    props.responses?.map((item) => {
      if (item.respuesta !== '{}') {
        const responsesKeys = Object.keys(item.respuestaParse)
        responsesKeys.map((x) => {
          if (x == _question?.id) {
            tempRes.push({
              r: item.respuestaParse[x],
              name: item.nombreUsuario,
              email: item.correoUsuario || item.correoInvitacion
            })
          }
        })
      }
    })
    return tempRes
  }
  const { t } = useTranslation()
  const getQuestionByIdx = (idx) => {
    const total = getQuestionsCount()

    const _mapperRows = []

    props.form.questionContainers?.map((container) => {
      return props.form.questions[container.id]?.map((item) => {
        _mapperRows.push(item)
      })
    })

    if (isNaN(idx)) {
      const _finded = _mapperRows.find((x) => x.idx === 0)
      if (_finded !== undefined) {
        setCurrentQuestion(_finded)
      }
    } else {
      const _finded = _mapperRows.find((x) => x.idx === idx)

      if (idx < total && idx >= 0) {
        if (_finded !== undefined) {
          setCurrentQuestion(_finded)
        }
      }
    }
  }

  return (
    <Container>
      {snackBar(snackbarContent.variant, snackbarContent.msg)}
      <div
        style={{
					  position: 'fixed',
					  bottom: '10px',
					  right: '10px'
        }}
      >
        <div className='loading loading-form' />
      </div>
      <Row>
        <Col xs={12} md={8}>
          <Card style={{ paddingTop: '20px' }}>
            <CardBody>
              <Row>
                <Col md={10}>
                  <Row style={{ marginLeft: '2px' }}>
                    <Dropdown
                    isOpen={dropdownOpen}
                    toggle={toggle}
                  >
                    <DropdownToggle caret>
                    {currentQuestion
												  ? 'Pregunta ' +
													  (currentQuestion?.idx + 1)
												  : 'Seleccione'}
                  </DropdownToggle>

                    <DropdownMenu
                    style={{
												  maxHeight: '9rem',
												  overflowY: 'auto'
                  }}
                  >
                    {props.form.questionContainers?.map(
												  (container) => {
												    return props.form.questions[
												      container.id
												    ]?.map((item) => {
												      return (
  <DropdownItem
    key={
																		item.id
																	}
    value={
																		item.id
																	}
    onClick={() =>
																	  setCurrentQuestion(
																	    item
																	  )}
  >
    {t('formularios>respuestas>pregunta', 'Pregunta')}{' '}
    {item.idx +
																		1}
  </DropdownItem>
												      )
												    })
												  }
                  )}
                  </DropdownMenu>
                  </Dropdown>
                    <div style={{ marginLeft: '35px' }}>
                    <ArrowBackIosIcon
                    style={{
												  cursor: 'pointer'
                  }}
                    onClick={() => {
												  getQuestionByIdx(
												    currentQuestion?.idx - 1
												  )
                  }}
                  />
                    <a
                    style={{
												  verticalAlign: 'super',
												  fontSize: '1rem'
                  }}
                  >
                    <i
                    style={{
													  textDecoration:
															'underline'
                  }}
                  >
                    {currentQuestion
													  ? currentQuestion?.idx +
														  1
													  : ' '}
                  </i>{' '}
                    de {getQuestionsCount()}
                  </a>
                    <ArrowForwardIosIcon
                    style={{
												  cursor: 'pointer'
                  }}
                    onClick={() => {
												  getQuestionByIdx(
												    currentQuestion?.idx + 1
												  )
                  }}
                  />
                  </div>
                  </Row>
                </Col>
                <Col md={2} style={{ textAlign: 'end' }}>
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

                  {currentQuestion?.type == 'uploadFile' && (
                    <GetAppIcon
                    fontSize='large'
                    style={{ cursor: 'pointer' }}
                    title='Descargar archivos'
                    onClick={() => {
											  props.descargarArchivos(
											    currentQuestion
											  )
                  }}
                  />
                  )}
                </Col>
              </Row>
              <Row style={{ paddingTop: '30px' }}>
                <Col md={10}>
                  <FroalaEditorView
                    model={currentQuestion?.label}
                  />
                  <p> respuestas</p>
                </Col>
                <Col md={2} style={{ textAlign: 'end' }}>
                  {getIcon(currentQuestion?.type, {
									  fontSize: 'xxx-large'
                  })}
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Col
            style={{
						  paddingLeft: '15px',
						  paddingTop: '40px',
						  paddingBottom: '40px'
            }}
          >
            <ItemsShow
              currentResponses={currentResponses}
              currentQuestion={currentQuestion}
              ref={(el) => setPrintRef(el)}
            />
          </Col>
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
								  fontSize: '1.4rem',
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
    scrollTo={(e) =>
												  setCurrentQuestion(
												    getQuestion(e)
												  )}
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
    </Container>
  )
}

export default AnswersPerQuestion
