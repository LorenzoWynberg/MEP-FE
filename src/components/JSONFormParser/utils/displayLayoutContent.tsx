import { LayoutContent } from '../Interfaces.ts'
import { DisplayField } from './fieldsFunction.tsx'

const mapLayoutContent = (
  layout,
  register,
  setValue,
  watch,
  currentItem,
  errors,
  pageData
): any => {
  const layoutContent: LayoutContent = pageData?.contents.find((content) => {
    return content.layoutId === layout.id
  })

  if (layoutContent?.fields) {
    return layoutContent.fields.map((field) => {
      return DisplayField(
        field,
        register,
        setValue,
        watch,
        currentItem,
        errors
      )
    })
  }

  if (layoutContent?.steps) {
    return DisplayField(
      layoutContent,
      register,
      setValue,
      watch,
      currentItem,
      errors
    )
  }

  return DisplayField(layout, register, setValue, watch, currentItem, errors)
}

export default mapLayoutContent
