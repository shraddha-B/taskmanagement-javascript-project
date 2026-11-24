let alertAudio = null;

export function initAlertSound(container = document.body, src = './Sounds/alert-notification-sound.wav') { //./Sounds/alert.mp3
  if (alertAudio) return; // already initialized

  alertAudio = document.createElement('audio');
  alertAudio.id = 'alert-sound';
  alertAudio.src = src;
  alertAudio.preload = 'auto';
  container.appendChild(alertAudio);
}

export function playAlertSound() {
  if (!alertAudio) return;
  alertAudio.currentTime = 0;
  alertAudio.play().catch(err => {
    console.error('Audio playback failed:', err);
  });
}
