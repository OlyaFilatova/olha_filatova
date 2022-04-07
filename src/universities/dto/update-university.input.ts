import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { NewUniversityInput } from './new-university.input';

@InputType()
export class UpdateUniversityInput extends PartialType(NewUniversityInput) {
  @Field(type => Int)
  id: number;
}
