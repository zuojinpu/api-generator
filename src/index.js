import openapi from './openapi.json'
import {
  apiGenerator
} from './generator'
export function APIGenerator(apiList) {
  return apiGenerator(apiList)
}