import React from 'react'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import Select from 'react-select'

import {
  Input,
  Label,
  Form,
  Row,
  Col,
  FormGroup,
  FormFeedback,
  CustomInput
} from 'reactstrap'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import styled from 'styled-components'
import MiembroId from './MiembroId'
import { useTranslation } from 'react-i18next'

const MiembroPersonalDataForm = (props) => {
  const { t } = useTranslation()
  const currentDate = moment()
  const threeMonthsBefore = moment(currentDate).subtract(3, 'M')
  return (
    <Form>
      <MiembroId
        {...props}
        handleChange={props.handleChange}
        toggleAlertModal={props.toggleAlertModal}
        loadMemberActions={props.loadMemberActions}
        memberData={props.memberData}
        avoidSearch={props.avoidSearch}
        editable={props.editable}
        disableFields={props.disableFields}
        disableIds={props.disableIds}
        image={props.image}
        setImage={props.setImage}
        loading={props.loading}
        setLoading={props.setLoading}
        errors={props.errors}
        fields={props.fields}
        setDisableFields={props.setDisableFields}
      />
      <Row>

        <Col sm='12'>
          <FormGroup>
            <Label>{t('estudiantes>matricula_estudiantil>matricular_estudiante>encargados>agregar>nombre', ' Nombre')}</Label>
            <Input
              type='text'
              name='nombre'
              value={props.memberData.nombre}
              disabled={props.disableFields}
              onInput={(e) => e.target.value = e.target.value.toUpperCase()}
              onChange={(e) => {
                props.handleChange(e)
              }}
              invalid={props.fields.Nombre}
            />
            <FormFeedback>
              {props.fields.Nombre && props.errors.Nombre}
            </FormFeedback>
          </FormGroup>
        </Col>
        <Col sm='12'>
          <FormGroup>
            <Label>{t('estudiantes>matricula_estudiantil>matricular_estudiante>encargados>agregar>primer_ap', 'Primer apellido')}</Label>
            <Input
              type='text'
              name='primerApellido'
              value={props.memberData.primerApellido}
              disabled={props.disableFields}
              onInput={(e) => e.target.value = e.target.value.toUpperCase()}
              onChange={(e) => {
                props.handleChange(e)
              }}
              invalid={props.fields.PrimerApellido}
            />
            <FormFeedback>
              {props.fields.PrimerApellido && props.errors.PrimerApellido}
            </FormFeedback>
          </FormGroup>
        </Col>
        <Col sm='12'>
          <FormGroup>
            <Label>{t('estudiantes>matricula_estudiantil>matricular_estudiante>encargados>agregar>segundo_ap', 'Segundo apellido')}</Label>
            <Input
              type='text'
              name='segundoApellido'
              value={props.memberData.segundoApellido}
              disabled={props.disableFields}
              onInput={(e) => e.target.value = e.target.value.toUpperCase()}
              onChange={(e) => {
                props.handleChange(e)
              }}
            />
          </FormGroup>
        </Col>

        <Col sm='12'>
          <FormGroup>
            <Label>{t('estudiantes>matricula_estudiantil>matricular_estudiante>encargados>agregar>conocido_como', 'Conocido como')}</Label>
            <Input
              type='text'
              name='conocidoComo'
              onInput={(e) => e.target.value = e.target.value.toUpperCase()}
              value={props.memberData.conocidoComo}
              disabled={props.disableFields}
              onChange={(e) => {
                props.handleChange(e)
              }}
            />
          </FormGroup>
        </Col>
        <Col sm='6'>
          <FormGroup>
            <Label>{t('estudiantes>matricula_estudiantil>matricular_estudiante>encargados>agregar>fecha_naci', 'Fecha de nacimiento')}</Label>
            <DatePicker
              dateFormat='dd/MM/yyyy'
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              selectsStart
              maxDate={threeMonthsBefore.toDate()}
              disabled={props.disableFields}
              selected={
                props.memberData.fechaNacimiento
                  ? moment(props.memberData.fechaNacimiento).toDate()
                  : null
              }
              onChange={(e) => {
                props.handleChange(e, 'fechaNacimiento')
              }}
            />
            <FormFeedbackSpan>
              {props.fields.FechaNacimiento &&
                props.errors.FechaNacimiento}
            </FormFeedbackSpan>
          </FormGroup>
        </Col>
        <Col sm='6'>
          <FormGroup>
            <Label>{t('estudiantes>matricula_estudiantil>matricular_estudiante>encargados>agregar>nacionalidad', 'Nacionalidad')}</Label>
            <Input
              type='text'
              name='nacionalidad'
              value={props.memberData.nationalityId?.label}
              disabled={props.disableFields}
              onChange={(e) => {
                // props.handleChange(e)
              }}
            />
            <FormFeedbackSpan>
              {props.fields.FechaNacimiento &&
                props.errors.FechaNacimiento}
            </FormFeedbackSpan>
          </FormGroup>
        </Col>

        <Col sm='6'>
          <FormGroup>
            <Label>{t('estudiantes>matricula_estudiantil>matricular_estudiante>encargados>agregar>genero', 'Género')}</Label>
            <Select
              components={{ Input: CustomSelectInput }}
              className='react-select'
              classNamePrefix='react-select'
              options={props.selects.genderTypes.map((item) => {
                return { ...item, label: item.nombre, value: item.id }
              })}
              placeholder=''
              value={props.memberData.genero}
              isdisabled={props.disableFields}
              onChange={(data) => {
                props.handleChange(data, 'genero')
              }}
            />
          </FormGroup>
        </Col>
        <Col sm='6'>
          <FormGroup>
            <Label>
              <Label>{t('estudiantes>matricula_estudiantil>matricular_estudiante>encargados>agregar>vive_est', '*Vive con el estudiante')}</Label>
            </Label>
            <div>
              <CustomInput
                type='radio' inline label={t('estudiantes>matricula_estudiantil>matricular_estudiante>encargados>agregar>vive_est>si', 'Si')} checked={props.memberData.viveHogar} onClick={() => {
                  if (props.editable) {
                    props.handleChange({ target: { value: true, name: 'viveHogar' } })
                  }
                }}
              />
              <CustomInput
                type='radio' inline label={t('estudiantes>matricula_estudiantil>matricular_estudiante>encargados>agregar>vive_est>no', 'No')} checked={!props.memberData.viveHogar} onClick={() => {
                  if (props.editable) {
                    props.handleChange({ target: { value: false, name: 'viveHogar' } })
                  }
                }}
              />
            </div>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  )
}

const FormFeedbackSpan = styled.span`
  color: red;
`
export default MiembroPersonalDataForm
