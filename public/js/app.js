/* 恋屿 · 双人恋爱工作台 —— 前端逻辑（桌面版 + 语音/位置/贴纸） */
(function () {
  'use strict';

  // ---------- 图标 ----------
  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M9.5 20v-6h5v6"/>',
    chat: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.6-.7L3 21l1.7-4.2A8.4 8.4 0 0 1 3.6 12 8.5 8.5 0 0 1 12 3.5h.5A8.5 8.5 0 0 1 21 11.5z"/>',
    wish: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12l3 3 5-6"/>',
    moment: '<path d="M12 3l2.5 6.5L21 9.8l-5.3 4.3L17.6 21 12 17.4 6.4 21l1.9-6.9L3 9.8l6.5-.3z"/>',
    game: '<rect x="2" y="7" width="20" height="10" rx="5"/><path d="M7 11v2"/><path d="M6 12h2"/><circle cx="16" cy="11" r=".6"/><circle cx="18" cy="13" r=".6"/>',
    heart: '<path d="M12 20s-7-4.5-9.3-9A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 9.3 5C19 15.5 12 20 12 20z"/>',
    hug: '<circle cx="8.5" cy="8" r="3"/><path d="M3 20v-1a4 4 0 0 1 4-4h3a4 4 0 0 1 4 4v1"/><circle cx="17" cy="10" r="2.4"/><path d="M14.5 20v-.8a3 3 0 0 1 3-3 3 3 0 0 1 3 3V20"/>',
    gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>',
    pin: '<path d="M12 21s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12z"/><circle cx="12" cy="9" r="2.6"/>',
    sticker: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="9" cy="10" r="1.2"/><circle cx="15" cy="10" r="1.2"/><path d="M9 15c1.4 1.3 4.6 1.3 6 0"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="3"/>',
    send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/>',
    poke: '<path d="M9 11V6a2 2 0 0 1 4 0v5"/><path d="M13 11V5a2 2 0 0 1 4 0v6"/><path d="M17 11V8a2 2 0 0 1 4 0v6a7 7 0 0 1-7 7h-2a7 7 0 0 1-6-3.4L3 14a2 2 0 0 1 3.2-2.4L9 14"/>',
    play: '<path d="M7 4l13 8-13 8z"/>',
  };
  const ic = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;

  // ---------- 常量 ----------
  const TABS = [
    { key: 'home', label: '小岛', icon: 'home' },
    { key: 'chat', label: '悄悄话', icon: 'chat' },
    { key: 'wish', label: '愿望', icon: 'wish' },
    { key: 'moment', label: '瞬间', icon: 'moment' },
    { key: 'game', label: '游戏', icon: 'game' },
  ];
  const MOODS = [
    { e: '🥰', l: '超甜' }, { e: '😊', l: '开心' }, { e: '😌', l: '平静' }, { e: '😐', l: '一般' },
    { e: '😢', l: '委屈' }, { e: '😡', l: '生气' }, { e: '😴', l: '疲惫' }, { e: '🤒', l: '不舒服' },
  ];
  const COLORS = ['#ff6b9d', '#ff9ecb', '#ff8fab', '#b58cff', '#8b7cf6', '#ff6f91'];
  const QUOTES = [
    '遇见你以后，我的每一天才都有了名字。', '世界很大，但我的手只想牵你一个。', '你不是我的例外，你是我全部的偏爱。',
    '我想把平平无奇的日子，过成只和你有关的诗。', '喜欢你，是我做过最不后悔的决定。', '你一笑，我就觉得人间值得。',
    '就算世界很吵，有你在就刚刚好。', '我们要一起慢慢变老，慢慢相爱。', '你是我所有温柔的来处和归途。',
    '今天也想见你，明天也是，后天也是。', '被你爱着的感觉，是我最踏实的安全感。', '余生很长，请多指教，我的宝贝。',
  ];
  const FORTUNES = [
    { star: '★★★★☆', yi: '主动牵手', ji: '生闷气' },
    { star: '★★★★★', yi: '分享小秘密', ji: '冷战' },
    { star: '★★★☆☆', yi: '一起散步', ji: '熬夜刷手机' },
    { star: '★★★★☆', yi: '说句情话', ji: '挑剔对方' },
    { star: '★★★★★', yi: '计划一次约会', ji: '拖延' },
    { star: '★★★☆☆', yi: '互相夸奖', ji: '比较前任' },
    { star: '★★★★☆', yi: '视频通话', ji: '已读不回' },
    { star: '★★★★★', yi: '制造惊喜', ji: '懒得回复' },
    { star: '★★★☆☆', yi: '早起说早安', ji: '错过晚安' },
    { star: '★★★★☆', yi: '共同做饭', ji: '外卖度日' },
  ];
  const TACIT = [
    { q: '如果只能带一样东西去旅行，你选？', a: '相机📷', b: '零食🍫' },
    { q: '周末更想？', a: '窝家躺平🛋️', b: '出门浪🌞' },
    { q: '生气时你更希望我？', a: '安静陪着🤫', b: '立刻哄我🍬' },
    { q: '约会首选？', a: '看电影🎬', b: '吃大餐🍲' },
    { q: '送礼物你更爱？', a: '惊喜盲盒🎁', b: '实用好物🛍️' },
    { q: '睡觉习惯？', a: '早睡早起🌅', b: '熬夜修仙🌙' },
    { q: '表达爱意你更吃？', a: '甜言蜜语💬', b: '实际行动🤲' },
    { q: '未来定居偏好？', a: '热闹城市🏙️', b: '安静小镇🏡' },
    { q: '吵架后谁先低头？', a: '我主动🙋', b: '等你哄😌' },
    { q: '养宠物你选？', a: '猫🐱', b: '狗🐶' },
  ];
  const TRUTH = ['说出对方最让你心动的一个瞬间', '你第一次对对方心动是因为什么', '对方做过最让你感动的一件事', '你最喜欢对方身上的哪个小习惯', '如果只能夸对方一个优点，你夸什么', '你们之间最甜的一次约会是什么', '对方哪句口头禅你最上头'];
  const DARE = ['对着屏幕给ta比一个大大的爱心', '用最甜的声音说一句「我想你啦」', '给ta发一段你现在的表情包自拍', '模仿ta的一个小动作逗ta笑', '下一句悄悄话要用三个emoji表达爱心', '给ta唱两句你们共同的歌'];
  const STICKERS = ['🐱', '🐰', '🐻', '🐼', '🍓', '🌈', '⭐', '💖', '🍰', '🌸', '🍩', '🦄', '🌟', '💕', '🔥', '🌻'];

  // ---------- 状态 ----------
  const S = {
    ws: null, reconnect: null, me: null, peer: null, room: null, data: null,
    activeTab: 'home', gameKind: 'tacit', tacit: { me: null, peer: null },
    momentEmoji: '✨', rec: null, audio: null, audioBtn: null,
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function el(tag, props = {}, kids = []) {
    const n = document.createElement(tag);
    for (const k in props) {
      if (k === 'class') n.className = props[k];
      else if (k === 'text') n.textContent = props[k];
      else if (k.startsWith('on') && typeof props[k] === 'function') n.addEventListener(k.slice(2), props[k]);
      else if (k === 'html') n.innerHTML = props[k];
      else if (k === 'style') n.setAttribute('style', props[k]);
      else n.setAttribute(k, props[k]);
    }
    (Array.isArray(kids) ? kids : [kids]).forEach((c) => { if (c == null) return; n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  const dayIndex = () => { const d = new Date(); return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5); };
  const fmtTime = (t) => { const d = new Date(t); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
  const timeAgo = (t) => {
    const s = (Date.now() - t) / 1000;
    if (s < 60) return '刚刚';
    if (s < 3600) return Math.floor(s / 60) + ' 分钟前';
    if (s < 86400) return Math.floor(s / 3600) + ' 小时前';
    return `${new Date(t).getMonth() + 1}月${new Date(t).getDate()}日`;
  };
  const toast = (m) => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2200); };
  const loadCred = () => { try { return JSON.parse(localStorage.getItem('lianyu') || 'null'); } catch { return null; } };
  const saveCred = (c) => localStorage.setItem('lianyu', JSON.stringify(c));
  const loadServer = () => { try { return localStorage.getItem('lianyu_server') || ''; } catch { return ''; } };
  const saveServer = (v) => { try { localStorage.setItem('lianyu_server', v); } catch {} };
  // 计算 WebSocket 地址：优先用「设置里填的服务器地址」，否则用当前同源（Node 托管时）
  function getWsUrl() {
    const saved = (loadServer() || '').trim().replace(/\/+$/, '');
    if (saved) {
      try {
        const u = new URL(saved);
        if (!u.host) return null;
        const proto = (u.protocol === 'https:' || u.protocol === 'wss:') ? 'wss' : 'ws';
        return proto + '://' + u.host;
      } catch (e) { return null; }
    }
    const isNative = (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNative);
    // 同源模式：仅在由 Node 服务直接托管时成立（host 不是 localhost，避免原生壳的 capacitor://localhost）
    if (!isNative && (location.protocol === 'http:' || location.protocol === 'https:') && location.host && location.host !== 'localhost') {
      const proto = location.protocol === 'https:' ? 'wss' : 'ws';
      return proto + '://' + location.host;
    }
    return null; // Capacitor 原生壳 / file:// 等场景，需用户填写服务器地址
  }

  // ---------- WebSocket ----------
  let serverPrompted = false;
  function connect() {
    const url = getWsUrl();
    if (!url) {
      if (!serverPrompted) { serverPrompted = true; openServerModal('先填写服务器地址，才能和对方牵手 💗'); }
      return;
    }
    let ws;
    try { ws = new WebSocket(url); }
    catch (e) { if (!serverPrompted) { serverPrompted = true; openServerModal('服务器地址格式不对，请重新填写 💗'); } return; }
    S.ws = ws;
    ws.onopen = () => {
      const c = loadCred();
      if (c && c.roomCode) { showPairLoading('正在重连小岛…'); ws.send(JSON.stringify({ type: 'pair', mode: 'join', code: c.roomCode, clientId: c.clientId, name: c.name, color: c.color })); }
    };
    ws.onmessage = (ev) => { let m; try { m = JSON.parse(ev.data); } catch { return; } handle(m); };
    ws.onclose = () => { if (S.room) toast('连接断开，正在重连…'); S.reconnect = setTimeout(connect, 2000); };
    ws.onerror = () => ws.close();
  }
  const send = (o) => { if (S.ws && S.ws.readyState === 1) S.ws.send(JSON.stringify(o)); };
  const sendAction = (a, p) => send({ type: 'action', action: a, payload: p });
  const sendEffect = (e, d) => send({ type: 'effect', effect: e, data: d || null });

  function handle(m) {
    switch (m.type) {
      case 'paired':
        S.me = m.you; S.room = m.room; S.data = m.room.data;
        S.peer = m.room.members.filter((x) => x.id !== m.you.id)[0] || null;
        saveCred({ clientId: m.you.id, name: m.you.name, color: m.you.color, roomCode: m.room.code });
        onPaired(); break;
      case 'error': toast(m.msg); hidePairLoading(); if (m.code === 'NO_ROOM') localStorage.removeItem('lianyu'); break;
      case 'presence': updatePresence(m.members); break;
      case 'action': applyAction(m); break;
      case 'effect': onEffect(m); break;
      case 'typing': showTyping(m.from === (S.peer && S.peer.id), m.on); break;
    }
  }

  function applyAction(m) {
    const d = S.data; if (!d) return; const p = m.payload;
    switch (m.action) {
      case 'chat': d.messages.push(p); if (d.messages.length > 500) d.messages.shift(); break;
      case 'mood': d.moods[p.id] = p.mood; break;
      case 'wish_add': d.wishes.push(p); break;
      case 'wish_toggle': { const w = d.wishes.find((x) => x.id === p.id); if (w) { w.done = p.done; w.by = p.by; } break; }
      case 'wish_del': d.wishes = d.wishes.filter((x) => x.id !== p.id); break;
      case 'anniv_add': d.anniversaries.push(p); break;
      case 'anniv_del': d.anniversaries = d.anniversaries.filter((x) => x.id !== p.id); break;
      case 'together': d.togetherSince = p.date; break;
      case 'moment': d.moments.unshift(p); if (d.moments.length > 200) d.moments.pop(); break;
      case 'rename': if (S.peer && p.id === S.peer.id) { S.peer.name = p.name; S.peer.color = p.color; } break;
    }
    renderHome();
    if (S.activeTab === 'chat') renderChat();
    if (S.activeTab === 'wish') renderWish();
    if (S.activeTab === 'moment') renderMoment();
  }

  function updatePresence(members) {
    const peer = members.find((x) => x.id !== (S.me && S.me.id));
    const dot = $('#peerDot'), on = $('#peerOnline'), nm = $('#peerName');
    if (peer) {
      nm.textContent = peer.name || '对方';
      const isOn = peer.online;
      dot.className = 'dot ' + (isOn ? 'on' : 'off'); on.textContent = isOn ? '在线' : '离线';
      S.peer = { ...(S.peer || {}), id: peer.id, name: peer.name, color: peer.color, online: isOn };
      const ss = $('#sideStatus'); if (ss) ss.innerHTML = `<span class="dot ${isOn ? 'on' : 'off'}"></span>${isOn ? '对方在线 · 陪着你' : '对方暂时离开'}`;
    }
  }

  // ---------- 特效 ----------
  function onEffect(m) {
    if (m.effect === 'heartbeat') { fxHearts('💓'); banner(`💓 ${m.from.name} 怦怦了你一下`); vibrate([60, 40, 60]); }
    else if (m.effect === 'hug') { fxHearts('🤗'); banner(`🤗 ${m.from.name} 给了你一个拥抱`); vibrate([120, 60, 120]); }
    else if (m.effect === 'poke') { fxHearts('👉'); banner(`👉 ${m.from.name} 戳了你一下`); vibrate([40, 30, 40, 30, 40]); }
    else if (m.effect === 'tacit') {
      if (m.from.id !== S.me.id) {
        S.tacit.peer = m.data && m.data.choice;
        if (S.tacit.peer && S.tacit.me) evalTacit();
        else if (S.tacit.me == null) toast(`${m.from.name} 选好了，该你啦~`);
      }
    }
  }
  function fxHearts(emoji) {
    const layer = $('#fxLayer');
    for (let i = 0; i < 14; i++) {
      const h = el('div', { class: 'fx-heart', text: emoji });
      h.style.left = Math.random() * 100 + 'vw'; h.style.bottom = '-40px';
      h.style.animationDelay = (Math.random() * 0.6) + 's'; h.style.fontSize = (22 + Math.random() * 18) + 'px';
      layer.appendChild(h); setTimeout(() => h.remove(), 3000);
    }
  }
  function banner(text) { const b = el('div', { class: 'fx-banner', text }); $('#fxLayer').appendChild(b); setTimeout(() => b.remove(), 1800); }
  const vibrate = (p) => { if (navigator.vibrate) try { navigator.vibrate(p); } catch {} };

  // ---------- 导航 ----------
  function buildNav() {
    const sb = $('#sidebar'), tb = $('#tabbar'); sb.innerHTML = ''; tb.innerHTML = '';
    sb.appendChild(el('div', { class: 'side-brand' }, [el('img', { src: '/icon-192.png' }), el('b', { text: '恋屿' })]));
    sb.appendChild(el('div', { class: 'side-status', id: 'sideStatus' }, [el('span', { class: 'dot off' }), el('span', { text: '等待牵手…' })]));
    TABS.forEach((t) => {
      tb.appendChild(el('button', { class: 'tab', 'data-tab': t.key }, [el('span', { class: 'ic', html: ic(t.icon) }), el('label', { text: t.label })]));
      sb.appendChild(el('button', { class: 'tab', 'data-tab': t.key }, [el('span', { class: 'ic', html: ic(t.icon) }), el('label', { text: t.label })]));
    });
    sb.appendChild(el('div', { class: 'side-foot', text: '把同一地址发到两台手机，创造小岛 / 登上小岛即可牵手 💗' }));
  }
  function initTabs() {
    $$('.tab').forEach((t) => t.addEventListener('click', () => {
      S.activeTab = t.dataset.tab;
      $$('.tab').forEach((x) => x.classList.remove('active'));
      t.classList.add('active');
      $$('.view').forEach((v) => v.classList.toggle('active', v.dataset.view === S.activeTab));
      if (S.activeTab === 'home') renderHome();
      if (S.activeTab === 'chat') renderChat();
      if (S.activeTab === 'wish') renderWish();
      if (S.activeTab === 'moment') renderMoment();
      if (S.activeTab === 'game') renderGame();
    }));
    $$('.game-tab').forEach((t) => t.addEventListener('click', () => {
      $$('.game-tab').forEach((x) => x.classList.remove('active')); t.classList.add('active');
      S.gameKind = t.dataset.game; renderGame();
    }));
  }
  const switchTab = (tab) => { const t = $(`.tab[data-tab="${tab}"]`); if (t) t.click(); };

  // ---------- 配对 ----------
  const showPairLoading = (t) => { $('#pairForm').style.display = 'none'; $('#pairLoading').style.display = 'block'; $('#pairLoadingText').textContent = t; };
  const hidePairLoading = () => { $('#pairForm').style.display = 'block'; $('#pairLoading').style.display = 'none'; };
  function initPair() {
    let mode = 'create';
    $$('.pair-tab').forEach((t) => t.addEventListener('click', () => {
      mode = t.dataset.mode; $$('.pair-tab').forEach((x) => x.classList.remove('active')); t.classList.add('active');
      $('#joinCodeField').style.display = mode === 'join' ? 'block' : 'none';
      $('#pairBtn').textContent = mode === 'create' ? '🌱 创造我们的小岛' : '🚪 登上对方的小岛';
    }));
    $('#pairBtn').addEventListener('click', () => {
      const name = $('#pairName').value.trim() || '宝贝';
      const code = $('#pairCode').value.trim().toUpperCase();
      if (mode === 'join' && !/^[A-Z0-9]{5}$/.test(code)) { toast('连接码是 5 位哦~'); return; }
      const c = loadCred() || {};
      const clientId = c.clientId || ('u' + Date.now() + Math.random().toString(36).slice(2, 7));
      const color = c.color || COLORS[Math.floor(Math.random() * COLORS.length)];
      showPairLoading(mode === 'create' ? '正在创造小岛…' : '正在登上小岛…');
      send({ type: 'pair', mode, code, clientId, name, color });
    });
    const serverBtn = $('#btnServer');
    if (serverBtn) serverBtn.addEventListener('click', () => openServerModal('填写服务器地址：家里电脑填 http://电脑局域网IP:3000，云端填部署后的网址'));
  }
  function onPaired() {
    $('#pairScreen').style.display = 'none'; $('#app').style.display = 'flex';
    $('#peerName').textContent = (S.peer && S.peer.name) || '对方';
    buildQuickEmoji(); renderHome(); renderChat(); renderWish(); renderMoment(); renderGame();
    toast('牵手成功 💗 欢迎来到你们的小岛');
  }

  // ---------- 顶部按钮 ----------
  function initTop() {
    $('#btnHeart').addEventListener('click', () => { sendEffect('heartbeat'); fxHearts('💓'); banner('💓 你怦怦了一下'); });
    $('#btnHug').addEventListener('click', () => { sendEffect('hug'); fxHearts('🤗'); banner('🤗 你抱了对方一下'); });
    $('#btnSettings').addEventListener('click', openSettings);
  }

  // ---------- 首页 ----------
  function renderHome() {
    const c = $('#homeContent'); if (!c || !S.data) return; c.innerHTML = '';
    const peerName = (S.peer && S.peer.name) || '对方';
    const h = new Date().getHours();
    const greetPre = h < 6 ? '夜深了' : h < 11 ? '早安' : h < 14 ? '午安' : h < 18 ? '下午好' : '晚上好';
    c.appendChild(el('div', { class: 'greet', text: `${greetPre}，${peerName} 和我的小岛 💗` }));

    const td = S.data.togetherSince;
    if (td) {
      const days = Math.floor((Date.now() - td) / 864e5);
      c.appendChild(el('div', { class: 'card love-days' }, [
        el('div', { class: 'heart-deco', text: '💞' }),
        el('div', { class: 'big', html: `${days}<small> 天</small>` }),
        el('div', { class: 'sub', text: `从 ${new Date(td).toLocaleDateString('zh-CN')} 起，我们一起走过` }),
      ]));
    } else {
      c.appendChild(el('div', { class: 'card' }, [
        el('div', { class: 'card-title', text: '📅 在一起的日子' }),
        el('div', { class: 'anniv-empty', text: '还没记录你们在一起的起点~' }),
        el('button', { class: 'quick-btn', style: 'width:100%;justify-content:center;margin-top:8px', onclick: openSettings, html: '<span class="ic">✍️</span><span class="tx">记录这一天<small>算出恋爱天数</small></span>' }),
      ]));
    }

    c.appendChild(renderMoodCard());

    // 位置卡
    const locs = (S.data.messages || []).filter((m) => m.kind === 'location');
    const peerLoc = S.peer ? locs.filter((m) => m.from === S.peer.id).pop() : null;
    const myLoc = locs.filter((m) => m.from === S.me.id).pop();
    const showLoc = peerLoc || myLoc;
    if (showLoc) {
      const who = showLoc.from === S.me.id ? '你' : (S.peer && S.peer.name) || '对方';
      const when = timeAgo(showLoc.t);
      c.appendChild(el('div', { class: 'card loc-card' }, [
        el('div', { class: 'pin', text: '📍' }),
        el('div', { class: 'info' }, [el('div', { class: 't', text: `${who}的位置` }), el('div', { class: 'c', text: `${when} · ${showLoc.lat.toFixed(3)}, ${showLoc.lng.toFixed(3)}` })]),
        el('button', { class: 'btn-add', style: 'width:40px;font-size:18px', text: '➤', onclick: () => openMapExternal(showLoc.lat, showLoc.lng) }),
      ]));
    } else {
      c.appendChild(el('div', { class: 'card loc-card' }, [
        el('div', { class: 'pin', text: '📍' }),
        el('div', { class: 'info' }, [el('div', { class: 't', text: '分享你的位置' }), el('div', { class: 'c', text: '让对方知道你在哪' })]),
        el('button', { class: 'btn-add', style: 'width:40px;font-size:20px', text: '＋', onclick: doShareLocation }),
      ]));
    }

    c.appendChild(renderAnnivCard());

    // 今日运势
    const f = FORTUNES[dayIndex() % FORTUNES.length];
    c.appendChild(el('div', { class: 'card fortune' }, [
      el('div', { class: 'card-title', text: '🔮 今日运势' }),
      el('div', { class: 'star', text: f.star }),
      el('div', { class: 'yi', html: `宜：<b>${esc(f.yi)}</b>` }),
      el('div', { class: 'ji', html: `忌：<b>${esc(f.ji)}</b>` }),
    ]));

    // 今日情话
    const q = QUOTES[dayIndex() % QUOTES.length];
    c.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'card-title', text: '💌 今日情话' }),
      el('div', { class: 'quote', html: `“${esc(q)}”<span class="src">— 恋屿 · 每日一句</span>` }),
    ]));

    // 快捷操作
    c.appendChild(el('div', { class: 'quick-grid' }, [
      el('button', { class: 'quick-btn', onclick: () => { sendEffect('heartbeat'); fxHearts('💓'); banner('💓 你怦怦了一下'); }, html: '<span class="ic">💓</span><span class="tx">怦怦一下<small>让ta心跳加速</small></span>' }),
      el('button', { class: 'quick-btn', onclick: () => { sendEffect('hug'); fxHearts('🤗'); banner('🤗 你抱了对方一下'); }, html: '<span class="ic">🤗</span><span class="tx">抱抱<small>远程拥抱ta</small></span>' }),
      el('button', { class: 'quick-btn', onclick: () => { sendEffect('poke'); fxHearts('👉'); banner('👉 你戳了对方一下'); }, html: '<span class="ic">👉</span><span class="tx">戳一戳<small>调皮一下</small></span>' }),
      el('button', { class: 'quick-btn', onclick: () => switchTab('chat'), html: '<span class="ic">💬</span><span class="tx">写悄悄话<small>说点甜甜的</small></span>' }),
      el('button', { class: 'quick-btn', onclick: () => switchTab('moment'), html: '<span class="ic">✨</span><span class="tx">记瞬间<small>留住小美好</small></span>' }),
      el('button', { class: 'quick-btn', onclick: doShareLocation, html: '<span class="ic">📍</span><span class="tx">分享位置<small>让ta找到你</small></span>' }),
    ]));
  }

  function renderMoodCard() {
    const myMood = S.data.moods[S.me.id];
    const today = new Date().toISOString().slice(0, 10);
    const peerMood = S.peer ? S.data.moods[S.peer.id] : null;
    const card = el('div', { class: 'card' }, [el('div', { class: 'card-title', text: '😊 今日心情' })]);
    const row = el('div', { class: 'mood-row' });
    row.appendChild(el('div', { class: 'mood-half' }, [
      el('div', { class: 'who', text: '我' }),
      el('div', { class: 'emo', text: (myMood && myMood.date === today) ? myMood.value : '❔' }),
      el('div', { class: 'note', text: (myMood && myMood.date === today) ? (myMood.note || (MOODS.find((x) => x.e === myMood.value) || {}).l || '') : '今天还没打卡' }),
    ]));
    row.appendChild(el('div', { class: 'mood-half' }, [
      el('div', { class: 'who', text: (S.peer && S.peer.name) || '对方' }),
      el('div', { class: 'emo', text: (peerMood && peerMood.date === today) ? peerMood.value : '❔' }),
      el('div', { class: 'note', text: (peerMood && peerMood.date === today) ? (peerMood.note || (MOODS.find((x) => x.e === peerMood.value) || {}).l || '') : '等ta打卡~' }),
    ]));
    card.appendChild(row);
    const pick = el('div', { class: 'mood-pick' });
    MOODS.forEach((m) => {
      const b = el('button', { text: m.e, title: m.l });
      if (myMood && myMood.date === today && myMood.value === m.e) b.classList.add('sel');
      b.addEventListener('click', () => { sendAction('mood', { value: m.e, note: '' }); toast(`已记录今天的心情 ${m.e}`); });
      pick.appendChild(b);
    });
    card.appendChild(pick);
    return card;
  }
  function renderAnnivCard() {
    const list = S.data.anniversaries || [];
    const future = list.map((a) => ({ ...a, diff: Math.ceil((new Date(a.date).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 864e5) }))
      .filter((a) => a.diff >= 0).sort((x, y) => x.diff - y.diff);
    const card = el('div', { class: 'card' }, [el('div', { class: 'card-title', text: '🎉 最近的纪念日' })]);
    if (future.length) {
      const a = future[0];
      card.appendChild(el('div', { class: 'anniv-next' }, [
        el('div', { class: 'emo', text: a.emoji }),
        el('div', { class: 'info' }, [el('div', { class: 't', text: a.title }), el('div', { class: 'c', text: new Date(a.date).toLocaleDateString('zh-CN') })]),
        el('div', { class: 'days' }, [el('b', { text: a.diff }), el('span', { text: a.diff === 0 ? '就是今天!' : '天后' })]),
      ]));
      if (future.length > 1) card.appendChild(el('div', { class: 'anniv-empty', text: `还有 ${future.length - 1} 个日子在排队 →` }));
    } else card.appendChild(el('div', { class: 'anniv-empty', text: '还没有纪念日，添加你们的特别日子吧' }));
    card.appendChild(el('button', { class: 'quick-btn', style: 'width:100%;justify-content:center;margin-top:10px', onclick: openAnniv, html: '<span class="ic">➕</span><span class="tx">管理纪念日<small>生日 / 周年 / 旅行</small></span>' }));
    return card;
  }

  // ---------- 悄悄话 ----------
  function buildQuickEmoji() {
    const row = $('#quickEmoji'); if (!row) return; row.innerHTML = '';
    ['💗', '🥰', '😘', '想你了', '在干嘛', '晚安', '抱抱', '❤️'].forEach((e) => {
      row.appendChild(el('button', { text: e, onclick: () => { $('#chatText').value = e; $('#chatText').focus(); } }));
    });
  }
  function waveBars(seed) {
    let s = 0; for (const ch of String(seed)) s = (s * 31 + ch.charCodeAt(0)) % 997;
    const box = el('div', { class: 'voice-wave' });
    for (let i = 0; i < 22; i++) { s = (s * 17 + 7) % 997; const h = 6 + (s % 20); box.appendChild(el('i', { style: `height:${h}px` })); }
    return box;
  }
  function renderChat() {
    const box = $('#chatBox'); if (!box) return;
    const atBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 60;
    box.innerHTML = '';
    (S.data.messages || []).forEach((m) => box.appendChild(renderMsg(m)));
    if (atBottom) box.scrollTop = box.scrollHeight;
  }
  function renderMsg(m) {
    if (m.from === 'sys') return el('div', { class: 'msg sys', text: m.text });
    const mine = m.from === S.me.id;
    const cls = 'msg ' + (mine ? 'me' : 'peer') + (m.kind && m.kind !== 'text' ? ' ' + m.kind : '');
    if (m.kind === 'voice') {
      const node = el('div', { class: cls }, [
        el('button', { class: 'voice-play', html: ic('play'), onclick: (e) => playVoice(m, e.currentTarget) }),
        waveBars(m.id),
        el('span', { class: 'voice-dur', text: (m.dur || 0) + '″' }),
      ]);
      return node;
    }
    if (m.kind === 'sticker') {
      const node = el('div', { class: cls }, [el('div', { text: m.emoji }), el('span', { class: 'ts', text: fmtTime(m.t) })]);
      return node;
    }
    if (m.kind === 'location') {
      const mapWrap = el('div', { class: 'mini-map' });
      const openLink = `https://www.openstreetmap.org/?mlat=${m.lat}&mlon=${m.lng}#map=15/${m.lat}/${m.lng}`;
      const node = el('div', { class: cls }, [
        el('div', { class: 'loc-cap', html: `📍 分享了一个位置` }),
        mapWrap,
        el('a', { class: 'loc-open', href: openLink, target: '_blank', rel: 'noopener', text: '在地图中打开 ➤' }),
        el('span', { class: 'ts', text: fmtTime(m.t) }),
      ]);
      setTimeout(() => renderMiniMap(mapWrap, m.lat, m.lng), 30);
      return node;
    }
    return el('div', { class: cls, html: `${esc(m.text)}<span class="ts">${fmtTime(m.t)}</span>` });
  }
  function playVoice(m, btn) {
    try {
      if (S.audio && S.audioBtn && S.audioBtn !== btn) { S.audio.pause(); S.audioBtn.innerHTML = ic('play'); }
      if (!S.audio) { S.audio = new Audio(m.audio); S.audio.addEventListener('ended', () => { if (S.audioBtn) S.audioBtn.innerHTML = ic('play'); S.audio = null; }); }
      S.audioBtn = btn;
      if (S.audio.paused) { S.audio.play(); btn.innerHTML = ic('stop'); }
      else { S.audio.pause(); btn.innerHTML = ic('play'); }
    } catch (e) { toast('播放失败'); }
  }
  function renderMiniMap(wrap, lat, lng) {
    if (typeof L === 'undefined') { wrap.outerHTML = `<div class="loc-fallback">📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}<br>地图需要联网加载</div>`; return; }
    try {
      const map = L.map(wrap, { zoomControl: false, attributionControl: false }).setView([lat, lng], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
      L.marker([lat, lng]).addTo(map);
      setTimeout(() => map.invalidateSize(), 60);
    } catch (e) { wrap.outerHTML = `<div class="loc-fallback">📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}</div>`; }
  }
  function openMapExternal(lat, lng) { window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`, '_blank', 'noopener'); }

  function initChat() {
    const input = $('#chatText');
    $('#btnSend').addEventListener('click', sendChat);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });
    let typingTimer;
    input.addEventListener('input', () => { send({ type: 'typing', on: true }); clearTimeout(typingTimer); typingTimer = setTimeout(() => send({ type: 'typing', on: false }), 1200); });
    input.addEventListener('blur', () => send({ type: 'typing', on: false }));
    // 语音
    $('#btnMic').addEventListener('click', toggleRecord);
    $('#btnRecStop').addEventListener('click', stopRecord);
    // 位置
    $('#btnLoc').addEventListener('click', doShareLocation);
    // 贴纸
    const panel = $('#stickerPanel');
    STICKERS.forEach((s) => panel.appendChild(el('button', { text: s, onclick: () => { sendAction('chat', { kind: 'sticker', emoji: s }); panel.style.display = 'none'; } })));
    $('#btnSticker').addEventListener('click', () => { panel.style.display = panel.style.display === 'none' ? 'grid' : 'none'; });
  }
  function sendChat() {
    const v = $('#chatText').value.trim(); if (!v) return;
    sendAction('chat', { text: v }); $('#chatText').value = ''; send({ type: 'typing', on: false });
  }
  function showTyping(isPeer, on) { const tip = $('#typingTip'); if (!tip) return; tip.textContent = (isPeer && on) ? `${(S.peer && S.peer.name) || '对方'} 正在输入…` : ''; }

  // 语音录制
  function toggleRecord() {
    if (S.rec) { stopRecord(); return; }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { toast('当前环境不支持录音（请用 HTTPS 或 localhost 打开）'); return; }
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mr = new MediaRecorder(stream);
      const chunks = [];
      mr.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: mr.mimeType || 'audio/webm' });
        const dur = Math.round((Date.now() - S.rec.start) / 1000);
        if (blob.size < 500) { toast('录音太短啦'); return; }
        const fr = new FileReader();
        fr.onload = () => { sendAction('chat', { kind: 'voice', audio: fr.result, dur: Math.max(1, dur) }); };
        fr.readAsDataURL(blob);
      };
      mr.start();
      S.rec = { mr, start: Date.now(), stream, timer: setInterval(() => { $('#recTime').textContent = Math.round((Date.now() - S.rec.start) / 1000) + '″'; }, 500) };
      $('#recBar').style.display = 'flex';
      $('#btnMic').classList.add('rec');
    }).catch(() => toast('无法访问麦克风，请检查权限'));
  }
  function stopRecord() {
    if (!S.rec) return;
    clearInterval(S.rec.timer); S.rec.mr.stop(); S.rec = null;
    $('#recBar').style.display = 'none'; $('#btnMic').classList.remove('rec');
  }
  function doShareLocation() {
    if (!navigator.geolocation) { toast('当前设备不支持定位'); return; }
    toast('正在获取位置…');
    navigator.geolocation.getCurrentPosition(
      (pos) => { sendAction('chat', { kind: 'location', lat: pos.coords.latitude, lng: pos.coords.longitude, locName: '' }); toast('已共享你的位置 📍'); if (S.activeTab !== 'chat') switchTab('chat'); },
      (err) => toast('无法获取位置：' + (err.message || '已拒绝'))
    );
  }

  // ---------- 愿望 ----------
  function renderWish() {
    const list = $('#wishList'); if (!list) return;
    const wishes = S.data.wishes || [];
    const done = wishes.filter((w) => w.done).length;
    $('#wishProgress').textContent = `${done}/${wishes.length}`;
    list.innerHTML = '';
    if (!wishes.length) list.appendChild(el('div', { class: 'anniv-empty', text: '还没有愿望，添加你们想一起做的事吧 🌟' }));
    wishes.forEach((w) => {
      list.appendChild(el('div', { class: 'wish-item' + (w.done ? ' done' : '') }, [
        el('div', { class: 'wish-check', text: w.done ? '✓' : '', onclick: () => sendAction('wish_toggle', { id: w.id }) }),
        el('div', { class: 'wish-text', text: w.text }),
        el('div', { class: 'wish-by', text: 'by ' + ((w.by === S.me.id ? '我' : (S.peer && S.peer.name)) || '对方') }),
        el('div', { class: 'wish-del', text: '🗑', onclick: () => sendAction('wish_del', { id: w.id }) }),
      ]));
    });
  }
  function initWish() {
    $('#btnWishAdd').addEventListener('click', () => { const v = $('#wishInput').value.trim(); if (!v) return; sendAction('wish_add', { text: v }); $('#wishInput').value = ''; });
    $('#wishInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#btnWishAdd').click(); });
  }

  // ---------- 瞬间 ----------
  const MOMENT_EMOJIS = ['✨', '🌸', '☀️', '🌙', '🍰', '🌊', '🎡', '☕️', '🐱', '🌟', '💐', '🍜'];
  function renderMoment() {
    const list = $('#momentList'); if (!list) return;
    const moms = S.data.moments || [];
    list.innerHTML = '';
    if (!moms.length) list.appendChild(el('div', { class: 'anniv-empty', text: '还没有瞬间，记下你们的小美好吧 ✨' }));
    moms.forEach((mo) => list.appendChild(el('div', { class: 'moment-item' }, [
      el('div', { class: 'me-emo', text: mo.emoji }),
      el('div', { class: 'm-body' }, [el('div', { class: 'm-text', text: mo.text }), el('div', { class: 'm-meta', text: `${mo.from === S.me.id ? '我' : mo.name} · ${timeAgo(mo.t)}` })]),
    ])));
  }
  function initMoment() {
    const strip = $('#momentEmojiStrip'); strip.innerHTML = '';
    MOMENT_EMOJIS.forEach((e) => {
      const b = el('button', { text: e }); if (e === S.momentEmoji) b.classList.add('sel');
      b.addEventListener('click', () => { S.momentEmoji = e; $('#momentEmoji').textContent = e; $$('#momentEmojiStrip button').forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); });
      strip.appendChild(b);
    });
    $('#momentEmoji').textContent = S.momentEmoji;
    $('#btnMomentAdd').addEventListener('click', () => { const v = $('#momentText').value.trim(); if (!v) return; sendAction('moment', { text: v, emoji: S.momentEmoji }); $('#momentText').value = ''; });
    $('#momentText').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#btnMomentAdd').click(); });
  }

  // ---------- 小游戏 ----------
  function renderGame() {
    const body = $('#gameBody'); if (!body) return; body.innerHTML = '';
    body.appendChild(S.gameKind === 'tacit' ? renderTacit() : renderTruth());
  }
  function renderTacit() {
    const q = TACIT[dayIndex() % TACIT.length];
    S.tacit.me = null; S.tacit.peer = null;
    const card = el('div', { class: 'game-card' });
    card.appendChild(el('div', { class: 'game-q', text: q.q }));
    const opts = el('div', { class: 'game-opts' });
    [['a', q.a], ['b', q.b]].forEach(([k, label]) => {
      const b = el('button', { class: 'game-opt', text: label, onclick: () => {
        S.tacit.me = k; $$('.game-opt', opts).forEach((x) => x.classList.remove('sel')); b.classList.add('sel');
        sendEffect('tacit', { choice: k });
        if (S.tacit.peer) evalTacit(); else toast('已选择，等对方选好…');
      } });
      opts.appendChild(b);
    });
    card.appendChild(opts);
    card.appendChild(el('div', { class: 'game-hint', text: '两人答同一道题，答案一致就证明超有默契💞（每天一题）' }));
    return card;
  }
  function evalTacit() {
    const box = $('#gameBody .game-card'); if (!box) return;
    const old = box.querySelector('.game-result'); if (old) old.remove();
    const ok = S.tacit.me === S.tacit.peer;
    box.appendChild(el('div', { class: 'game-result ' + (ok ? 'tacit' : ''), text: ok ? '💞 默契爆表！你们想到了一起~' : '🤪 有点不一样，但这就是可爱的地方' }));
  }
  function renderTruth() {
    const card = el('div', { class: 'game-card' });
    card.appendChild(el('div', { class: 'game-hint', text: '轮流转盘，抽到真心话就坦白，抽到大冒险就行动！' }));
    const res = el('div', { class: 'spin-result' }); res.style.display = 'none';
    const btn = el('button', { class: 'spin-btn', text: '🎲 转一转' });
    btn.addEventListener('click', () => {
      const isTruth = Math.random() < 0.5;
      const pool = isTruth ? TRUTH : DARE;
      const text = pool[Math.floor(Math.random() * pool.length)];
      res.style.display = 'block'; res.innerHTML = `<span class="tag">${isTruth ? '💬 真心话' : '🔥 大冒险'}</span><br>${esc(text)}`;
      btn.textContent = '🎲 再来一次';
    });
    card.appendChild(btn); card.appendChild(res);
    return card;
  }

  // ---------- 设置 / 纪念日 ----------
  const openModal = (node) => { $('#modalBody').innerHTML = ''; $('#modalBody').appendChild(node); $('#modal').style.display = 'flex'; };
  function openServerModal(msg) {
    const wrap = el('div');
    wrap.appendChild(el('h3', { text: '⚙️ 服务器地址' }));
    if (msg) wrap.appendChild(el('p', { class: 'modal-tip', text: msg }));
    const f = el('div', { class: 'set-field' }, [el('label', { text: '服务器地址（含 http:// 或 https://）' }), (() => { const i = el('input', { type: 'url', placeholder: 'http://192.168.1.10:3000', value: loadServer() }); i.id = 'setServer'; return i; })()]);
    wrap.appendChild(f);
    wrap.appendChild(el('p', { class: 'modal-tip', text: '家里 WiFi：电脑跑 npm start 后，填 http://电脑内网IP:3000。云端：填部署后的网址。' }));
    wrap.appendChild(el('button', { class: 'modal-save', text: '💾 保存并连接', onclick: () => {
      const v = $('#setServer').value.trim();
      if (!v) { toast('请填写服务器地址'); return; }
      saveServer(v); serverPrompted = false; closeModal(); connect();
    } }));
    openModal(wrap);
  }
  const closeModal = () => { $('#modal').style.display = 'none'; };
  function initModal() { $$('[data-close]').forEach((x) => x.addEventListener('click', closeModal)); }
  function openSettings() {
    const wrap = el('div');
    wrap.appendChild(el('h3', { text: '⚙️ 小岛设置' }));
    wrap.appendChild(el('div', { class: 'set-field' }, [el('label', { text: '服务器地址' }), (() => { const i = el('input', { type: 'url', placeholder: 'http://IP:3000', value: loadServer() }); i.id = 'setServer2'; return i; })()]));
    wrap.appendChild(el('div', { class: 'set-field' }, [el('label', { text: '我的昵称' }), (() => { const i = el('input', { value: S.me.name, maxlength: '12' }); i.id = 'setName'; return i; })()]));
    const colorF = el('div', { class: 'set-field' }, [el('label', { text: '我的颜色' })]);
    const sw = el('div', { class: 'color-swatches' });
    COLORS.forEach((c) => { const b = el('button', { style: `background:${c}` }); if (c === S.me.color) b.classList.add('sel'); b.addEventListener('click', () => { $$('.color-swatches button', sw).forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); }); b.dataset.color = c; sw.appendChild(b); });
    colorF.appendChild(sw); wrap.appendChild(colorF);
    wrap.appendChild(el('div', { class: 'set-field' }, [el('label', { text: '在一起的这一天（算恋爱天数）' }), (() => { const i = el('input', { type: 'date', value: S.data.togetherSince ? new Date(S.data.togetherSince).toISOString().slice(0, 10) : '' }); i.id = 'setDate'; return i; })()]));
    wrap.appendChild(el('button', { class: 'modal-save', text: '💾 保存', onclick: () => {
      const sv = $('#setServer2').value.trim(); if (sv) { saveServer(sv); serverPrompted = false; }
      const nm = $('#setName').value.trim() || '宝贝';
      const col = ($('.color-swatches button.sel') || {}).dataset?.color || S.me.color;
      sendAction('rename', { name: nm, color: col }); S.me.name = nm; S.me.color = col;
      sendAction('together', { date: $('#setDate').value });
      closeModal(); toast('已保存 💗'); renderHome();
    } }));
    openModal(wrap);
  }
  function openAnniv() {
    const wrap = el('div');
    wrap.appendChild(el('h3', { text: '🎉 纪念日管理' }));
    const listBox = el('div');
    const refresh = () => { listBox.innerHTML = ''; (S.data.anniversaries || []).forEach((a) => listBox.appendChild(el('div', { class: 'anniv-item' }, [
      el('div', { class: 'ae', text: a.emoji }), el('div', { class: 'at', text: a.title }), el('div', { class: 'ad', text: new Date(a.date).toLocaleDateString('zh-CN') }),
      el('div', { class: 'adel', text: '🗑', onclick: () => { sendAction('anniv_del', { id: a.id }); refresh(); renderHome(); } }),
    ]))); };
    refresh(); wrap.appendChild(listBox);
    const f = el('div', { class: 'set-field', style: 'margin-top:14px' }, [el('label', { text: '添加一个特别日子' })]);
    const row = el('div', { style: 'display:flex;gap:8px' });
    const emo = el('input', { value: '💖', style: 'width:54px;text-align:center;font-size:20px' });
    const title = el('input', { placeholder: '标题，如：交往纪念日' });
    const date = el('input', { type: 'date' });
    row.appendChild(emo); row.appendChild(title); row.appendChild(date); f.appendChild(row); wrap.appendChild(f);
    wrap.appendChild(el('button', { class: 'modal-save', text: '➕ 添加', onclick: () => {
      if (!title.value.trim() || !date.value) { toast('填好标题和日期哦~'); return; }
      sendAction('anniv_add', { title: title.value.trim(), date: date.value, emoji: emo.value.trim() || '💖' });
      title.value = ''; refresh(); renderHome(); toast('已添加 🎉');
    } }));
    openModal(wrap);
  }

  // ---------- 启动 ----------
  let deferredPrompt = null;
  function initInstall() {
    const banner = $('#installBanner'), btn = $('#installBtn');
    if (btn) btn.addEventListener('click', async () => {
      if (deferredPrompt) { try { deferredPrompt.prompt(); await deferredPrompt.userChoice; } catch (e) {} deferredPrompt = null; if (banner) banner.style.display = 'none'; }
    });
    const closeBtn = document.querySelector('[data-close-install]');
    if (closeBtn) closeBtn.addEventListener('click', () => { if (banner) banner.style.display = 'none'; });
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault(); deferredPrompt = e;
      const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent);
      if (!isIOS && banner) banner.style.display = 'flex';
    });
    window.addEventListener('appinstalled', () => { if (banner) banner.style.display = 'none'; });
    // iOS Safari 不支持 beforeinstallprompt，给一次性引导
    const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent);
    if (isIOS && !localStorage.getItem('lianyu_ioshint')) {
      const ih = $('#iosHint');
      if (ih) { ih.style.display = 'block'; setTimeout(() => { ih.style.display = 'none'; try { localStorage.setItem('lianyu_ioshint', '1'); } catch (e) {} }, 9000); }
    }
  }
  function setupIcons() {
    $$('[data-ic]').forEach((b) => { b.innerHTML = ic(b.dataset.ic); });
  }
  function init() {
    setupIcons(); buildNav(); initPair(); initTop(); initTabs(); initChat(); initWish(); initMoment(); initModal(); initInstall();
    connect();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
