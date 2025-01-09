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
    {%- for param in api.params -%}
    {%- if param.description %}
    /** {{ param.description }} */
    {%- endif %}
    {{ param.name }} {{- "?" if not param.schema.required }}: {{ param.type }},
    {%- endfor %}
  }
    {%- endif -%}
  ,
  {%- endif %}
  
  {%- if api.query.length > 0 %}
  query
    {%- if genType === 'ts' -%}
    : {
    {%- for query in api.query -%}
    {%- if query.description %}
    /** {{ query.description }} */
    {%- endif %}
    {{ query.name }} {{- "?" if not query.schema.required }}: {{ query.type }},
    {%- endfor %}
  }
    {%- endif -%}
  ,
  {%- endif %}

  {%- if api.body.length > 0 %}
  body
    {%- if genType === 'ts' -%}
    : {
    {%- for body in api.body -%}
    {%- if body.description %}
    /** {{ body.description }} */
    {%- endif %}
    {{ body.name }} {{- "?" if not body.schema.required }}: {{ body.type }},
    {%- endfor %}
  }
    {%- endif -%}
  ,
  {%- endif %}

  {%- if api.headers.length > 0 %}
  headers
    {%- if genType === 'ts' -%}
    : {
    {%- for header in api.headers -%}
    {%- if header.description %}
    /** {{ header.description }} */
    {%- endif %}
    {{ header.name }} {{- "?" if not header.schema.required }}: {{ header.type }},
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
    {%- endif %}
    {% if api.query.length > 0 -%}
    params: query,
    {%- endif %}
    {% if api.body.length > 0 -%}
    data: body,
    {%- endif -%}
    {% if api.headers.length > 0 -%}
    headers: headers,
    {%- endif -%}
  });
}
{% endfor -%}
`

export default generatornjk