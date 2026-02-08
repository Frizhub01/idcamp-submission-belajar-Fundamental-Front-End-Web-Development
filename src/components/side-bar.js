class SideBar extends HTMLElement {
  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.innerHTML = `
      <div class="brand">
        <h2>Notes App</h2>
      </div>
      <nav class="nav-links">
        <a href="#" class="nav-link active" data-target="notes-list">
          <span>📚</span> Daftar Catatan
        </a>
        <a href="#" class="nav-link" data-target="add-note">
          <span>➕</span> Tambah Catatan
        </a>
      </nav>
    `;
  }

  addEventListeners() {
    const links = this.querySelectorAll(".nav-link");
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        links.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");

        const target = link.getAttribute("data-target");

        this.dispatchEvent(
          new CustomEvent("navigate", {
            detail: target,
            bubbles: true,
          }),
        );
      });
    });
  }
}

customElements.define("side-bar", SideBar);
