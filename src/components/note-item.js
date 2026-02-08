class NoteItem extends HTMLElement {
  constructor() {
    super();
    this._note = { id: "", title: "", body: "", createdAt: "" };
  }

  static get observedAttributes() {
    return ["id", "title", "-body", "createdAt"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this._note[name.replace("data-", "")] = newValue;
      this.render();
    }
  }

  set note(value) {
    this._note = value;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  formatDate(dateString) {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric", month: "long", day: "numeric"
      });
    } catch { return dateString; }
  }

  render() {
    const displayDate = this.formatDate(this.getAttribute('created-at') || this._note.createdAt);
    const title = this.getAttribute('title') || this._note.title;
    const body = this.getAttribute('body') || this._note.body;
    const id = this.getAttribute('id') || this._note.id;

    this.innerHTML = `
      <div class="note-info">
        <h3>${title}</h3>
        <p>${body}</p>
        <small>📅 ${displayDate}</small>
      </div>
      <div class="note-actions">
        <button class="delete-btn" data-id="${id}">🗑️ Hapus</button>
      </div>
    `;

    // Event Listener untuk tombol hapus
    const deleteBtn = this.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      // Konfirmasi sederhana (opsional, tapi disarankan UX-nya)
      if(confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
        this.dispatchEvent(new CustomEvent("delete-note", {
            detail: { id: id },
            bubbles: true
        }));
      }
    });
  }
}

customElements.define("note-item", NoteItem);