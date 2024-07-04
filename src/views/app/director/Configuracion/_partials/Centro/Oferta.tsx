import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import Loader from 'components/LoaderContainer'
import SimpleModal from 'Components/Modal/simple'
import ContentTab from 'Components/Tab/Content'
import HeaderTab from 'Components/Tab/Header'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import useNotification from 'Hooks/useNotification'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Card, CardBody, Row } from 'reactstrap'
import styled from 'styled-components'

import MallasCurriculares from '../../../ExpedienteCentroEducativo/_partials/ofertas/MallasCurriculares'
import OfertasAutorizadas from './OfertasAutorizadas'
import useOferta from './useOferta'

const Oferta = props => {
	const { t } = useTranslation()
	const optionsTab = [
		t(
			'configuracion>centro_educativo>ver_centro_educativo>ofertas_autorizadas',
			'Ofertas autorizadas'
		),
		t('menu>configuracion>mallas', 'Mallas curriculares')
	]

	const [snackBarContent, setSnackBarContent] = useState({
		variant: 'error',
		msg: 'something failed'
	})
	const [snackBar, handleClick] = useNotification()
	const [activeTab, setActiveTab] = useState(0)
	const [openModalError, setOpenModalError] = useState(false)
	const [dataModalError, setDataModalError] = useState({
		TYPE: 1,
		MSG: '',
		data: []
	})

	const handleSnackbar = (variant, msg) => {
		setSnackBarContent({ variant, msg })
		handleClick()
	}

	const handleError = data => {
		const message = JSON.parse(data)
		setDataModalError(message)
		setOpenModalError(true)
	}

	const ofertaHook = useOferta({ handleSnackbar, handleError })

	const {
		showForm,
		toggleForm,
		loadOfertaModalidadServicioByInstitucionId,
		ofertaModalidadServicioList,
		loading,
		onAgregarEvent
	} = ofertaHook

	const state = useSelector<any>((store: any) => {
		return {
			selects: store.selects,
			ofertasModelos: store.ofertasInstitucion.modelOffers,
			ofertas: store.ofertas.ofertas,
			modalidades: store.modalidades.modalidades,
			servicios: store.servicios.servicios,
			niveles: store.niveles.niveles,
			especialidades: store.especialidades.especialidades,
			loaded: store.ofertasInstitucion.loaded,
			loading: store.ofertasInstitucion.loading,
			currentInstitutionOffers: store.ofertasInstitucion.currentInstitutionModelOffers,
			currentInstitution: store.configuracion.currentInstitution,
			anioSelected: store.authUser.selectedActiveYear
		}
	})

	const { hasAddAccess = true, hasEditAccess = true, hasDeleteAcces = true } = props
	
	useEffect(() => {
		loadOfertaModalidadServicioByInstitucionId()
	}, [state.anioSelected])

	const columnas = [
		{
			Header: t('configuracion>centro_educativo>ver_centro_educativo>oferta', 'Oferta'),
			column: 'oferta',
			accessor: 'oferta'
		},
		{
			Header: t(
				'configuracion>centro_educativo>ver_centro_educativo>ofertas_autorizadas>editar>modalidad',
				'Modalidad'
			),
			column: 'modalidad',
			accessor: 'modalidad'
		},
		{
			Header: t(
				'configuracion>centro_educativo>ver_centro_educativo>ofertas_autorizadas>editar>servicio',
				'Servicio'
			),
			column: 'servicio',
			accessor: 'servicio'
		},
		{
			Header: t(
				'configuracion>centro_educativo>agregar>codigo_presupuestario',
				'Código presupuestario'
			),
			column: 'codigoPresu',
			accessor: 'codigoPresu'
		},
		{
			Header: t(
				'configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>estado',
				'Estado'
			),
			column: 'estado',
			accessor: 'estadoP'
		},{
			Header: 'Año educativo',
			column: 'nombreAnioEducativo',
			accessor: 'nombreAnioEducativo'
		},
		{
			Header: t('general>acciones', 'Acciones'),
			column: 'acciones',
			accessor: 'acciones'
		}
	]

	return (
		<div>
			<HeaderTab options={optionsTab} activeTab={activeTab} setActiveTab={setActiveTab} />
			<ContentTab activeTab={activeTab} numberId={activeTab}>
				{activeTab === 0 && (
					<>
						{snackBar(snackBarContent.variant, snackBarContent.msg)}
						<h4>
							{t(
								'configuracion>centro_educativo>ver_centro_educativo>ofertas_autorizadas',
								'Ofertas autorizadas'
							)}
						</h4>
						<br />
						{!showForm ? (
							<div>
								{/*  <section style={{ textAlign: 'right' }}>
                    <Button size='lg' className='top-right-button' color='primary' onClick={onAgregarEvent}>{t('general>agregar', 'Agregar')}</Button>
                  </section> */}
								<TableReactImplementation
									showAddButton
									onSubmitAddButton={onAgregarEvent}
									columns={columnas}
									data={ofertaModalidadServicioList}
									autoResetPage={false}
								/>
							</div>
						) : (
							<div>
								<NavigationContainer
									onClick={e => {
										toggleForm()
									}}
								>
									<ArrowBackIosIcon />
									<h4>{t('edit_button>regresar', 'REGRESAR')}</h4>
								</NavigationContainer>
								<Card>
									<CardBody>
										<OfertasAutorizadas
											hasAddAccess={hasAddAccess}
											hookOptions={ofertaHook}
										/>
									</CardBody>
								</Card>
							</div>
						)}
					</>
				)}
				{activeTab === 1 && (
					<MallasCurriculares institutionId={state.currentInstitution.id} />
				)}
			</ContentTab>
			{loading && <Loader />}

			<SimpleModal
				openDialog={openModalError}
				onConfirm={() => setOpenModalError(false)}
				onClose={() => setOpenModalError(false)}
				txtBtn='Cerrar'
				title='Niveles en uso'
				btnCancel={false}
			>
				<ContainerError>
					<h5>{dataModalError.MSG}</h5>
					<hr />
					<div>
						{dataModalError.data.map((e, i) => {
							return (
								<Row key={i}>
									{e.NivelNombre +
										(e.EspecialidadNombre ? ' - ' + e.EspecialidadNombre : '')}
								</Row>
							)
						})}
					</div>
				</ContainerError>
			</SimpleModal>
		</div>
	)
}

const NavigationContainer = styled.span`
	display: flex;
	cursor: pointer;
`
const ContainerError = styled.div`
	width: 600px;
`

export default Oferta
