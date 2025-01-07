const numberEnum = [
  'integer',
  'long',
  'float',
  'double',
  'number',
  'int',
  'float',
  'double',
  'int32',
  'int64',
];

const dateEnum = ['Date', 'date', 'dateTime', 'date-time', 'datetime'];

const stringEnum = ['string', 'email', 'password', 'url', 'byte', 'binary'];


function typeGenerator (prop) {
  const type = prop.schema?.type || prop.type
  if (type === 'null') {
    return null
  }
  if (numberEnum.includes(type)) {
    return 'number'
  }
  if (dateEnum.includes(type)) {
    return 'Date'
  }
  if (stringEnum.includes(type)) {
    return 'string'
  }
  if (type === 'array') {
    return typeGeneratorByArray(prop.items)
  }
  if (prop.type === 'object') {
    return typeGeneratorByObject(prop)
  }
  return 'any'
}

function typeGeneratorByArray(prop) {
  try {
    const types = Object.keys(prop.properties).map(key => {
      return {
        name: key,
        type: typeGenerator(prop.properties[key]),
        required: prop.required.includes(key)
      }
    })
    return `{${types.map(item => item.name + (item.required ? '' : '?') + ': ' + item.type).join(', ')}}[]`
  } catch (error) {
    return 'any[]'
  }
}

function typeGeneratorByObject(prop) {
  try {
    const types = Object.keys(prop.properties).map(key => {
      return {
        name: key,
        type: typeGenerator(prop.properties[key]),
        required: prop.required.includes(key)
      }
    })
    return `{${types.map(item => item.name + (item.required ? '' : '?') + ': ' + item.type).join(', ')}}`
  } catch (error) {
    return '{[key: string]: any}'
  }
}

export default typeGenerator;