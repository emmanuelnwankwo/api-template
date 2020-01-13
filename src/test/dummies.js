import faker from 'faker';

const genders = ['female', 'male'];

export const newUser = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: 'johnmike@example.com',
  gender: faker.random.objectElement(genders),
  password: faker.internet.password(15, false),
};

export const newUser01 = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  gender: faker.random.objectElement(genders),
  password: faker.internet.password(15, false),
};

export const newUser02 = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  gender: faker.random.objectElement(genders),
  password: faker.internet.password(15, false),
};
