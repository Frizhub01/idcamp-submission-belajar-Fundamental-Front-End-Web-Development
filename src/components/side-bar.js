class SideBar extends HTMLElement {
  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.innerHTML = `
      <nav class="sidebar">
        <h1>NOTES APP</h1>
        <ul class="nav-links">
          <li>
            <a href="#" class="nav-link active" data-view="notes-list">
              <span class="icon">📝</span>
              <span class="label">Catatan</span>
            </a>
          </li>
          
          <li>
            <a href="#" class="nav-link" data-view="archived-list">
              <span class="icon">📂</span>
              <span class="label">Arsip</span>
            </a>
          </li>
          
          <li>
            <a href="#" class="nav-link" data-view="add-note">
              <span class="icon">➕</span>
              <span class="label">Tambah</span>
            </a>
          </li>
        </ul>
      </nav>
    `;
  }

  addEventListeners() {
    const links = this.querySelectorAll('.nav-link');

    links.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();

        this.updateActiveState(link.dataset.view);
        this.dispatchEvent(
          new CustomEvent('navigate', {
            detail: link.dataset.view,
            bubbles: true,
            composed: true,
          }),
        );
      });
    });
  }

  updateActiveState(targetView) {
    const links = this.querySelectorAll('.nav-link');
    links.forEach((link) => link.classList.remove('active'));

    const targetLink = this.querySelector(`[data-view="${targetView}"]`);
    if (targetLink) {
      targetLink.classList.add('active');
    }
  }
}

customElements.define('side-bar', SideBar);
