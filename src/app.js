import './styles/style.css';
import './components/side-bar.js';
import './components/note-input.js';
import './components/note-list.js';
import Swal from 'sweetalert2';
import NotesApi from './data/api.js';

document.addEventListener('DOMContentLoaded', () => {
  const allList = document.querySelector('#allNotesList');
  const sectionTitle = document.querySelector('.section-title');

  // State untuk melacak kita sedang di mode apa ("active" atau "archived")
  let currentViewMode = 'active';

  // --- FUNGSI LOADING & FEEDBACK ---
  const showLoading = () => {
    Swal.fire({
      title: 'Mohon Tunggu...',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => Swal.showLoading(),
    });
  };

  const hideLoading = () => Swal.close();

  const showSuccess = (msg) =>
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: msg,
      showConfirmButton: false,
      timer: 1500,
    });
  const showError = (msg) =>
    Swal.fire({ icon: 'error', title: 'Gagal!', text: msg });

  // --- FUNGSI RENDER UTAMA ---
  const renderApp = () => {
    showLoading();

    // Tentukan mau ambil data yang mana berdasarkan state
    const apiCall =
      currentViewMode === 'archived'
        ? NotesApi.getArchivedNotes()
        : NotesApi.getNotes();

    apiCall
      .then((notes) => {
        // Reset HTML list biar bersih
        allList.innerHTML = '';

        // Sorting berdasarkan tanggal terbaru
        const sorted = notes.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        // Kirim data ke komponen note-list
        allList.notes = sorted;

        // Update Judul Halaman biar user tau lagi di mana
        if (sectionTitle) {
          sectionTitle.innerText =
            currentViewMode === 'archived'
              ? '📂 Catatan Arsip'
              : '📝 Daftar Catatan';
        }

        hideLoading();
      })
      .catch((error) => {
        hideLoading();
        showError(error.message);
      });
  };

  // Render awal (default: catatan aktif)
  renderApp();

  // --- EVENT LISTENER: NAVIGASI DARI SIDEBAR ---
  document.addEventListener('navigate', (event) => {
    const targetView = event.detail;

    // Ambil elemen section
    const notesListSection = document.querySelector('#notes-list');
    const addNoteSection = document.querySelector('#add-note');

    // Logika Navigasi
    if (targetView === 'notes-list') {
      currentViewMode = 'active';
      notesListSection.classList.remove('hidden');
      addNoteSection.classList.add('hidden');
      renderApp();
    } else if (targetView === 'archived-list') {
      currentViewMode = 'archived';
      notesListSection.classList.remove('hidden'); // Tetap pakai section list
      addNoteSection.classList.add('hidden');
      renderApp();
    } else if (targetView === 'add-note') {
      notesListSection.classList.add('hidden');
      addNoteSection.classList.remove('hidden');
    }
  });

  // --- EVENT LISTENER: TAMBAH CATATAN ---
  document.addEventListener('note-submitted', (event) => {
    const { title, body } = event.detail;
    showLoading();
    NotesApi.createNote({ title, body })
      .then(() => {
        showSuccess('Catatan Berhasil disimpan!');

        // Paksa pindah ke tab "Semua Catatan" setelah nambah
        const sideBar = document.querySelector('side-bar');
        const notesLink = sideBar.shadowRoot
          ? sideBar.shadowRoot.querySelector('[data-view="notes-list"]') // Jika pakai shadowDOM
          : sideBar.querySelector('[data-view="notes-list"]'); // Jika tidak

        if (notesLink) notesLink.click();
        else renderApp(); // Fallback jika link tidak ketemu
      })
      .catch((error) => showError(error.message));
  });

  // --- EVENT LISTENER: HAPUS ---
  document.addEventListener('delete-note', (event) => {
    Swal.fire({
      title: 'Hapus Catatan?',
      text: 'Anda tidak bisa mengembalikannya lagi!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        showLoading();
        NotesApi.deleteNote(event.detail.id)
          .then(() => {
            showSuccess('Catatan berhasil dihapus!');
            renderApp();
          })
          .catch((error) => showError(error.message));
      }
    });
  });

  // --- EVENT LISTENER: ARSIPKAN ---
  document.addEventListener('archive-note', (event) => {
    showLoading();
    NotesApi.archiveNote(event.detail.id)
      .then(() => {
        showSuccess('Catatan berhasil diarsipkan!');
        renderApp();
      })
      .catch((error) => showError(error.message));
  });

  // --- EVENT LISTENER: AKTIFKAN KEMBALI (UNARCHIVE) ---
  document.addEventListener('unarchive-note', (event) => {
    showLoading();
    NotesApi.unarchiveNote(event.detail.id)
      .then(() => {
        showSuccess('Catatan dikembalikan ke aktif!');
        renderApp();
      })
      .catch((error) => showError(error.message));
  });
});
