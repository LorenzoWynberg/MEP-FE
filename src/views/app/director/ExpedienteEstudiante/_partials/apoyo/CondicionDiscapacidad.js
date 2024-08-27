import React, { useEffect, useState } from 'react'
import { Button, Col, FormGroup, Label, Row, Form } from 'reactstrap';
import IntlMessages from '../../../../../../helpers/IntlMessages';
import { EditButton } from '../../../../../../components/EditButton'
import colors from '../../../../../../assets/js/colors'

import styled from 'styled-components'
import { useTranslation } from 'react-i18next';
import SelectItem from './SelectItem';
function CondicionDiscapacidad(props) {
    const { t } = useTranslation()

    console.log('props.discapacidades SENTdATA', props)
    return <>
        <Row>
            <Col md='12'>
                <FormGroup>
                    <Label>{t('estudiantes>expediente>apoyos_edu>cond_discap', 'Condición de discapacidad')}</Label>
                    <StyledMultiSelect
                        className={props.classes.inputTags}
                        disabled={!props.editable}
                        onClick={() => {
                            props.handleOpenOptions(props.discapacidades, 'discapacidades')
                        }}
                    >
                        {props.discapacidades.filter(d =>
                            props.discapacidadesIdentidad?.some(di => di.id == d.id)
                        ).map(discapacidad =>
                            <SelectItem item={discapacidad} />
                        )}
                    </StyledMultiSelect>
                </FormGroup>
            </Col>
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
    </>;
}

export default CondicionDiscapacidad;

const StyledMultiSelect = styled.div`
        &[disabled] {
          background - color: #eaeaea;
  }
        `
