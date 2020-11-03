const client = require('../lib/client');
// import our seed data:
const penguins = require('./penguins.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {
  console.log(penguins)
  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      penguins.map(penguin => {
        return client.query(`
                    INSERT INTO penguins (name, number_of_feet, eats_fish, size, owner_id)
                    VALUES ($1, $2, $3, $4, $5)
                `,
        [penguin.name, penguin.number_of_feet, penguin.eats_fish, penguin.size, user.id]);
      })
    );
    
    console.log(penguins)

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
