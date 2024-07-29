require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

console.log('ACCESS_TOKEN_SECRET:', ACCESS_TOKEN_SECRET);
console.log('REFRESH_TOKEN_SECRET:', REFRESH_TOKEN_SECRET);
console.log('MONGODB_URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err.message);
});

// Middleware pour vérifier la connexion à MongoDB
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).send('MongoDB connection error');
  }
  next();
});

// Créez un schéma et un modèle utilisateur
const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  picture: String,
  pseudo: String,
  steamId: String
});

const User = mongoose.model('User', userSchema);

// Fonction pour générer des tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// Endpoint de connexion Google
app.post('/auth/google', async (req, res) => {
  const { googleId, name, email, picture } = req.body;
  console.log('Received Google auth request:', { googleId, name, email, picture });

  try {
    let user = await User.findOne({ googleId });
    if (!user) {
      user = new User({ googleId, name, email, picture, pseudo: '' });
      await user.save();
      console.log('New user created:', user);
    }

    const tokens = generateTokens({ id: user.id, googleId: user.googleId });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.send({ accessToken: tokens.accessToken, user });
  } catch (error) {
    console.error('Error during Google authentication:', error);
    res.status(500).send('Error during Google authentication');
  }
});

// Endpoint pour rafraîchir les tokens
app.post('/refresh-token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(403);

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const tokens = generateTokens({ id: user.id, googleId: user.googleId });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.json({ accessToken: tokens.accessToken });
  });
});

// Endpoint pour déconnexion
app.post('/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.sendStatus(204);
});

// Middleware pour vérifier le token d'accès
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Endpoint pour mettre à jour le pseudo de l'utilisateur
app.post('/user/:googleId/pseudo', authenticateToken, async (req, res) => {
  try {
    console.log('Updating pseudo for user:', req.params.googleId, 'with pseudo:', req.body.pseudo);
    const user = await User.findOneAndUpdate(
      { googleId: req.params.googleId },
      { pseudo: req.body.pseudo },
      { new: true }
    );
    if (!user) {
      return res.status(404).send('User not found');
    }
    console.log('Updated user:', user);
    res.send(user);
  } catch (error) {
    console.error('Error updating pseudo:', error);
    res.status(500).send('Error updating pseudo');
  }
});

app.use((req, res, next) => {
  console.log(`Received request for ${req.url}`);
  next();
});

app.use('/api/steam', async (req, res) => {
  const endpoint = req.url;
  const steamApiUrl = `http://api.steampowered.com${endpoint}`;
  console.log('Received request to:', steamApiUrl);

  try {
    const response = await axios.get(steamApiUrl);
    console.log('Data fetched from Steam API:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from Steam API:', error);
    res.status(500).send('Error fetching data from Steam API');
  }
});

// Endpoint pour mettre à jour le Steam ID de l'utilisateur
app.post('/user/:googleId/steamId', async (req, res) => {
  try {
    console.log('Received request for /user/:googleId/steamId');
    console.log('Request Params:', req.params);
    console.log('Request Body:', req.body);

    const user = await User.findOneAndUpdate(
      { googleId: req.params.googleId },
      { steamId: req.body.steamId },
      { new: true }
    );

    if (!user) {
      console.log('User not found');
      return res.status(404).send('User not found');
    }

    console.log('Updated user:', user);
    res.send(user);
  } catch (error) {
    console.error('Error updating Steam ID:', error);
    res.status(500).send('Error updating Steam ID');
  }
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
