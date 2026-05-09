const state = {
  token: localStorage.getItem('token'),
  usuario: null,
  menu: [],
  premios: [],
  cupons: [],
  carrinho: [],
  rotation: 0,
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const money = (value) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function showToast(message, type = 'success') {
  const toast = $('#toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  setTimeout(() => toast.classList.add('hidden'), 3500);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.mensagem || data.message || 'Erro na requisição.');
  return data;
}

function setView(viewName) {
  $$('.view').forEach((view) => view.classList.remove('active'));
  $(`#${viewName}`).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (viewName === 'dashboard') loadDashboard();
  if (viewName === 'admin') loadAdmin();
}

function updateAuthUI() {
  const isLogged = Boolean(state.token && state.usuario);
  const isAdmin = isLogged && state.usuario.id_funcao === 2;

  $$('.guest-only').forEach((el) => el.classList.toggle('hidden', isLogged));
  $$('.auth-only').forEach((el) => el.classList.toggle('hidden', !isLogged));
  $$('.admin-only').forEach((el) => el.classList.toggle('hidden', !isAdmin));
}

async function carregarUsuario() {
  if (!state.token) return;
  try {
    const data = await api('/api/auth/me');
    state.usuario = data.usuario;
    updateAuthUI();
  } catch (_) {
    localStorage.removeItem('token');
    state.token = null;
    state.usuario = null;
    updateAuthUI();
  }
}

async function login(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  try {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(form)),
    });
    state.token = data.token;
    state.usuario = data.usuario;
    localStorage.setItem('token', data.token);
    updateAuthUI();
    showToast('Login realizado com sucesso.');
    setView('dashboard');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function cadastrar(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  try {
    const data = await api('/api/auth/cadastro', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(form)),
    });
    state.token = data.token;
    state.usuario = data.usuario;
    localStorage.setItem('token', data.token);
    updateAuthUI();
    showToast('Conta criada com sucesso.');
    setView('dashboard');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function logout() {
  localStorage.removeItem('token');
  state.token = null;
  state.usuario = null;
  state.carrinho = [];
  updateAuthUI();
  showToast('Você saiu da conta.');
  setView('home');
}

async function loadDashboard() {
  if (!state.token) return setView('login');
  await Promise.all([loadMe(), loadMenu(), loadPremios(), loadCupons()]);
  renderDashboard();
}

async function loadMe() {
  const data = await api('/api/auth/me');
  state.usuario = data.usuario;
}

async function loadMenu() {
  state.menu = await api('/api/menu');
}

async function loadPremios() {
  state.premios = await api('/api/roleta/premios');
}

async function loadCupons() {
  state.cupons = await api('/api/roleta/cupons');
}

function renderDashboard() {
  $('#welcomeTitle').textContent = `Olá, ${state.usuario.nome.split(' ')[0]}!`;
  animateNumber($('#pointsValue'), Number(state.usuario.pontos || 0));
  const percent = Math.min((state.usuario.pontos % 100), 100);
  $('#pointsBar').style.width = `${percent}%`;
  const faltam = state.usuario.pontos >= 100 ? 'Você já pode girar a roleta!' : `Faltam ${100 - state.usuario.pontos} pontos para 1 giro.`;
  $('#pointsHint').textContent = faltam;
  renderMiniWheel();
  renderMenu();
  renderCupons();
  renderCarrinho();
  updateAuthUI();
}

function animateNumber(element, target) {
  const start = Number(element.textContent.replace(/\D/g, '') || 0);
  const duration = 500;
  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.round(start + (target - start) * progress);
    element.textContent = value;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function wheelGradient() {
  const premios = state.premios.length ? state.premios : [
    { label: '5% OFF', color: '#ffb347' },
    { label: '10% OFF', color: '#ff8a00' },
    { label: '15% OFF', color: '#ff6a00' },
  ];
  const angle = 360 / premios.length;
  return premios.map((p, i) => `${p.color || p.cor} ${i * angle}deg ${(i + 1) * angle}deg`).join(', ');
}

function renderMiniWheel() {
  $('#miniWheel').style.background = `conic-gradient(${wheelGradient()})`;
  renderWheel();
}

function renderWheel() {
  const wheel = $('#wheel');
  const premios = state.premios;
  const angle = 360 / premios.length;
  wheel.innerHTML = '';
  wheel.style.background = `conic-gradient(${wheelGradient()})`;

  premios.forEach((premio, index) => {
    const label = document.createElement('div');
    label.className = 'wheel-label';
    label.style.transform = `rotate(${index * angle + angle / 2}deg)`;
    label.innerHTML = `<span>${premio.label}</span>`;
    wheel.appendChild(label);
  });
}

function renderMenu() {
  const list = $('#menuList');
  list.innerHTML = state.menu.map((item) => `
    <article class="menu-item">
      <img src="${item.url_imagem || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80'}" alt="${item.nome}" />
      <div class="menu-item-body">
        <small class="eyebrow">${item.categoria || 'Prato'}</small>
        <h3>${item.nome}</h3>
        <p>${item.descricao || ''}</p>
        <div class="section-title">
          <span class="price">${money(item.preco)}</span>
          <button class="small-btn" onclick="addCarrinho(${item.id})">Adicionar</button>
        </div>
      </div>
    </article>
  `).join('');
}

function renderCupons() {
  const list = $('#couponsList');
  const select = $('#couponSelect');
  const disponiveis = state.cupons.filter((cupom) => !cupom.resgatado && new Date(cupom.expira_em) > new Date());

  if (!state.cupons.length) {
    list.className = 'scroll-list empty';
    list.textContent = 'Nenhum cupom disponível.';
  } else {
    list.className = 'scroll-list';
    list.innerHTML = state.cupons.map((cupom) => `
      <div class="coupon">
        <strong>${cupom.codigo}</strong>
        <p>${cupom.desconto_percentual}% de desconto</p>
        <small>${cupom.resgatado ? 'Usado' : 'Disponível'} · expira em ${new Date(cupom.expira_em).toLocaleDateString('pt-BR')}</small>
      </div>
    `).join('');
  }

  select.innerHTML = '<option value="">Sem cupom</option>' + disponiveis.map((cupom) => `
    <option value="${cupom.id}">${cupom.codigo} - ${cupom.desconto_percentual}% OFF</option>
  `).join('');
}

window.addCarrinho = function addCarrinho(itemId) {
  const item = state.menu.find((i) => i.id === itemId);
  const existente = state.carrinho.find((i) => i.item_menu_id === itemId);
  if (existente) existente.quantidade += 1;
  else state.carrinho.push({ item_menu_id: item.id, nome: item.nome, preco: Number(item.preco), quantidade: 1 });
  renderCarrinho();
  showToast(`${item.nome} adicionado ao carrinho.`);
};

window.removeCarrinho = function removeCarrinho(itemId) {
  state.carrinho = state.carrinho.filter((i) => i.item_menu_id !== itemId);
  renderCarrinho();
};

function calcularTotal() {
  const bruto = state.carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  const cupomId = Number($('#couponSelect')?.value || 0);
  const cupom = state.cupons.find((c) => c.id === cupomId);
  const desconto = cupom ? bruto * (cupom.desconto_percentual / 100) : 0;
  return { bruto, desconto, total: Math.max(bruto - desconto, 0), cupom };
}

function renderCarrinho() {
  const list = $('#cartList');
  if (!state.carrinho.length) {
    list.className = 'cart-list empty';
    list.textContent = 'Nenhum item no carrinho.';
  } else {
    list.className = 'cart-list';
    list.innerHTML = state.carrinho.map((item) => `
      <div class="cart-item">
        <div><strong>${item.nome}</strong><br><small>${item.quantidade}x ${money(item.preco)}</small></div>
        <button onclick="removeCarrinho(${item.item_menu_id})">Remover</button>
      </div>
    `).join('');
  }
  $('#cartTotal').textContent = money(calcularTotal().total);
}

function openModal(id) { $(`#${id}`).classList.remove('hidden'); }
function closeModal(id) { $(`#${id}`).classList.add('hidden'); }

function openCheckout() {
  if (!state.carrinho.length) return showToast('Adicione itens ao carrinho antes de finalizar.', 'error');
  const valores = calcularTotal();
  $('#checkoutSummary').innerHTML = `
    <div class="order-line"><span>Subtotal</span><strong>${money(valores.bruto)}</strong></div>
    <div class="order-line"><span>Desconto</span><strong>${money(valores.desconto)}</strong></div>
    <div class="order-line"><span>Total a pagar</span><strong>${money(valores.total)}</strong></div>
    <div class="order-line"><span>Pontos previstos</span><strong>${Math.floor(valores.total)} pontos</strong></div>
  `;
  openModal('checkoutModal');
}

async function confirmarPedido() {
  try {
    const cupomId = $('#couponSelect').value ? Number($('#couponSelect').value) : null;
    const data = await api('/api/pedidos', {
      method: 'POST',
      body: JSON.stringify({
        itens: state.carrinho.map((item) => ({ item_menu_id: item.item_menu_id, quantidade: item.quantidade })),
        cupom_id: cupomId,
        metodo_pagamento: $('#paymentMethod').value,
      }),
    });
    state.usuario = data.usuario;
    state.carrinho = [];
    closeModal('checkoutModal');
    $('#successText').textContent = `Você ganhou ${data.pontos_gerados} pontos nesse pedido. Total atual: ${data.usuario.pontos} pontos.`;
    openModal('successModal');
    await loadDashboard();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function girarRoleta() {
  if (!state.usuario || state.usuario.pontos < 100) return showToast('Você precisa de 100 pontos para girar.', 'error');
  const btn = $('#spinBtn');
  btn.disabled = true;
  $('#wheelResult').classList.add('hidden');

  try {
    const data = await api('/api/roleta/girar', { method: 'POST' });
    const index = state.premios.findIndex((p) => p.label === data.prizeLabel);
    const angle = 360 / state.premios.length;
    const fullSpins = 360 * 6;
    const stopAt = 360 - (index * angle + angle / 2);
    state.rotation += fullSpins + stopAt;
    $('#wheel').style.transform = `rotate(${state.rotation}deg)`;

    setTimeout(async () => {
      $('#wheelResult').innerHTML = `<strong>${data.message}</strong>${data.couponCode ? `<p>Cupom: ${data.couponCode}</p>` : ''}`;
      $('#wheelResult').classList.remove('hidden');
      showToast(data.message);
      state.usuario = data.usuario;
      await loadCupons();
      renderDashboard();
      btn.disabled = false;
    }, 5300);
  } catch (error) {
    btn.disabled = false;
    showToast(error.message, 'error');
  }
}

async function loadAdmin() {
  if (!state.usuario || state.usuario.id_funcao !== 2) return setView('dashboard');
  await loadMenu();
  $('#adminMenuList').innerHTML = state.menu.map((item) => `
    <div class="admin-item">
      <strong>${item.nome}</strong><br>
      <small>${item.categoria} · ${money(item.preco)}</small>
    </div>
  `).join('');
}

async function criarMenuItem(event) {
  event.preventDefault();
  const body = Object.fromEntries(new FormData(event.target));
  try {
    await api('/api/menu', { method: 'POST', body: JSON.stringify(body) });
    event.target.reset();
    showToast('Item cadastrado com sucesso.');
    await loadAdmin();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function bindEvents() {
  $$('[data-view]').forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));
  $$('[data-close]').forEach((button) => button.addEventListener('click', () => closeModal(button.dataset.close)));
  $('#loginForm').addEventListener('submit', login);
  $('#cadastroForm').addEventListener('submit', cadastrar);
  $('#logoutBtn').addEventListener('click', logout);
  $('#openWheelBtn').addEventListener('click', () => { renderWheel(); openModal('wheelModal'); });
  $('#spinBtn').addEventListener('click', girarRoleta);
  $('#couponSelect').addEventListener('change', renderCarrinho);
  $('#checkoutBtn').addEventListener('click', openCheckout);
  $('#confirmOrderBtn').addEventListener('click', confirmarPedido);
  $('#menuForm').addEventListener('submit', criarMenuItem);
}

(async function init() {
  bindEvents();
  await carregarUsuario();
  await loadPremios().catch(() => null);
  if (state.token && state.usuario) setView('dashboard');
})();
