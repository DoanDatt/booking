import { Module } from '@nestjs/common'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { SharedModule } from './shared/shared.module.js'
import CustomZodValidationPipe from './shared/pipes/custom-zod-validation.pipe.js'
import { CustomZodSerializerInterceptor } from './shared/interceptor/custom-zod.interceptor.js'
import { HttpExceptionFilter } from './shared/filters/http-exception.filter.js'
import { LanguageModule } from './routes/language/language.module.js'
import { BrandModule } from './routes/brand/brand.module.js'
import { AuthModule } from './routes/auth/auth.module.js'
import { AccessTokenGuard } from './shared/guards/access-token.guard.js'
import { RolesGuard } from './shared/guards/roles.guard.js'

@Module({
  imports: [SharedModule, LanguageModule, BrandModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    { provide: APP_INTERCEPTOR, useClass: CustomZodSerializerInterceptor },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    { provide: APP_GUARD, useClass: AccessTokenGuard },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
