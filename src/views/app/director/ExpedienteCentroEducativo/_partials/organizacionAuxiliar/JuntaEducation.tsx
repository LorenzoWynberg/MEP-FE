import React from 'react'

import InfoOrganizacion from './_partials/InfoOrganizacion'
import TablaMiembros from './_partials/TablaMiembros'
import Miembro from './_partials/Miembro'
import { Card, CardBody } from 'reactstrap'
import { useTranslation } from 'react-i18next'

const JuntaEducation = (props) => {
  const { t } = useTranslation()

  const { onlyView } = props
  const { hasEditAccess = true, hasAddAccess = true } = props
  return (
    <div>
      {!props.openCreateItem
        ? (
          <>
            <InfoOrganizacion
              titulo={
							props.configuracion
							  ? t('configuracion>centro_educativo>ver_centro_educativo>auxiliar>juntas_edu', 'Juntas de educación')
							  : t('configuracion>centro_educativo>ver_centro_educativo>auxiliar>info_juntas', 'Información de Junta')
						}
              loadingOrganization={props.loadingOrganization}
              handleDataChange={props.handleDataChange}
              data={props.data}
              sendData={props.sendData}
              setEditableOrganizacion={props.setEditableOrganizacion}
              editableOrganizacion={
							hasEditAccess
							  ? props.editableOrganizacion
							  : undefined
						}
              readOnly={onlyView}
            />
            <br />
            <br />
            <Card>
              <CardBody style={{ overflow: 'scroll' }}>
                <h2>{t('configuracion>centro_educativo>ver_centro_educativo>sedes>miembros', 'Miembros de la junta')}</h2>
                <br />
                <TablaMiembros
                  toggleAddNewModal={props.toggleAddNewModal}
                  data={props.data}
                  members={props.members}
                  incluyeInactivos={props.incluyeInactivos}
                  setMemberData={props.setMemberData}
                  setIncluyeInactivos={props.setIncluyeInactivos}
                  esPrivado={false}
                  activarInactivarMiembro={
									props.activarInactivarMiembro
								}
                  setMember={props.setMember}
                  editableMiembro={props.editableMiembro}
                  setEditableMiembro={props.setEditable}
                  hasAddAccess={hasAddAccess}
                  hasEditAccess={hasEditAccess}
                  onlyView={onlyView}
                />
              </CardBody>
            </Card>
          </>
          )
        : (
          <Miembro
            onlyView={onlyView}
            toggleAddNewModal={props.toggleAddNewModal}
            loadingMiembro={props.loadingMiembro}
            esPrivado={false}
            sendMemberData={props.sendMemberData}
            setEditableMiembro={props.setEditableMiembro}
            editableMiembro={props.editableMiembro && hasEditAccess}
          />
          )}
    </div>
  )
}

export default JuntaEducation
