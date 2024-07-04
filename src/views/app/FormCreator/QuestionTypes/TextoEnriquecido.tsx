import React from 'react'
import { Typography } from '@material-ui/core'
import Froala from '../../../../components/Froala/index'
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView'
import { useTranslation } from 'react-i18next'

const TextoEnriquecido = (props) => {
  const { t } = useTranslation()
  const handleModelChange = (value) => {
    props.handleOnChangeValue(value)
  }

  if (props.summary) {
    return <FroalaEditorView model={props.value} />
  }

  return (
    <div>
      <Typography
        variant='caption'
        style={{
				  marginTop: '1rem',
				  marginLeft: '1rem',
				  color: '#848484'
        }}
      >
        {props.question.config.placeholder
				  ? props.question.config.placeholderText
				  : t('formularios>formulario_respuestas>respuesta_larga', 'Respuesta larga')}
      </Typography>
      {!props.active && (
        <div>
          <Froala
            value={props.value}
            zIndex={9}
            uploadUrl={props.uploadUrl}
            resourcesUrl={props.resourcesUrl}
            deleteResourceUrl={props.deleteResourceUrl}
            onChange={handleModelChange}
          />
        </div>
      )}
    </div>
  )
}

export default TextoEnriquecido
