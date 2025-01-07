import openapi from './openapi.json'
import generatornjk from './generator.njk.js';
import {
  apiGenerator
} from './generator'
export function APIGenerator(apiTemplate = generatornjk, openapi, genType = 'ts') {
  return apiGenerator(apiTemplate, openapi, genType)
}

APIGenerator(generatornjk, openapi, 'ts')