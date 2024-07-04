import React from 'react'
import IntlMessages from '../../../../../../../helpers/IntlMessages'
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Label,
  CustomInput,
  Button
} from 'reactstrap'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core'
import colors from 'assets/js/colors'

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  input: {
    display: 'none'
  },
  avatar: {
    width: '150px',
    height: '150px'
  },
  buttonIcon: {
    width: '150px',
    height: '150px',
    background: colors.primary,
    '&:hover': {
      background: '#0c3253'
    }
  },
  icon: {
    width: '80px',
    height: '80px',
    color: '#fff'
  }
}))

const Asociacion = props => {
  const classes = useStyles()

  return (
    <Card>
      <CardBody>
        <Row>
          <Col sm='12' md='12'>
            <h5>
              <IntlMessages id='family.asociation' />
            </h5>
          </Col>
          <Col sm='12' md='12'>
            <FormGroup>
              <Label>
                <IntlMessages id='family.relationship' />
              </Label>
              <Select
                className='react-select'
                classNamePrefix='react-select'
                components={{ Input: CustomSelectInput }}
                isDisabled={!props.editable}
                placeholder='Seleccionar'
                value={props.memberData.relacion}
                onChange={(data) => {
                  props.handleChange(data, 'relacion')
                }}
                options={props.selects.relacionEstudiante.map(item => { return ({ ...item, label: item.nombre, value: item.id }) })}
              />
              <span style={{ color: 'red' }}>
                {props.fields.ParentescoId && props.errors.ParentescoId}
              </span>
            </FormGroup>
            <FormGroup>
              <Label>
                <IntlMessages id='family.onCharge' />
              </Label>
              <div>
                <CustomInput
                  type='radio' inline label='Si' checked={props.memberData.encargado} onClick={() => {
                      if (props.editable) {
                        props.handleChange({ target: { value: true, name: 'encargado' } })
                      }
                    }}
                />
                <CustomInput
                  type='radio' inline label='No' checked={!props.memberData.encargado} onClick={() => {
                      if (props.editable) {
                        props.handleChange({ target: { value: false, name: 'encargado' } })
                      }
                    }}
                />
              </div>
              {props.memberData.encargado &&

                <ButtonsContainer>
                  <DownloadIconContainer>
                      <i className='simple-icon-cloud-upload' />
                    </DownloadIconContainer>
                  <div style={{ paddingTop: '0.4rem' }}>
                      {props.editable && <input
                        onChange={(e) => { props.handleFile(e, true) }}
                        className={classes.input}
                        id='filesEncargado-id'
                        type='file'
                        name='filesEncargado'
                                         />}
                      <label htmlFor='filesEncargado-id'>
                        <FileLabel
                            disabled={!props.editable} onClick={() => {
                                // if(!props.memberData.idMiembro) {
                                // props.toggleAlertModal()
                                // }
                              }}
                          >
                            <IntlMessages id='family.uploadFile' />
                          </FileLabel>
                      </label>
                    </div>
                  {props.memberData.recursosIdsEncargado && props.memberData.recursosIdsEncargado.length > 0 &&
                      <Button
                        color='primary' onClick={() => {
                            props.handleOpenFiles(props.memberData.recursosIdsEncargado)
                            props.setDisplayingModalFiles('encargado')
                          }}
                      >
                        <IntlMessages id='family.uploadedFiles' />{`(${props.memberData.recursosIdsEncargado.length} archivos)`}
                      </Button>}
                </ButtonsContainer>}
            </FormGroup>
          </Col>
          <Col sm='12' md='12'>
            <FormGroup>
              <Label>
                <IntlMessages id='family.legalRepresentative' />
              </Label>
              <div>
                <CustomInput
                  type='radio' inline label='Si' checked={props.memberData.representanteLegal} onClick={() => {
                      if (props.editable) {
                        props.handleChange({ target: { value: true, name: 'representanteLegal' } })
                      }
                    }}
                />
                <CustomInput
                  type='radio' inline label='No' checked={!props.memberData.representanteLegal} onClick={() => {
                      if (props.editable) {
                        props.handleChange({ target: { value: false, name: 'representanteLegal' } })
                      }
                    }}
                />
              </div>
              {props.memberData.representanteLegal && <ButtonsContainer>
                <DownloadIconContainer>
                  <i className='simple-icon-cloud-upload' />
                </DownloadIconContainer>
                <div style={{ paddingTop: '0.4rem' }}>
                  {props.editable && <input
                      onChange={(e) => { props.handleFile(e) }}
                      className={classes.input}
                      id='filesRepresentante-id'
                      type='file'
                      name='filesRepresentante'
                                       />}
                  <label htmlFor='filesRepresentante-id'>
                      <FileLabel
                        disabled={!props.editable} onClick={() => {
                            // if(!props.memberData.idMiembro) {
                            //   props.toggleAlertModal()
                            //   }
                          }}
                      >
                        <IntlMessages id='family.uploadFile' />
                      </FileLabel>
                    </label>
                </div>
                {props.memberData.recursosIdsRepresentante && props.memberData.recursosIdsRepresentante.length > 0 &&
                  <Button
                      color='primary' onClick={() => {
                        props.handleOpenFiles(props.memberData.recursosIdsRepresentante)
                        props.setDisplayingModalFiles('representante')
                      }}
                    >
                      <IntlMessages id='family.uploadedFiles' />{`(${props.memberData && props.memberData.recursosIdsRepresentante.length} archivos)`}
                    </Button>}
              </ButtonsContainer>}
            </FormGroup>
          </Col>
          <Col sm='12' md='12'>
            <FormGroup>
              <Label>
                <IntlMessages id='family.authorized' />
              </Label>
              <div>
                <CustomInput
                  type='radio' inline label='Si' checked={props.memberData.autorizado} onClick={() => {
                      if (props.editable) {
                        props.handleChange({ target: { value: true, name: 'autorizado' } })
                      }
                    }}
                />
                <CustomInput
                  type='radio' inline label='No' checked={!props.memberData.autorizado} onClick={() => {
                      if (props.editable) {
                        props.handleChange({ target: { value: false, name: 'autorizado' } })
                      }
                    }}
                />
              </div>
            </FormGroup>
          </Col>
          <Col sm='12' md='12'>
            <FormGroup>
              <Label>
                <IntlMessages id='family.livesWithStudent' />
              </Label>
              <div>
                <CustomInput
                  type='radio' inline label='Si' checked={props.memberData.viveHogar} onClick={() => {
                      if (props.editable) {
                        props.handleChange({ target: { value: true, name: 'viveHogar' } })
                      }
                    }}
                />
                <CustomInput
                  type='radio' inline label='No' checked={!props.memberData.viveHogar} onClick={() => {
                      if (props.editable) {
                        props.handleChange({ target: { value: false, name: 'viveHogar' } })
                      }
                    }}
                />
              </div>
            </FormGroup>
          </Col>
          <Col sm='12' md='12'>
            <FormGroup>
              <Label>
                <IntlMessages id='family.dependsOfStudent' />
              </Label>
              <div>
                <CustomInput
                  type='radio' inline label='Si' checked={props.memberData.dependenciaEconomica} onClick={() => {
                      if (props.editable) {
                        props.handleChange({ target: { value: true, name: 'dependenciaEconomica' } })
                      }
                    }}
                />
                <CustomInput
                  type='radio' inline label='No' checked={!props.memberData.dependenciaEconomica} onClick={() => {
                      if (props.editable) {
                        props.handleChange({ target: { value: false, name: 'dependenciaEconomica' } })
                      }
                    }}
                />
              </div>
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

const ButtonsContainer = styled.div`
    display: flex;
    margin-top: 1rem;
    justify-content: space-around;
    align-items: center;
`

const FileLabel = styled.div`
    background-color: white;
    color: ${props => props.disabled ? '#636363' : colors.primary};;
    border: 1.5px solid ${props => props.disabled ? '#636363' : colors.primary};;
    width: 7rem;
    height: 2.7rem;
    text-align: center;
    justify-content: center;
    align-items: center;
    display: flex;
    border-radius: 26px;
    &:hover {
        background-color: ${props => props.disabled ? '' : colors.primary};
        color: ${props => props.disabled ? '' : 'white'};
    }
`

const DownloadIconContainer = styled.span`
    font-size: 35px;
`
export default Asociacion
