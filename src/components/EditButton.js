import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'reactstrap'
import Loader from './Loader'

export const EditButton = ({
  editable,
  setEditable,
  sendData,
  loading,
  goBack,
  disabledSubmit = false,
  disabledCancel = false
}) => {
  const { t } = useTranslation()
  return (
    <>
      {loading
        ? (
          <div className='my-2'>
            <Loader formLoader />
          </div>
        )
        : editable
          ? (
            <>
              <Button
                color='primary'
                className='btn-shadow my-2 edit-btn-cancelar'
                outline
                type='button'
                disabled={disabledCancel}
                onClick={() => {
                  setEditable(false)
                }}
              >
                {goBack ? t('edit_button>regresar', 'Regresar') : t('edit_button>cancelar', 'Cancelar')}
              </Button>
              <Button color='primary' className='btn-shadow my-2' type='submit' disabled={disabledSubmit}>
                {t('edit_button>guardar', 'Guardar')}
              </Button>
            </>
          )
          : (
            <Button
              color='primary'
              className='btn-shadow my-2'
              type='button'
              onClick={() => {
                setEditable(true)
              }}
            >
              {t('edit_button>editar', 'Editar')}
            </Button>
          )}
    </>
  )
}
