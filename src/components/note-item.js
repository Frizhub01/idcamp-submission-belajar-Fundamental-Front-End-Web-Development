class NoteItem extends HTMLElement {
  constructor() {
    super();
    this._note = { title: "", body: "", createdAt: "" };
  }

  static get observedAttributes() {
    return ["title", "body", "created-at"];
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

    this.innerHTML = `
      <h3>${title}</h3>
      <p>${body}</p>
      <small>📅 ${displayDate}</small>
    `;
  }
}

customElements.define("note-item", NoteItem);