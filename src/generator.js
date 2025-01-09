import nunjucks from 'nunjucks';
import pinyin from 'pinyin';
// import js_beautify from 'js-beautify';
import typeGenerator from './typeGenerator.js';


export function apiGenerator(apiTemplate, openapi, genType) {
  const apiMap = new Map()
  Object.keys(openapi.paths).forEach(path => {
    Object.keys(openapi.paths[path]).forEach(method => {
      const apiSource = openapi.paths[path][method];
      const params = getParams(apiSource, 'path');
      const apiItem = { 
        path: getPath(path, params), 
        method,
        description: apiSource.summary,
        functionName: getFunctionName(apiSource.summary),
        params: params,
        query: getParams(apiSource, 'query'),
        headers: getParams(apiSource, 'header'),
        body: getBody(apiSource),
      }
      const apiTag = apiSource.tags[apiSource.tags.length - 1];
      if (apiMap.get(apiTag)) {
        apiMap.get(apiTag).apiList.push(apiItem);
      } else {
        apiMap.set(apiTag, {
          tag: apiTag,
          apiList: [apiItem],
          apiText: '',
        })
      }
    })
  })
  apiMap.forEach((item, key) => {
    item.apiText = getApiFile(apiTemplate, item.apiList, genType);
  })
  // console.log(Object.fromEntries(Array.from(apiMap)))
  // return Object.fromEntries(Array.from(apiMap));
  return apiMap;
}

function getPath(path, params) {
  if (!params?.length) {
    return path
  }
  let newPath = path
  params.forEach(item => {
    newPath = newPath.replace(`{${item.name}}`, `$\{${item.name}}`)
  })
  return newPath
}
function getParams(api, position) {
  if (api.parameters) {
    return api.parameters.filter(item => item.in === position).map(item => ({
      ...item,
      schema: {
        ...item.schema,
        required: item.required,
      },
      type: typeGenerator(item),
    }))
  }
  return []
}

function getBody(api) {
  const reqContent = api?.requestBody?.content
  if (!reqContent) {
    return []
  }
  const contentType = Object.keys(reqContent)[0]
  const schema = reqContent[contentType].schema
  if (!schema.properties) {
    return []
  }
  return Object.keys(schema.properties).map(name => ({
    ...schema.properties[name],
    name,
    in: 'body',
    description: schema.properties[name].description,
    schema: {
      required: schema.required.includes(name),
      type: schema.properties[name].type,
    },
  })).map(item => ({
    ...item,
    type: typeGenerator(item),
  }))
}

function getApiFile(apiTemplate, apiList, genType) {
  const apiText = nunjucks.renderString(apiTemplate, { apiList, genType })
  return apiText
}

function getFunctionName(summary) {
  return pinyin(summary, { style: pinyin.STYLE_NORMAL }).flat(Infinity).map(str => str.charAt(0).toUpperCase() + str.slice(1)).join('')
}