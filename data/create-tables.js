const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(256) NOT NULL,
                    hash VARCHAR(512) NOT NULL
                );   
                
                CREATE TABLE sizes (
                  id SERIAL PRIMARY KEY,
                  size VARCHAR(512) NOT NULL
              ); 

                CREATE TABLE penguins (
                    id SERIAL PRIMARY KEY NOT NULL,
                    name VARCHAR(512) NOT NULL,
                    number_of_feet INTEGER NOT NULL,
                    eats_fish BOOLEAN NOT NULL,
                    size_id INTEGER NOT NULL REFERENCES sizes(id),
                    owner_id INTEGER NOT NULL REFERENCES users(id)

            );
        `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
