/**
 * 恋屿 · 双人恋爱工作台 —— 后端服务
 * 提供：静态资源托管 + WebSocket 实时同步 + 房间配对 + JSON 持久化
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_FILE = path.join(__dirname, 'data.json');

// ---------- 持久化 ----------
let rooms = {};
try {
  if (fs.existsSync(DATA_FILE)) {
    rooms = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    console.log(`已载入 ${Object.keys(rooms).length} 个房间数据`);
  }
} catch (e) {
  console.warn('载入数据失败，使用空数据:', e.message);
  rooms = {};
}
let saveTimer = null;
function persist() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    fs.writeFile(DATA_FILE, JSON.stringify(rooms), (err) => {
      if (err) console.error('保存失败:', err.message);
    });
  }, 400);
}

// ---------- 房间管理 ----------
function genCode() {
  const chars = 'ACDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code;
  do {
    code = '';
    for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  } while (rooms[code]);
  return code;
}
function newRoomData() {
  return { messages: [], moods: {}, wishes: [], anniversaries: [], moments: [], togetherSince: null };
}
function roomInfo(room) {
  return {
    code: room.code,
    createdAt: room.createdAt,
    members: Object.values(room.members),
    data: room.data,
  };
}
function broadcast(room, msg, exceptWs) {
  if (!room) return;
  const raw = JSON.stringify(msg);
  for (const m of Object.values(room.members)) {
    if (m.ws && m.ws !== exceptWs && m.ws.readyState === 1) m.ws.send(raw);
  }
}
function presence(room) {
  return {
    type: 'presence',
    members: Object.values(room.members).map((m) => ({
      id: m.id, name: m.name, color: m.color, online: !!m.ws,
    })),
  };
}

// ---------- HTTP 静态服务 ----------
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};
const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(PUBLIC_DIR, path.normalize(urlPath));
  if (!filePath.startsWith(PUBLIC_DIR)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(filePath, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    res.end(buf);
  });
});

// ---------- WebSocket ----------
const wss = new WebSocketServer({ server });
function send(ws, obj) { if (ws.readyState === 1) ws.send(JSON.stringify(obj)); }

wss.on('connection', (ws) => {
  ws.roomCode = null;
  ws.clientId = null;

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    // 配对
    if (msg.type === 'pair') {
      const isCreate = msg.mode === 'create';
      let room;
      if (isCreate) {
        const code = genCode();
        room = rooms[code] = { code, createdAt: Date.now(), members: {}, data: newRoomData() };
      } else {
        room = rooms[msg.code];
        if (!room) { send(ws, { type: 'error', code: 'NO_ROOM', msg: '没有找到这个连接码，请确认后重试~' }); return; }
        if (Object.keys(room.members).length >= 2 && !room.members[msg.clientId]) {
          send(ws, { type: 'error', code: 'FULL', msg: '这个岛已经有两个人啦，换一个连接码试试~' }); return;
        }
      }
      // 注册成员
      const id = msg.clientId;
      const member = room.members[id] || { id, name: msg.name || '宝贝', color: msg.color || '#ff7eb3', joinedAt: Date.now() };
      member.name = msg.name || member.name;
      member.color = msg.color || member.color;
      member.ws = ws;
      room.members[id] = member;
      ws.roomCode = room.code; ws.clientId = id;

      send(ws, { type: 'paired', you: { id: member.id, name: member.name, color: member.color }, room: roomInfo(room) });
      broadcast(room, presence(room), ws);
      persist();
      return;
    }

    const room = ws.roomCode ? rooms[ws.roomCode] : null;
    if (!room) return;
    const me = room.members[ws.clientId];
    if (!me) return;

    // 心跳 / 抱抱 / 戳一戳 / 小游戏同步 等实时特效
    if (msg.type === 'effect') {
      broadcast(room, { type: 'effect', effect: msg.effect, from: { id: me.id, name: me.name, color: me.color }, data: msg.data || null, t: Date.now() }, ws);
      return;
    }
    // 正在输入
    if (msg.type === 'typing') {
      broadcast(room, { type: 'typing', from: me.id, on: !!msg.on }, ws);
      return;
    }
    // 各类数据动作
    if (msg.type === 'action') {
      const p = msg.payload || {};
      const t = Date.now();
      let evt = null;
      switch (msg.action) {
        case 'chat': {
          const kind = p.kind || 'text';
          const m = { id: 'm' + t + Math.random().toString(36).slice(2, 6), from: me.id, name: me.name, color: me.color, kind, t };
          if (kind === 'text') m.text = String(p.text || '').slice(0, 1000);
          if (kind === 'voice') { m.audio = String(p.audio || '').slice(0, 4000000); m.dur = Number(p.dur) || 0; }
          if (kind === 'sticker') { m.emoji = p.emoji || '💖'; }
          if (kind === 'location') { m.lat = Number(p.lat); m.lng = Number(p.lng); m.locName = String(p.locName || '').slice(0, 60); }
          room.data.messages.push(m);
          if (room.data.messages.length > 500) room.data.messages.shift();
          evt = { action: 'chat', payload: m };
          break;
        }
        case 'mood': {
          room.data.moods[me.id] = { value: p.value, note: String(p.note || '').slice(0, 200), date: new Date().toISOString().slice(0, 10), t };
          evt = { action: 'mood', payload: { id: me.id, mood: room.data.moods[me.id] } };
          break;
        }
        case 'wish_add': {
          const w = { id: 'w' + t + Math.random().toString(36).slice(2, 6), text: String(p.text || '').slice(0, 200), done: false, by: me.id, t };
          room.data.wishes.push(w);
          evt = { action: 'wish_add', payload: w };
          break;
        }
        case 'wish_toggle': {
          const w = room.data.wishes.find((x) => x.id === p.id);
          if (w) { w.done = !w.done; w.by = me.id; w.t = t; evt = { action: 'wish_toggle', payload: { id: w.id, done: w.done, by: me.id } }; }
          break;
        }
        case 'wish_del': {
          room.data.wishes = room.data.wishes.filter((x) => x.id !== p.id);
          evt = { action: 'wish_del', payload: { id: p.id } };
          break;
        }
        case 'anniv_add': {
          const a = { id: 'a' + t + Math.random().toString(36).slice(2, 6), title: String(p.title || '纪念日').slice(0, 50), date: p.date, emoji: p.emoji || '💖', by: me.id };
          room.data.anniversaries.push(a);
          evt = { action: 'anniv_add', payload: a };
          break;
        }
        case 'anniv_del': {
          room.data.anniversaries = room.data.anniversaries.filter((x) => x.id !== p.id);
          evt = { action: 'anniv_del', payload: { id: p.id } };
          break;
        }
        case 'together': {
          room.data.togetherSince = p.date ? new Date(p.date).getTime() : null;
          evt = { action: 'together', payload: { date: room.data.togetherSince } };
          break;
        }
        case 'moment': {
          const mo = { id: 'mo' + t + Math.random().toString(36).slice(2, 6), from: me.id, name: me.name, color: me.color, text: String(p.text || '').slice(0, 500), emoji: p.emoji || '✨', t };
          room.data.moments.unshift(mo);
          if (room.data.moments.length > 200) room.data.moments.pop();
          evt = { action: 'moment', payload: mo };
          break;
        }
        case 'rename': {
          me.name = String(p.name || '宝贝').slice(0, 20);
          me.color = p.color || me.color;
          evt = { action: 'rename', payload: { id: me.id, name: me.name, color: me.color } };
          break;
        }
      }
      if (evt) {
        broadcast(room, { type: 'action', ...evt, from: me.id, t }, ws);
        // 回执给发送者本人（确保自己端也刷新）
        send(ws, { type: 'action', ...evt, from: me.id, t });
        persist();
      }
      return;
    }
  });

  ws.on('close', () => {
    const room = ws.roomCode ? rooms[ws.roomCode] : null;
    if (room && room.members[ws.clientId]) {
      room.members[ws.clientId].ws = null;
      broadcast(room, presence(room));
      persist();
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n💗 恋屿 工作台已启动: http://localhost:${PORT}`);
  console.log('   Share this URL with both phones. One creates the island, the other joins.\n');
});
