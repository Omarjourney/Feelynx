const mascot = document.getElementById('mascot');
const eyeL   = document.getElementById('eyeL');
const eyeR   = document.getElementById('eyeR');
const pupilL = document.getElementById('pupilL');
const pupilR = document.getElementById('pupilR');
const tail   = document.getElementById('tail');

// Eye‐follow logic
document.addEventListener('mousemove', e => {
  [ {eye: eyeL, pupil: pupilL}, {eye: eyeR, pupil: pupilR} ]
    .forEach(pair => {
      const rect = pair.eye.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width/2);
      const dy = e.clientY - (rect.top  + rect.height/2);
      const dist = Math.min(4, Math.hypot(dx,dy) / 20);
      const angle = Math.atan2(dy, dx);
      pair.pupil.setAttribute(
        'transform',
        `translate(${Math.cos(angle)*dist},${Math.sin(angle)*dist})`
      );
    });
});

// Tail wag on hover
mascot.addEventListener('mouseenter', () => {
  tail.animate([
    { transform: 'rotate(0deg)' },
    { transform: 'rotate(15deg)' },
    { transform: 'rotate(-15deg)' },
    { transform: 'rotate(0deg)' }
  ], { duration: 1000, iterations: Infinity });
});

mascot.addEventListener('mouseleave', () => {
  tail.getAnimations().forEach(a => a.cancel());
});
