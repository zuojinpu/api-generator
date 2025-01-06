import openapi from './openapi.json'
import {
  apiGenerator
} from './generator'
export function generator(apiList) {
  return apiGenerator(apiList)
}

generator(openapi)