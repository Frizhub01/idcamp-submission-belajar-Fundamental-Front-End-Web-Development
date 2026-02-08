class NoteInput extends HTMLElement {
  connectedCallback() {
    this.render();
    this.addEventListeners();
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
    const form = this.querySelector("#noteForm");
    const title = this.querySelector("#title");
    const body = this.querySelector("#body");
    const titleError = this.querySelector("#titleError");
    const bodyError = this.querySelector("#bodyError");

    const customValidationHandler = (input, errorElement, minLength) => {
      if (input.value.length > 0 && input.value.length < minLength) {
        errorElement.innerText = `Minimal ${minLength} karakter (saat ini: ${input.value.length})`;
        return false;
      } else {
        errorElement.innerText = "";
        return true;
      }
    };

    title.addEventListener("input", () => customValidationHandler(title, titleError, 3));
    title.addEventListener("blur", () => customValidationHandler(title, titleError, 3));

    body.addEventListener("input", () => customValidationHandler(body, bodyError, 5));
    body.addEventListener("blur", () => customValidationHandler(body, bodyError, 5));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const isTitleValid = customValidationHandler(title, titleError, 3);
      const isBodyValid = customValidationHandler(body, bodyError, 5);

      if (isTitleValid && isBodyValid) {
        const newNote = {
          id: `notes-${Date.now()}`,
          title: title.value,
          body: body.value,
          createdAt: new Date().toISOString(),
          archived: false,
        };

        this.dispatchEvent(new CustomEvent("note-submitted", { 
          detail: newNote, 
          bubbles: true 
        }));
        
        form.reset();
        titleError.innerText = "";
        bodyError.innerText = "";
      }
    });
  }
}

customElements.define("note-input", NoteInput);