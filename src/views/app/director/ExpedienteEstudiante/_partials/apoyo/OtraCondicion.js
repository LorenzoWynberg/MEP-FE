import React from 'react'
import { Button, Col, FormGroup, Label, Row,Form } from 'reactstrap';
import IntlMessages from '../../../../../../helpers/IntlMessages';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components'
import { catalogsEnumObj } from '../../../../../../utils/catalogsEnum'
import { useSelector } from 'react-redux';
import { EditButton } from '../../../../../../components/EditButton' 
import colors from '../../../../../../assets/js/colors'


export default function OtraCondicion(props) {
    const { t } = useTranslation()
    const state = useSelector((store) => {
        return {
            selects: store.selects
        }
    })


    return <>
        <Row><Col md='12'>
            <Row>
                <Col md='12'>
                    <FormGroup>
                        <Label>{t('estudiantes>expediente>apoyos_edu>otra_condicion', 'Otro tipo de condición')}</Label>
                        <StyledMultiSelect
                            className={props.classes.inputTags}
                            disabled={!props.editable}
                            onClick={() => {
                                props.handleOpenOptions(props.otrasCondiciones, 'conditions')
                            }}
                        >
                            {props.condiciones.map((discapacidad) => {
                                return <SelectItem item={discapacidad} />
                            })}
                        </StyledMultiSelect>
                    </FormGroup>
                </Col>
                {/* <Col md='6'>
                    <span>{t('estudiantes>expediente>apoyos_edu>reco_docentes', 'Recomendaciones a docentes')}</span>
                    <ButtonsContainer>
                        <DownloadIconContainer>
                            <i className='simple-icon-cloud-upload' />
                        </DownloadIconContainer>
                        <div style={{ paddingTop: '0.4rem' }}>
                            {props.editable && (
                                <input
                                    onChange={(e) => {
                                        props.handleFileCondition(e)
                                    }}
                                    className={props.classes.input}
                                    id='filesCondicion-id'
                                    type='file'
                                    name='filesCondicion'
                                />
                            )}
                            <label htmlFor='filesCondicion-id'>
                                <FileLabel
                                    disabled={!props.editable}
                                >
                                    {t('general>subir_archivo', 'Subir Archivo')}
                                </FileLabel>
                            </label>
                        </div>
                        {state.selects[catalogsEnumObj.OTRASCONDICIONES.name].length > 0 && (
                            <Button
                                color='primary'
                                onClick={() => {
                                    props.setOpenFiles({ open: true, type: 'condicion' })
                                    props.setFiles(props.condicionesFiles)
                                }}
                            >
                                <IntlMessages id='family.uploadedFiles' />(
                                {`${props.condicionesFiles.length} archivos`})
                            </Button>
                        )}
                    </ButtonsContainer>
                </Col> */}
                <Col xs={12}>
                <Form onSubmit={props.handleSubmit(props.sentData)}>
                    <EditButton
                        editable={props.editable}
                        setEditable={(value) => props.authHandler('modificar', () => props.setEditable(value), props.showsnackBar)}
                        loading={props.loading}
                    />
                </Form>
            </Col>

            </Row>
        </Col></Row>
    </>

}
const StyledMultiSelect = styled.div`
        &[disabled] {
          background - color: #eaeaea;
  }
        `

const ButtonsContainer = styled.div`
        display: flex;
        margin-top: 1rem;
        align-items: center;
        `

const FileLabel = styled.div`
        background-color: white;
        color: ${props => props.disabled ? '#636363' : colors.primary};
        border: 1.5px solid ${props => props.disabled ? '#636363' : colors.primary};
        width: 7rem;
        height: 2.7rem;
        text-align: center;
        justify-content: center;
        align-items: center;
        display: flex;
        margin-left: 0.35rem;
        margin-right: 0.35rem;
        border-radius: 26px;
        &:hover {
          background - color: ${props => props.disabled ? '' : colors.primary};
        color: ${props => props.disabled ? '' : 'white'};
  }
        `

const DownloadIconContainer = styled.span`
        font-size: 35px;
        `