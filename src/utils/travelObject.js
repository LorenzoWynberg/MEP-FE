export default function travelObject (props, obj) {
  /*
  *
  * recursive func to tavel through props
  * where the input value has the shape of
  * 'exampleProp.exmProp.ep'<string>
  *
  */
  const propsArray = props.split('.')
  const element = obj[propsArray.splice(0, 1)]
  if (propsArray.length) return travelObject(propsArray.join('.'), element)
  return element
}
