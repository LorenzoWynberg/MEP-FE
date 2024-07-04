import React from 'react'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap'
import IntlMessages from 'Helpers/IntlMessages'
import { useTranslation } from 'react-i18next'

const getMenuTitle = sub => {
  return <IntlMessages id={`menu.${sub}`} />
}

const BreadcrumbContainer = ({ heading, match, hidePath }) => {
  const { t } = useTranslation()
  return (
    <>
      {heading && <h1>{heading}</h1>}
      {!hidePath && <BreadcrumbItems match={match} />}
    </>
  )
}

export const BreadcrumbItems = ({ match }) => {
  const { t } = useTranslation()
  const path = match.path.substr(1)
  let paths = path.split('/')
  if (paths[paths.length - 1].indexOf(':') > -1) {
    paths = paths.filter(x => x.indexOf(':') === -1)
  }
  return (
    <>
      <Breadcrumb className='pt-0 breadcrumb-container d-none d-sm-block d-lg-inline-block'>
        {paths.map((sub, index) => {
          return (
            <BreadcrumbItem key={index} active={paths.length === index + 1}>
              {/* {getMenuTitle(sub)} */}
              {t(sub, `${sub} not found`)}
            </BreadcrumbItem>
          )
        })}
      </Breadcrumb>
    </>
  )
}

export default BreadcrumbContainer
