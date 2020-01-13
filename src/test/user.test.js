import chai, { expect } from 'chai';
import faker from 'faker';
import chaiHttp from 'chai-http';
import server from '../index';
import { newUser02 } from './dummies';

chai.use(chaiHttp);
let newlyCreatedUser;
let token;
describe('User Route Endpoints', () => {
  it('should signup successfully with a status of 201', async () => {
    const response = await chai
      .request(server)
      .post('/api/auth/signup')
      .send(newUser02);
    expect(response).to.have.status(201);
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.token).to.be.a('string');
    expect(response.body.data.firstName).to.be.a('string');
    expect(response.body.data.lastName).to.be.a('string');
    newlyCreatedUser = response.body.data;
    token = response.body.data.token;
  });
});


describe('GET REQUESTS', () => {
  it('should successfully populate the user data on the profile with a status of 200', async () => {
    const { id } = newlyCreatedUser;
    const response = await chai.request(server).get(`/api/users/${id}`)
      .set('authorization', `Bearer ${token}`);
    const { body: { status } } = response;
    expect(response).to.have.status(200);
    expect(status).to.equal('success');
  });
  it('should return error of 401, access denied', async () => {
    const id = 2131121313;
    const response = await chai.request(server).get(`/api/users/${id}`)
      .set('Cookie', `token=${token};`);
    const { body: { status } } = response;
    expect(response).to.have.status(401);
    expect(status).to.equal('fail');
  });
});
describe('PATCH REQUESTS', () => {
  it('should return error of 401, access denied', async () => {
    const id = 2131121313;
    const response = await chai.request(server).patch(`/api/users/${id}`)
      .set('Cookie', `token=${token};`);
    const { body: { status } } = response;
    expect(response).to.have.status(401);
    expect(status).to.equal('fail');
  });
  it('should update the user data successfully with a status of 200', async () => {
    const { id } = newlyCreatedUser;
    const user = {
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      gender: 'male',
    };
    const response = await chai.request(server).patch(`/api/users/${id}`).send(user)
      .set('Cookie', `token=${token};`);
    const { body: { status } } = response;
    expect(response).to.have.status(200);
    expect(status).to.equal('success');
  });
});

describe('GET Logout', () => {
  it('should logout a user successfully', async () => {
    const response = await chai.request(server).get('/api/auth/logout').send();
    expect(response).to.have.status(200);
  });
});
