require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;

    beforeAll(async done => {
      execSync('npm run setup-db');

      client.connect();
    
      const signInData = await fakeRequest(app) 
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });

      token = signInData.body.token;

      return done();
    });

    afterAll(done => {
      return client.end(done);
    });

    test.only('returns penguins', async() => {

      const expectation = [
        {
          id: 1,
          name: 'Emperor',
          number_of_feet: 2,
          eats_fish: true,
          sizes: 1
        },
        {
          id: 2,
          name: 'King',
          number_of_feet: 2,
          eats_fish: true,
          sizes: 2
        },
        {
          id: 3,
          name: 'African',
          number_of_feet: 2,
          eats_fish: true,
          sizes: 3
        },
        {
          id: 4,
          name: 'Galapagos',
          number_of_feet: 2,
          eats_fish: true,
          sizes: 2
        },
        {
          id: 5,
          name: 'Gentoo',
          number_of_feet: 2,
          eats_fish: false,
          sizes: 3
        }
      ];

      const data = await fakeRequest(app)
        .get('/penguins')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

  });
});

