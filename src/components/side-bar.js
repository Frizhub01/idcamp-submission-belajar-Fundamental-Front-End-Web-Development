class SideBar extends HTMLElement {
  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.innerHTML = `
      <aside class="sidebar">
        <h1 class="brand">Notes App</h1>
        <nav>
          <ul>
            <li>
              <a href="#" class="nav-link active" data-view="notes-list">
                📝 Daftar Catatan
              </a>
            </li>
            <li>
              <a href="#" class="nav-link" data-view="archived-list">
                📂 Arsip
              </a>
            </li>
            <li>
              <a href="#" class="nav-link" data-view="add-note">
                ➕ Buat Baru
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    `;
  }

  addEventListeners() {
    const links = this.querySelectorAll('.nav-link');
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        links.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');

        const viewName = link.getAttribute('data-view');

        this.dispatchEvent(
          new CustomEvent('navigate', {
            detail: viewName,
            bubbles: true,
          }),
        );
      });
    });
  }
}

customElements.define('side-bar', SideBar);
