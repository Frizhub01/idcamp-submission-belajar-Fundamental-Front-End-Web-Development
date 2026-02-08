import "./note-item.js";

class NoteList extends HTMLElement {
  set notes(notes) {
    this._notes = notes;
    this.render();
  }

  render() {
    this.innerHTML = "";

    if (!this._notes || this._notes.length === 0) {
      this.innerHTML = "<p style='color:#888; text-align: center;'>Tidak ada catatan.</p>";
      return;
    }

    this._notes.forEach((note) => {
      const noteItemElement = document.createElement("note-item");

      noteItemElement.setAttribute("id", note.id);
      noteItemElement.setAttribute("title", note.title);
      noteItemElement.setAttribute("body", note.body);
      noteItemElement.setAttribute("created-at", note.createdAt);
      noteItemElement.setAttribute("archived", note.archived);

      this.appendChild(noteItemElement);
    });
  }
}

customElements.define("note-list", NoteList);
