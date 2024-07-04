import React from 'react'
import ItemNav from './_partials/ItemNavRegistrarPersona'
import { useTranslation } from 'react-i18next'


interface IProps {
  selectedType: any
  setSelectedType: Function
}
type TNav = {
  key: number
  type: string
  title: string
  desciption: string
}

const NavRegistrarPersona: React.FC<IProps> = (props) => {
  const { t } = useTranslation()
  const nav: Array<TNav> = [
      {
        key: 1,
        type: 'cedula',
        title: t('estudiantes>registro_matricula>matricula_estudian>registrar_persona>cedula', 'Cédula o Tarjeta de Identidad de Menores'),
        desciption:
          t('estudiantes>registro_matricula>matricula_estudian>registrar_persona>cedula>texto', 'Esta opción se elige cuando vamos a registrar a una persona que posee una cédula o tarjeta de identidad de menores.')
      },
      {
        key: 3,
        type: 'dimex',
        title: t('estudiantes>registro_matricula>matricula_estudian>registrar_persona>dimex', 'Documento de Identificación de Migración y Extranjería (DIMEX)'),
        desciption:
          t('estudiantes>registro_matricula>matricula_estudian>registrar_persona>dimex>texto', 'Esta opción se elige cuando vamos a registrar a una persona que posee DIMEX.')
      },
      {
        key: 4,
        type: 'yisro',
        title:
          'Documento de identificación estudiantil del Ministerio de Educación Pública de Costa Rica (Yís Rö)',
        desciption:
          t('estudiantes>registro_matricula>matricula_estudian>registrar_persona>yisro>texto', 'Esta opción se elige cuando vamos a registrar a una persona que no posee ninguno de los anteriores.')
      }
      
    ]
  

  const { selectedType, setSelectedType } = props

  const onclick = (type) => {
    setSelectedType(type)
  }

  return (
    <div>
      {nav.map((item, i) => {
        return (
          <ItemNav
            key={i}
            isSelected={Number(selectedType.id) === Number(item.key)}
            id={item.key}
            type={item.type}
            title={item.title}
            desciption={item.desciption}
            onClick={onclick}
          />
        )
      })}
    </div>
  )
}

export default NavRegistrarPersona
