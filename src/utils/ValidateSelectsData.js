// if all keys provided in keys array has data returns true else return false
export const validateSelectsData = (slectsState = {}, keys = []) => {
  return keys.every(key => {
    return !!slectsState[key][0]
  })
}
