import nunjucks from 'nunjucks';
import pinyin from 'pinyin';
// import js_beautify from 'js-beautify';
import generatornjk from './generator.njk.js';


export function apiGenerator(openapi) {
  const apiMap = new Map()
  Object.keys(openapi.paths).forEach(path => {
    Object.keys(openapi.paths[path]).forEach(method => {
      const apiSource = openapi.paths[path][method];
      const params = getParams(apiSource);
      const apiItem = { 
        path: getPath(path, params), 
        method,
        description: apiSource.summary,
        functionName: getFunctionName(apiSource.summary),
        params: params,
        query: getQuery(apiSource),
        headers: getHeaders(apiSource),
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
    item.apiText = getApiFile(item.apiList);
  })
  // console.log(Object.fromEntries(Array.from(apiMap)))
  // return Object.fromEntries(Array.from(apiMap));
  return apiMap;
}

function getPath(path, params) {
  if (!params.length) {
    return path
  }
  let newPath = path
  params.forEach(item => {
    newPath = newPath.replace(`{${item.name}}`, `$\{${item.name}}`)
  })
  return newPath
}

function getQuery(api) {
  if (api.parameters) {
    return api.parameters.filter(item => item.in === 'query')
  }
  return []
}
function getParams(api) {
  if (api.parameters) {
    return api.parameters.filter(item => item.in === 'path')
  }
  return []
}

function getHeaders(api) {
  if (api.parameters) {
    return api.parameters.filter(item => item.in === 'header')
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
    name,
    in: 'body',
    description: schema.properties[name].description,
    required: schema.required.includes(name),
    schema: {
      type: schema.properties[name].type,
    },
  }))
}

function getApiFile(apiList) {
  // nunjucks.configure({ autoescape: false })
  const apiText = nunjucks.renderString(generatornjk, { apiList, genType: 'ts' })
  return apiText
}

function getFunctionName(summary) {
  return pinyin(summary, { style: pinyin.STYLE_NORMAL }).flat(Infinity).map(str => str.charAt(0).toUpperCase() + str.slice(1)).join('')
}