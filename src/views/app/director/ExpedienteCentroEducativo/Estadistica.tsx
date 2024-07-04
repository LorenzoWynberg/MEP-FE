import React from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

const Estadistica = () => {
  const { t } = useTranslation()
  return (
    <div>
      <Helmet>
        <title>
          Estadística
        </title>
      </Helmet>
      <h1>
        {t('general>estadistica','Esto es Estadística')}
      </h1>
    </div>
  )
}

export default Estadistica
