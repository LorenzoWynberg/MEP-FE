import React, { useState } from 'react'
import {
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu
} from 'reactstrap'

import { AreaChart } from '../../../../../../components/charts'

import { AreaChartData } from '../../../../../../data/charts'

import { map, min, max, orderBy } from 'lodash'

import moment from 'moment'
import { useTranslation } from 'react-i18next'

const getChartData = (items, currentId = 1) => {
  return map(
    items,
    currentId === 1 ? 'peso' : currentId === 2 ? 'talla' : 'imc'
  )
}

const getChatTicksConfig = (items, currentId = 1) => {
  const chartData = getChartData(items, currentId)
  return {
    beginAtZero: true,
    max: min(chartData) - 10,
    min: max(chartData),
    padding: 20,
    stepSize: 5
  }
}
const SaludChart = (props) => {
  const { t } = useTranslation()

  const getChartFilters = (currentId = 1) => {
    return [
      {
        id: 1,
        title: t('estudiantes>expediente>salud>peso', 'Peso (kg)'),
        active: currentId === 1
      },
      {
        id: 2,
        title: t('estudiantes>expediente>salud>talla', 'Talla (cm)'),
        active: currentId === 2
      },
      {
        id: 3,
        title: t('estudiantes>expediente>salud>imc', 'Índice de masa corporal (imc)'),
        active: currentId === 3
      }
    ]
  }

  const items = orderBy(
    [...props.items],
    function (o) {
      return new moment(o.fechaInsercion)
    },
    ['asc']
  )
  const labels = map(items, 'date')
  const [chartFilters, setChartFilters] = useState(getChartFilters())
  const [chartData, setChartData] = useState(
    AreaChartData({ labels, data: getChartData(items) })
  )
  console.log('chartData',chartData)
  const [ticksConfig, setTicksConfig] = useState(getChatTicksConfig(items))

  const onChangeChart = (current) => {
    setChartFilters(getChartFilters(current.id))
    const newChartData = getChartData(items, current.id)

    setChartData(AreaChartData({ labels, data: newChartData }))
    setTicksConfig(getChatTicksConfig(items, current.id))
  }
  return (
    <Card className='dashboard-filled-line-chart salud-card-chart'>
      <CardBody>
        <div className='float-left float-none-xs'>
          <div className='d-inline-block'>
            <h5 className='d-inline'>{t('estudiantes>expediente>salud>graficos', 'Gráficos')}</h5>
          </div>
        </div>

        <div className='btn-group float-right float-none-xs mt-2'>
          <UncontrolledDropdown>
            <DropdownToggle caret color='secondary' className='btn-xs' outline>
              {chartFilters.filter((item) => item.active)[0].title}
            </DropdownToggle>
            <DropdownMenu right>
              {chartFilters
                .filter((item) => !item.active)
                .map((filter) => (
                  <DropdownItem onClick={onChangeChart.bind(this, filter)}>
                    {filter.title}
                  </DropdownItem>
                ))}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </CardBody>

      <div className='chart card-body pt-0'>
        <AreaChart shadow data={chartData} ticks={ticksConfig} />
      </div>
    </Card>
  )
}

export default SaludChart
