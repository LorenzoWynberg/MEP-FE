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
	Card,
	CardBody,
	CardTitle,
	CustomInput
} from 'reactstrap'
import { useTranslation } from 'react-i18next'
import SelectCatalogo from 'Components/SelectCatalogo'

const listSexo = [
	{ value: 1, label: 'Masculino', key: 1 },
	{ value: 2, label: 'Femenino', key: 2 }
]
const PersonalDataForm = props => {
	const { t } = useTranslation()
	return (
		<Card>
			<CardBody>
				<CardTitle>
					{t(
						'estudiantes>expediente>info_gen>datos_adicionales>titulo',
						'Datos adicionales'
					)}
				</CardTitle>
				<Form>
					<Row>
						{/* Este code se comenta hata que se resuelva el tema con los estados de los estudiantes */}
						{false && (
							<Col sm="12">
								<FormGroup>
									<Label>
										{' '}
										{t(
											'estudiantes>expediente>info_gen>datos_adicionales>estado',
											'Estado de estudiante'
										)}{' '}
									</Label>
									<Select
										components={{
											Input: CustomSelectInput
										}}
										className="react-select"
										classNamePrefix="react-select"
										options={listSexo}
										placeholder=""
										value={{
											value: 1,
											label: 'Hombre',
											key: 1
										}}
										isDisabled={!props.editable}
									/>
								</FormGroup>
							</Col>
						)}

						<Col sm="12">
							<FormGroup>
								<Label>
									{t(
										'estudiantes>expediente>info_gen>datos_adicionales>estatus_migratorio',
										'Estatus migratorio'
									)}
								</Label>
								<SelectCatalogo
									components={{ Input: CustomSelectInput }}
									className="react-select"
									classNamePrefix="react-select"
									/* options={props.selects.migrationTypes.map((item) => {
                    return { ...item, label: item.nombre, value: item.id };
                  })} */
									catalogo="migrationTypes"
									placeholder=""
									value={props.personalData.migracionStatus}
									onChange={data => {
										props.handleChange(data, 'migracionStatus')
									}}
									isDisabled={!props.editable || props.disableMigrationStatus}
								/>
							</FormGroup>
						</Col>
						<Col sm="12">
							<FormGroup>
								<Label>
									{t(
										'estudiantes>expediente>info_gen>datos_adicionales>etnia_ind',
										'Pueblo indígena'
									)}
								</Label>
								<SelectCatalogo
									components={{ Input: CustomSelectInput }}
									className="react-select"
									classNamePrefix="react-select"
									/* options={[{label: t('general>sin_select','Sin seleccionar'), value: null},...props.selects.etnias.map((item) => {
                    return { ...item, label: item.nombre, value: item.id };
                  })]} */
									catalogo="etnias"
									placeholder=""
									value={props.personalData.etnia}
									onChange={data => {
										props.handleChange(data, 'etnia')
									}}
									isDisabled={!props.editable}
								/>
							</FormGroup>
						</Col>
						<Col sm="12">
							<FormGroup>
								<Label>
									{t(
										'estudiantes>expediente>info_gen>datos_adicionales>lengua_ind',
										'Lengua indígena'
									)}
								</Label>
								<SelectCatalogo
									components={{ Input: CustomSelectInput }}
									className="react-select"
									classNamePrefix="react-select"
									/* options={[{label: t('general>sin_select','Sin seleccionar'), value: null},...props.selects.lenguasIndigenas.map((item) => {
                    return { ...item, label: item.nombre, value: item.id };
                  })]} */
									catalogo="lenguasIndigenas"
									placeholder=""
									value={props.personalData.lenguaIndigena}
									onChange={data => {
										props.handleChange(data, 'lenguaIndigena')
									}}
									isDisabled={!props.editable}
								/>
							</FormGroup>
						</Col>

						<Col sm="12">
							<FormGroup>
								<Label>
									{t(
										'estudiantes>expediente>info_gen>datos_adicionales>lengua_senias',
										'Lengua de señas costarricense (LESCO)'
									)}
								</Label>
								<div>
									<CustomInput
										type="radio"
										id="exampleCustomInline"
										inline
										label={t('general>si', 'Si')}
										checked={props.personalData.lesco}
										onClick={() => {
											if (props.editable) {
												props.handleChange({
													target: {
														value: true,
														name: 'lesco'
													}
												})
											}
										}}
									/>
									<CustomInput
										type="radio"
										id="exampleCustomInline2"
										inline
										label={t('general>no', 'No')}
										checked={!props.personalData.lesco}
										onClick={() => {
											if (props.editable) {
												props.handleChange({
													target: {
														value: false,
														name: 'lesco'
													}
												})
											}
										}}
									/>
								</div>
							</FormGroup>
						</Col>
						<Col sm="12">
							<FormGroup>
								<Label>
									{t(
										'estudiantes>expediente>info_gen>datos_adicionales>lengua_mater',
										'Idioma materno'
									)}
								</Label>
								<SelectCatalogo
									components={{ Input: CustomSelectInput }}
									className="react-select"
									classNamePrefix="react-select"
									/* options={props.selects.lenguasMaternas.map((item) => {
                    return { ...item, label: item.nombre, value: item.id };
                  })} */
									catalogo="lenguasMaternas"
									placeholder=""
									value={props.personalData.lenguaMaterna}
									onChange={data => {
										props.handleChange(data, 'lenguaMaterna')
									}}
									isDisabled={!props.editable}
								/>
							</FormGroup>
						</Col>
						<Col sm="12">
							<FormGroup>
								<Label>
									{t(
										'estudiantes>expediente>info_gen>datos_adicionales>estado_civil',
										'Estado civil'
									)}
								</Label>
								<SelectCatalogo
									components={{ Input: CustomSelectInput }}
									className="react-select"
									classNamePrefix="react-select"
									/* options={props.selects.estadosCiviles.map((item) => {
                    return { ...item, label: item.nombre, value: item.id };
                  })} */
									catalogo="estadosCiviles"
									placeholder=""
									value={props.personalData.estadoCivil}
									onChange={data => {
										props.handleChange(data, 'estadoCivil')
									}}
									isDisabled={!props.editable}
								/>
							</FormGroup>
						</Col>
					</Row>
				</Form>
			</CardBody>
		</Card>
	)
}
export default PersonalDataForm
