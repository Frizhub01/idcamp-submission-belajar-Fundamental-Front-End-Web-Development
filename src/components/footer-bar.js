class FooterBar extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        width: 100%;
        background-color: var(--white, #ffffff);
        color: var(--font-color, #333);
        
        /* PERHALUS: Border tipis dan Shadow ke atas agar transisi dengan sidebar mulus */
        border-top: 1px solid rgba(0, 0, 0, 0.05); 
        box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.05);
      }

      .footer-container {
        /* TIPIS: Padding diperkecil drastis (atas-bawah cuma 10px) */
        padding: 10px 24px;
        display: flex;
        flex-direction: column;
        gap: 5px; /* Jarak antar judul dan konten dirapatkan */
      }

      /* --- BAGIAN JUDUL & GARIS --- */
      .footer-header {
        border-bottom: 1.5px solid var(--primary-light, #6c5ce7);
        padding-bottom: 4px; /* Jarak garis ke teks judul */
        margin-bottom: 2px;
        width: 100%;
      }

      .footer-title {
        margin: 0;
        font-size: 0.9rem; /* Ukuran font judul diperkecil */
        font-weight: 700;
        color: var(--primary-dark, #2d3436);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      /* --- BAGIAN KONTEN --- */
      .footer-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.8rem; /* Font konten lebih kecil (12-13px) */
        color: #888;
      }

      .heart {
        color: #e74c3c;
        display: inline-block;
        animation: beat 1.5s infinite ease-in-out;
      }

      @keyframes beat {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }

      @media (max-width: 600px) {
        .footer-content {
          flex-direction: column;
          gap: 4px;
          text-align: center;
        }
        .footer-header {
          text-align: center;
        }
      }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = '';
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `      
      <div class="footer-container">
        <div class="footer-header">
          <h4 class="footer-title">Notes App</h4>
        </div>

        <div class="footer-content">
          <div class="copyright">
            &copy; 2026 Submission Belajar Fundamental Front-End Web Development
          </div>
          <div class="credit">
            Dibuat dengan <span class="heart">❤️</span> oleh <strong>Muhamad Afriza</strong>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('footer-bar', FooterBar);
