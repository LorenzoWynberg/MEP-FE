import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Row, Col, Input } from 'reactstrap'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { getCatalogs } from 'Redux/selects/actions'
import { useActions } from 'Hooks/useActions'
import { catalogsEnum } from 'Utils/catalogsEnum'
import { calculateAge } from 'Utils/years'
import { useTranslation } from 'react-i18next'

type FormProps = {
	data: any
	isVerify: any
}

const RegistroFormPreview: React.FC<FormProps> = props => {
	const { t } = useTranslation()
	const { data, isVerify } = props
	const [dataForm, setDataForm] = useState<any>({})

	const actions = useActions({
		getCatalogs
	})

	const state = useSelector((store: any) => {
		return {
			selects: store.selects
		}
	})
	React.useEffect(() => {
		const fetch = async () => {
			await actions.getCatalogs(40)
		}
		fetch()
	}, [])

	useEffect(() => {
		if (isVerify) {
			let _data = { ...data, edad: calculateAge(data.fechaNacimiento) }

			data?.datos?.forEach(item => {
				const typeCat = catalogsEnum.filter(x => x.id === item.catalogoId)
				const selected = state.selects[typeCat[0].name].filter(x => x.id === item.elementoId)
				let _obj = {}
				switch (typeCat[0].name) {
					case 'nationalities':
						_obj = {
							nationality: selected[0]
						}
						break
					case 'genderTypes':
						_obj = {
							genero: selected[0]
						}
						break
					case 'sexoTypes':
						_obj = {
							sexo: selected[0]
						}
						break
					case 'tipoDimex':
						_obj = {
							tipoDimex: selected[0]
						}
						break
					case 'idTypes':
						_obj = {
							type_identification: selected[0].nombre,
							tipoIdentificacionId: selected[0].id
						}
						break
				}

				_data = { ..._data, ..._obj }
			})
			setDataForm(_data)
		} else {
			setDataForm(data)
		}
	}, [data])

	return (
		<div>
			<Form>
				<Row>
					<Col md={12}>
						<FormGroup>
							<Label>
								{t(
									'configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>tipo_identificacion',
									'Tipo de identificación'
								)}
							</Label>
							<Input
								name='type_identification'
								autoComplete='off'
								readOnly
								value={dataForm?.type_identification}
							/>
						</FormGroup>
					</Col>

					{dataForm?.tipoIdentificacionId === 3 && (
						<Col md={6}>
							<FormGroup>
								<Label>{t('general>label>tipo_dimex', 'Tipo DIMEX')}</Label>
								<Input
									name='tipoDimex'
									autoComplete='off'
									readOnly
									value={dataForm?.tipoDimex?.nombre}
								/>
							</FormGroup>
						</Col>
					)}
					{dataForm.tipoIdentificacionId != 4 ? (
						<Col md={6}>
							<FormGroup>
								<Label>
									{t(
										'configuracion>centro_educativo>ver_centro_educativo>asignar_director>asignar_director>numero_identificacion',
										'Número de identificación'
									)}
									{dataForm?.tipoIdentificacionId === 3 && ' de DIMEX'}
								</Label>
								<Input
									name='identificacion'
									autoComplete='off'
									readOnly
									value={dataForm?.identificacion}
								/>
							</FormGroup>
						</Col>
					) : (
						<Col md={6}>
							<FormGroup>
								<Label>{t('general>label>tipo_yisro', 'Tipo de Yís Rö')}</Label>
								<Input
									name='tipoYisro'
									autoComplete='off'
									readOnly
									value={dataForm?.tipoYisro?.nombre}
								/>
							</FormGroup>
						</Col>
					)}
					<Col md={dataForm?.tipoIdentificacionId === 3 ? 12 : 6}>
						<FormGroup>
							<Label>
								{t(
									'configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>nacionalidad',
									'Nacionalidad'
								)}
							</Label>
							<Input
								name='nationality'
								autoComplete='off'
								readOnly
								value={dataForm?.nationality?.nombre}
							/>
						</FormGroup>
					</Col>
					<Col md={12}>
						<FormGroup>
							<Label>{t(' dir_regionales>col_nombre', 'Nombre')}</Label>
							<Input name='nombre' autoComplete='off' readOnly value={dataForm?.nombre} />
						</FormGroup>
					</Col>
					<Col md={6}>
						<FormGroup>
							<Label>
								{t(
									'configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>primer_apellido',
									'Primer apellido'
								)}
							</Label>
							<Input name='primerApellido' autoComplete='off' readOnly value={dataForm?.primerApellido} />
						</FormGroup>
					</Col>
					<Col md={6}>
						<FormGroup>
							<Label>
								{t(
									'configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>segundo_apellido',
									'Segundo apellido'
								)}
							</Label>
							<Input
								name='segundoApellido'
								autoComplete='off'
								readOnly
								value={dataForm?.segundoApellido}
							/>
						</FormGroup>
					</Col>
					<Col md={12}>
						<FormGroup>
							<Label>{t('buscador_ce>ver_centro>centro_educativo>conocido_como', 'Conocido como')}</Label>
							<Input name='conocidoComo' autoComplete='off' readOnly value={dataForm?.conocidoComo} />
						</FormGroup>
					</Col>

					<Col md={6}>
						<FormGroup>
							<Label>{t('estudiantes>buscador_per>col_fecha_naci', 'Fecha de nacimiento')}</Label>
							<Input
								name='fechaNacimiento'
								autoComplete='off'
								readOnly
								value={moment(dataForm?.fechaNacimiento).format('DD/MM/YYYY')}
							/>
						</FormGroup>
					</Col>
					<Col md={6}>
						<FormGroup>
							<Label>{t('estudiantes>buscador_per>info_gen>edad', 'Edad')}</Label>
							<Input name='edad' autoComplete='off' readOnly value={dataForm?.edad} />
						</FormGroup>
					</Col>
					<Col md={6}>
						<FormGroup>
							<Label>{t('estudiantes>expediente>hogar>miembros_hogar>agregar>sexo', 'Sexo')}</Label>
							<Input name='sexo' autoComplete='off' readOnly value={dataForm?.sexo?.nombre} />
						</FormGroup>
					</Col>
					<Col md={6}>
						<FormGroup>
							<Label>
								{t(
									'estudiantes>expediente>hogar>miembros_hogar>agregar>identidad_gen',
									'Identidad de género'
								)}
							</Label>
							<Input name='genero' autoComplete='off' readOnly value={dataForm?.genero?.nombre} />
						</FormGroup>
					</Col>
				</Row>
			</Form>
		</div>
	)
}

const Form = styled.form`
	margin-bottom: 20px;
`
const FormGroup = styled.div`
	margin-bottom: 10px;
	position: relative;
`
const Label = styled.label`
	color: #000;
	display: block;
`
export default RegistroFormPreview
