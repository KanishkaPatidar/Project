const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(
  session({
    secret: 'secret-key', 
    resave: false,
    saveUninitialized: false,
    cookie: { 
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      secure: false 
    },
  })
);

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {                   
  console.log('Session:', req.session);
  next();
});                                         

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'root', 
    database: 'test_db', 
  });
  
  db.connect((err) => {
    if (err) {
      console.error('Database connection failed:', err);
      process.exit();
    }
    console.log('Connected to MySQL!');
  });

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.status(403).json({ message: 'Not logged in' });
};
  
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, result) => {
      if (err) 
        {
        console.error('Error querying database:', err);
        return res.status(500).send({ success: false, message: 'Server error'});
      }
      if (result.length > 0) {
        req.session.user = result[0]; 
        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            return res.status(500).send({ success: false, message: 'Session error' });
          }
          res.send({ success: true, user: result[0] });
        });

      } else { 
        res.status(401).send({ success: false, message: 'Invalid credentials' });
    }
  });
});

  // registration route
app.post('/api/register', (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, yearOfDegree, branch, degree } = req.body;
    if (!firstName || !lastName || !email || !password || !phoneNumber || !yearOfDegree || !branch || !degree) {
      return res.status(400).send({ message: 'All fields are required' });
    }

  // SQL query to insert the new user
  const query = 'INSERT INTO users (first_name, last_name, email, phone_number, password, yearOfDegree, branch, degree) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(
      query,
      [firstName, lastName, email, phoneNumber, password, yearOfDegree, branch, degree],
      (err) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).send({ message: 'Database error' });
        }
        res.send({ message: 'Registration successful' });
    }
  );
});

  app.get('/api/profile', (req, res) => {
    if (req.session && req.session.user) {
      const user = req.session.user;
      const userProfile = {
        full_name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone_number: user.phone_number,
        year_of_degree: user.yearOfDegree,
        branch: user.branch,
        degree: user.degree,
      };
      res.send(userProfile);
    } else {
      res.status(403).send({ message: 'Not logged in' });
  }
});
    
  // Update profile route
app.put('/api/profile/update', isAuthenticated, (req, res) => {
  const { first_name, last_name, branch, year_of_degree, degree } = req.body;
  const email = req.session.user.email; 
    if (!first_name || !last_name || !branch || !year_of_degree || !degree) {
      return res.status(400).send({ message: 'All fields are required' });
    }

  const query = `
    UPDATE users 
    SET first_name = ?, last_name = ?, branch = ?, yearOfDegree = ?, degree = ? 
    WHERE email = ?`;

    db.query(query, [first_name, last_name, branch, year_of_degree, degree, email], (err) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send({ message: 'Database error' });
      }
      req.session.user = {
        ...req.session.user,
        first_name,
        last_name,
        branch,
        yearOfDegree: year_of_degree,
        degree,
      };

      res.send({ message: 'Profile updated successfully' });
  });
});

  // Logout route
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err); 
        return res.status(500).send({ success: false, message: 'Logout failed' });
      }
      res.clearCookie('connect.sid', {
        path: '/', 
        httpOnly: true, 
      });
      res.send({ success: true, message: 'Logged out successfully' });
  });
});


  // Task management routes
app.get('/api/tasks', isAuthenticated, (req, res) => {
  const userId = req.session.user.id;
    db.query('SELECT * FROM tasks WHERE user_id = ?', [userId], (err, results) => {
      if (err) {
        console.error('Error fetching tasks:', err);
        return res.status(500).send({ message: 'Server error' });
      }
      res.send(results);
  });
});

  // Add new task
app.post('/api/tasks', isAuthenticated, (req, res) => {
  const userId = req.session.user.id;
  const { task } = req.body;
    if (!task) return res.status(400).send({ message: 'Task cannot be empty' });

    db.query('INSERT INTO tasks (user_id, task) VALUES (?, ?)', [userId, task], (err, result) => {
      if (err) {
        console.error('Error adding task:', err);
        return res.status(500).send({ message: 'Server error' });
      }
      res.send({ id: result.insertId, task });
  });
});

  // Delete task
app.delete('/api/tasks/:id', isAuthenticated, (req, res) => {
  const userId = req.session.user.id;
  const taskId = req.params.id;

    db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId], (err, result) => {
      if (err) {
        console.error('Error deleting task:', err);
        return res.status(500).send({ message: 'Server error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: 'Task not found' });
      }
      res.send({ message: 'Task deleted successfully' });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
