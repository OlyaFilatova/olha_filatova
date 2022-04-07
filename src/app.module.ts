import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { join } from 'path';

import { UniversitiesModule } from './universities/universities.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UniversitiesModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      debug: false,
      sortSchema: true,
    }),
    AuthModule,
    UsersModule
  ]
})
export class AppModule {}
