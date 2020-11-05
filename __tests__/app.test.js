require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
  
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

  test('returns penguins', async() => {

    const expectation = [
      {
        name: 'emperor',
        number_of_feet: 2,
        eats_fish: true,
        size: 'large',
      },
      {
        name: 'king',
        number_of_feet: 2,
        eats_fish: true,
        size: 'large',
      },
      {
        name: 'african',
        number_of_feet: 2,
        eats_fish: true,
        size: 'medium',
      },
      {
        name: 'galapagos',
        number_of_feet: 2,
        eats_fish: true,
        size: 'small',
      },
      {
        name: 'gentoo',
        number_of_feet: 2,
        eats_fish: false,
        size: 'small',
      }
    
    ];
    

    const data = await fakeRequest(app)
      .get('/penguins')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(data.body).toEqual(expectation);
  });
});
,