const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/printpress', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// User Schema
const UserSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  name: String,
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Quote Request Schema
const QuoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  email: String,
  phone: String,
  serviceType: String,
  quantity: Number,
  description: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Quote = mongoose.model('Quote', QuoteSchema);

// Passport Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          avatar: profile.photos[0].value
        });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Auth Middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// Routes

// Auth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }),
  (req, res) => {
    res.redirect('http://localhost:3000/dashboard');
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.json({ message: 'Logged out successfully' });
  });
});

app.get('/auth/user', isAuthenticated, (req, res) => {
  res.json(req.user);
});

// Quote Routes
app.post('/api/quotes', isAuthenticated, async (req, res) => {
  try {
    const quote = await Quote.create({
      userId: req.user._id,
      ...req.body
    });
    res.status(201).json(quote);
  } catch (err) {
    res.status(500).json({ message: 'Error creating quote', error: err.message });
  }
});

app.get('/api/quotes', isAuthenticated, async (req, res) => {
  try {
    const quotes = await Quote.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching quotes', error: err.message });
  }
});

app.get('/api/quotes/:id', isAuthenticated, async (req, res) => {
  try {
    const quote = await Quote.findOne({ _id: req.params.id, userId: req.user._id });
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    res.json(quote);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching quote', error: err.message });
  }
});

// Contact Form Route (public)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    // Here you would typically send an email or save to database
    console.log('Contact form submission:', { name, email, message });
    res.json({ message: 'Contact form submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting contact form', error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});