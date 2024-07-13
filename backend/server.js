const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Créez un schéma et un modèle utilisateur
const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  picture: String,
  pseudo: String,
});

const User = mongoose.model('User', userSchema);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://localhost:27017/steam-app-project', {
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
      return res.status(201).send({ user, newUser: true });
    }
    console.log('User exists:', user);
    res.send({ user, newUser: false });
  } catch (error) {
    console.error('Error during Google authentication:', error);
    res.status(500).send('Error during Google authentication');
  }
});

// Endpoint pour mettre à jour le pseudo de l'utilisateur
app.post('/user/:googleId/pseudo', async (req, res) => {
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
