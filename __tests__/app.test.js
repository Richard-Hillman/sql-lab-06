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

    // ==============================================================
    // Test 1

    test('returns penguins', async() => {

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

    //============================================================
    // Test 2 

    test('returns a single penguin', async() => {
      const expectation = {
        id: 1,
        name: 'Emperor',
        number_of_feet: 2,
        eats_fish: true,
        size: 'Small'
      };

      const data = await fakeRequest(app)
        .get('/penguins/1')
        .expect('Content-Type', /json/) 
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    // ====================================================================
    // Test 3

    test('adds a penguin to the DB and returns it', async() => {
      const expectation = {
        id: 6,
        name: 'Emperor',
        number_of_feet: 2,
        eats_fish: true,
        size_id: 1,
        owner_id: 1
      };

      const data = await fakeRequest(app)
        .post('/penguins/')
        .send({
          name: 'Emperor',
          number_of_feet: 2,
          eats_fish: true,
          size_id: 1,       
          owner_id: 1 
        })

        .expect('Content-Type', /json/)
        .expect(200);

      const penguins = await fakeRequest(app)
        .get('/penguins')
        .expect('Content-Type', /json/)
        .expect(200); 

      expect(data.body).toEqual(expectation);
      expect(penguins.body.length).toEqual(6);

    });

    // ======================================================================
    // Test 4

    test.only('updates a single penguin', async() => {
      const expectation = {
        id: 1,
        name: 'Emperor',
        number_of_feet: 2,
        eats_fish: true,
        size: 'Small'
      };

      const data = await fakeRequest(app)
        .put('/penguins/1')
        .send({
          id: 1,
          name: 'Emperor',
          number_of_feet: 2,
          eats_fish: true,
          size: 'Small'
        });

      await fakeRequest(app)
        .get('/penguins/1')
        .expect('Content-Type', /json/)
        .expect(200); 

      expect(data.body).toEqual(expectation);
      // expect(penguins.body.length).toEqual(6);
     

    });
  });
});

