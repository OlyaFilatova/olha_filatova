import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class State {
  @Field(type => Int)
  id: number;

  @Field()
  name: string;
}