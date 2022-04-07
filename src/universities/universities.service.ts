import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';

import { UniversitiesArgs } from './dto/universities.args';
import { NewUniversityInput } from './dto/new-university.input';
import { UpdateUniversityInput } from './dto/update-university.input';

import { University } from './models/university.model';
import { City } from './models/city.model';

@Injectable()
export class UniversitiesService {
  db: University[] = [
    {
      "id": 1,
      "name": "Alabama A & M University",
      "city": {
        "id": 1,
        "name": "Huntsville",
        "state": {
          "id": 1,
          "name": "Alabama"
        }
      }
    },
    {
      "id": 2,
      "name": "University of Alabama at Birmingham",
      "city": {
        "id": 2,
        "name": "Birmingham",
        "state": {
          "id": 1,
          "name": "Alabama"
        }
      }
    },
    {
      "id": 3,
      "name": "Amridge University",
      "city": {
        "id": 3,
        "name": "Montgomery",
        "state": {
          "id": 1,
          "name": "Alabama"
        }
      }
    },
    {
      "id": 4,
      "name": "University of Alabama in Huntsville",
      "city": {
        "id": 1,
        "name": "Huntsville",
        "state": {
          "id": 1,
          "name": "Alabama"
        }
      }
    },
    {
      "id": 5,
      "name": "Alabama State University",
      "city": {
        "id": 1,
        "name": "Huntsville",
        "state": {
          "id": 1,
          "name": "Alabama"
        }
      }
    },
    {
      "id": 6,
      "name": "University of Alabama System Office",
      "city": {
        "id": 1,
        "name": "Huntsville",
        "state": {
          "id": 1,
          "name": "Alabama"
        }
      }
    },
    {
      "id": 7,
      "name": "The University of Alabama",
      "city": {
        "id": 1,
        "name": "Huntsville",
        "state": {
          "id": 1,
          "name": "Alabama"
        }
      }
    },
    {
      "id": 8,
      "name": "Central Alabama Community College",
      "city": {
        "id": 8,
        "name": "Alexander City",
        "state": {
          "id": 1,
          "name": "Alabama"
        }
      }
    },
    {
      "id": 9,
      "name": "Athens State University",
      "city": {
        "id": 9,
        "name": "Athens",
        "state": {
          "id": 1,
          "name": "Alabama"
        }
      }
    },
    {
      "id": 10,
      "name": "Auburn University at Montgomery",
      "city": {
        "id": 10,
        "name": "Auburn",
        "state": {
          "id": 1,
          "name": "Alabama"
        }
      }
    },
    {
      "id": 11,
      "name": "Auburn University",
      "city": {
        "id": 10,
        "name": "Auburn",
        "state": {
          "id": 1,
          "name": "Alabama"
        }
      }
    },
    {
      "id": 12,
      "name": "Birmingham Southern College",
      "city": {
        "id": 2,
        "name": "Birmingham",
        "state": {
          "id": 1,
          "name": "Alabama"
        }
      }
    },
    {
      "id": 13,
      "name": "Chattahoochee Valley Community College",
      "city": {
        "id": 13,
        "name": "Phenix City",
        "state": {
          "id": 1,
          "name": "Alabama"
        }
      }
    },
    {
      "id": 14,
      "name": "Concordia College Alabama",
      "city": {
        "id": 14,
        "name": "Selma",
        "state": {
          "id": 1,
          "name": "Alabama"
        }
      }
    },
    {
      "id": 15,
      "name": "South University-Montgomery",
      "city": {
        "id": 15,
        "name": "Montgomery",
        "state": {
          "id": 1,
          "name": "Alabama"
        }
      }
    },
    {
      "id": 16,
      "name": "Enterprise State Community College",
      "city": {
        "id": 16,
        "name": "Enterprise",
        "state": {
          "id": 1,
          "name": "Alabama"
        }
      }
    },
    {
      "id": 17,
      "name": "Coastal Alabama Community College",
      "city": {
        "id": 17,
        "name": "Bay Minette",
        "state": {
          "id": 1,
          "name": "Alabama"
        }
      }
    },
    {
      "id": 18,
      "name": "Faulkner University",
      "city": {
        "id": 18,
        "name": "Montgomery",
        "state": {
          "id": 1,
          "name": "Alabama"
        }
      }
    },
    {
      "id": 19,
      "name": "Gadsden State Community College",
      "city": {
        "id": 19,
        "name": "Gadsden",
        "state": {
          "id": 1,
          "name": "Alabama"
        }
      }
    },
    {
      "id": 20,
      "name": "New Beginning College of Cosmetology",
      "city": {
        "id": 20,
        "name": "Albertville",
        "state": {
          "id": 1,
          "name": "Alabama"
        }
      }
    }
  ];

  async findCityById(cityId: number): Promise<City> {
    let universityWithTheCity = this.db.find(el => el.city.id == cityId);
    if (!universityWithTheCity) {
      throw new NotFoundException('City not found');
    }
    return universityWithTheCity.city;
  }
  async create(data: NewUniversityInput): Promise<University> {
    let newId = Math.max(...this.db.map(el => el.id)) + 1;
    let city = await this.findCityById(data.cityId);

    let newUniversity = {
      name: data.name,
      id: newId,
      city: city
    };
    this.db.push(newUniversity);
    return newUniversity;
  }
  async update(data: UpdateUniversityInput): Promise<University> {
    let universityIndex: number = this.db.findIndex(el => el.id == data.id);
    let university: University;
    if (universityIndex == -1) {
      throw new NotFoundException('University not found');
    } else {
      university = this.db[universityIndex];

      if (data.cityId !== undefined) {
        university.city = await this.findCityById(data.cityId);
      }
      if (data.name !== undefined) {
        university.name = data.name;
      }
    }
    return university;
  }

  async findOneById(id: number): Promise<University> {
    let university = this.db.find(el => el.id == id);
    if (!university) {
        throw new NotFoundException('University not found');
    }
    return university as University;
  }

  async findAll(universitiesArgs: UniversitiesArgs): Promise<University[]> {
    if (universitiesArgs.cityId !== undefined) {
      return this.db.filter(el =>
        el.city.id == universitiesArgs.cityId
      );
    } else if (universitiesArgs.stateId !== undefined) {
      return this.db.filter(el =>
        el.city.state.id == universitiesArgs.stateId
      );
    }
    return this.db;
  }
}
