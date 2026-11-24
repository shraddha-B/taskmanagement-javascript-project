export function injectSlidingLogos(targetElement = document.querySelector('footer')) {

  const logoSlider = document.createElement('div');
  logoSlider.className = 'logo-container';
  logoSlider.id = 'logoContainer';
  logoSlider.innerHTML = `
                <h5>Our trusted partners</h5>
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Google_Logo.svg" class="logo" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" class="logo" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Apple-logo.png" class="logo" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                    class="logo" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Logo_Twitter.svg" class="logo" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/YouTube_logo_2017.svg" class="logo" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Google_Logo.svg" class="logo" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Google_Logo.svg" class="logo" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Google_Logo.svg" class="logo" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Google_Logo.svg" class="logo" />
            </div>
    `;

  if (targetElement) {
    targetElement.appendChild(logoSlider);
  }
}
