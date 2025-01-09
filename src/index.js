import {
  apiGenerator
} from './generator'
export function APIGenerator(apiTemplate, openapi, genType = 'ts') {
  return apiGenerator(apiTemplate, openapi, genType)
}