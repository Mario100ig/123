/**
 * @jest-environment jsdom
 */

document.body.innerHTML = `
  <form id="opinia-form">
    <input type="text" id="opinia-nick">
    <textarea id="opinia-tresc"></textarea>
    <button type="submit">Dodaj opinię</button>
  </form>
  <ul id="opinie-lista"></ul>
`;

// Kod z index.html (przeniesiony do testu)
function getOpinie() {
  try {
    return JSON.parse(localStorage.getItem('opinieKlientow') || '[]');
  } catch (e) {
    return [];
  }
}
function setOpinie(opinie) {
  try {
    localStorage.setItem('opinieKlientow', JSON.stringify(opinie));
  } catch (e) {}
}
function renderOpinie() {
  const lista = document.getElementById('opinie-lista');
  lista.innerHTML = '';
  const opinie = getOpinie();
  if (!opinie.length) {
    const li = document.createElement('li');
    li.style.color = '#aaa';
    li.textContent = 'Brak opinii.';
    lista.appendChild(li);
    return;
  }
  opinie.slice(-5).reverse().forEach((op, idx, arr) => {
    const li = document.createElement('li');
    li.innerHTML = `<b>${op.nick}:</b> ${op.tresc} <button onclick='usunOpinie(${opinie.length-1-idx})'>Usuń</button>`;
    lista.appendChild(li);
  });
}
window.usunOpinie = function(idx) {
  let opinie = getOpinie();
  if (idx >= 0 && idx < opinie.length) {
    opinie.splice(idx, 1);
    setOpinie(opinie);
  }
  renderOpinie();
}

describe('Opinie klientów (localStorage)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.getElementById('opinia-nick').value = '';
    document.getElementById('opinia-tresc').value = '';
    renderOpinie();
  });

  it('wyświetla "Brak opinii." gdy nie ma opinii', () => {
    renderOpinie();
    expect(document.getElementById('opinie-lista').textContent).toContain('Brak opinii.');
  });

  it('dodaje opinię i renderuje ją', () => {
    setOpinie([]);
    setOpinie([{nick: 'TestUser', tresc: 'Super!'}]);
    renderOpinie();
    expect(document.getElementById('opinie-lista').innerHTML).toContain('TestUser');
    expect(document.getElementById('opinie-lista').innerHTML).toContain('Super!');
  });

  it('usuwa opinię po kliknięciu Usuń', () => {
    setOpinie([{nick: 'A', tresc: 'B'},{nick: 'C', tresc: 'D'}]);
    renderOpinie();
    // Usuwamy pierwszą (ostatnio dodaną)
    window.usunOpinie(1);
    const opinie = getOpinie();
    expect(opinie.length).toBe(1);
    expect(opinie[0].nick).toBe('C');
  });

  it('nie dodaje opinii krótszej niż 3 znaki', () => {
    document.getElementById('opinia-nick').value = 'X';
    document.getElementById('opinia-tresc').value = 'ok';
    const form = document.getElementById('opinia-form');
    window.alert = jest.fn();
    form.dispatchEvent(new Event('submit', {bubbles:true, cancelable:true}));
    expect(window.alert).toHaveBeenCalledWith('Opinia jest za krótka!');
    expect(getOpinie().length).toBe(0);
  });

  it('dodaje opinię przez formularz', () => {
    document.getElementById('opinia-nick').value = 'Jan';
    document.getElementById('opinia-tresc').value = 'Bardzo fajnie!';
    const form = document.getElementById('opinia-form');
    form.addEventListener('submit', e => e.preventDefault());
    form.dispatchEvent(new Event('submit', {bubbles:true, cancelable:true}));
    expect(getOpinie().length).toBe(1);
    expect(getOpinie()[0].nick).toBe('Jan');
    expect(getOpinie()[0].tresc).toBe('Bardzo fajnie!');
  });
});
