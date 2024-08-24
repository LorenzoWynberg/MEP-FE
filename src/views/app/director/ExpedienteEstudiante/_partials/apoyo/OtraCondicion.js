import React from 'react'

export default function OtraCondicion() {
    return <>
        <Row><Col md='12'>
            <Row>
                <Col md='6'>
                    <FormGroup>
                        <Label>{t('estudiantes>expediente>apoyos_edu>otra_condicion', 'Otro tipo de condición')}</Label>
                        <StyledMultiSelect
                            className={classes.inputTags}
                            disabled={!editable}
                            onClick={() => {
                                handleOpenOptions(props.otrasCondiciones, 'conditions')
                            }}
                        >
                            {condiciones.map((discapacidad) => {
                                return <SelectItem item={discapacidad} />
                            })}
                        </StyledMultiSelect>
                    </FormGroup>
                </Col>
                <Col md='6'>
                    <span>{t('estudiantes>expediente>apoyos_edu>reco_docentes', 'Recomendaciones a docentes')}</span>
                    <ButtonsContainer>
                        <DownloadIconContainer>
                            <i className='simple-icon-cloud-upload' />
                        </DownloadIconContainer>
                        <div style={{ paddingTop: '0.4rem' }}>
                            {editable && (
                                <input
                                    onChange={(e) => {
                                        handleFileCondition(e)
                                    }}
                                    className={classes.input}
                                    id='filesCondicion-id'
                                    type='file'
                                    name='filesCondicion'
                                />
                            )}
                            <label htmlFor='filesCondicion-id'>
                                <FileLabel
                                    disabled={!editable}
                                >
                                    {t('general>subir_archivo', 'Subir Archivo')}
                                </FileLabel>
                            </label>
                        </div>
                        {condicionesFiles.length > 0 && (
                            <Button
                                color='primary'
                                onClick={() => {
                                    setOpenFiles({ open: true, type: 'condicion' })
                                    setFiles(condicionesFiles)
                                }}
                            >
                                <IntlMessages id='family.uploadedFiles' />(
                                {`${condicionesFiles.length} archivos`})
                            </Button>
                        )}
                    </ButtonsContainer>
                </Col>
            </Row>
        </Col></Row>
    </>

}
