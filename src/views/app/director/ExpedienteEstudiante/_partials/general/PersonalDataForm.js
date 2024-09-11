import React, { useState, useEffect } from 'react'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import Select from 'react-select'
import { isEmpty } from 'lodash'

import { Input, Label, Form, Row, Col, FormGroup, Card, CardBody, CardTitle, FormFeedback } from 'reactstrap'
import styled from 'styled-components'
import RequiredLabel from '../../../../../../components/common/RequeredLabel'
import { useTranslation } from 'react-i18next'
import SelectCatalogo from 'Components/SelectCatalogo'
import { getCatalogs, getCatalogsSet } from 'Redux/selects/actions'
import { useActions } from 'Hooks/useActions'
import { catalogsEnumObj } from 'Utils/catalogsEnum'

const IdentificationTypeCode = {
	NACIONAL: '01',
	DIMEX: '03',
	YISRO: '04'
}

const PersonalDataForm = props => {
	const { t } = useTranslation()
	const [errorFields, setErrorFields] = useState(props.identification.errorFields)
	const [errorMessages, setErrorMessages] = useState(props.identification.errorMessages)
	const [tipoIdentidadData, setTipoIdentidadData] = useState(null)

	const actions = useActions({
		getCatalogs
	})

	useEffect(() => {
		setErrorFields(props.identification.errorFields)
		setErrorMessages(props.identification.errorMessages)
	}, [props.identification])

	const getTipoIdentificacion = async (codigoDeCatalogo, idType, nombreCatalogo) => {
		try {
			let type = ''
			if (idType == 'YISRO') {
				type = 'Yís Rö'
			} else {
				type = idType
			}
			const titulo = `Tipo de ${type}`

			const response = await actions.getCatalogs(codigoDeCatalogo)

			let codigoIdentificacion = ''

			codigoIdentificacion = props.identification.data.datos.find(
				item => item.nombreCatalogo === nombreCatalogo
			).elementoId

			if (codigoIdentificacion !== '') {
				const tipos = response.data
				const nombre = tipos.find(item => item.id === parseInt(codigoIdentificacion)).nombre
				nombre && setTipoIdentidadData({ label: titulo, value: nombre })
			}
		} catch (err) {
			setTipoIdentidadData(null)
		}
	}

	useEffect(() => {
		const loadData = async () => {
			if (props.personalData.idType.codigo === IdentificationTypeCode.DIMEX) {
				getTipoIdentificacion(catalogsEnumObj.TIPODIMEX.id, 'DIMEX', 'Tipo Dimex')
			}
			if (props.personalData.idType.codigo === IdentificationTypeCode.YISRO) {
				getTipoIdentificacion(catalogsEnumObj.TIPOYISRO.id, 'YISRO', 'TIPO YÍS RÖ')
			}
		}
		loadData()
	}, [props.identification])

	return (
		<Card>
			<CardBody>
				<CardTitle>
					{t('estudiantes>expediente>info_gen>info_gen>datos_personales>titulo', 'Datos personales')}
				</CardTitle>
				<Form>
					<Row>
						{/*
            <Col sm='12'>
              
              <FormGroup>
                {props.label
                  ? (
                    <Label>{t('estudiantes>expediente>info_gen>info_gen>datos_personales>nombre', 'Nombre')}</Label>
                    )
                  : (
                    <RequiredLabel>{t('estudiantes>expediente>info_gen>info_gen>datos_personales>nombre', 'Nombre')}</RequiredLabel>
                    )}
                <Input
                  type='text'
                  name='nombre'
                  value={props.personalData.nombre}
                  disabled={props.disabled}
                  invalid={errorFields.Nombre}
                  onChange={props.handleChange}
                />
                <FormFeedback>
                  {errorMessages.Nombre}
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                {props.label
                  ? (
                    <Label>{t('estudiantes>expediente>info_gen>info_gen>datos_personales>apellido_1', 'Primer apellido')}</Label>
                    )
                  : (
                    <RequiredLabel>
                    {t('estudiantes>expediente>info_gen>info_gen>datos_personales>apellido_1', 'Primer apellido')}
                  </RequiredLabel>
                    )}
                <Input
                  type='text'
                  name='primerApellido'
                  value={props.personalData.primerApellido}
                  disabled={props.disabled}
                  invalid={errorFields.PrimerApellido}
                  onChange={props.handleChange}
                />
                <FormFeedback>
                  {errorMessages.PrimerApellido}
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                <Label>{t('estudiantes>expediente>info_gen>info_gen>datos_personales>apellido_2', 'Segundo apellido')}</Label>
                <Input
                  type='text'
                  name='segundoApellido'
                  value={props.personalData.segundoApellido}
                  onChange={props.handleChange}
                  disabled={props.disabled}
                />
              </FormGroup>
            </Col>
            */}

						{!isEmpty(tipoIdentidadData) && (
							<Col sm='12'>
								<FormGroup>
									<Label>{tipoIdentidadData.label}</Label>
									<Input type='text' value={tipoIdentidadData.value} disabled={props.disabled} />
								</FormGroup>
							</Col>
						)}

						<Col sm='12'>
							<FormGroup>
								<Label>
									{t('estudiantes>expediente>info_gen>datos_adicionales>conocido', 'Conocido como')}
								</Label>
								<Input
									type='text'
									name='conocidoComo'
									value={props.personalData.conocidoComo}
									onChange={props.handleChange}
									disabled
								/>
							</FormGroup>
						</Col>
						<Col sm='12'>
							<FormGroup>
								<Label>
									{t(
										'estudiantes>expediente>info_gen>datos_adicionales>genero',
										'Identidad de género'
									)}
								</Label>
								<SelectCatalogo
									components={{ Input: CustomSelectInput }}
									className='react-select'
									classNamePrefix='react-select'
									/* options={props.selects.genderTypes.map((item) => {
                    return { ...item, label: item.nombre, value: item.id };
                  })} */
									catalogo='genderTypes'
									placeholder=''
									value={props.personalData.genero}
									onChange={data => {
										props.handleChange(data, 'genero')
									}}
									isDisabled={!props.editable}
								/>
							</FormGroup>
						</Col>
						<Col sm='12'>
							<FormGroup>
								<Label>
									{t('estudiantes>expediente>info_gen>info_gen>datos_personales>sexo', 'Sexo')}
								</Label>
								<Select
									components={{ Input: CustomSelectInput }}
									className='react-select'
									classNamePrefix='react-select'
									options={props.selects.sexoTypes.map(item => ({
										...item,
										label: item.nombre,
										value: item.id
									}))}
									placeholder=''
									value={props.personalData.sexo}
									onChange={data => {
										props.handleChange(data, 'sexo')
									}}
									isDisabled
								/>
								<FormFeedbackSpan>{errorMessages.SexoId}</FormFeedbackSpan>
							</FormGroup>
						</Col>
						<Col sm='12'>
							<FormGroup>
								{props.label ? (
									<Label>
										{t(
											'estudiantes>expediente>info_gen>info_gen>datos_personales>nacimiento',
											'Fecha de nacimiento'
										)}
									</Label>
								) : (
									<RequiredLabel>
										{t(
											'estudiantes>expediente>info_gen>info_gen>datos_personales>nacimiento',
											'Fecha de nacimiento'
										)}
									</RequiredLabel>
								)}
								<Input
									type='text'
									name='fechaDeNacimiento'
									value={props.personalData.fechaDeNacimiento}
									disabled
									onChange={data => {
										props.handleChange(data, 'sexo')
									}}
									invalid={errorFields.FechaDeNacimiento}
								/>
								<FormFeedback>{errorMessages.FechaDeNacimiento}</FormFeedback>
							</FormGroup>
						</Col>
						<Col sm='12'>
							<FormGroup>
								<Label>
									{t(
										'estudiantes>expediente>info_gen>info_gen>datos_personales>edad',
										'Edad cumplida'
									)}
								</Label>
								<Input name='id' value={props.personalData.edad} disabled invalid={errorFields.Edad} />
								<FormFeedback>{errorMessages.Edad}</FormFeedback>
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
export default PersonalDataForm
