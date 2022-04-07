import { NotFoundException, Request, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { University } from './models/university.model';

import { UniversitiesArgs } from './dto/universities.args';
import { NewUniversityInput } from './dto/new-university.input';
import { UpdateUniversityInput } from './dto/update-university.input';
import { UniversitiesService } from './universities.service';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/role.enum';

@Resolver(of => University)
export class UniversitiesResolver {
  constructor(
    private universitiesService: UniversitiesService) {}

  @Query(returns => University, {name: 'university'})
  async getUniversity(@Args('id', { type: () => Int }) id: number) {
    return this.universitiesService.findOneById(id);
  }

  @Query(returns => [University], {name: 'universities'})
  getUniversities(@Args() universitiesArgs: UniversitiesArgs): Promise<University[]> {
    return this.universitiesService.findAll(universitiesArgs);
  }

  @Mutation(returns => University)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  async addUniversity(
    @Args('newUniversityData') newUniversityData: NewUniversityInput
  ): Promise<University> {
    return await this.universitiesService.create(newUniversityData);
  }

  @Mutation(returns => University)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  async updateUniversity(
    @Args('updateUniversityData') updateUniversityData: UpdateUniversityInput
  ): Promise<University> {
    return await this.universitiesService.update(updateUniversityData);
  }
}
