import React from 'react'
import { useTranslation } from 'react-i18next'
interface IProps {
  firstColumnContent: Array<any>;
  renderFirstColumnItem: (val: any) => JSX.Element;
  schedule: Array<any>;
  renderScheduleItem: (val: any) => JSX.Element;
  renderBodyItem: (val: any, i1: number, i2: number) => JSX.Element;
  schedules: Array<Array<any>>;
  children?: JSX.Element;
  days: Array<string>;
}

const GenericSchedule = ({
  firstColumnContent,
  renderFirstColumnItem,
  schedule,
  renderScheduleItem,
  renderBodyItem,
  schedules = [],
  children = <></>,
  days = []
}: IProps) => {
  const { t } = useTranslation()
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div style={{ display: 'flex' }}>
        <div>
          <p className='generic-schedule__column-header' style={{ padding: '1.02rem 0' }}>
            {t("expediente_ce>horario>leccion", "Lección")}
          </p>
          {
            firstColumnContent?.map((el, i) => (
              <div
                className='generic-schedule__row-content'
                key={`lection-${i}`}
                style={{
                  backgroundColor: el.esReceso ? '#145388' : 'unset',
                  color: el.esReceso ? '#fff' : 'unset'
                }}
              >
                {renderFirstColumnItem(el)}
              </div>
            ))
}
          {
              firstColumnContent.length === 0 && (
                <div className='generic-schedule__row-content' />
              )
            }
        </div>
        <div>
          <p className='generic-schedule__column-header' style={{ width: '10rem', padding: '1.02rem 0' }}>
            {t("expediente_ce>horario>horario", "Horario")}
          </p>
          {
            schedule?.map((el, i) => (
              <div
                className='generic-schedule__row-content'
                key={`schedule-${i}`}
                style={{
                  width: '10rem',
                  backgroundColor: el.esReceso ? '#145388' : 'unset',
                  color: el.esReceso ? '#fff' : 'unset'
                }}
              >
                {renderScheduleItem(el)}
              </div>
            ))
}
          {
              firstColumnContent.length === 0 && (
                <div className='generic-schedule__row-content' style={{ width: '10rem' }} />
              )
            }
        </div>
      </div>
      <div style={{ width: '100%', overflow: 'scroll' }}>
        <table>
          <thead>
            <tr>
              {
                  days?.map((day, i) => (
                    <th className='generic-schedule__column-header' style={{ padding: '1.05rem 0' }} key={`${day}-${i}`}>
                      {day}
                    </th>
                  ))
                }
            </tr>
          </thead>
          <tbody>
            {
              schedules?.map((item, index) => {
                return (
                  <tr>
                    {days.map((el, i) => (
                      <td
                        style={{
                          height: '3.5rem',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        {renderBodyItem(item[i], index, i)}
                      </td>
                    ))}
                  </tr>
                )
              })
            }
            {
              firstColumnContent.length === 0 && (
                <tr>
                  {
                    days.map((_, i) => (
                      <td key={`schedule-${i}`} style={{ height: '3.5rem', padding: 0 }}>
                        <div className='generic-schedule__row-content' style={{ width: '13.5rem' }} />
                      </td>
                    ))
                  }
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
      {children}
    </div>
  )
}

export default GenericSchedule
