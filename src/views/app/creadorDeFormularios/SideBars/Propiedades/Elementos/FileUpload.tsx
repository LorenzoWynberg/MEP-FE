import React, { useState, useEffect } from 'react'
import {
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
  CustomInput
} from 'reactstrap'
import { PropsFileUpload } from '../../../Types/propiedades.tsx'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { IOSSwitch } from '../../../../../../components/IosSwitch.tsx'
import '../../../styles.scss'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import Select from 'react-select'
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined'
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined'
import VolumeUpOutlinedIcon from '@material-ui/icons/VolumeUpOutlined'
import QueueMusicOutlinedIcon from '@material-ui/icons/QueueMusicOutlined'

import {
  allExtentions,
  imageExtensions,
  audioExtensions
} from 'Utils/extensionsFiles'

import { map } from 'lodash'

const FileUpload: React.FC<PropsFileUpload> = (props) => {
  const handleChangeRequired = () => {
    props.handleChange('required', !props.field.config.required, true)
  }
  const [type, setType] = useState(props.field.config.type)
  const [extensions, setExtensions] = useState(allExtentions)

  const _formas = ['archivo', 'imagen', 'audio']

  useEffect(() => {
    switch (type) {
      case 'imagen':
        setExtensions(imageExtensions)
        break

      case 'audio':
        setExtensions(audioExtensions)
        break

      default:
        setExtensions(allExtentions)
    }
  }, [type])

  return (
    <div>
      <h4>[SUBIDA DE ARCHIVO]</h4>
      <div className='content-form'>
        <Form>
          <FormGroup>
            <Label for='tituloId'>Título</Label>
            <Input
              type='text'
              name='titulo'
              value={props.field.label}
              id='tituloId'
              placeholder='Título'
              onChange={(e) => {
                props.handleChange('label', e.target.value)
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label for='maxFiles'>Archivos Máximo</Label>
            <Input
              type='number'
              name='maxFiles'
              value={props.field.config.maxFiles}
              id='maxFiles'
              placeholder='5'
              onChange={(e) => {
                props.handleChange('maxFiles', e.target.value, true)
              }}
            />
          </FormGroup>

          <FormGroup>
            <FormControlLabel
              control={
                <IOSSwitch
                  checked={props.field.config.required}
                  onClick={handleChangeRequired}
                  name='required'
                  color='primary'
                />
              }
              label='Requerido'
              labelPlacement='start'
              className='switch-required'
            />
          </FormGroup>
          <FormGroup>
            <Label for='informacionId'>Información (tooltip)</Label>
            <Input
              type='textarea'
              name='tooltip'
              value={props.field.config.tooltipText}
              id='informacionId'
              placeholder='Identificación del estudiante'
              onChange={(e) => props.handleChange('tooltipText', e.target.value, true)}
            />
          </FormGroup>
          <FormGroup className='position-relative' style={{ width: '100%' }}>
            <Label>Tipo</Label>
            <Select
              components={{ Input: CustomSelectInput }}
              className='react-select'
              classNamePrefix='react-select'
              name='type'
              id='type'
              isDisabled={false}
              onChange={(data) => {
                setType(data.value)
                props.handleChange('type', data.value, true)
              }}
              value={{
                label: props.field.config.type,
                value: props.field.config.type
              }}
              placeholder='Seleccionar'
              options={_formas.map((item) => ({
                label: item,
                value: item
              }))}
            />
          </FormGroup>
          {props.field.config.type != 'archivo'
            ? (
              <FormGroup className='upload-files-type-icon'>
                <Label>Elige el icono a mostrar</Label>
                <br />
                {
                {
                  imagen: (
                    <>
                      <ImageOutlinedIcon
                        className={`icon ${
                          props.field.config.icon == 'imagen' ? 'active' : ''
                        }`}
                        onClick={() =>
                          props.handleChange('icon', 'imagen', true)}
                      />
                      <CameraAltOutlinedIcon
                        className={`icon ${
                          props.field.config.icon == 'imagen1' ? 'active' : ''
                        }`}
                        onClick={() =>
                          props.handleChange('icon', 'imagen1', true)}
                      />
                    </>
                  ),
                  audio: (
                    <>
                      <VolumeUpOutlinedIcon
                        className={`icon ${
                          props.field.config.icon == 'audio' ? 'active' : ''
                        }`}
                        onClick={() =>
                          props.handleChange('icon', 'audio', true)}
                      />
                      <QueueMusicOutlinedIcon
                        className={`icon ${
                          props.field.config.icon == 'audio1' ? 'active' : ''
                        }`}
                        onClick={() =>
                          props.handleChange('icon', 'audio1', true)}
                      />
                    </>
                  )
                }[props.field.config.type]
              }
              </FormGroup>
              )
            : null}
          {props.field.row && !props.field.col && (
            <FormGroup>
              <Input
                type='select'
                name='size'
                value={props.field.config.size || 6}
                onChange={(e) =>
                  props.handleChange('size', e.target.value, true)}
                id='placeholderId'
                placeholder='Introduzca nombre aquí'
              >
                <option value={3}>25%</option>
                <option value={6}>50%</option>
                <option value={9}>75%</option>
              </Input>
            </FormGroup>
          )}
          <Row>
            <Col md={12} xs={12}>
              <CustomInput
                key={`${props.field.id}_general`}
                color='primary'
                type='checkbox'
                id={`${props.field.id}_general`}
                value='*'
                name={`${props.field.id}_general`}
                checked={
                  (props.field.config.typesAccepted != '' &&
                    !props.field.config.typesAccepted) ||
                  props.field.config.typesAccepted == '*'
                }
                onClick={(e) => {
                  props.handleChange(
                    'typesAccepted',
                    !e.target.checked ? '*' : '',
                    true
                  )
                }}
                label='Seleccionar todo'
                row
              />
            </Col>
          </Row>
          <hr />
          <Row>
            <Col md={6} xs={6}>
              {extensions
                .slice(0, Math.ceil(extensions.length / 2))
                .map((option, i) => (
                  <GetCustomInput {...props} option={option} i={i} />
                ))}
            </Col>
            <Col md={6} xs={6}>
              {extensions
                .slice(Math.ceil(extensions.length / 2), extensions.length)
                .map((option, i) => (
                  <GetCustomInput {...props} option={option} i={i} />
                ))}
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  )
}

const GetCustomInput = (props) => {
  return (
    <CustomInput
      key={`${props.field.id}_${props.i}`}
      color='primary'
      type='checkbox'
      id={`${props.field.id}_${props.i}`}
      value={props.option.extension}
      name={`${props.field.id}`}
      checked={
        props.field.config.typesAccepted ||
        props.field.config.typesAccepted == ''
          ? props.field.config.typesAccepted == '*'
            ? true
            : props.field.config.typesAccepted.search(props.option.extension) >=
              0
          : true
      }
      onClick={(e) => {
        let extensionsSelected = []

        // Definir lista de tipos aceptados si es * o no esta definida y segun el tipo
        if (
          (!props.field.config.typesAccepted &&
            props.field.config.typesAccepted != '') ||
          props.field.config.typesAccepted == '*'
        ) {
          switch (props.field.config.type) {
            case 'imagen':
              extensionsSelected = map(imageExtensions, 'extension')
              break

            case 'audio':
              extensionsSelected = map(audioExtensions, 'extension')
              break

            default:
              extensionsSelected = map(allExtentions, 'extension')
          }
        } else {
          extensionsSelected = props.field.config.typesAccepted.split(',')
        }

        if (!e.target.checked) {
          extensionsSelected.push(e.target.value)
        } else {
          extensionsSelected.splice(
            extensionsSelected.indexOf(e.target.value),
            1
          )
        }

        props.handleChange('typesAccepted', extensionsSelected.join(','), true)
      }}
      label={props.option.id}
      row
    />
  )
}

export default FileUpload
