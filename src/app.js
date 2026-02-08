import './components/side-bar.js';
import './components/note-input.js';
import './components/note-list.js';
import NotesApi from './data/api.js';
import './styles/style.css';

document.addEventListener("DOMContentLoaded", () => {
  const allList = document.querySelector("#allNotesList");
  const views = document.querySelectorAll(".view-section");

  const renderApp = () => {
    NotesApi.getNotes()
      .then((notes) => {
        const sorted = notes.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        allList.notes = sorted;
      })
      .catch((error) => {
        alert(`Gagal mengambil data: ${error.message}`);
      });
  };

  renderApp();

  // --- EVENT LISTENER: NAVIGASI---
  document.addEventListener("navigate", (event) => {
    const targetId = event.detail;
    views.forEach(view => {
      if (view.id === targetId) {
        view.classList.remove("hidden");
      } else {
        view.classList.add("hidden");
      }
    });
  });

  // --- EVENT LISTENER: TAMBAH CATATAN ---
  document.addEventListener("note-submitted", (event) => {
    // note-input.js mengirim object lengkap, tapi API hanya butuh {title, body}
    const { title, body } = event.detail; 
    const newNote = { title, body };

    NotesApi.createNote(newNote)
      .then(() => {
        alert("Catatan berhasil disimpan!");
        // Refresh daftar catatan
        renderApp();
        
        // Pindah kembali ke list view
        const sideBar = document.querySelector("side-bar");
        const notesLink = sideBar.querySelector('[data-target="notes-list"]');
        if(notesLink) notesLink.click();
      })
      .catch((error) => {
        alert(`Gagal menyimpan catatan: ${error.message}`);
      });
  });

  // === EVENT LISTENER: HAPUS CATATAN ===
  document.addEventListener("delete-note", (event) => {
    const noteId = event.detail.id;

    NotesApi.deleteNote(noteId)
      .then(() => {
        alert("Catatan berhasil dihapus!");
        renderApp(); // Refresh daftar catatan setelah dihapus
      })
      .catch((error) => {
        alert(`Gagal menghapus catatan: ${error.message}`);
      });
  });
});