import React from 'react'
import creadorDeFormulariosItems from 'Constants/creadorDeFormulariosItems'
import IntlMessages from 'Helpers/IntlMessages'
import colors from 'Assets/js/colors'
import { Row, Col } from 'reactstrap'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import { useTranslation } from 'react-i18next'
const Navigation = (props) => {
  const { t } = useTranslation()
  const newMenus = creadorDeFormulariosItems.map((el) => ({
    ...el,
    label: t(`formularios>navigation>${el?.id}`, el?.label)
  }))
  return (
    <AppLayout items={newMenus}>
      <Row>
        <Col xs={12}>
          <h1>{t('formularios>navigation>formularios', 'Formularios')}</h1>
        </Col>
        {newMenus.map((el, i) => {
          return (
            <Col
              xs={12}
              md={3}
              key={i}
              onClick={() => {
                props.history.push(el.to)
              }}
            >
              <div
                className='cursor-pointer'
                style={{
                  display: 'flex',
                  width: '100%',
                  height: '5rem',
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    marginRight: '1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    backgroundColor: colors.primary,
                    width: '30%',
                    height: '100%'
                  }}
                >
                  <el.icon />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* <IntlMessages id={el.label} /> */}
                  <div>{el?.label}</div>
                </div>
              </div>
            </Col>
          )
        })}
      </Row>
    </AppLayout>
  )
}

export default Navigation
