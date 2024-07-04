import React from 'react'

import InfoOrganizacion from './_partials/InfoOrganizacion'
import TablaMiembros from './_partials/TablaMiembros'
import Miembro from './_partials/Miembro'
import { useTranslation } from 'react-i18next'

const CentroPrivado = (props) => {
  const { t } = useTranslation()

  const { onlyView } = props

  return (
    <div>
      {!props.openCreateItem
        ? (
          <>
            <br />
            <br />
            <InfoOrganizacion
              titulo={t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>centros_educativos_privados', 'Centros educativos privados')}
              sendData={props.sendData}
              loadingOrganization={props.loadingOrganization}
              handleDataChange={props.handleDataChange}
              data={props.data}
              setEditableOrganizacion={props.setEditableOrganizacion}
              editableOrganizacion={props.editableOrganizacion}
            />
            <br />
            <br />
            <h2>{t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>representante_legal', 'Representante legal')}</h2>
            <br />
            <br />
            <TablaMiembros
              toggleAddNewModal={props.toggleAddNewModal}
              data={props.data}
              members={props.members}
              esPrivado
              activarInactivarMiembro={props.activarInactivarMiembro}
              setMember={props.setMember}
              editableMiembro={props.editableMiembro}
              incluyeInactivos={props.incluyeInactivos}
              setIncluyeInactivos={props.setIncluyeInactivos}
              onlyView={onlyView}
            />
          </>
          )
        : (
          <Miembro
            toggleAddNewModal={props.toggleAddNewModal}
            loadingMiembro={props.loadingMiembro}
            esPrivado
            sendMemberData={props.sendMemberData}
            setEditableMiembro={props.setEditableMiembro}
            editableMiembro={
						props.editableMiembro && props.hasEditAccess
					}
            onlyView={onlyView}
          />
          )}
    </div>
  )
}

export default CentroPrivado
