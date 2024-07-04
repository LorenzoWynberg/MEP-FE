import React, { FunctionComponent } from 'react'
import { Input, FormFeedback } from 'reactstrap'
import { Field } from '../Interfaces.ts'
import { TooltipLabel, StyledFormGroup } from '../styles.tsx'
import styled from 'styled-components'
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined'
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined'
import VolumeUpOutlinedIcon from '@material-ui/icons/VolumeUpOutlined'
import QueueMusicOutlinedIcon from '@material-ui/icons/QueueMusicOutlined'
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined'

type Props = {
  field: Field;
  register: any;
};

const IconTextrea: FunctionComponent<Props> = (props) => {
  return (
    <StyledFormGroup className='position-relative'>
      <TooltipLabel field={props.field} />
      <div style={{ display: 'flex' }}>
        <div>
          <IconSpan className='upload-files-type-icon'>
            {
                {
                  archivo: <CloudUploadOutlinedIcon className='icon' />,
                  imagen: <ImageOutlinedIcon className='icon' />,
                  imagen1: <CameraAltOutlinedIcon className='icon' />,
                  audio: <VolumeUpOutlinedIcon className='icon' />,
                  audio1: <QueueMusicOutlinedIcon className='icon' />
                }[props.field.config.icon]
            }
          </IconSpan>
        </div>
        <Input
          type='textarea'
          name={`${props.field.id}`}
          innerRef={props.register({
            required: props.field.config.required
          })}
          disabled={!props.editable || props.readOnlyFields?.includes(props.field.id)}
          placeholder={props.field.config.placeholder}
          invalid={props.errors[`${props.field.id}`]}
          style={{
            resize: props.field?.config?.dontResize ? 'none' : 'unset'
          }}
        />
        <FormFeedback>
          {props.errors[`${props.field.id}`]
            ? 'Este campo es requerido o fallo una validación'
            : null}
        </FormFeedback>
      </div>
    </StyledFormGroup>
  )
}

const IconSpan = styled.span`
  font-size: 2rem;
  width: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default IconTextrea
