import React, { useState, useEffect } from 'react'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'
import BeneficiosMEP from './_partials/beneficios/beneficiosMep'
import BeneficiosSinirube from './_partials/beneficios/beneficiosSinirube'
import { connect } from 'react-redux'

import { GetTypes, GetSubsidiosMEP, GetSubsidiosFilterMEP, GetDependencias } from 'Redux/beneficios/actions'
import moment from 'moment'
import './style.scss'
import withAuthorization from '../../../../Hoc/withAuthorization'

const BeneficiosMEPWithAuth = withAuthorization({
	id: 7,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Informacion de Beneficios',
	Seccion: 'MEP'
})(BeneficiosMEP)

const BeneficiosSinirubeWithAuth = withAuthorization({
	id: 8,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Informacion de Beneficios',
	Seccion: 'SINIRUBE'
})(BeneficiosSinirube)

const Expediente = props => {
	const { dataMEP, dataSINIRUBE, typesSubsidios, data, dependencias, errors, error, loading } = props
	const [activeTab, setActiveTab] = useState(0)
	const [listMep, setListMep] = useState([])
	const [totalRegitroMEP, setTotalRegitroMEP] = useState([])

	const optionsTab = ['MEP']

	useEffect(() => {
		if (dataMEP && dataMEP.entityList) {
			setListMep(
				dataMEP.entityList.map(item => {
					return {
						...item,
						periodo: moment().isBefore(item.fechaFinal) && moment().isAfter(item.fechaInicio) ? 'Si' : 'No'
					}
				})
			)
			setTotalRegitroMEP(dataMEP.totalCount)
		}
	}, [dataMEP])

	const handlePagination = async (pagina, cantidadPagina) => {
		await props.GetSubsidiosMEP(data.id, pagina, cantidadPagina)
	}

	const handleSearch = async (FilterText, cantidadPagina, pagina) => {
		return await props.GetSubsidiosFilterMEP(data.id, FilterText, pagina, cantidadPagina)
	}

	useEffect(() => {
		const fetch = async () => {
			await props.GetDependencias()
			await props.GetTypes()
			await props.GetSubsidiosMEP(data.id, 1, 10)
		}
		fetch()
	}, [])

	return (
		<>
			<h4>Información de beneficios</h4>
			<br />
			<HeaderTab options={optionsTab} activeTab={activeTab} setActiveTab={setActiveTab} />
			<ContentTab activeTab={activeTab} numberId={activeTab}>
				{
					{
						0: (
							<BeneficiosMEPWithAuth
								handlePagination={handlePagination}
								handleSearch={handleSearch}
								totalRegistros={totalRegitroMEP}
								loading={loading}
								data={listMep}
								data1={data}
								match={props.match}
								tipos={typesSubsidios}
								GetTypes={props.GetTypes}
								GetDependencias={props.GetDependencias}
								GetSubsidiosMEP={props.GetSubsidiosMEP}
								dependencias={dependencias}
							/>
						),
						1: <BeneficiosSinirubeWithAuth data={dataSINIRUBE} />
					}[activeTab]
				}
			</ContentTab>
		</>
	)
}

const mapStateToProps = reducers => {
	const { beneficios, identification } = reducers

	return {
		...beneficios,
		...identification
	}
}

const mapActionsToProps = {
	GetTypes,
	GetSubsidiosMEP,
	GetDependencias,
	GetSubsidiosFilterMEP
}

export default connect(mapStateToProps, mapActionsToProps)(Expediente)
