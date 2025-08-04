// Lovense integration helpers
// Provides pair(), startVibration() and stopVibration() with basic UI feedback.

const LOVENSE_URL = 'http://localhost:30010';
const BLE_SERVICE = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const BLE_CHAR = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
let paired = false;
let bleCharacteristic = null;
const statusIcon = document.getElementById('vibeStatusIcon');

async function connectLovense() {
  const res = await fetch(`${LOVENSE_URL}/GetToys`).catch(() => null);
  if (!res || !res.ok) throw new Error('No toys detected');
  const data = await res.json();
  console.log('Connected toys:', data);
  return data;
}

async function pairBluetooth() {
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: [BLE_SERVICE] }]
  });
  const server = await device.gatt.connect();
  const service = await server.getPrimaryService(BLE_SERVICE);
  bleCharacteristic = await service.getCharacteristic(BLE_CHAR);
}

async function pair() {
  try {
    if ('bluetooth' in navigator) {
      await pairBluetooth();
      paired = true;
      return;
    }
  } catch (err) {
    console.warn('Bluetooth pairing failed, falling back to Lovense Connect', err);
  }
  try {
    await connectLovense();
    paired = true;
  } catch (e) {
    console.error('Failed to connect to Lovense Connect:', e);
    paired = false;
  }
}

async function vibrateToy(device = 'all', level = 1, time = 5) {
  if (bleCharacteristic) {
    const intensity = Math.min(Math.max(Math.round(level * 20), 0), 20);
    const cmd = new TextEncoder().encode(`Vibrate:${intensity};`);
    await bleCharacteristic.writeValue(cmd);
    return;
  }
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
  if (bleCharacteristic) {
    const cmd = new TextEncoder().encode('Vibrate:0;');
    bleCharacteristic.writeValue(cmd).catch(() => {});
  }
}

window.lovense = { pair, startVibration, stopVibration };
