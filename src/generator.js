import nunjucks from 'nunjucks'
import pinyin from 'pinyin';
const generatornjk = `
{% for api in apiList -%}
/**
* {{ api.description }}
*/
export function {{ api.functionName }}(
  {%- if api.params.length > 0 %}
  params
    {%- if genType === 'ts' -%}
    : {
    {%- for param in api.params %}
    {%- if param.description %}
    /** {{ param.description }} */
    {% endif -%}
    {{ param.name }} {{- "?" if not param.required }}: {{ param.schema.type }},
    {%- endfor %}
  }
    {%- endif -%}
  ,
  {%- endif %}
  
  {%- if api.query.length > 0 %}
  query
    {%- if genType === 'ts' -%}
    : {
    {%- for query in api.query %}
    {%- if query.description %}
    /** {{ query.description }} */
    {% endif -%}
    {{ query.name }} {{- "?" if not query.required }}: {{ query.schema.type }},
    {%- endfor %}
  }
    {%- endif -%}
  ,
  {%- endif %}

  {%- if api.body.length > 0 %}
  body
    {%- if genType === 'ts' -%}
    : {
    {%- for body in api.body %}
    {%- if body.description %}
    /** {{ body.description }} */
    {% endif -%}
    {{ body.name }} {{- "?" if not body.required }}: {{ body.schema.type }},
    {%- endfor %}
  }
    {%- endif -%}
  ,
  {%- endif %}

  {%- if api.headers.length > 0 %}
  headers
    {%- if genType === 'ts' -%}
    : {
    {%- for header in api.headers %}
    {%- if header.description %}
    /** {{ header.description }} */
    {% endif -%}
    {{ header.name }} {{- "?" if not header.required }}: {{ header.schema.type }},
    {%- endfor %}
  }
    {%- endif -%}
  ,
  {%- endif %}
) {
  return axios({
    method: '{{ api.method }}',
    {% if api.params.length > 0 -%}
    url: \`{{ api.path }}\`,
    {%- else -%}
    url: '{{ api.path }}',
    {% endif -%}
    {%- if api.query.length > 0 -%}
    params: query,
    {%- endif %}
    {%- if api.body.length > 0 -%}
    data: body,
    {%- endif %}
    {%- if api.headers.length > 0 -%}
    headers: headers,
    {%- endif %}
  });
}
{% endfor -%}
`

export function archiveGenerator(openapi) {
  let apiList = []
  Object.keys(openapi.paths).forEach(path => {
    Object.keys(openapi.paths[path]).forEach(method => {
      const apiSource = openapi.paths[path][method]
      const params = getParams(apiSource)
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
       apiList.push(apiItem)
    })
  })

  getApiFile(apiList)
  console.log(apiList);
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
  nunjucks.configure({ autoescape: false })
  const fileStr = nunjucks.renderString(generatornjk, { apiList, genType: 'ts' })
  console.log(fileStr);
}

function getFunctionName(summary) {
  return pinyin(summary, { style: pinyin.STYLE_NORMAL }).flat(Infinity).map(str => str.charAt(0).toUpperCase() + str.slice(1)).join('')
}