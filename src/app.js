// --- STYLES ---
import './styles/abstracts/variables.css';
import './styles/base/global.css';
import './styles/layout/app-shell.css';
import './styles/components/sidebar.css';
import './styles/components/note-form.css';
import './styles/components/note-list.css';

// --- COMPONENTS & LOGIC ---
import './components/side-bar.js';
import './components/note-input.js';
import './components/note-list.js';
import './components/footer-bar.js';
import Swal from 'sweetalert2';
import NotesApi from './data/api.js';

document.addEventListener('DOMContentLoaded', () => {
  const allList = document.querySelector('#allNotesList');
  const sectionTitle = document.querySelector('.section-title');
  const notesListSection = document.querySelector('#notes-list');
  const addNoteSection = document.querySelector('#add-note');

  let currentViewMode = 'active';
  const showLoading = () => {
    Swal.fire({
      title: 'Mohon Tunggu...',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => Swal.showLoading(),
    });
  };

  const hideLoading = () => Swal.close();

  const showSuccess = (msg) => {
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: msg,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const showError = (msg) => {
    Swal.fire({ icon: 'error', title: 'Gagal!', text: msg });
  };

  const renderApp = async () => {
    try {
      showLoading();

      const notes =
        currentViewMode === 'archived'
          ? await NotesApi.getArchivedNotes()
          : await NotesApi.getNotes();

      allList.innerHTML = '';

      const sorted = notes.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      allList.notes = sorted;

      if (sectionTitle) {
        sectionTitle.innerText =
          currentViewMode === 'archived' ? 'Catatan Arsip' : 'Daftar Catatan';
      }

      hideLoading();
    } catch (error) {
      hideLoading();
      showError(error.message);
    }
  };

  renderApp();

  // --- EVENT LISTENER: NAVIGASI ---
  document.addEventListener('navigate', (event) => {
    const targetView = event.detail;

    if (targetView === 'notes-list') {
      currentViewMode = 'active';
      notesListSection.classList.remove('hidden');
      addNoteSection.classList.add('hidden');
      renderApp();
    } else if (targetView === 'archived-list') {
      currentViewMode = 'archived';
      notesListSection.classList.remove('hidden');
      addNoteSection.classList.add('hidden');
      renderApp();
    } else if (targetView === 'add-note') {
      notesListSection.classList.add('hidden');
      addNoteSection.classList.remove('hidden');
    }
  });

  // --- EVENT LISTENER: TAMBAH CATATAN ---
  document.addEventListener('note-submitted', async (event) => {
    const { title, body } = event.detail;

    try {
      showLoading();
      await NotesApi.createNote({ title, body });
      showSuccess('Catatan Berhasil disimpan!');

      currentViewMode = 'active';

      const notesListSection = document.querySelector('#notes-list');
      const addNoteSection = document.querySelector('#add-note');
      if (notesListSection && addNoteSection) {
        notesListSection.classList.remove('hidden');
        addNoteSection.classList.add('hidden');
      }

      const sideBarElement = document.querySelector('side-bar');
      if (sideBarElement) {
        sideBarElement.updateActiveState('notes-list');
      }

      await renderApp();
    } catch (error) {
      hideLoading();
      showError(error.message);
    }
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          showLoading();
          await NotesApi.deleteNote(event.detail.id);
          showSuccess('Catatan berhasil dihapus!');
          renderApp();
        } catch (error) {
          hideLoading();
          showError(error.message);
        }
      }
    });
  });

  // --- EVENT LISTENER: ARSIPKAN ---
  document.addEventListener('archive-note', async (event) => {
    try {
      showLoading();
      await NotesApi.archiveNote(event.detail.id);
      showSuccess('Catatan berhasil diarsipkan!');
      renderApp();
    } catch (error) {
      hideLoading();
      showError(error.message);
    }
  });

  // --- EVENT LISTENER: UN-ARSIPKAN ---
  document.addEventListener('unarchive-note', async (event) => {
    try {
      showLoading();
      await NotesApi.unarchiveNote(event.detail.id);
      showSuccess('Catatan dikembalikan ke aktif!');
      renderApp();
    } catch (error) {
      hideLoading();
      showError(error.message);
    }
  });
});
