import { Field, Int, ObjectType } from '@nestjs/graphql';
import { City } from './city.model';

@ObjectType()
export class University {
  @Field(type => Int)
  id: number;

  @Field()
  name: string;

  @Field(type => City)
  city: City;
}
