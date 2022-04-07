import { Field, Int, ObjectType } from '@nestjs/graphql';
import { State } from './state.model';

@ObjectType()
export class City {
  @Field(type => Int)
  id: number;

  @Field()
  name: string;

  @Field(type => State)
  state: State;
}