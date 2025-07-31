// Lovense integration helpers
// Provides pair(), startVibration() and stopVibration() with basic UI feedback.

const LOVENSE_URL = 'http://localhost:30010';
let paired = false;
const statusIcon = document.getElementById('vibeStatusIcon');

async function connectLovense() {
  const res = await fetch(`${LOVENSE_URL}/GetToys`).catch(() => null);
  if (!res || !res.ok) throw new Error('No toys detected');
  const data = await res.json();
  console.log('Connected toys:', data);
  return data;
}

async function pair() {
  try {
    await connectLovense();
    paired = true;
  } catch (e) {
    console.error('Failed to connect to Lovense Connect:', e);
    paired = false;
  }
}

async function vibrateToy(device = 'all', level = 1, time = 5) {
  await fetch(`${LOVENSE_URL}/Vibrate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ device, level, time })
  });
}

async function startVibration(level = 1, time = 5) {
  if (!paired) return;
  statusIcon?.classList.add('animate-pulse', 'text-pink-500');
  try {
    await vibrateToy('all', level, time);
  } finally {
    statusIcon?.classList.remove('animate-pulse', 'text-pink-500');
  }
}

function stopVibration() {
  statusIcon?.classList.remove('animate-pulse', 'text-pink-500');
}

window.lovense = { pair, startVibration, stopVibration };
