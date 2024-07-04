import React, { useEffect, useState } from 'react'
import { Card, CardBody, Row, Col, CardTitle } from 'reactstrap'
import PrintIcon from '@material-ui/icons/Print'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import { Typography } from '@material-ui/core'
import RespuestaIcon from './RespuestaIcon'
import ItemsToShow from './ItemsToShow'
import ReactToPrint from 'react-to-print'
import { useTranslation } from 'react-i18next'

type IProps = {
	responses: any[]
	form: any
}
const ResponsesPerUser: React.FC<IProps> = (props) => {
  //
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [currentResponse, setCurrentResponse] = React.useState<any>()
  const [printRef, setPrintRef] = React.useState(null)

  const [currentIndex, setCurrentIndex] = React.useState<number>(0)

  const toggle = () => setDropdownOpen((prevState) => !prevState)

  useEffect(() => {
    setCurrentResponse(props.responses[currentIndex])
    setTimeout(() => {
      setLoading(false)
    }, 200)
  }, [currentIndex])

  useEffect(() => {
    setCurrentResponse(props.responses[currentIndex])
  }, [props.responses])

  const increaseIndex = () => {
    if (currentIndex + 1 < props.responses.length) {
      setCurrentIndex(currentIndex + 1)
      setCurrentResponse(props.responses[currentIndex + 1])
      setLoading(true)
    }
  }

  const decreaseIndex = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setCurrentResponse(props.responses[currentIndex - 1])
      setLoading(true)
    }
  }

  const { t } = useTranslation()

  return (
    <div style={{ paddingTop: '20px' }}>
      <Row>
        <Col xs={12} md={8}>
          <Card style={{ paddingTop: '20px' }}>
            <CardBody>
              <Row>
                <Col md={10}>
                  <Row style={{ marginLeft: '2px' }}>
                    <div>
                    <ArrowBackIosIcon
                    onClick={decreaseIndex}
                  />
                    <a
                    style={{
												  verticalAlign: 'super',
												  fontSize: '1rem'
                  }}
                  >
                    {currentIndex + 1} de{' '}
                    {props.responses?.length}
                  </a>
                    <ArrowForwardIosIcon
                    onClick={increaseIndex}
                  />
                  </div>
                  </Row>
                </Col>
              </Row>
              <Row style={{ paddingTop: '30px' }}>
                <Col md={8}>
                  <h2>{currentResponse?.nombreUsuario}</h2>
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
                    content={() => printRef}
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Card
            md={12}
            style={{ marginBottom: '40px', marginTop: '20px' }}
          >
            <ItemsToShow
              {...props}
              loading={loading}
              currentResponse={currentResponse}
              ref={(el) => setPrintRef(el)}
            />
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
								  fontSize: '1.4rem',
								  paddingTop: '10px',
								  marginBottom: '1px'
                }}
              >
                {t('formularios>respuestas>estadisticas>navegacion', 'Navegación')}
              </CardTitle>
              {props.responses.map((response, index) => {
							  return (
  <div
    className='hoverColor'
    style={{ display: 'flex' }}
    onClick={() => {
										  setCurrentResponse(response)
										  setLoading(true)
										  setCurrentIndex(index)
    }}
  >
    <div
      style={{
											  display: 'flex',
											  justifyContent: 'center',
											  alignItems: 'center'
      }}
    >
      <DragIndicatorIcon
        fontSize='default'
        style={{ color: 'gray' }}
      />
    </div>
    <div
      style={{
											  height: '3rem',
											  width: '4rem',
											  color: 'white',
											  margin: '20px',
											  backgroundColor: '#155388',
											  display: 'flex',
											  alignItems: 'center',
											  borderRadius: '8px',
											  justifyContent: 'center'
      }}
    >
      <RespuestaIcon />
    </div>
    <div
      style={{
											  display: 'flex',
											  flexDirection: 'column',
											  justifyContent: 'center'
      }}
    >
      <Typography>
        Respuesta #{index + 1}
      </Typography>
      <span>
        {response.correoInvitacion &&
													response.correoInvitacion}
      </span>
    </div>
  </div>
							  )
              })}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ResponsesPerUser
