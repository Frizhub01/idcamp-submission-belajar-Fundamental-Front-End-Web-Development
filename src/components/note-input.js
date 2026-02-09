import anime from 'animejs/lib/anime.es.js';

class NoteInput extends HTMLElement {
  connectedCallback() {
    this.render();
    this.addEventListeners();
    this.animateEntrance();
  }

  animateShake() {
    anime({
      targets: this.querySelector('form'),
      translateX: [
        { value: -10, duration: 100 },
        { value: 10, duration: 100 },
        { value: -5, duration: 100 },
        { value: 5, duration: 100 },
        { value: 0, duration: 100 }
      ],
      easing: 'easeInOutQuad'
    });
  }

  animateEntrance() {
    anime({
      targets: this.querySelector('form'), // Targetkan form
      opacity: [0, 1],         // Fade in
      translateY: [50, 0],     // Slide dari bawah ke atas
      scale: [0.95, 1],         // Sedikit membesar
      duration: 800,           // Durasi (ms)
      easing: 'easeOutElastic(1, .8)', // Efek membal yang halus
      delay: 200               // Tunggu sebentar
    });
  }

  render() {
    this.innerHTML = `
      <form id="noteForm">
        <div class="form-group">
          <input type="text" id="title" placeholder="Judul (Min. 3 karakter)" required minlength="3" autocomplete="off">
          <span class="error-message" id="titleError"></span>
        </div>
        <div class="form-group">
          <textarea id="body" rows="6" placeholder="Isi catatan (Min. 5 karakter)..." required minlength="5"></textarea>
          <span class="error-message" id="bodyError"></span>
        </div>
        <button type="submit">Simpan</button>
      </form>
    `;
  }

  addEventListeners() {
    const form = this.querySelector('#noteForm');
    const title = this.querySelector('#title');
    const body = this.querySelector('#body');
    const titleError = this.querySelector('#titleError');
    const bodyError = this.querySelector('#bodyError');

    const customValidationHandler = (input, errorElement, minLength) => {
      if (input.value.length > 0 && input.value.length < minLength) {
        errorElement.innerText = `Minimal ${minLength} karakter (saat ini: ${input.value.length})`;
        return false;
      } else {
        errorElement.innerText = '';
        return true;
      }
    };

    title.addEventListener('input', () => customValidationHandler(title, titleError, 3));
    title.addEventListener('blur', () => customValidationHandler(title, titleError, 3));
    body.addEventListener('input', () => customValidationHandler(body, bodyError, 5));
    body.addEventListener('blur', () => customValidationHandler(body, bodyError, 5));

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const isTitleValid = customValidationHandler(title, titleError, 3);
      const isBodyValid = customValidationHandler(body, bodyError, 5);

      if (isTitleValid && isBodyValid) {
        const newNote = {
          title: title.value,
          body: body.value,
        };

        this.dispatchEvent(
          new CustomEvent('note-submitted', {
            detail: newNote,
            bubbles: true,
            composed: true, 
          }),
        );

        form.reset();
        titleError.innerText = '';
        bodyError.innerText = '';
      } else {
        this.animateShake(); 
      }
    });

    const btn = this.querySelector('button');
    btn.addEventListener('mousedown', () => {
      anime({
        targets: btn,
        scale: 0.95,
        duration: 100,
        easing: 'easeOutQuad'
      });
    });
    
    btn.addEventListener('mouseup', () => {
      anime({
        targets: btn,
        scale: 1,
        duration: 100,
        easing: 'easeOutQuad'
      });
    });
  }
}

customElements.define('note-input', NoteInput);