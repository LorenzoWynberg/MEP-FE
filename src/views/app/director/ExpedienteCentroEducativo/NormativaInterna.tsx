import React from 'react'
import { Helmet } from 'react-helmet'
import TablaNormativa from './_partials/NormativaInterna/TablaNormativa'
import './_partials/NormativaInterna/general.css'
import { useTranslation } from 'react-i18next'

const NormativaInterna = () => {
  const { t } = useTranslation()
  const faltas = [
    {
      name: 'Faltas muy leves',
      id: 0
    },
    {
      name: 'Faltas leves',
      id: 1
    },
    {
      name: 'Faltas graves',
      id: 2
    },
    {
      name: 'Faltas muy graves',
      id: 3
    },
    {
      name: 'Faltas gravísimas',
      id: 4
    }
  ]
  const data = [
    {
      tipoFalta: 'Faltas muy leves',
      nombre: 'Falta muy leve 1',
      acciones: [],
      id: 0
    },
    {
      tipoFalta: 'Faltas leves',
      nombre: 'Falta muy leve 2',
      acciones: [],
      id: 1
    },
    {
      tipoFalta: 'Faltas graves',
      nombre: 'Falta muy leve 3',
      acciones: [],
      id: 2
    },
    {
      tipoFalta: 'Faltas muy graves',
      nombre: 'Falta muy leve 4',
      acciones: [],
      id: 3
    },
    {
      tipoFalta: 'Faltas gravísimas',
      nombre: 'Falta muy leve 5',
      acciones: [],
      id: 4
    }
  ]
  return (
    <>
      <Helmet>
        <title>{t('expediente_ce>normativa_interna>titulo', 'Normativa Interna')}</title>
      </Helmet>
      <br />
      <h4>{t('expediente_ce>normativa_interna>titulo', 'Normativa Interna')}</h4>
      <TablaNormativa />
    </>
  )
}

export default NormativaInterna
