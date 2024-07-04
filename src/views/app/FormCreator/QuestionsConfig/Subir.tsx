import React from 'react'
import { Row, Col, Input, FormGroup, Label } from 'reactstrap'
import { Switch, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const Subir = (props) => {
  const { t } = useTranslation()
  return (
    <Row>
      <Col sm={12}>
        <StyledDivContainer>
          <Switch
            checked={props.question.config.required} color='primary' onClick={(e) => {
              props.onConfigChange(!props.question.config.required, 'required')
            }}
          />
          <Typography>
            {t('formularios>crear_formulario>question_config>requerida', 'Requerida')}
          </Typography>
        </StyledDivContainer>
        <StyledDivContainer>
          <Switch
            checked={!!props.question.config.showSize} color='primary' onClick={(e) => {
              props.onConfigChange(!props.question.config.showSize, 'showSize')
            }}
          />
          <Typography>
            {t('formularios>crear_formulario>question_config>mostrar_size', 'Mostrar tamaño de archivos')}
          </Typography>
        </StyledDivContainer>
        <div>
          <StyledDivContainer>
            <Switch
              checked={!!props.question.config.filesLimitsMin} color='primary' onClick={(e) => {
                props.onConfigChange(!props.question.config.filesLimitsMin, 'filesLimitsMin')
              }}
            />
            <Typography>
              {t('formularios>crear_formulario>question_config>minimo_archivos_requeridos', 'Mínimo de Archivos requeridas')}
            </Typography>
          </StyledDivContainer>
          {props.question.config.filesLimitsMin &&
            <StyledDivContainer>
              <Input
                value={props.question.config.min} style={{ width: '4rem', margin: '10px' }} placeholder='min' type='number' onChange={(e) => {
                  props.onConfigChange(e.target.value, 'min')
                }}
              />
            </StyledDivContainer>}
        </div>
        <div>
          <StyledDivContainer>
            <Switch
              checked={!!props.question.config.tooltip} color='primary' onClick={(e) => {
                props.onConfigChange(!props.question.config.tooltip, 'tooltip')
              }}
            />
            <Typography>
              {t('formularios>crear_formulario>question_config>requiere_ayuda', 'Requiere texto de ayuda')}
            </Typography>
          </StyledDivContainer>
          <div style={{ paddingLeft: '13px' }}>
            {props.question.config.tooltip
              ? <Input
                  type='text' value={props.question.config.tooltipText} onChange={(e) => {
                    props.onConfigChange(e.target.value, 'tooltipText')
                  }}
                />
              : null}
          </div>
        </div>
        <div>
          <StyledDivContainer>
            <Switch
              checked={!!props.question.config.filesLimitsMax} color='primary' onClick={(e) => {
                props.onConfigChange(!props.question.config.filesLimitsMax, 'filesLimitsMax')
              }}
            />
            <Typography>
              {t('formularios>crear_formulario>question_config>maximo_archivos_requeridos', 'Máximo de Archivos permitidos')}
            </Typography>
          </StyledDivContainer>
          {props.question.config.filesLimitsMax &&
            <StyledDivContainer>
              <Input
                value={props.question.config.max} style={{ width: '4rem', margin: '10px' }} placeholder='max' type='number' onChange={(e) => {
                  props.onConfigChange(e.target.value, 'max')
                }}
              />
            </StyledDivContainer>}
        </div>
        <div>
          <div style={{ paddingLeft: '13px' }}>
            <Typography>
              {t('formularios>crear_formulario>question_config>limite_size_archivos', 'Limite de tamaño de archivo (MB)')}:
            </Typography>
            <Input
              type='number' max={10} style={{ width: '5rem' }} value={props.question.config.maxSize || 10} onChange={(e) => {
                if (e.target.value <= 10 && e.target.value > 0) {
                  props.onConfigChange(e.target.value, 'maxSize')
                }
              }}
            />
          </div>
        </div>
        <div>
          <Typography>
            {t('formularios>crear_formulario>question_config>tipo_archivos_aceptados', 'Tipos de archivos aceptados')}
          </Typography>
          <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', padding: '1rem', paddingLeft: '1.5rem' }}>
            <FormGroup>
              <Input
                type='checkbox' checked={!props.question.config.fileTypes || props.question.config.fileTypes.length === 0} onClick={() => {
                  props.onConfigChange(false, 'fileTypes')
                }}
              />
              <Label>
                {t('formularios>crear_formulario>question_config>todos', 'Todos')}
              </Label>
            </FormGroup>
            <FormGroup>
              <Input
                type='checkbox' checked={props.question.config.fileTypes && props.question.config.fileTypes.includes('.docx')} onClick={() => {
                  if (!props.question.config.fileTypes || !(props.question.config.fileTypes && props.question.config.fileTypes.includes('.docx'))) {
                    props.onConfigChange(props.question.config.fileTypes ? [...props.question.config.fileTypes, '.docx', '.dot', '.dotm'] : ['.docx', '.dot', '.dotm'], 'fileTypes')
                  } else {
                    props.onConfigChange(props.question.config.fileTypes.filter(el => !['.docx', '.dot', '.dotm'].includes(el)), 'fileTypes')
                  }
                }}
              />
              <Label>
                {t('formularios>crear_formulario>question_config>documentos', 'Documentos')} (.docx, .dot, .dotm)
              </Label>
            </FormGroup>
            <FormGroup>
              <Input
                type='checkbox' checked={props.question.config.fileTypes && props.question.config.fileTypes.includes('.xlsx')} onClick={() => {
                  if (!props.question.config.fileTypes || !(props.question.config.fileTypes && props.question.config.fileTypes.includes('.xlsx'))) {
                    props.onConfigChange(props.question.config.fileTypes ? [...props.question.config.fileTypes, '.xlsx', '.xlsm', '.xlsb', '.xltx', '.csv'] : ['.xlsx', '.xl sm', '.xlsb', '.xltx', '.csv'], 'fileTypes')
                  } else {
                    props.onConfigChange(props.question.config.fileTypes.filter(el => !['.xlsx', '.xlsm', '.xlsb', '.xltx', '.csv'].includes(el)), 'fileTypes')
                  }
                }}
              />
              <Label>
                {t('formularios>crear_formulario>question_config>hoja_de_calculo', 'Hoja de cálculo')} (.xlsx, .xlsm, .xlsb, .xltx, .csv)
              </Label>
            </FormGroup>
            <FormGroup>
              <Input
                type='checkbox' checked={props.question.config.fileTypes && props.question.config.fileTypes.includes('.pdf')} onClick={() => {
                  if (!props.question.config.fileTypes || !(props.question.config.fileTypes && props.question.config.fileTypes.includes('.pdf'))) {
                    props.onConfigChange(props.question.config.fileTypes ? [...props.question.config.fileTypes, '.pdf'] : ['.pdf'], 'fileTypes')
                  } else {
                    props.onConfigChange(props.question.config.fileTypes.filter(el => el !== '.pdf'), 'fileTypes')
                  }
                }}
              />
              <Label>
                {t('formularios>crear_formulario>question_config>pdf', 'PDF')}
              </Label>
            </FormGroup>
            <FormGroup>
              <Input
                type='checkbox' checked={props.question.config.fileTypes && props.question.config.fileTypes.includes('.jpeg')} onClick={() => {
                  if (!props.question.config.fileTypes || !(props.question.config.fileTypes && props.question.config.fileTypes.includes('.jpg'))) {
                    props.onConfigChange(props.question.config.fileTypes ? [...props.question.config.fileTypes, '.jpg', '.png', '.jpeg'] : ['.jpg', '.png', '.jpeg'], 'fileTypes')
                  } else {
                    props.onConfigChange(props.question.config.fileTypes.filter(el => !['.jpg', '.png', '.jpeg'].includes(el)), 'fileTypes')
                  }
                }}
              />
              <Label>
                {t('formularios>crear_formulario>question_config>imagen', 'Imagen')} (".jpg", ".png", ".jpeg")
              </Label>
            </FormGroup>
            <FormGroup>
              <Input
                type='checkbox' checked={props.question.config.fileTypes && props.question.config.fileTypes.includes('audio/*')} onClick={() => {
                  if (!props.question.config.fileTypes || !(props.question.config.fileTypes && props.question.config.fileTypes.includes('audio/*'))) {
                    props.onConfigChange(props.question.config.fileTypes ? [...props.question.config.fileTypes, 'audio/*'] : ['audio/*'], 'fileTypes')
                  } else {
                    props.onConfigChange(props.question.config.fileTypes.filter(el => el !== 'audio/*'), 'fileTypes')
                  }
                }}
              />
              <Label>
                {t('formularios>crear_formulario>question_config>audio', 'Audio')} (.WAV, .mp3, .AAC, .mp4, .ADTS)
              </Label>
            </FormGroup>
            <FormGroup>
              <Input
                type='checkbox' checked={props.question.config.fileTypes && props.question.config.fileTypes.includes('video/*')} onClick={() => {
                  if (!props.question.config.fileTypes || !(props.question.config.fileTypes && props.question.config.fileTypes.includes('video/*'))) {
                    props.onConfigChange(props.question.config.fileTypes ? [...props.question.config.fileTypes, 'video/*'] : ['video/*'], 'fileTypes')
                  } else {
                    props.onConfigChange(props.question.config.fileTypes.filter(el => el !== 'video/*'), 'fileTypes')
                  }
                }}
              />
              <Label>
                {t('formularios>crear_formulario>question_config>video', 'Vídeo')} (.mp4, .Ogg, .WebM)
              </Label>
            </FormGroup>
            <FormGroup>
              <Input
                type='checkbox' checked={props.question.config.fileTypes && props.question.config.fileTypes.includes('.pptx')} onClick={() => {
                  if (!props.question.config.fileTypes || !(props.question.config.fileTypes && props.question.config.fileTypes.includes('.pptx'))) {
                    props.onConfigChange(props.question.config.fileTypes ? [...props.question.config.fileTypes, '.ppt', '.pptx'] : ['.ppt', '.pptx'], 'fileTypes')
                  } else {
                    props.onConfigChange(props.question.config.fileTypes.filter(el => !['.ppt', '.pptx'].includes(el)), 'fileTypes')
                  }
                }}
              />
              <Label>
                {t('formularios>crear_formulario>question_config>presentacion', 'Presentación')} (.ppt, .pptx, .odp)
              </Label>
            </FormGroup>
          </div>
        </div>
      </Col>
    </Row>
  )
}

const StyledDivContainer = styled.div`
    display: flex;
    align-items: center;
`

export default Subir
