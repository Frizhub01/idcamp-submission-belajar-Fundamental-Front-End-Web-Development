import notesData from './data/notes.js';
import './components/side-bar.js';
import './components/note-input.js';
import './components/note-list.js';

document.addEventListener("DOMContentLoaded", () => {
  let currentNotes = [...notesData];

  const allList = document.querySelector("#allNotesList");
  const views = document.querySelectorAll(".view-section");

  const renderApp = () => {
    const sorted = currentNotes.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    allList.notes = sorted;
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
    currentNotes.push(event.detail);
    
    renderApp();
    
    const sideBar = document.querySelector("side-bar");
    const notesLink = sideBar.querySelector('[data-target="notes-list"]');
    
    if(notesLink) notesLink.click();
    
    alert("Catatan berhasil disimpan!");
  });
});