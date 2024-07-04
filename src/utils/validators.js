export const isEmptyNullOrUndefined = (value) => {
  return (
    value == null || value === undefined || value.toString().trim().length === 0
  )
}
