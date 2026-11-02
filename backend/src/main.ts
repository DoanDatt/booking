import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import {
  SwaggerModule,
  DocumentBuilder,
  type MediaTypeObject,
  type OpenAPIObject,
  type ReferenceObject,
  type ResponseObject,
} from '@nestjs/swagger'
import { cleanupOpenApiDoc } from 'nestjs-zod'
import helmet from 'helmet'
import { AppModule } from './app.module.js'
import envConfig from './shared/config.js'

// The global serializer wraps every documented success payload as { data, statusCode }.
function addResponseEnvelope(document: OpenAPIObject) {
  for (const pathItem of Object.values(document.paths)) {
    for (const operation of Object.values(pathItem)) {
      if (!operation || !('responses' in operation)) {
        continue
      }

      const responses = Object.values(operation.responses) as (ResponseObject | ReferenceObject | undefined)[]
      for (const response of responses) {
        if (!response || '$ref' in response) {
          continue
        }

        const mediaTypes = Object.values(response.content ?? {}) as MediaTypeObject[]
        for (const mediaType of mediaTypes) {
          if (!mediaType.schema) {
            continue
          }

          mediaType.schema = {
            type: 'object',
            required: ['data', 'statusCode'],
            properties: {
              data: mediaType.schema,
              statusCode: { type: 'integer' },
            },
          }
        }
      }
    }
  }

  return document
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors()
  app.use(helmet())

  // Swagger UI: http://localhost:3000/api
  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('The API for the ecommerce application')
    .setVersion('1.0')
    .setOpenAPIVersion('3.1.0')
    .addBearerAuth()
    .build()
  const document = addResponseEnvelope(cleanupOpenApiDoc(SwaggerModule.createDocument(app, config)))
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })

  await app.listen(envConfig.PORT)
}
await bootstrap()
