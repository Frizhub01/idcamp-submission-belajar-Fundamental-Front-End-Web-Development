import "./styles/style.css";
import "./components/side-bar.js";
import "./components/note-input.js";
import "./components/note-list.js";
import Swal from "sweetalert2";
import NotesApi from "./data/api.js";

document.addEventListener("DOMContentLoaded", () => {
  const allList = document.querySelector("#allNotesList");
  const views = document.querySelectorAll(".view-section");

  // --- FUNGSI LOADING BARU (MENGGUNAKAN SWEETALERT2) ---
  const showLoading = () => {
    Swal.fire({
      title: 'Mohon Tunggu...',
      html: 'Sedang memproses data',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading(); // Menampilkan spinner bawaan SweetAlert
      },
    });
  };

  const hideLoading = () => {
    Swal.close();
  };

  // --- FUNGSI FEEDBACK (OPSIONAL 2) ---
  const showSuccess = (message) => {
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: message,
      showConfirmButton: false,
      timer: 1500
    });
  };

  const showError = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: message,
    });
  };

  const renderApp = () => {
    showLoading();
    NotesApi.getNotes()
      .then((notes) => {
        const sorted = notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        allList.notes = sorted;
        hideLoading();
      })
      .catch((error) => {
        alert(`Gagal mengambil data: ${error.message}`);
      });
  };

  renderApp();

  // --- EVENT LISTENER: NAVIGASI---
  document.addEventListener("navigate", (event) => {
    const targetId = event.detail;
    views.forEach((view) => {
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

    showLoading();
    NotesApi.createNote(newNote)
      .then(() => {
        showSuccess("Catatan Berhasil disimpan!");
        renderApp();
        const sideBar = document.querySelector("side-bar");
        const notesLink = sideBar.querySelector('[data-target="notes-list"]');
        if (notesLink) notesLink.click();
      })
      .catch((error) => {
        showError(error.message);
      });
  });

  // === EVENT LISTENER: HAPUS CATATAN ===
  document.addEventListener("delete-note", (event) => {
    const noteId = event.detail.id;

    // Konfirmasi sebelum hapus (Fitur tambahan SweetAlert)
    Swal.fire({
      title: 'Hapus Catatan?',
      text: "Anda tidak bisa mengembalikannya lagi!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        showLoading();
        NotesApi.deleteNote(noteId)
          .then(() => {
            showSuccess("Catatan berhasil dihapus!");
            renderApp();
          })
          .catch((error) => {
            showError(error.message);
          });
      }
    });
  });
});