import SearchIcon from '@material-ui/icons/Search'
import ContentTab from 'Components/Tab/Content'
import HeaderTab from 'Components/Tab/Header'
import { useActions } from 'Hooks/useActions'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { deleteSubsidio } from 'Redux/beneficios/actions'
import { getCircuitos, getInstitucion, getRegionales } from 'Redux/configuracion/actions'
import { getCatalogs } from 'Redux/selects/actions'
import { catalogsEnumObj } from 'Utils/catalogsEnum'
import { getInstitutionStates } from '../../../../redux/institucion/actions'
import InformationCard from './_partials/InformationCard'
import AssignmentIcon from '@material-ui/icons/Assignment'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import TwoPeople from '../../../../assets/icons/TwoPeople'
import HouseIcon from '@material-ui/icons/House'
import SquareFoot from '../../../../assets/icons/SquareFoo'

const Buscador = React.lazy(() => import('./_partials/Centro/Buscador'))
const Inicio = React.lazy(() => import('./_partials/Centro/Inicio'))
const General = React.lazy(() => import('./_partials/Centro/General'))
const Ubicacion = React.lazy(() => import('./_partials/Centro/UbicacionSaber'))
const Oferta = React.lazy(() => import('./_partials/Centro/Oferta'))
const AsignarDirector = React.lazy(
  () => import('./_partials/Centro/AsignarDirector')
)
const Sedes = React.lazy(() => import('./_partials/Centro/Sedes'))
const AdministracionAuxiliar = React.lazy(
  () => import('./_partials/Centro/AdministracionAuxiliar/index')
)

const Centro = (props) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(props.activeTab)
  const [currentCenter, setCurrentCenter] = useState({})
  const actions = useActions({
    getInstitutionStates,
    getInstitucion,
    getCircuitos,
    getRegionales,
    getCatalogs,
    deleteSubsidio
  })
  useEffect(() => {
    if (props.match.params.centroId) {
      const loadData = async () => {
        await actions.getCircuitos()
        await actions.getRegionales()
        await actions.getCatalogs(catalogsEnumObj.TIPOCE.id)
      }
      actions.getInstitucion(props.match.params.centroId)
      loadData()
    }
    actions.getInstitutionStates()
  }, [props.match.params.centroId])
  const state = useSelector((store) => {
    return {
      identification: store.identification
    }
  })
  const {
    hasAddAccess = true,
    hasEditAccess = true,
    hasDeleteAccess = true
  } = props
  const optionsTab = [
    {
      icon: (
        <span style={{ display: 'flex' }}>
          {t('configuracion>centro_educativo>ver_centro_educativo>busqueda', 'Búsqueda')}
          <SearchIcon />
        </span>
      )
    },
    {
      title: t('configuracion>centro_educativo>ver_centro_educativo>inicio', 'Inicio'),
      icon: <SquareFoot style={{ fontSize: '4rem', color: 'white' }} />,
      showIcon: false
    },
    {
      title: t('configuracion>centro_educativo>ver_centro_educativo>informacion_general', 'Información general'),
      icon: <AssignmentIcon style={{ fontSize: '4rem', color: 'white' }} />,
      showIcon: false
    },
    {
      title: t('configuracion>centro_educativo>ver_centro_educativo>ubicacion', 'Ubicación'),
      icon: <BookmarkIcon style={{ fontSize: '4rem', color: 'white' }} />,
      showIcon: false
    },
    {
      title: t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa', 'Oferta educativa'),
      icon: <i className='fas fa-tools' style={{ fontSize: '3rem', color: 'white' }} />,
      showIcon: false
    },
    {
      title: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director', 'Asignar director'),
      icon: <AccountCircleIcon style={{ fontSize: '4rem', color: 'white' }} />,
      showIcon: false
    },
    {
      title: t('configuracion>centro_educativo>ver_centro_educativo>sedes', 'Sedes'),
      icon: <HouseIcon style={{ fontSize: '4rem', color: 'white' }} />,
      showIcon: false
    },
    {
      title: t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar', 'Administración auxiliar'),
      icon: <TwoPeople style={{ fontSize: '4rem', color: 'white' }} />,
      showIcon: false
    }
  ]
  const handleDeleteSubsidio = async (ids) => {
    const response = await actions.deleteSubsidio(
      ids,
      state.identification.data.id
    )
    return response
  }
  return (
    <div>
      {activeTab > 0 && (
        <>
          <InformationCard />
          <HeaderTab
            options={optionsTab}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            marginTop={4}
          />
        </>
      )}
      <ContentTab activeTab={activeTab} numberId={activeTab}>
        {
          {
            0: (
              <Buscador
                {...props}
                setActiveTab={setActiveTab}
                hasAddAccess={hasAddAccess}
                hasEditAccess={hasEditAccess}
                hasDeleteAccess={hasDeleteAccess}
              />
            ),
            1: (
              <Inicio
                {...props}
                optionsTab={optionsTab}
                setActiveTab={setActiveTab}
                hasAddAccess={hasAddAccess}
                hasEditAccess={hasEditAccess}
                hasDeleteAccess={hasDeleteAccess}
              />
            ),
            2: (
              <General
                {...props}
                setActiveTab={setActiveTab}
                hasAddAccess={hasAddAccess}
                hasEditAccess={hasEditAccess}
                hasDeleteAccess={hasDeleteAccess}
              />
            ),
            3: (
              <Ubicacion
                {...props}
                setActiveTab={setActiveTab}
                hasAddAccess={hasAddAccess}
                hasEditAccess={hasEditAccess}
                hasDeleteAccess={hasDeleteAccess}
              />
            ),
            4: (
              <Oferta
                {...props}
                hasAddAccess={hasAddAccess}
                hasEditAccess={hasEditAccess}
                hasDeleteAccess={hasDeleteAccess}
              />
            ),
            5: (
              <AsignarDirector
                {...props}
                hasAddAccess={hasAddAccess}
                hasEditAccess={hasEditAccess}
                hasDeleteAccess={hasDeleteAccess}
              />
            ),
            6: (
              <Sedes
                {...props}
                handleDeleteSubsidio={handleDeleteSubsidio}
              />
            ),
            7: (
              <AdministracionAuxiliar
                {...props}
                hasAddAccess={hasAddAccess}
                hasEditAccess={hasEditAccess}
                hasDeleteAccess={hasDeleteAccess}
              />
            ),
            8: (
              <Oferta
                identidad
                {...props}
                hasAddAccess={hasAddAccess}
                hasEditAccess={hasEditAccess}
                hasDeleteAccess={hasDeleteAccess}
              />
            )
          }[activeTab]
        }
      </ContentTab>
    </div>
  )
}

export default Centro
