import React, { useTransition } from 'react'
import styled from 'styled-components'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import HeaderTab from 'Components/Tab/Header'
import useGestionUsuarios from './useGestionUsuarios'
import FormUserComponent from './_partials/FormUserComponent'
import useNotification from 'Hooks/useNotification'
import RolInfoModal from './_partials/RolInfoModal'
import BarLoader from 'Components/barLoader/barLoader'
import { useTranslation } from 'react-i18next'

const GestionUsuarios = () => {
  const { t } = useTranslation()
  const [snackbar, handleClick] = useNotification()
  const {
    activeTab,
    setActiveTab,
    optionTabs,
    fetchTipoRoles,
    tabs,
    fetchUsuarios,
    showForm,
    onRegresarEvent,
    onChangeInputEmail,
    onChangeInputNumeroIdentificacion,
    onChangeSelectRol,
    onChangeSelectTipoIdentificacion,
    onChangeMultiselectInstituciones,
    onChangeMultiselectCircuitos,
    rolOptions,
    tipoIdentificacionOptions,
    fetchInstituciones,
    fetchRegionales,
    institucionesId,
    viewState,
    onRegionalSelectChange,
    regionalId,
    fetchCircuitos,
    circuitosCatalog,
    circuitoId,
    circuitosId,
    rolId,
    fullName,
    snackbarData,
    fetchAllDepartamentos,
    fetchAllEmpresas,
    onCreateDepartamento,
    onCreateCompania,
    email,
    tipoIdentificacionId,
    identificacion,
    institucionId,
    regionalesId,
    isEditing,
    onBtnSaveEvent,
    onConfirmRegisterModalCallback,
    toggleRegisterModal,
    showRegisterModal,
    encontrado,
    onRegionalMultiselectChange,
    loading,
    onDepartamentoSelectChange,
    onCompaniaSelectChange,
    departamentoId,
    companiaId,
    companiaOptions,
    departamentoOptions,
    toggleLoading,
    showRolInfoModal,
    selectedItem,
    onRolModalClose
  } = useGestionUsuarios({ snackbarHandleClick: handleClick })

  React.useEffect(() => {
    toggleLoading(true)
    Promise.all([
      fetchTipoRoles(),
      fetchUsuarios(),
      fetchAllDepartamentos(),
      fetchAllEmpresas()
    ]).then((_) => {
      toggleLoading(false)
    })
  }, [])

  const Panel = () => {
    if (showForm == true) {
      return (
        <FormUserComponent
          encontrado={encontrado}
          onConfirmRegisterModalCallback={onConfirmRegisterModalCallback}
          toggleRegisterModal={toggleRegisterModal}
          showRegisterModal={showRegisterModal}
          onRegionalMultiselectChange={onRegionalMultiselectChange}
          onChangeSelectTipoIdentificacion={onChangeSelectTipoIdentificacion}
          onChangeInputNumIdentificacion={onChangeInputNumeroIdentificacion}
          onChangeInputEmail={onChangeInputEmail}
          onChangeSelectRol={onChangeSelectRol}
          onRegresarEvent={onRegresarEvent}
          onSaveButtonClickEvent={onBtnSaveEvent}
          onChangeMultiselectInstituciones={onChangeMultiselectInstituciones}
          onChangeMultiselectCircuitos={onChangeMultiselectCircuitos}
          onChangeSelectRegional={onRegionalSelectChange}
          fetchInstituciones={fetchInstituciones}
          fetchCircuitos={fetchCircuitos}
          rolOptions={rolOptions}
          fetchRegionales={fetchRegionales}
          tipoIdentificacionOptions={tipoIdentificacionOptions}
          circuitosId={circuitosId}
          multiselectInstitucionesValue={institucionesId}
          viewState={viewState}
          isEditing={isEditing}
          institucionId={institucionId}
          regionalesId={regionalesId}
          regionalId={regionalId}
          circuitosOptions={circuitosCatalog}
          tipoIdentificacionValue={tipoIdentificacionId}
          identificacion={identificacion}
          email={email}
          rolId={rolId}
          fullName={fullName}
          fetchCompanias={fetchAllEmpresas}
          fetchDepartamentos={fetchAllDepartamentos}
          createCompania={onCreateCompania}
          createDepartamento={onCreateDepartamento}
          loading={loading}
          onCompaniaSelectChange={onCompaniaSelectChange}
          onDepartamentoSelectChange={onDepartamentoSelectChange}
          departamentoId={departamentoId}
          companiaId={companiaId}
          companiaOptions={companiaOptions}
          departamentoOptions={departamentoOptions}
          multiselectCircuitosValue={circuitosId}
          circuitoId={circuitoId}
        />
      )
    } else return <div>{tabs[activeTab]}</div>
  }

  return (
    <AppLayout items={directorItems}>
      {snackbar(snackbarData.variant, snackbarData.msg)}
      {loading == true ? <BarLoader /> : ''}
      <RolInfoModal
        fullRowData={selectedItem}
        show={showRolInfoModal}
        onClose={onRolModalClose}
      />
      <Title>{t('gestion_usuario>usuarios>title_gestion_usuarios', 'Gestión de Usuarios')}</Title>
      <Subtitle>{t('gestion_usuario>usuarios>subtitle_usuarios', 'Usuarios')}</Subtitle>
      <HeaderTab
        options={optionTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <>
        {Panel()}
      </>
    </AppLayout>
  )
}
const Spinner = styled.div`
  z-index: 999999999;
  cursor: wait;
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`
const Title = styled.h2`
  font-weight: bold;
  margin-bottom: 1.5rem;
`
const Subtitle = styled.h3``

export default GestionUsuarios
