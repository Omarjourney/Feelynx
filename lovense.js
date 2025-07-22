// Basic Lovense integration using the local Lovense Connect API
// Assumes Lovense Connect is running on the same machine (default port 30010)
// Exposes global `lovense` object with helper methods

const LOVENSE_URL = 'http://localhost:30010';

async function connectLovense() {
  try {
    const res = await fetch(`${LOVENSE_URL}/GetToys`);
    if (!res.ok) throw new Error('No toys detected');
    const data = await res.json();
    console.log('Connected toys:', data);
    return data;
  } catch (err) {
    console.error('Failed to connect to Lovense Connect:', err);
  }
}

async function vibrateToy(device = 'all', level = 1, time = 5) {
  try {
    await fetch(`${LOVENSE_URL}/Vibrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ device, level, time })
    });
  } catch (err) {
    console.error('Failed to send vibration command:', err);
  }
}

window.lovense = { connectLovense, vibrateToy };
