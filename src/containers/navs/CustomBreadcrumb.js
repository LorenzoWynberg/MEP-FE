import React from 'react'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
// import IntlMessages from "Helpers/IntlMessages";

import Typography from '@material-ui/core/Typography'
import { NavLink as Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
const GetMenuTitle = (props) => {
  const { sub } = props
  const { t } = useTranslation()
  if (sub.icon) return sub.icon
  return t(sub.label, `${sub.label} not found`)
  // return <IntlMessages id={`breadcrumb.${sub.label}`} />;
}
/*
data=
[
  {
  label:"home", //to use IntlMessages
  to:"../expediente-estudiante",
  active:false
},
{
  label:"general", //to use IntlMessages
  to:"app/expediente-estudiante/general",
  active:false
},{
  label:"contact", //to use IntlMessages
  to:"app/expediente-estudiante/contacto",
  active:true
}]
*/
const CustomBreadcrumb = ({ header, data, hideSpace, hidePadding }) => {
  const { t } = useTranslation()
  return (
    <>
      {header && (
        <h1 style={hidePadding ? { paddingBottom: 0, marginBottom: 0 } : { paddingBottom: '10px' }}>
          {/* <IntlMessages id={header} /> */}
          {t(header, `${header}`)}
        </h1>
      )}{' '}
      {!hideSpace && <br />}
      <BreadcrumbItems data={data || []} />
    </>
  )
}

export const BreadcrumbItems = ({ data }) => {
  return (
    <>
      <Breadcrumbs separator='|' aria-label='breadcrumb' maxItems={12}>
        {data.map((menu, i) => {
          const item = !menu.active
            ? (
              <Link
                key={i}
                color='inherit'
                to={`${menu.to}`}
                className='breadcrumb-label'
              >
                <GetMenuTitle sub={menu} />
              </Link>
              )
            : (
              <Typography key={i} color='textPrimary' className='breadcrumb-active'>
                <GetMenuTitle sub={menu} />
              </Typography>
              )
          return item
        })}
      </Breadcrumbs>
    </>
  )
}

export default CustomBreadcrumb
