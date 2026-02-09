class NoteItem extends HTMLElement {
  constructor() {
    super();
    this._note = {
      id: '',
      title: '',
      body: '',
      createdAt: '',
      archived: false,
    };
  }

  static get observedAttributes() {
    return ['id', 'title', 'body', 'created-at', 'archived'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    this._note[name.replace('data-', '')] = newValue;

    if (this.isConnected) {
      this.render();
    }
  }

  set note(value) {
    this._note = value;
  }

  connectedCallback() {
    this.render();
  }

  formatDate(dateString) {
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  }

  render() {
    const displayDate = this.formatDate(
      this.getAttribute('created-at') || this._note.createdAt,
    );
    const title = this.getAttribute('title') || this._note.title;
    const body = this.getAttribute('body') || this._note.body;
    const id = this.getAttribute('id') || this._note.id;
    const isArchived = this.getAttribute('archived') === 'true';

    this.innerHTML = `
      <div class="note-info">
        <h3>${title}</h3>
        <p>${body}</p>
        <small class="date">📅 ${displayDate}</small>
      </div>
      
      <div class="note-actions">
        <button class="archive-btn" data-id="${id}">
          ${isArchived ? '📂 Aktifkan' : '📥 Arsipkan'}
        </button>
        <button class="delete-btn" data-id="${id}">🗑️ Hapus</button>
      </div>
    `;

    this.querySelector('.delete-btn').addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('delete-note', {
          detail: { id: id },
          bubbles: true,
        }),
      );
    });

    this.querySelector('.archive-btn').addEventListener('click', () => {
      const action = isArchived ? 'unarchive-note' : 'archive-note';
      this.dispatchEvent(
        new CustomEvent(action, {
          detail: { id: id },
          bubbles: true,
        }),
      );
    });
  }
}

customElements.define('note-item', NoteItem);
