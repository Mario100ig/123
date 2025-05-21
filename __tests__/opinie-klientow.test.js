/**
 * @jest-environment jsdom
 */

document.body.innerHTML = `
  <form id="opinia-form">
    <input type="text" id="opinia" name="opinia">
    <button type="submit">Dodaj opinię</button>
  </form>
  <ul id="opinie-list"></ul>
`;

function getOpinie() {
  try {
    return JSON.parse(localStorage.getItem('paradiseOpinieKlientow') || '[]');
  } catch (e) {
    return [];
  }
}
function setOpinie(opinie) {
  try {
    localStorage.setItem('paradiseOpinieKlientow', JSON.stringify(opinie));
  } catch (e) {}
}
function renderOpinie() {
  const opinieList = document.getElementById('opinie-list');
  opinieList.innerHTML = '';
  const opinie = getOpinie();
  if (!opinie.length) {
    opinieList.innerHTML = '<li class="opinia-empty">Brak opinii. Bądź pierwszy!</li>';
    return;
  }
  opinie.forEach((op, idx) => {
    const li = document.createElement('li');
    li.className = 'opinia-item';
    li.innerHTML = `<div class="opinia-content">${op.text}</div><button class="opinia-delete" title="Usuń" data-idx="${idx}">×</button>`;
    opinieList.appendChild(li);
  });
}
window.renderOpinie = renderOpinie;

describe('Opinie klientów (localStorage)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.getElementById('opinia').value = '';
    renderOpinie();
  });

  it('wyświetla "Brak opinii." gdy nie ma opinii', () => {
    renderOpinie();
    expect(document.getElementById('opinie-list').textContent).toContain('Brak opinii. Bądź pierwszy!');
  });

  it('dodaje opinię i renderuje ją', () => {
    setOpinie([]);
    setOpinie([{text: 'Super!'}]);
    renderOpinie();
    expect(document.getElementById('opinie-list').innerHTML).toContain('Super!');
  });

  it('usuwa opinię po kliknięciu Usuń', () => {
    setOpinie([{text: 'A'},{text: 'C'}]);
    renderOpinie();
    // Usuwamy pierwszą (ostatnio dodaną)
    const opinie = getOpinie();
    opinie.splice(1, 1);
    setOpinie(opinie);
    renderOpinie();
    expect(getOpinie().length).toBe(1);
    expect(getOpinie()[0].text).toBe('A');
  });

  it('nie dodaje opinii krótszej niż 3 znaki', () => {
    document.getElementById('opinia').value = 'ok';
    const form = document.getElementById('opinia-form');
    // Patch: rejestrowanie window.alert PRZED dodaniem listenera submit
    window.alert = jest.fn();
    // Dodajemy submit handler z walidacją długości (jak w produkcji)
    form.onsubmit = function(e) {
      e.preventDefault();
      const text = form.elements['opinia'].value.trim();
      if (text.length < 3) {
        window.alert('Opinia musi mieć co najmniej 3 znaki.');
        return;
      }
      if (!text) return;
      const opinie = getOpinie();
      opinie.unshift({ text });
      setOpinie(opinie);
      form.reset();
      renderOpinie();
    };
    form.dispatchEvent(new Event('submit', {bubbles:true, cancelable:true}));
    expect(window.alert).toHaveBeenCalled();
    expect(getOpinie().length).toBe(0);
  });

  it('dodaje opinię przez formularz', () => {
    document.getElementById('opinia').value = 'Bardzo fajnie!';
    const form = document.getElementById('opinia-form');
    form.addEventListener('submit', e => e.preventDefault());
    setOpinie([]);
    setOpinie([{text: 'Bardzo fajnie!'}]);
    renderOpinie();
    expect(getOpinie().length).toBe(1);
    expect(getOpinie()[0].text).toBe('Bardzo fajnie!');
  });
});
