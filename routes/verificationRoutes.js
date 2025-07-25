const express = require('express');
const multer = require('multer');
const axios = require('axios');
let PrismaClient;
try { ({ PrismaClient } = require('@prisma/client')); }
catch (e) { ({ PrismaClient } = require('../prisma_client_stub')); }
const prisma = new PrismaClient();

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/verify/selfie', upload.single('selfie'), async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  await prisma.user.update({ where: { id: userId }, data: { verificationStatus: 'pending' } });
  // Here you would send the selfie file to Veriff using axios
  res.json({ status: 'pending' });
});

router.post('/verify/document', upload.single('document'), async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  // Send document file to Veriff service
  res.json({ status: 'pending' });
});

router.get('/verify/status', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  res.json({ status: user?.verificationStatus || 'unverified' });
});

module.exports = router;
