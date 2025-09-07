import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, doc, setDoc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB6-0VPDW3W5TigkzxBYMgZV_3iqw8GGkM",
  authDomain: "chattingbackendsincenodebreaks.firebaseapp.com",
  projectId: "chattingbackendsincenodebreaks",
  storageBucket: "chattingbackendsincenodebreaks.firebasestorage.app",
  messagingSenderId: "628300382438",
  appId: "1:628300382438:web:c5a701929b899f45267b27",
  measurementId: "G-YV919TVGCY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

let me = {
  uid: null,
  name: localStorage.getItem("username") || "",
  tag: localStorage.getItem("usertag") || "",
  avatar: "?"
};

let current = { type: "public", id: "public", title: "General Chat" };
let unsubMsgs = null, unsubMyRooms = null, unsubUsers = null;

let lastMessageTime = 0;
let messageHistory = [];
let mutedUntil = 0;
const COOLDOWN_MS = 3000; 
const MUTE_DURATION_MS = 10 * 60 * 1000; 
const SPAM_THRESHOLD = 5; 

const swearingBlacklist = [
  "fuck", "shit", "damn", "bitch", "bastard", "dickhead",
  "asshole", "motherfucker", "bullshit", "dumbass", "retard", "slut", "whore", "fag",
  "nigger", "cunt", "pussy", "cock", "dick", "penis", "vagina", "tits", "boobs",
  "sex", "porn", "masturbate", "orgasm", "horny", "sexy", "nude", "naked", "strip",
  "rape", "murder", "die", "death", "suicide", "bomb", "terrorist", "nig", "ger"
];

const emojis = [
  "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "🥸", "😎", "🤓", "🧐", "😕", "😟", "🙁", "☹️", "😮", "😯", "😲", "😳", "🥺", "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "🥱", "😤", "😡", "😠", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻", "👽", "👾", "🤖", "🎃", "😺", "🫨", "🫠", "🫥", "🫡", "🫢", "🫣", "🫤", "🥹", "🫶", "🫰", "🫵", "🫳", "🫴", "🤌", "🫱", "🫲", "🤏", "🙌", "👏", "🫸", "🫷", "🤝", "👍", "👎", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "✋", "🤚", "🖐️", "🖖", "👋", "🤛", "🤜", "✊", "👊", "💪", "🦾", "🦿", "👂", "🦻", "👃", "🥀", "👅", "🔋", "🪫", "🌹", "🧠", "🫀", "🫁", "🦷", "🦴", "👀", "👁️", "👅", "👄", "🫦", "💋", "🩸", "✨", "💫", "⭐", "🌟", "💥", "💢", "💨", "💦", "💤", "🔥", "❄️", "⚡", "🌈", "☀️", "⛅", "☁️", "🌤️", "🌦️", "🌧️", "⛈️", "🌩️", "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💖", "💗", "💘", "💝", "💟", "❤‍🩹", "♥️", "💯", "💣", "💬", "👁️‍🗨️", "🗨️", "🗯️", "💭", "🕳️", "✌️", "🖕", "🤲", "🙏", "✍️", "💅", "🤳", "🦵", "🦶", "🧬", "🦠", "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐽", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🦟", "🦗", "🕷️", "🕸️", "🦂", "🐢", "🐍", "🦎", "🦖", "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🐡", "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍", "🦧", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒", "🦘", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🦙", "🐐", "🦌", "🐕", "🐩", "🦮", "🐕‍🦺", "🐈", "🐈‍⬛", "🐓", "🦃", "🦚", "🦜", "🦢", "🦩", "🕊️", "🐇", "🦝", "🦨", "🦡", "🦦", "🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶️", "🫑", "🌽", "🥕", "🫒", "🧄", "🧅", "🥔", "🍠", "🥐", "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🦴", "🌭", "🍔", "🍟", "🍕", "🫓", "🥪", "🥙", "🧆", "🌮", "🌯", "🫔", "🥗", "🥘", "🫕", "🥫", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪", "🍤", "🍙", "🍚", "🍘", "🍥", "🥠", "🥮", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🧁", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🌰", "🥜", "🍯", "🥛", "🍼", "🫖", "☕", "🍵", "🧃", "🥤", "🧋", "🍶", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸", "🍹", "🧉", "🍾", "🧊", "🥄", "🍴", "🍽️", "🥣", "🥡", "🥢", "🧂", "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛼", "🛷", "⛸️", "🥌", "🎿", "⛷️", "🏂", "🪂", "🏋️‍♀️", "🏋️", "🏋️‍♂️", "🤼‍♀️", "🤼", "🤼‍♂️", "🤸‍♀️", "🤸", "🤸‍♂️", "⛹️‍♀️", "⛹️", "⛹️‍♂️", "🤺", "🤾‍♀️", "🤾", "🤾‍♂️", "🏌️‍♀️", "🏌️", "🏌️‍♂️", "🏇", "🧘‍♀️", "🧘", "🧘‍♂️", "🏄‍♀️", "🏄", "🏄‍♂️", "🏊‍♀️", "🏊", "🏊‍♂️", "🤽‍♀️", "🤽", "🤽‍♂️", "🚣‍♀️", "🚣", "🚣‍♂️", "🧗‍♀️", "🧗", "🧗‍♂️", "🚵‍♀️", "🚵", "🚵‍♂️", "🚴‍♀️", "🚴", "🚴‍♂️", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "🏵️", "🎗️", "🎫", "🎟️", "🎪", "🤹‍♀️", "🤹", "🤹‍♂️"
];

const usersPanel = document.getElementById("usersPanel");
const toggleUsersBtn = document.getElementById("toggleUsers");
const usersList = document.getElementById("usersList");
const chatTitle = document.getElementById("chatTitle");
const messagesEl = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const publicBtn = document.getElementById("publicBtn");
const myChats = document.getElementById("myChats");
const startDmBtn = document.getElementById("startDmBtn");
const createGroupBtn = document.getElementById("createGroupBtn");
const changeNameBtn = document.getElementById("changeNameBtn");
const renameGroupBtn = document.getElementById("renameGroupBtn");

const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalCancel = document.getElementById("modalCancel");
const modalSave = document.getElementById("modalSave");

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function sanitizeInput(input, maxLength = 50) {
  if (typeof input !== 'string') return '';
  return input.trim().substring(0, maxLength);
}

function validateId(id) {
  if (typeof id !== 'string') return false;
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

function createTextElement(tagName, text, className = null) {
  const element = document.createElement(tagName);
  element.textContent = text; 
  if (className) element.className = className;
  return element;
}

function safeSetAttribute(element, attribute, value) {
  if (typeof attribute !== 'string' || typeof value !== 'string') return;
  const safeAttributes = ['id', 'class', 'data-uid', 'data-name', 'data-tag', 'type', 'name', 'value', 'placeholder', 'maxlength'];
  if (safeAttributes.includes(attribute)) {
    const sanitizedValue = value.replace(/[<>"']/g, '');
    element.setAttribute(attribute, sanitizedValue);
  }
}

function avatarLetter(name) {
  const safeName = sanitizeInput(name);
  return (safeName[0] || "?").toUpperCase();
}

function randomTag() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function safeUsername(name, tag) {
  const safeName = sanitizeInput(name, 20);
  const safeTag = sanitizeInput(tag, 10);
  return `${safeName}#${safeTag}`;
}

function formatTimestamp(timestamp) {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  if (messageDate.getTime() === today.getTime()) {
    return timeStr;
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return `Yesterday, ${timeStr}`;
  } else {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}, ${timeStr}`;
  }
}

function filterSwearing(text) {
  let filtered = sanitizeInput(text, 119);
  swearingBlacklist.forEach(word => {
    const regex = new RegExp(`\\b\\w*${word}\\w*\\b`, 'gi');
    filtered = filtered.replace(regex, (match) => '*'.repeat(match.length));
  });
  return filtered;
}

function showStatusMessage(message, type = 'info') {
  const statusDiv = document.createElement('div');
  statusDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    max-width: 300px;
    word-wrap: break-word;
  `;

  if (type === 'error') {
    statusDiv.style.background = '#ff4444';
  } else if (type === 'warning') {
    statusDiv.style.background = '#ff8800';
  } else {
    statusDiv.style.background = '#4CAF50';
  }

  statusDiv.textContent = sanitizeInput(message, 200);
  document.body.appendChild(statusDiv);

  setTimeout(() => {
    statusDiv.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => statusDiv.remove(), 300);
  }, 3000);
}

function checkSpamProtection(text) {
  const now = Date.now();

  if (now < mutedUntil) {
    const remainingTime = Math.ceil((mutedUntil - now) / 1000);
    showStatusMessage(`You are muted for ${remainingTime} more seconds`, 'error');
    return false;
  }

  const timeSinceLastMessage = now - lastMessageTime;
  if (timeSinceLastMessage < COOLDOWN_MS) {
    const remainingCooldown = Math.ceil((COOLDOWN_MS - timeSinceLastMessage) / 1000);
    showStatusMessage(`Please wait ${remainingCooldown} seconds before sending another message`, 'warning');
    return false;
  }

  messageHistory.push({ text: text.toLowerCase().trim(), timestamp: now });
  if (messageHistory.length > 10) {
    messageHistory.shift();
  }

  const recentIdentical = messageHistory.filter(msg => 
    msg.text === text.toLowerCase().trim() && 
    (now - msg.timestamp) < 60000 
  );

  if (recentIdentical.length >= SPAM_THRESHOLD) {
    mutedUntil = now + MUTE_DURATION_MS;
    showStatusMessage('You have been muted for 2 minutes due to spam', 'error');
    messageHistory = messageHistory.filter(msg => msg.text !== text.toLowerCase().trim());
    return false;
  }

  lastMessageTime = now;
  return true;
}

function updateSendButtonState() {
  const now = Date.now();
  const isEnabled = messageInput.value.trim() && 
                   now >= mutedUntil && 
                   (now - lastMessageTime) >= COOLDOWN_MS;

  sendBtn.disabled = !isEnabled;
  sendBtn.style.opacity = isEnabled ? '1' : '0.5';
  sendBtn.style.cursor = isEnabled ? 'pointer' : 'not-allowed';

  if (now < mutedUntil) {
    const remainingTime = Math.ceil((mutedUntil - now) / 1000);
    messageInput.placeholder = `Muted for ${remainingTime} seconds...`;
    messageInput.disabled = true;
  } else {
    messageInput.placeholder = "Type a message...";
    messageInput.disabled = false;
  }
}

function addEmojiPicker() {
  const picker = document.createElement('div');
  picker.id = 'emojiPicker';
  picker.style.cssText = `
    position: absolute;
    bottom: 60px;
    right: 10px;
    background: var(--surface-hover);
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    max-width: 300px;
    max-height: 200px;
    overflow-y: auto;
    display: none;
    z-index: 9999999999999999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;

  emojis.forEach(emoji => {
    const emojiBtn = document.createElement('button');
    emojiBtn.textContent = emoji; 
    emojiBtn.style.cssText = `
      border: none;
      background: none;
      font-size: 20px;
      margin: 2px;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      z-index:99999999999999999999999;
    `;
    emojiBtn.onclick = () => {
      if (messageInput.value.length < 119) {
        messageInput.value += emoji;
        updateCharCount();
        picker.style.display = 'none';
        messageInput.focus();
      }
    };
    picker.appendChild(emojiBtn);
  });

  document.body.appendChild(picker);

  const emojiToggle = document.createElement('button');
  emojiToggle.textContent = '😀';
  emojiToggle.style.cssText = `
    position: absolute;
    right: 20px;
    bottom: 40px;
    transform: translateY(-50%);
    border: none;
    background: var(--surface);
    font-size: 20px;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
    z-index:9999999;
  `;
  emojiToggle.onclick = () => {
    picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
  };

  const charCounter = document.createElement('div');
  charCounter.id = 'charCounter';
  charCounter.style.cssText = `
    position: absolute;
    right: 10px;
    bottom: 450px;
    transform: translateY(-50%);
    font-size: 12px;
    color: var(--text-muted);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
  `;

  const inputContainer = messageInput.parentElement;
  inputContainer.style.position = 'relative';
  inputContainer.appendChild(emojiToggle);
  inputContainer.appendChild(charCounter);

  function updateCharCount() {
    const count = messageInput.value.length;
    charCounter.textContent = `${count}/119`;
    
    if (count >= 90) {
      charCounter.style.opacity = '1';
      
      if (count > 100) {
        charCounter.style.color = count >= 119 ? '#ff4444' : '#ff8800';
      } else {
        charCounter.style.color = 'var(--text-muted)';
      }
    } else {
      charCounter.style.opacity = '0';
    }
    
    updateSendButtonState();
  }

  messageInput.addEventListener('input', (e) => {
    if (e.target.value.length > 119) {
      e.target.value = e.target.value.substring(0, 119);
    }
    updateCharCount();
  });

  messageInput.addEventListener('focus', () => {
    const count = messageInput.value.length;
    if (count >= 90) {
      charCounter.style.opacity = '1';
    }
  });

  messageInput.addEventListener('blur', () => {
    const count = messageInput.value.length;
    if (count < 90) {
      charCounter.style.opacity = '0';
    }
  });

  updateCharCount();
  window.updateCharCount = updateCharCount;

  setInterval(updateSendButtonState, 1000);

  document.addEventListener('click', (e) => {
    if (!picker.contains(e.target) && e.target !== emojiToggle) {
      picker.style.display = 'none';
    }
  });
}

function createSafeModal(title, contentBuilder, onSave) {
  modalTitle.textContent = sanitizeInput(title, 100);
  modalBody.innerHTML = ""; 

  const content = contentBuilder();
  modalBody.appendChild(content);

  modalOverlay.style.display = "flex";
  const firstInput = modalBody.querySelector("input");
  if (firstInput) setTimeout(() => firstInput.focus(), 0);
  modalSave.onclick = async () => {
    await onSave?.();
  };
}

function closeModal() {
  modalOverlay.style.display = "none";
  modalBody.innerHTML = "";
  modalSave.onclick = null;
}

modalCancel.onclick = closeModal;

function roomPathForCurrent() {
  if (current.type === "public") return ["rooms", "public", "messages"];
  if (current.type === "dm") return ["dms", current.id, "messages"];
  if (current.type === "group") return ["groups", current.id, "messages"];
  return ["rooms", "public", "messages"];
}

function renderMessage(m) {
  const row = document.createElement("div");
  row.className = "bubble" + (m.uid === me.uid ? " me" : "");

  const av = document.createElement("div");
  av.className = "avatar";
  av.textContent = avatarLetter(m.name); 

  const content = document.createElement("div");
  content.className = "content";

  const nm = document.createElement("div");
  nm.className = "name";
  const timestamp = formatTimestamp(m.timestamp);
  const safeName = sanitizeInput(m.name || "Unknown", 20);
  const safeTag = sanitizeInput(m.tag || "0000", 10);
  nm.textContent = `${safeUsername(safeName, safeTag)} • ${timestamp}`;

  const tx = document.createElement("div");
  const safeText = filterSwearing(sanitizeInput(m.text || "", 119));
  tx.textContent = safeText; 

  content.appendChild(nm);
  content.appendChild(tx);
  row.appendChild(av);
  row.appendChild(content);
  return row;
}

function setActiveRoomButton(id) {
  document.querySelectorAll(".room-btn").forEach(b => b.classList.remove("active"));

  if (validateId(id)) {
    const btn = document.getElementById(`roombtn_${id}`);
    if (btn) btn.classList.add("active");
  }

  if (id === "public") publicBtn.classList.add("active");
}

onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  me.uid = user.uid;
  if (!me.name) {
    showUsernameModal("Set Username");
  } else {
    me.avatar = avatarLetter(me.name);
    await upsertUserProfile();
    startListeners();
    addEmojiPicker();
  }
});

signInAnonymously(auth).catch(console.error);

function showUsernameModal(title) {
  createSafeModal(title, () => {
    const container = document.createElement('div');

    const input = document.createElement('input');
    input.id = 'usernameInput';
    input.className = 'input';
    input.placeholder = 'Your name';
    input.maxLength = 20; 

    const hint = createTextElement('div', 'Maximum 20 characters');
    hint.style.cssText = 'font-size: 12px; color: var(--text-muted); margin-top: 5px;';

    container.appendChild(input);
    container.appendChild(hint);
    return container;
  }, async () => {
    const val = sanitizeInput(document.getElementById("usernameInput").value, 20);
    if (!val) return;

    me.name = val;
    me.tag = randomTag();
    me.avatar = avatarLetter(val);
    localStorage.setItem("username", me.name);
    localStorage.setItem("usertag", me.tag);
    await upsertUserProfile();
    closeModal();
    startListeners();
    addEmojiPicker();
  });
}

changeNameBtn.onclick = () => showUsernameModal("Change Username");

async function upsertUserProfile() {
  if (!me.uid) return;
  const ref = doc(db, "users", me.uid);

  await setDoc(ref, {
    uid: me.uid,
    name: sanitizeInput(me.name, 20),
    tag: sanitizeInput(me.tag, 10),
    avatar: avatarLetter(me.name),
    status: "online",
    lastSeen: serverTimestamp()
  }, { merge: true });

  window.addEventListener("beforeunload", async () => {
    try {
      await updateDoc(ref, {
        status: "offline",
        lastSeen: serverTimestamp()
      });
    } catch (e) {
      console.error("Error updating status on unload:", e);
    }
  });
}

function startListeners() {
  if (unsubUsers) unsubUsers();
  unsubUsers = onSnapshot(query(collection(db, "users"), orderBy("name")), (snap) => {
    usersList.innerHTML = "";
    snap.forEach(d => {
      const u = d.data();
      if (!u.name) return;

      const userData = {
        uid: u.uid,
        name: sanitizeInput(u.name, 20),
        tag: sanitizeInput(u.tag, 10),
        status: sanitizeInput(u.status || "offline", 20)
      };

      if (userData.uid === me.uid) {
        userData.name = me.name;
        userData.tag = me.tag;
      }

      const row = document.createElement("div");
      row.className = "user-row";
      safeSetAttribute(row, 'data-uid', userData.uid);

      const avatar = createTextElement('div', avatarLetter(userData.name), 'avatar');

      const userInfo = document.createElement('div');
      const userName = createTextElement('div', 
        `${safeUsername(userData.name, userData.tag)}${userData.uid === me.uid ? " (you)" : ""}`, 
        'user-name'
      );
      const userMeta = createTextElement('div', userData.status, 'user-meta');

      userInfo.appendChild(userName);
      userInfo.appendChild(userMeta);
      row.appendChild(avatar);
      row.appendChild(userInfo);

      row.onclick = () => {
        if (userData.uid !== me.uid) {
          createOrOpenDM(userData.uid, userData.name, userData.tag);
          usersPanel.classList.remove("open");
        }
      };
      usersList.appendChild(row);
    });
  });

  if (unsubMyRooms) unsubMyRooms();

  const renderRooms = { dms: [], groups: [] };

  const drawRooms = () => {
    myChats.innerHTML = "";

    const dmSection = document.createElement("div");
    const groupSection = document.createElement("div");

    const sortedDMs = renderRooms.dms.sort((a, b) => {
      const aTime = a.updatedAt?.seconds || 0;
      const bTime = b.updatedAt?.seconds || 0;
      return bTime - aTime;
    });

    const sortedGroups = renderRooms.groups.sort((a, b) => {
      const aTime = a.updatedAt?.seconds || 0;
      const bTime = b.updatedAt?.seconds || 0;
      return bTime - aTime;
    });

    if (sortedDMs.length > 0) {
      sortedDMs.forEach(r => {
        const btn = document.createElement("button");
        btn.className = "room-btn";
        if (validateId(r.key)) {
          btn.id = `roombtn_${r.key}`;
        }
        btn.textContent = sanitizeInput(r.label.replace("DM: ", ""), 50); 
        btn.onclick = () => openRoom(r.kind, r.id, r.label);
        dmSection.appendChild(btn);
      });
    }

    if (sortedDMs.length > 0) {
      myChats.appendChild(dmSection);
    }

    if (sortedGroups.length > 0) {
      if (sortedDMs.length > 0) {
        const separator = createTextElement("div", "Groups", "side-title");
        separator.style.marginTop = "1rem";
        myChats.appendChild(separator);
      }

      sortedGroups.forEach(r => {
        const btn = document.createElement("button");
        btn.className = "room-btn";
        if (validateId(r.key)) {
          btn.id = `roombtn_${r.key}`;
        }
        btn.textContent = sanitizeInput(r.label.replace("Group: ", ""), 50); 
        btn.onclick = () => openRoom(r.kind, r.id, r.label);
        groupSection.appendChild(btn);
      });
      myChats.appendChild(groupSection);
    }

    if (sortedDMs.length === 0 && sortedGroups.length === 0) {
      const emptyMsg = createTextElement("div", "No conversations yet. Start a DM or create a group!");
      emptyMsg.style.cssText = `
        padding: 1rem;
        color: var(--text-muted);
        font-size: 0.9rem;
      `;
      myChats.appendChild(emptyMsg);
    }

    setActiveRoomButton(current.id);
  };

  const dmQuery = query(collection(db, "dms"), where("memberUids", "array-contains", me.uid));
  const dmUnsub = onSnapshot(dmQuery, (snap) => {
    renderRooms.dms = snap.docs.map(d => {
      const r = d.data();
      const otherUid = (r.memberUids || []).find(x => x !== me.uid);
      const otherName = sanitizeInput(r.memberNames?.[otherUid] || "Unknown", 20);
      const otherTag = sanitizeInput(r.memberTags?.[otherUid] || "0000", 10);

      return {
        kind: "dm",
        id: d.id,
        key: d.id,
        label: `DM: ${safeUsername(otherName, otherTag)}`,
        updatedAt: r.updatedAt
      };
    });
    drawRooms();
  });

  const groupQuery = query(collection(db, "groups"), where("memberUids", "array-contains", me.uid));
  const groupUnsub = onSnapshot(groupQuery, (snap) => {
    renderRooms.groups = snap.docs.map(d => {
      const r = d.data();
      const safeName = sanitizeInput(r.name || "Unnamed", 50);
      return {
        kind: "group",
        id: d.id,
        key: d.id,
        label: `Group: ${safeName}`,
        updatedAt: r.updatedAt
      };
    });
    drawRooms();
  });

  unsubMyRooms = () => {
    dmUnsub();
    groupUnsub();
  };

  openRoom(current.type, current.id, current.title);
}

function openRoom(kind, id, title) {
  const safeKind = sanitizeInput(kind, 10);
  const safeId = sanitizeInput(id, 50);
  const safeTitle = sanitizeInput(title, 100);

  current = { type: safeKind, id: safeId, title: safeTitle };
  chatTitle.textContent = safeTitle; 

  const renameBtn = document.getElementById("renameGroupBtn");
  if (renameBtn) {
    renameBtn.style.display = safeKind === "group" ? "inline-block" : "none";
  }

  if (unsubMsgs) unsubMsgs();
  messagesEl.innerHTML = "";

  const [c1, c2, c3] = roomPathForCurrent();
  const messageQuery = query(collection(db, c1, c2, c3), orderBy("timestamp"));

  unsubMsgs = onSnapshot(messageQuery, (snap) => {
    snap.docChanges().forEach(change => {
      if (change.type === "added") {
        const m = change.doc.data();
        messagesEl.appendChild(renderMessage(m));
      }
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  });

  setActiveRoomButton(safeId);
}

async function sendMessage() {
  const text = sanitizeInput(messageInput.value, 119);
  if (!text || !me.uid || !me.name) return;

  if (!checkSpamProtection(text)) {
    return;
  }

  try {
    const [c1, c2, c3] = roomPathForCurrent();
    await addDoc(collection(db, c1, c2, c3), {
      uid: me.uid,
      name: sanitizeInput(me.name, 20), 
      tag: sanitizeInput(me.tag, 10),   
      text: text, 
      timestamp: serverTimestamp()
    });

    if (current.type === "dm") {
      await updateDoc(doc(db, "dms", current.id), {
        updatedAt: serverTimestamp()
      });
    } else if (current.type === "group") {
      await updateDoc(doc(db, "groups", current.id), {
        updatedAt: serverTimestamp()
      });
    }

    messageInput.value = "";
    if (window.updateCharCount) window.updateCharCount();
  } catch (error) {
    console.error("Error sending message:", error);
    showStatusMessage("Failed to send message. Please try again.", 'error');
  }
}

sendBtn.onclick = sendMessage;
messageInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

publicBtn.onclick = () => openRoom("public", "public", "General Chat");
toggleUsersBtn.onclick = () => usersPanel.classList.toggle("open");

startDmBtn.onclick = async () => {
  try {
    const usersSnap = await getDocs(query(collection(db, "users"), orderBy("name")));

    createSafeModal("Start a Direct Message", () => {
      const container = document.createElement('div');

      const listContainer = document.createElement('div');
      listContainer.className = 'list';

      let hasUsers = false;
      usersSnap.forEach(d => {
        const u = d.data();
        if (u.uid === me.uid || !u.name) return;

        hasUsers = true;
        const label = document.createElement('label');
        label.className = 'list-row';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'dmTarget';
        radio.value = u.uid;
        safeSetAttribute(radio, 'data-name', sanitizeInput(u.name, 20));
        safeSetAttribute(radio, 'data-tag', sanitizeInput(u.tag, 10));

        const avatar = createTextElement('div', avatarLetter(u.name), 'avatar');
        const userName = createTextElement('div', safeUsername(u.name, u.tag));

        label.appendChild(radio);
        label.appendChild(avatar);
        label.appendChild(userName);
        listContainer.appendChild(label);
      });

      if (hasUsers) {
        const hint = createTextElement('div', 'Pick exactly one person.', 'hint');
        container.appendChild(listContainer);
        container.appendChild(hint);
      } else {
        const noUsers = createTextElement('div', 'No other users yet.', 'hint');
        container.appendChild(noUsers);
      }

      return container;
    }, async () => {
      const selected = modalBody.querySelector('input[name="dmTarget"]:checked');
      if (!selected) return;

      const targetUid = selected.value;
      const targetName = selected.getAttribute('data-name');
      const targetTag = selected.getAttribute('data-tag');

      await createOrOpenDM(targetUid, targetName, targetTag);
      closeModal();
    });
  } catch (error) {
    console.error("Error loading users for DM:", error);
  }
};

async function createOrOpenDM(otherUid, otherName, otherTag) {
  if (otherUid === me.uid) return;

  try {
    const safeOtherUid = sanitizeInput(otherUid, 50);
    const safeOtherName = sanitizeInput(otherName, 20);
    const safeOtherTag = sanitizeInput(otherTag, 10);

    const pair = [me.uid, safeOtherUid].sort();
    const dmId = `dm_${pair[0]}_${pair[1]}`;
    const dmRef = doc(db, "dms", dmId);

    await setDoc(dmRef, {
      id: dmId,
      kind: "dm",
      memberUids: pair,
      memberNames: {
        [me.uid]: sanitizeInput(me.name, 20),
        [safeOtherUid]: safeOtherName
      },
      memberTags: {
        [me.uid]: sanitizeInput(me.tag, 10),
        [safeOtherUid]: safeOtherTag
      },
      updatedAt: serverTimestamp()
    }, { merge: true });

    openRoom("dm", dmId, `DM: ${safeUsername(safeOtherName, safeOtherTag)}`);
  } catch (error) {
    console.error("Error creating/opening DM:", error);
  }
}

createGroupBtn.onclick = async () => {
  try {
    const usersSnap = await getDocs(query(collection(db, "users"), orderBy("name")));

    createSafeModal("Create Group (up to 10)", () => {
      const container = document.createElement('div');

      const nameInput = document.createElement('input');
      nameInput.id = 'groupName';
      nameInput.className = 'input';
      nameInput.placeholder = 'Group name';
      nameInput.maxLength = 20; 

      const hint = createTextElement('div', 'Maximum 20 characters');
      hint.style.cssText = 'font-size: 12px; color: var(--text-muted); margin-top: 5px;';

      const listContainer = document.createElement('div');
      listContainer.className = 'list';
      listContainer.style.marginTop = '0.6rem';

      let hasUsers = false;
      usersSnap.forEach(d => {
        const u = d.data();
        if (u.uid === me.uid || !u.name) return;

        hasUsers = true;
        const label = document.createElement('label');
        label.className = 'list-row';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'groupTargets';
        checkbox.value = u.uid;

        const avatar = createTextElement('div', avatarLetter(u.name), 'avatar');
        const userName = createTextElement('div', safeUsername(u.name, u.tag));

        label.appendChild(checkbox);
        label.appendChild(avatar);
        label.appendChild(userName);
        listContainer.appendChild(label);
      });

      container.appendChild(nameInput);
      container.appendChild(hint);

      if (hasUsers) {
        container.appendChild(listContainer);
      } else {
        const noUsers = createTextElement('div', 'No other users.', 'hint');
        noUsers.style.marginTop = '0.6rem';
        container.appendChild(noUsers);
      }

      return container;
    }, async () => {
      const name = sanitizeInput(document.getElementById("groupName").value, 20);
      if (!name) return;

      const selected = Array.from(modalBody.querySelectorAll('input[name="groupTargets"]:checked'))
        .map(i => sanitizeInput(i.value, 50));
      const members = Array.from(new Set([me.uid, ...selected])).slice(0, 10);

      const groupId = `grp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

      await setDoc(doc(db, "groups", groupId), {
        id: groupId,
        name: name, 
        kind: "group",
        memberUids: members,
        updatedAt: serverTimestamp()
      }, { merge: true });

      closeModal();
      openRoom("group", groupId, `Group: ${name}`);
    });
  } catch (error) {
    console.error("Error creating group:", error);
  }
};

renameGroupBtn.onclick = async () => {
  if (current.type !== "group") return;

  try {
    const groupRef = doc(db, "groups", current.id);
    const currentName = sanitizeInput(current.title.replace('Group: ', ''), 20);

    createSafeModal("Rename Group", () => {
      const container = document.createElement('div');

      const input = document.createElement('input');
      input.id = 'newGroupName';
      input.className = 'input';
      input.placeholder = 'New group name';
      input.value = currentName; 
      input.maxLength = 20;

      const hint = createTextElement('div', 'Maximum 20 characters');
      hint.style.cssText = 'font-size: 12px; color: var(--text-muted); margin-top: 5px;';

      container.appendChild(input);
      container.appendChild(hint);
      return container;
    }, async () => {
      const newName = sanitizeInput(document.getElementById("newGroupName").value, 20);
      if (!newName) return;

      await updateDoc(groupRef, {
        name: newName,
        updatedAt: serverTimestamp()
      });

      current.title = `Group: ${newName}`;
      chatTitle.textContent = current.title; 

      const btn = document.getElementById(`roombtn_${current.id}`);
      if (btn) btn.textContent = newName; 

      closeModal();
    });
  } catch (error) {
    console.error("Error renaming group:", error);
  }
};

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

if (me.name) {
  me.avatar = avatarLetter(me.name);
}