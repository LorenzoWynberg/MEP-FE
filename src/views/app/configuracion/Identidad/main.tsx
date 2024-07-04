import React, { useEffect } from 'react'
import styled from 'styled-components'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'
import directorItems from 'Constants/directorMenu'
import AppLayout from 'Layout/AppLayout'
import moment from 'moment'
import { useSelector } from 'react-redux'
import {
  clearWizardDataStore,
  clearWizardNavDataStore
} from 'Redux/identidad/actions'
import './style.scss'

import { cleanStudent } from '../../../../redux/identidad/actions'
import { useActions } from 'Hooks/useActions'
import { Helmet } from 'react-helmet'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { useTranslation } from 'react-i18next'

type IProps = {
	hasAddAccess: boolean
	hasEditAccess: boolean
	hasDeleteAccess: boolean
}

type IState = {
	selects: any
}

const RegistrarPersona = React.lazy(() => import('./RegistrarPersona'))
const CambiosIdentidad = React.lazy(() => import('./CambiosIdentidad'))
const HistoricoIdentidad = React.lazy(() => import('./HistoricoIdentidad'))
const Imprimir = React.lazy(() => import('./Imprimir'))

const Main: React.FC<IProps> = (props) => {
  const { t } = useTranslation()

  console.log('Render')
  const actions = useActions({
    cleanStudent,
    clearWizardDataStore,
    clearWizardNavDataStore
  })
  const [activeTab, setActiveTab] = React.useState<number>(0)
  const [currentUser, setCurrentUser] = React.useState<any>(null)
  const {
    hasAddAccess = true,
    hasEditAccess = true,
    hasDeleteAccess = true
  } = props
  const [print, setPrint] = React.useState(undefined)
  const [options, setOptions] = React.useState([
    t('estudiantes>registro_matricula>matricula_estudian>buscar>registrar_persona', 'Registrar persona'),
    t('estudiantes>indentidad_per>aplicar_camb>titulo', 'Aplicar cambios a la identidad'),
    t('estudiantes>indentidad_per>historico_camb>titulo', 'Histórico de cambios a la identidad'),
    t('estudiantes>indentidad_per>imp_docs', 'Imprimir documentos')
  ])
  const { currentRoleOrganizacion, currentInstitution } = useSelector(
    (state: any) => state.authUser
  )

  useEffect(() => {
    if (print !== undefined) {
      window.print()
    }
  }, [print])

  useEffect(() => {
    const aux = [
      t('estudiantes>registro_matricula>matricula_estudian>buscar>registrar_persona', 'Registrar persona'),
      t('estudiantes>indentidad_per>aplicar_camb>titulo', 'Aplicar cambios a la identidad'),
      t('estudiantes>indentidad_per>historico_camb>titulo', 'Histórico de cambios a la identidad'),
      t('estudiantes>indentidad_per>imp_docs', 'Imprimir documentos')
    ]

    if (!hasAddAccess) {
      aux.splice(0, 1)
    }

    if (!hasEditAccess) {
      aux.splice(1, 1)
    }

    setOptions(aux)
  }, [hasAddAccess, hasEditAccess, t])

  const state = useSelector((store: IState) => {
    return {
      selects: store.selects
    }
  })

  const handlePrint = async (user: any) => {
    const datos = user.datos

    const identificacion =
      datos.length > 0
        ? datos.find(
          (item: any) => item.nombreCatalogo === 'Tipo de Identificación'
        )
        : ''
    const userIdentification = state.selects.idTypes.find(
      (item: any) => item.id === identificacion.elementoId
    )

    const nacionalidad =
      datos.length > 0
        ? datos.find((item: any) => item.nombreCatalogo === 'Nacionalidad')
        : ''
    const userNacionalidad = state.selects.nationalities.find(
      (item: any) => item.id === nacionalidad.elementoId
    )

    const institucionData: any = await axios.get(
      `${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/GetById/${currentInstitution?.id}`
    )
    const directorData: any = await axios.get(
      `${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/GetDatosDirector/${currentInstitution?.id}`
    )
    setCurrentUser({
      ...user,
      userIdentificacion: userIdentification.nombre,
      userNacionalidad: userNacionalidad.nombre,
      director: `${directorData?.data?.nombre} ${directorData?.data?.primerApellido}  ${directorData?.data?.segundoApellido}`,
      provincia: institucionData?.data?.provincia,
      circuito: institucionData?.data?.circuitoNombre,
      correoInstitucional: institucionData?.data?.correoInstitucional,
      telefonoCentroEducativo: institucionData?.data?.telefonoCentroEducativo
    })
    setPrint(!print)
  }

  return (
    <AppLayout items={directorItems}>
      <Helmet>
        <title>Identidad de la persona</title>
      </Helmet>
      <Wrapper>
        <Title>{t('menu>estudiantes>identidad_persona', 'Identidad de la persona')}</Title>
        <div id='tabs-identidad'>
          <HeaderTab
            options={options}
            activeTab={activeTab}
            setActiveTab={async (index: number) => {
              await actions.cleanStudent()
              await actions.clearWizardDataStore()
              await actions.clearWizardNavDataStore()
              setActiveTab(index)
            }}
          />

          <ContentTab activeTab={activeTab} numberId={activeTab}>
            {hasAddAccess && hasEditAccess && (
              <>
                {
                  {
                    0: <RegistrarPersona handlePrint={handlePrint} />,
                    1: <CambiosIdentidad />,
                    2: <HistoricoIdentidad />,
                    3: <Imprimir handlePrint={handlePrint} />
                  }[activeTab]
                }
              </>
            )}
            {hasAddAccess && !hasEditAccess && (
              <>
                {
                  {
                    0: <RegistrarPersona handlePrint={handlePrint} />,
                    1: <HistoricoIdentidad />,
                    2: <Imprimir handlePrint={handlePrint} />
                  }[activeTab]
                }
              </>
            )}
            {!hasAddAccess && hasEditAccess && (
              <>
                {
                  {
                    0: <CambiosIdentidad />,
                    1: <HistoricoIdentidad />,
                    2: <Imprimir handlePrint={handlePrint} />
                  }[activeTab]
                }
              </>
            )}
          </ContentTab>
        </div>
        <div id='print-section'>
          <HeaderContainer>
            <HeaderSide>
              <img alt='Profile' height='50px'  src='/assets/img/LogoMepRep.jpg' />
            </HeaderSide>
            <HeaderCenter>
              <Parrafo>
                {t("reportes>institucional>ministro_educacion", "MINISTERIO DE EDUCACIÓN PÚBLICA")}
                <br />
                {currentUser?.provincia}
                <br />
                {currentUser?.circuito}
              </Parrafo>
              <Linea />
              {/* <Parrafo>
          Telefono:
        </Parrafo>
        <Parrafo>
          Correo institucional:
        </Parrafo> */}
              <Parrafo>
                {currentInstitution?.codigo + ' ' + currentInstitution?.nombre}
                <br />
                {t("dir_regionales>ver>tel", "Teléfono")}: {currentUser?.telefonoCentroEducativo}
                <br />
                {t('general>correo_institucional','Correo institucional')}: {currentUser?.correoInstitucional}
              </Parrafo>
            </HeaderCenter>
            <HeaderSide>
            <img
              alt='saber'
              height='60px'
              src='/assets/img/saber-logo.svg'
              />
            </HeaderSide>
          </HeaderContainer>
          <div style={{ margin: '50px 0' }}>
            <h2 className='text-center'>
              <strong>{t('imprimir_documento>constancia','CONSTANCIA')}</strong>
            </h2>
            <h3 className='text-center'>
              <strong>{t('imprimir_documento>registro_en_el_sistema','REGISTRO EN EL SISTEMA DE INFORMACIÓN')}</strong>
            </h3>
          </div>
          <p>
            {t('general>el','El')} <strong>{t("reportes>institucional>ministro_educacion", "MINISTERIO DE EDUCACIÓN PÚBLICA")}</strong> {t('imprimir_documento>hace_constar','hace constar que el día')}{' '}
            <strong>
              {moment(currentUser?.fechaInsercion).format('DD/MM/YYYY')}
            </strong>
            {t('imprimir_documento>se_registro_informacion',', se registró en el sistema de información Plataforma Ministerial, la información de la siguiente persona:')}
          </p>
          <p>
            {t('imprimir_documento>tipo_identificacion','TIPO DE INDENTIFICACIÓN')}:{' '}
            <strong>{currentUser?.userIdentificacion?.toUpperCase()}</strong>
          </p>
          <p>
            {t('imprimir_documento>numero_identificacion','NÚMERO DE IDENTIFICACIÓN')}:{' '}
            <strong>{currentUser?.identificacion?.toUpperCase()}</strong>
          </p>
          <p>
            {t("gestion_usuario>usuarios>name_info","NOMBRE")}: <strong>{currentUser?.nombre?.toUpperCase()}</strong>
          </p>
          <p style={{textTransform:'uppercase'}}>
            {t("configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>primer_apellido", "Primer apellido")}:{' '}
            <strong>{currentUser?.primerApellido?.toUpperCase()}</strong>
          </p>
          <p style={{textTransform:'uppercase'}}> 
            {t("configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>columna_segundo_apellido", "Segundo apellido")}:{' '}
            <strong>{currentUser?.segundoApellido?.toUpperCase()}</strong>
          </p>
          <p style={{textTransform:'uppercase'}}>
            {t("estudiantes>buscador_per>col_fecha_naci", "Fecha de nacimiento")}:{' '}
            <strong>
              {moment(currentUser?.fechaNacimiento).format('DD/MM/YYYY')}
            </strong>
          </p>
          <p style={{textTransform:'uppercase'}}>
            {t("configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>nacionalidad", "Nacionalidad")}:{' '}
            <strong>{currentUser?.userNacionalidad?.toUpperCase()}</strong>
          </p>
          <div style={{ marginTop: '100px' }}>
            <p>
              {t('imprimir_documento>se_expide','Se expide la presente el día')}{' '}
              <strong>{moment(new Date()).format('DD/MM/YYYY')}</strong> {t('imprimir_documento>en_la_provincia','en la provincia de')} <strong>{currentUser?.provincia}</strong>.
            </p>
           <div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
           </div>
            <div className='d-flex justify-content-around align-items-center'>
            <div className='text-center'>
                <p>{currentUser?.director?.toUpperCase()}</p>
                <p>
                  {currentRoleOrganizacion?.accessRole?.rolNombre?.toUpperCase()}
                </p>
                <p>
                  {currentRoleOrganizacion?.accessRole?.organizacionNombre?.toUpperCase()}
                </p>
              </div>
              <div className='text-center'>
                <p>{t('imprimir_documento>sello_centro_educativo','SELLO DE CENTRO EDUCATIVO')}</p>
              </div>  
            </div>
          </div>
        </div>
      </Wrapper>
    </AppLayout>
  )
}

const Wrapper = styled.div`
	
`

const Title = styled.h2`
	color: #000;
`

const Print = styled.div``

const PrintItem = styled.strong`
	color: #000;
`
const Parrafo = styled.p`
	font-size: 14px;
	line-height: auto;
	margin-top: 1rem;
	margin-bottom: 1rem;
`
const Linea = styled.hr`
	width: 100%;
	background-color: black;
	height: 1px;
	border: none;
	margin: 0;
`

const HeaderContainer = styled.div`
	display: flex;
	width: 100%;

	justify-content: center;
	text-align: center;
`
const HeaderSide = styled.div`
	display: flex;
	width: 20%;
	border: solid 1px;
	justify-content: center;
	justify-items: center;
	align-content: center;
	align-items: center;
`
const HeaderCenter = styled.div`
	display: flex;
	width: 60%;
	flex-direction: column;
	border-top: solid 1px;
	border-bottom: solid 1px;
	justify-content: center;
	justify-items: center;
	align-content: center;
	align-items: center;
`
export default Main
