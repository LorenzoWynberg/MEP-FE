import React, { useEffect } from 'react'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import Select from 'react-select'
import colors from 'Assets/js/colors'
import {
  Input,
  Label,
  Form,
  Row,
  Col,
  FormGroup,
  Card,
  CardBody,
  CardTitle,
  FormFeedback,
  CustomInput,
  Button,
  Container
} from 'reactstrap'
import SimpleModal from 'Components/Modal/simple'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import styled from 'styled-components'
import RequiredLabel from '../../../../../../components/common/RequeredLabel'
import { useTranslation } from 'react-i18next'

const MiembroPersonalDataForm = (props) => {
  const currentDate = moment()
  const threeMonthsBefore = moment(currentDate).subtract(3, 'M')
  const { t } = useTranslation()

  return (
    <Card>
      <CardBody>
        <CardTitle>{t('estudiantes>expediente>hogar>miembros_hogar>agregar>titulo', 'Información general')}</CardTitle>
        <Form>
          <Row>
            <Col sm='12'>
              <FormGroup>
                {props.label
                  ? (
                    <Label>*{t('estudiantes>expediente>hogar>miembros_hogar>agregar>nombre', 'Nombre')}</Label>
                    )
                  : (
                    <RequiredLabel>{t('estudiantes>expediente>hogar>miembros_hogar>agregar>nombre', 'Nombre')}</RequiredLabel>
                    )}
                <Input
                  type='text'
                  name='nombre'
                  value={props.memberData.nombre}
                  disabled={props.disabled || !props.editable}
                  onChange={(e) => {
									  props.handleChange(e)
                  }}
                  invalid={props.fields.Nombre}
                />
                <FormFeedback>
                  {props.fields.Nombre &&
										props.errors.Nombre}
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                {props.label
                  ? (
                    <Label>*{t('estudiantes>expediente>hogar>miembros_hogar>agregar>apellido_1', 'Primer apellido')}</Label>
                    )
                  : (
                    <RequiredLabel>
                    {t('estudiantes>expediente>hogar>miembros_hogar>agregar>apellido_1', 'Primer apellido')}
                  </RequiredLabel>
                    )}
                <Input
                  type='text'
                  name='primerApellido'
                  value={props.memberData.primerApellido}
                  disabled={props.disabled || !props.editable}
                  onChange={(e) => {
									  props.handleChange(e)
                  }}
                  invalid={props.fields.PrimerApellido}
                />
                <FormFeedback>
                  {props.fields.PrimerApellido &&
										props.errors.PrimerApellido}
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                <Label>{t('estudiantes>expediente>hogar>miembros_hogar>agregar>apellido_2', 'Segundo apellido')}</Label>
                <Input
                  type='text'
                  name='segundoApellido'
                  value={props.memberData.segundoApellido}
                  disabled={props.disabled || !props.editable}
                  onChange={(e) => {
									  props.handleChange(e)
                  }}
                />
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                <Label>{t('estudiantes>expediente>hogar>miembros_hogar>agregar>sexo', 'Sexo')}</Label>
                <Select
                  components={{ Input: CustomSelectInput }}
                  className={`react-select ${
										props.fields.SexoId && 'has-error'
									}`}
                  classNamePrefix='react-select'
                  options={props.selects.sexoTypes.map(
									  (item) => {
									    return {
									      ...item,
									      label: item.nombre,
									      value: item.id
									    }
									  }
                  )}
                  placeholder=''
                  value={props.memberData.sexo}
                  isDisabled={
										props.disabled || !props.editable
									}
                  onChange={(data) => {
									  props.handleChange(data, 'sexo')
                  }}
                />
                <FormFeedbackSpan>
                  {props.fields.SexoId &&
										props.errors.SexoId}
                </FormFeedbackSpan>
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                {props.label
                  ? (
                    <Label>*{t('estudiantes>expediente>hogar>miembros_hogar>agregar>nacimiento', 'Fecha de nacimiento')}</Label>
                    )
                  : (
                    <RequiredLabel>
                    {t('estudiantes>expediente>hogar>miembros_hogar>agregar>nacimiento', 'Fecha de nacimiento')}
                  </RequiredLabel>
                    )}
                <DatePicker
                  dateFormat='dd/MM/yyyy'
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  selectsStart
                  maxDate={threeMonthsBefore.toDate()}
                  disabled={props.disabled || !props.editable}
                  selected={
										props.memberData.fechaNacimiento
										  ? moment(
										    props.memberData
										      .fechaNacimiento
											  ).toDate()
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
            <Col sm='12'>
              <FormGroup>
                <Label>{t('estudiantes>expediente>hogar>miembros_hogar>agregar>conocido', 'Conocido como')}</Label>
                <Input
                  type='text'
                  name='conocidoComo'
                  value={props.memberData.conocidoComo}
                  disabled={props.disabled || !props.editable}
                  onChange={(e) => {
									  props.handleChange(e)
                  }}
                />
                <FormFeedbackSpan>
                  {props.fields.conocidoComo &&
										props.errors.conocidoComo}
                </FormFeedbackSpan>
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                <Label>{t('estudiantes>expediente>hogar>miembros_hogar>agregar>identidad_gen', 'Identidad de género')}</Label>
                <Select
                  components={{ Input: CustomSelectInput }}
                  className='react-select'
                  classNamePrefix='react-select'
                  options={props.selects.genderTypes.map(
									  (item) => {
									    return {
									      ...item,
									      label: item.nombre,
									      value: item.id
									    }
									  }
                  )}
                  placeholder=''
                  value={props.memberData.genero}
                  isDisabled={!props.editable}
                  onChange={(data) => {
									  props.handleChange(data, 'genero')
                  }}
                />
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                {props.label
                  ? (
                    <Label>*{t('estudiantes>expediente>hogar>miembros_hogar>agregar>escolaridad', 'Escolaridad')}</Label>
                    )
                  : (
                    <RequiredLabel>{t('estudiantes>expediente>hogar>miembros_hogar>agregar>escolaridad', 'Escolaridad')}</RequiredLabel>
                    )}
                <Select
                  components={{ Input: CustomSelectInput }}
                  className={`react-select ${
										props.fields.EscolaridadId &&
										'has-error'
									}`}
                  classNamePrefix='react-select'
                  options={props.selects.escolaridades.map(
									  (item) => {
									    return {
									      ...item,
									      label: item.nombre,
									      value: item.id
									    }
									  }
                  )}
                  placeholder=''
                  value={props.memberData.escolaridad}
                  onChange={(data) => {
									  props.handleChange(data, 'escolaridad')
                  }}
                  isDisabled={!props.editable}
                />
                <FormFeedbackSpan>
                  {props.fields.EscolaridadId &&
										props.errors.EscolaridadId}
                </FormFeedbackSpan>
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                {props.label
                  ? (
                    <Label>*{t('estudiantes>expediente>hogar>miembros_hogar>agregar>condicion_lab', 'Condición laboral')}</Label>
                    )
                  : (
                    <RequiredLabel>
                    {t('estudiantes>expediente>hogar>miembros_hogar>agregar>condicion_lab', 'Condición laboral')}
                  </RequiredLabel>
                    )}
                <Select
                  components={{ Input: CustomSelectInput }}
                  className={`react-select ${
										props.fields.CondicionLaboralId &&
										'has-error'
									}`}
                  classNamePrefix='react-select'
                  options={props.selects.condicionLaboral.map(
									  (item) => {
									    return {
									      ...item,
									      label: item.nombre,
									      value: item.id
									    }
									  }
                  )}
                  placeholder=''
                  value={props.memberData.condicionTrabajo}
                  isDisabled={!props.editable}
                  onChange={(data) => {
									  props.handleChange(
									    data,
									    'condicionTrabajo'
									  )
                  }}
                />
                <FormFeedbackSpan>
                  {props.fields.CondicionLaboralId &&
										'La condición laboral es requerida'}
                  {props.fields.condicionLaboralId &&
										'La condición laboral es requerida'}
                </FormFeedbackSpan>
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                <Label>{t('estudiantes>expediente>hogar>miembros_hogar>agregar>condicion_discap', 'Condición de discapacidad')}</Label>
                {/* <Select
									components={{ Input: CustomSelectInput }}
									className="react-select"
									classNamePrefix="react-select"
									options={props.selects.discapacidades.map(
										(item) => {
											return {
												...item,
												label: item.nombre,
												value: item.id
											}
										}
									)}
									placeholder=""
									value={props.memberData.discapacidades}
									isDisabled={!props.editable}
									onChange={(data) => {
										if (data) {
											props.handleChange(
												data,
												'discapacidades'
											)
										} else {
											props.handleChange(
												{},
												'discapacidades'
											)
										}
									}}
									isMulti
								/> */}
                <StyledMultiSelect
                  disabled={!props.editable}
                  onClick={() => {
									  props.editable &&
											props.handleOpenOptions()
                  }}
                >
                  {props.discapacidades2?.map(
									  (discapacidad) => {
									    return (
  <ItemSpan>
    {discapacidad.nombre}
  </ItemSpan>
									    )
									  }
                  )}
                </StyledMultiSelect>
                <SimpleModal
                  openDialog={props.openOptions.open}
                  onClose={() => {
									  props.toggleModal()
                  }}
                  title='Condición de discapacidad'
                  actions={false}
                >
                  <Container className='modal-detalle-subsidio'>
                    <Row>
                    <Col xs={12}>
                    {props.modalOptions.map(
												  (item) => {
												    return (
  <Row
    style={{
																  borderBottom:
																		'1px solid',
																  marginTop:
																		'10px',
																  paddingBottom:
																		'10px'
    }}
  >
    <Col
      xs={3}
      className='modal-detalle-subsidio-col'
    >
      <OnlyVert>
        <CustomInput
          type='checkbox'
          label={
																				item.nombre
																			}
          inline
          onClick={() =>
																			  props.handleChangeItem(
																			    item
																			  )}
          checked={
																				item.checked
																			}
        />
      </OnlyVert>
    </Col>
    <Col
      xs={9}
      className='modal-detalle-subsidio-col'
    >
      <OnlyVert>
        {item.descripcion
																		  ? item.descripcion
																		  : item.detalle
																		    ? item.detalle
																		    : 'Elemento sin detalle actualmente'}
      </OnlyVert>
    </Col>
  </Row>
												    )
												  }
                  )}
                  </Col>
                  </Row>
                    <Row>
                    <CenteredRow xs='12'>
                    <Button
                    onClick={() => {
													  props.toggleModal()
                  }}
                    color='primary'
                    outline
                    className='mr-3'
                  >
    Cancelar
                  </Button>
                    <Button
                    color='primary'
                    onClick={() => {
													  props.toggleModal(true)
                  }}
                  >
  Guardar
                  </Button>
                  </CenteredRow>
                  </Row>
                  </Container>
                </SimpleModal>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  )
}

const FormFeedbackSpan = styled.span`
	color: red;
`
export default MiembroPersonalDataForm
const StyledMultiSelect = styled.div`
	&[disabled] {
		background-color: #eaeaea;
	}
	min-height: 8rem;
	border: 1px solid #eaeaea;
	padding: 0.35rem;
	color: white;
`
const CenteredRow = styled(Col)`
	display: flex;
	justify-content: center;
	align-items: center;
`
const ItemSpan = styled.span`
	background-color: ${colors.primary};
	padding-left: 8px;
	padding-right: 8px;
	border-radius: 15px;
`
const CenterDiv = styled.div`
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
`
const OnlyVert = styled(CenterDiv)`
	display: flex;
	width: 100%;
	justify-content: left !important;
	align-items: center;
`
