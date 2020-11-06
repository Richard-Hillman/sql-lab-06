const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// ================================================================================================================================================
// GET===========================================================================================


// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});


app.get('/penguins/', async(req, res) => {
  try {
    const data = await client.query(`SELECT penguins.name, penguins.number_of_feet, penguins.eats_fish, sizes.size as sizes
      from penguins
      join sizes
      on sizes.id = penguins.size_id
    `);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
  
});

// ==================================================================================================================================================

app.get('/sizes', async(req, res) => {
  try {
    const data = await client.query('select * from sizes');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
  
});

// ==================================================================================================================================================

app.get('/penguins/:id', async(req, res) => {
  try {
    const penguin_id = req.params.id;

    const data = await client.query(
      `SELECT
        penguins.id,
        penguins.number_of_feet,
        penguins.eats_fish,
        penguins.size,
      FROM penguins
      JOIN sizes
      on sizes.id = penguins.size_id
      where sizes.id = $1
      `, [penguin_id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
  
});

// ==================================================================================================================================================

// PUT---------------------------------------

app.put('/penguins/:id', async(req, res) => {
  try {
    const newName = req.field.name;
    const newNumberOfFeet = req.body.number_of_feet;
    const newEatsFish = req.body.eats_fish;
    const newSize = req.body.size;
    const newOwnerId = req.body.owner_id;

    const data = await client.query(`
    UPDATE penguins, 
    SET name = $1,
    number_of_feet = $2,
    eats_fish =$3,
    size = $4,
    owner_id = $5
    WHERE penguins.id = $6
    RETURNING *
    `,

    [newName, newNumberOfFeet, newEatsFish, newSize, newOwnerId, req.params.id]);
    
    res.json(data.rows[0]);
  } catch(e) {    
    res.status(500).json({ error: e.message });
  }
});



// ==================================================================================================================================================================

// POST------------------------------------------------

app.post('/penguins/', async(req, res) => {
  try {
    const newName = req.field.name;
    const newNumberOfFeet = req.body.number_of_feet;
    const newEatsFish = req.body.eats_fish;
    const newSize = req.body.size;
    const newOwnerId = req.body.owner_id;

    const data = await client.query(`
      INSERT INTO penguins (name, number_of_feet, eats_fish, size, owner_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      
    [newName, newNumberOfFeet, newEatsFish, newSize, newOwnerId]);

    res.json(data.rows[0]);
  } catch(e) {
      
    res.status(500).json({ error: e.message });
  }
});



// ======================================================================================================================================================

// DELETE--------------------------------------------

app.delete('/penguins/:id', async(req, res) => {
  try {
    const penguin_id = req.params.id;

    const data = await client.query(`
    DELETE from penguins
    WHERE penguins.id=$1
    `,
    [penguin_id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
  
});

// ====================================================================================================================================================================

app.use(require('./middleware/error'));

module.exports = app;
