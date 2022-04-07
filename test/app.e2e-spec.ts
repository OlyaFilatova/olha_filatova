import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UniversitiesModule } from './../src/universities/universities.module';
import { AuthModule } from './../src/auth/auth.module';
import { UsersModule } from './../src/users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';


describe('AppController (e2e) graphql', () => {
    let app: INestApplication;
    let userToken: string;
    let managerToken: string;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            debug: false,
            sortSchema: true,
          }),
          UniversitiesModule,
          AuthModule,
          UsersModule
        ]
      }).compile();
      app = moduleFixture.createNestApplication();
      await app.init();
      userToken = (await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          "username": "Jack", "password": "password1"
        })).body.access_token;
      managerToken = (await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          "username": "Jared", "password": "password2"
        })).body.access_token;
    });

    describe('Universities', () => {
      const universitiesQueryData = {
        query: `query {
          universities {
            id,
            name
          }
        }`,
        variables: { },
      };
      const universitiesByCityQueryData = {
        query: `query ($cityId: Int) {
          universities (cityId: $cityId) {
            id,
            name
          }
        }`,
        variables: {
          cityId: 1
        },
      };
      const universitiesByStateQueryData = {
        query: `query ($stateId: Int) {
          universities (stateId: $stateId) {
            id,
            name
          }
        }`,
        variables: {
          stateId: 1
        },
      };

      it('get', async () => {

        const res = await request(app.getHttpServer())
          .post('/graphql')
          .send(universitiesQueryData);

        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.universities.length).toBeGreaterThan(0);
      });
      it('get by city', async () => {

        const res = await request(app.getHttpServer())
          .post('/graphql')
          .send(universitiesByCityQueryData);

        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.universities.length).toBe(5);
      });
      it('get by state', async () => {

        const res = await request(app.getHttpServer())
          .post('/graphql')
          .send(universitiesByStateQueryData);

        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.universities.length).toBe(20);
      });
    });

    describe('University', () => {
      describe('query', () => {
        const universityQueryData = {
          query: `query ($universityId: Int!) {
            university(id: $universityId) {
              id,
              name,
              city {
              	id,
                name
            	}
            }
          }`,
          variables: {
            "universityId": 1
          },
        };
        const university404QueryData = {
          query: `query ($universityId: Int!) {
            university(id: $universityId) {
              id,
              name,
              city {
              	id,
                name
            	}
            }
          }`,
          variables: {
            "universityId": 245
          },
        };

        it('404', async () => {

          const res = await request(app.getHttpServer())
            .post('/graphql')
            .send(university404QueryData);

          expect(res.body.errors).toBeDefined();

          expect(res.body.errors[0].message).toBe("University not found");
        });
        it('succesful', async () => {

          const res = await request(app.getHttpServer())
            .post('/graphql')
            .send(universityQueryData);

          expect(res.body.errors).toBeUndefined();
          expect(res.body.data.university).toMatchObject(
            {
              "city": {"id": 1, "name": "Huntsville"},
              "id": 1,
              "name": "Alabama A & M University"});
        });
      });
      describe('create', () => {
        const universityMutationCreateData = {
          query: `mutation ($newUniversityInput : NewUniversityInput! ) {
            addUniversity(newUniversityData: $newUniversityInput) {
              id,
              name,
              city {
                id,
                name,
                state {
                  id,
                  name
                }
              }
            }
          }`,
          variables: {
            "newUniversityInput": {
              "name": "New University name",
              "cityId": 3
            }
          },
        };
        const universityCity404MutationCreateData = {
          query: `mutation ($newUniversityInput : NewUniversityInput! ) {
            addUniversity(newUniversityData: $newUniversityInput) {
              id,
              name,
              city {
                id,
                name,
                state {
                  id,
                  name
                }
              }
            }
          }`,
          variables: {
            "newUniversityInput": {
              "name": "New University name",
              "cityId": 333
            }
          },
        };

        it('404', async () => {

          const res = await request(app.getHttpServer())
            .post('/graphql')
            .set('Authorization', 'Bearer ' + managerToken)
            .send(universityCity404MutationCreateData);

          expect(res.body.errors).toBeDefined();

          expect(res.body.errors[0].message).toBe("City not found");
        });
        it('succesful', async () => {

          const res = await request(app.getHttpServer())
            .post('/graphql')
            .set('Authorization', 'Bearer ' + managerToken)
            .send(universityMutationCreateData);

          expect(res.body.errors).toBeUndefined();
          expect(res.body.data.addUniversity).toBeDefined();
        });
        it('Forbidden resource', async () => {

          const res = await request(app.getHttpServer())
            .post('/graphql')
            .set('Authorization', 'Bearer ' + userToken)
            .send(universityMutationCreateData);

          expect(res.body.errors).toBeDefined();
          expect(res.body.errors[0].message).toBe("Forbidden resource");
        });
        it('not authorized', async () => {

          const res = await request(app.getHttpServer())
            .post('/graphql')
            .send(universityMutationCreateData);

          expect(res.body.errors).toBeDefined();
          expect(res.body.errors[0].message).toBe("Unauthorized");
        });
      });
      describe('update', () => {
        const universityMutationUpdateData = {
          query: `mutation ($updateUniversityInput : UpdateUniversityInput! ) {
            updateUniversity(updateUniversityData: $updateUniversityInput) {
              id,
              name,
              city {
                id,
                name,
                state {
                  id,
                  name
                }
              }
            }
          }`,
          variables: {
            "updateUniversityInput": {
              "id": 2,
              "name": "New name 2"
            }
          },
        };
        const universityCity404MutationUpdateData = {
          query: `mutation ($updateUniversityInput : UpdateUniversityInput! ) {
            updateUniversity(updateUniversityData: $updateUniversityInput) {
              id,
              name
            }
          }`,
          variables: {
            "updateUniversityInput": {
              "id": 2,
              "name": "New name 2",
              "cityId": 333
            }
          },
        };

        it('404', async () => {

          const res = await request(app.getHttpServer())
            .post('/graphql')
            .set('Authorization', 'Bearer ' + managerToken)
            .send(universityCity404MutationUpdateData);

          expect(res.body.errors).toBeDefined();

          expect(res.body.errors[0].message).toBe("City not found");
        });
        it('succesful', async () => {

          const res = await request(app.getHttpServer())
            .post('/graphql')
            .set('Authorization', 'Bearer ' + managerToken)
            .send(universityMutationUpdateData);

          expect(res.body.errors).toBeUndefined();
          expect(res.body.data.updateUniversity).toBeDefined();
        });
        it('Forbidden resource', async () => {

          const res = await request(app.getHttpServer())
            .post('/graphql')
            .set('Authorization', 'Bearer ' + userToken)
            .send(universityMutationUpdateData);

            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].message).toBe("Forbidden resource");
        });
        it('not authorized', async () => {

          const res = await request(app.getHttpServer())
            .post('/graphql')
            .send(universityMutationUpdateData);

          expect(res.body.errors).toBeDefined();
          expect(res.body.errors[0].message).toBe("Unauthorized");
        });
      });
    });
    afterAll(async () => {
        await app?.close();
    });
});
