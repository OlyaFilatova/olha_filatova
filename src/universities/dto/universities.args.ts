import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class UniversitiesArgs {
  @Field(type => Int, { nullable: true })
  cityId: number;

  @Field(type => Int, { nullable: true })
  stateId: number;
}
