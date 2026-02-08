const BASE_URL = 'https://notes-api.dicoding.dev/v2';

class NotesApi {
  static getNotes() {
    return fetch(`${BASE_URL}/notes`)
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          return Promise.reject(new Error(`Error: ${response.statusText}`));
        }
      })
      .then((responseJson) => {
        const { data } = responseJson;
        return Promise.resolve(data);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  // --- FITUR BARU: AMBIL ARSIP ---
  static getArchivedNotes() {
    return fetch(`${BASE_URL}/notes/archived`)
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          return Promise.reject(new Error(`Error: ${response.statusText}`));
        }
      })
      .then((responseJson) => {
        const { data } = responseJson;
        return Promise.resolve(data);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  static createNote(note) {
    return fetch(`${BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    })
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          return Promise.reject(new Error(`Error: ${response.statusText}`));
        }
      })
      .then((responseJson) => {
        if (responseJson.status !== 'success') {
          return Promise.reject(new Error(responseJson.message));
        }
        return responseJson.data;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  // --- FITUR BARU: ARSIPKAN ---
  static archiveNote(id) {
    return fetch(`${BASE_URL}/notes/${id}/archive`, {
      method: 'POST',
    })
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          return Promise.reject(new Error(`Error: ${response.statusText}`));
        }
      })
      .then((responseJson) => {
        return responseJson.message;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  // --- FITUR BARU: BATAL ARSIP ---
  static unarchiveNote(id) {
    return fetch(`${BASE_URL}/notes/${id}/unarchive`, {
      method: 'POST',
    })
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          return Promise.reject(new Error(`Error: ${response.statusText}`));
        }
      })
      .then((responseJson) => {
        return responseJson.message;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  static deleteNote(id) {
    return fetch(`${BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          return Promise.reject(new Error(`Error: ${response.statusText}`));
        }
      })
      .then((responseJson) => {
        if (responseJson.status !== 'success') {
          return Promise.reject(new Error(responseJson.message));
        }
        return responseJson.message;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }
}

export default NotesApi;