export const maxLengthString = (string, max = 25, avoidDots = false) => {
  if (string.length <= max) return string
  if (avoidDots) {
    return `${string.substring(0, max)}`
  }
  return `${string.substring(0, max)}...`
}
