const express = require('express');
let PrismaClient;
try { ({ PrismaClient } = require('@prisma/client')); }
catch (e) { ({ PrismaClient } = require('../prisma_client_stub')); }
const prisma = new PrismaClient();

const admin = (() => {
  try {
    const adminLib = require('firebase-admin');
    if (!adminLib.apps.length) {
      try {
        adminLib.initializeApp();
      } catch (initErr) {
        return null;
      }
    }
    return adminLib;
  } catch (e) {
    return null;
  }
})();

const router = express.Router();
router.use(express.json());

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    let uid;
    if (admin) {
      try {
        const userRecord = await admin.auth().createUser({ email, password });
        uid = userRecord.uid;
      } catch (adminErr) {
        uid = undefined;
      }
    }
    const user = await prisma.user.create({ data: { email, uid } });
    req.session.userId = user.id;
    res.json({ id: user.id, email: user.email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  req.session.userId = user.id;
  res.json({ message: 'Logged in' });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
});

module.exports = router;
