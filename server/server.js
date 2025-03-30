const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const axios = require('axios')
const app = express();
const fs = require("fs");
require('dotenv').config();
app.use(cors()); 
app.use(bodyParser.json());

const jwtSecret = process.env.JWT_SECRET;

const db = mysql.createConnection({
  host: 'localhost',
  user:'root',
  password:'',
  database:'recipeverse'
});
db.connect((err) => {
  if (err) {
    console.error('Connection failed: ', err);
  } else {
    console.log('Connected');
  }
})

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }
  jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
          return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
      }
      req.user = user; 
      next();
  });
};
app.post('/add-recipe', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const {recipe} = req.body;
  const sql = 'INSERT INTO `ai-recipes` (recipe, user_id) VALUES (?, ?)';
  db.query(sql, [recipe, userId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({error:err})
    }
    res.status(200).json({ message: "Recipe added"});
  })
})
app.get('/get-recipe', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const sql = 'SELECT recipe FROM `ai-recipes` WHERE user_id = ? ';
  db.query(sql, [userId], (error, results) => {
    if (error) {
      console.log(error);
      
      return res.status(500).json({ error: "Error fetching data. "});
    }
    res.json(results);
  })
})
app.get('/profile', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const query = 'SELECT username, email FROM users WHERE id = ?';
  try {
    db.query(query, [userId], (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error'});
      res.json(result[0]);       
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error'});
  }
})
app.put('/update-password', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const hashedpassword = await bcrypt.hash(password, 10);
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (results.length === 0) {
        return res.status(404).json({ message: "Email not found", error: 'email'});
      }
      db.query('UPDATE users SET password = ? WHERE email = ?', [hashedpassword, email], (err) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ message: "Password changed successfully" });
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put('/update-info', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { name, email, number, address, pincode } = req.body;
  const query = 'UPDATE users SET name = ?, email = ?, number = ?, address = ?, pincode = ? WHERE id = ?';
  try {
      db.query(query, [name, email, number, address, pincode, userId], (err, result) => {
        if (err) return res.status(500).json( {message: 'Database error'});        
        res.json({ name, email, number, address, pincode});
      })
  } catch (error) {
    res.status(500).json({message: 'Server error'});
    
  }
})

app.post('/register', async (req, res) => {
  const {username, email, password} = req.body;
  if (!username || !email || !password) {
    return res.status(400).json( {success: false, error:'all' , message: 'All fields are required.'});
  }
  try {
    const hashedpassword = await bcrypt.hash(password, 2);
    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedpassword], (err, result) => {
      if (err) {
        if (err.code == 'ER_DUP_ENTRY') {
          return res.status(400).json({ success:false, error:'email/username', message: 'User exists'});
        }
        return res.status(500).json({ success:false, message:'Database error'});
      }
      const token = jwt.sign( {userId: result.insertId}, jwtSecret, {expiresIn: '1h'})
    return res.status(200).json({ success: true, message:'Registration succesful', token});
    });
  } catch (error) {
    res.status(500).json( {success:false, message:'Error hashing password'});
  }
});


app.post('/login', (req, res) => {
  const { username, email, password } = req.body;
  if ((!username && !email) || !password) {
    return res.status(400).json({ success: false, error:'both', message: 'Email and password required '})
  }
  const selectedMode = email ? 'email' : 'username';
  const selectedLoginInfo = email ? email : username;
  const query = `SELECT * FROM users WHERE ${selectedMode} = ?`;
  db.query(query, [selectedLoginInfo], async (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: 'Internal server error', errormsg: err});
    }
    if (results.length === 0) {
      return res.status(401).json({ success: false, error:'email/username', message: 'User not found'});
    }
    const user = results[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error:'password', message: 'Invalid password'});
    }

    const token = jwt.sign( {userId: user.id}, jwtSecret, {expiresIn: '1h'})
    return res.status(200).json({ success: true, message:'Login succesful', token});

  })
})

app.post('/get-recipe', async (req, res) => {
  try {
    const { ingredients } = req.body;
    console.log(ingredients);
    
    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: 'No ingredients provided' });
    }
    const response = await axios.post('http://localhost:5002/generate-recipe', {ingredients})
    console.log(response.data);
    
    res.json(response.data)
  } catch (error) {
    console.error('Error: ', error.message);
    res.status(500).json({error:'Failed to generate recipe'})
  }
})
app.listen(5001, '0.0.0.0', () => console.log("Server runnning on port 5001"))
