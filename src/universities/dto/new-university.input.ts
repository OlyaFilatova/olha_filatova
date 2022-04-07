import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class NewUniversityInput {
  @Field()
  name: string;

  @Field(type => Int)
  cityId: number;
}
