import React, { useState, useEffect } from 'react'
import { Container, Col, Input, Row, Button } from 'reactstrap'
import { Switch } from '@material-ui/core'
import { useTranslation } from 'react-i18next'

const ContainerConfigs = (props) => {
  const [data, setData] = useState({ title: '', tooltip: false, tooltipText: '', description: false, descriptionText: '' })
  const { t } = useTranslation()
  useEffect(() => {
    setData({
      title: props.container.title,
      tooltip: props.container.tooltip,
      tooltipText: props.container.tooltipText,
      description: props.container.description,
      descriptionText: props.container.descriptionText
    })
  }, [])

  const onConfigChange = (value, type) => {
    const _data = { ...data, [type]: value }
    setData(_data)
  }

  const onSave = () => {
    props.onSave({
      title: data.title,
      tooltip: data.tooltip,
      tooltipText: data.tooltipText,
      description: data.description,
      descriptionText: data.descriptionText
    })
  }

  return (
    <Container>
      <Row>
        <Col xs={12}>
          <Input value={data.title} onChange={e => onConfigChange(e.target.value, 'title')} />
          <br />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <p style={{ marginTop: 'revert' }}>
                {t('formularios>crear_formulario>informacion', 'Información')} ({t('formularios>crear_formulario>tooltip', 'tooltip')})
              </p>
            </div>
            <Switch checked={data.tooltip} color='primary' onClick={e => onConfigChange(!data.tooltip, 'tooltip')} />
          </div>
          {data.tooltip &&
            <Input type='textarea' rows='10' value={data.tooltipText} onChange={e => onConfigChange(e.target.value, 'tooltipText')} />}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <p style={{ marginTop: 'revert' }}>
              {t('formularios>crear_formulario>informacion', 'Información')} {`(${t('formularios>crear_formulario>descripcion', 'descripción').toLowerCase()})`}
              </p>
            </div>
            <Switch checked={data.description} color='primary' onClick={e => onConfigChange(!data.description, 'description')} />
          </div>

          {data.description &&
            <Input type='textarea' rows='10' value={data.descriptionText} onChange={e => onConfigChange(e.target.value, 'descriptionText')} />}
        </Col>
      </Row>

      <Row>
        <Col xs='12'>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <Button
              outline color='primary' style={{ marginRight: '10px' }} onClick={() => {
                props.onConfigClose()
              }}
            >
              {t('formularios>crear_formulario>cancelar', 'Cancelar')}
            </Button>
            <Button
              color='primary' onClick={() => {
                onSave()
              }}
            >
              {t('formularios>crear_formulario>cancelar', 'Guardar')}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default ContainerConfigs
