// 50% of this is chatgpt and copilot btw sorry guys ik ik skid skid go ahead man 😔
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

function avatarLetter(name) {
  return (name?.trim()[0] || "?").toUpperCase();
}

function randomTag() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function safeUsername(name, tag) {
  return `${name}#${tag}`;
}

function formatTimestamp(timestamp) {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function filterSwearing(text) {
 let filtered = text;
 swearingBlacklist.forEach(word => {
   const regex = new RegExp(`\\b\\w*${word}\\w*\\b`, 'gi');
   filtered = filtered.replace(regex, (match) => '*'.repeat(match.length));
 });
 return filtered;
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
    z-index: 1000;
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
    `;
    emojiBtn.onclick = () => {
      messageInput.value += emoji;
      picker.style.display = 'none';
      messageInput.focus();
    };
    picker.appendChild(emojiBtn);
  });

  document.body.appendChild(picker);

  const emojiToggle = document.createElement('button');
  emojiToggle.textContent = '😀';
  emojiToggle.style.cssText = `
    position: absolute;
    right: 30px;
    top: -40px;
    transform: translateY(-50%);
    border: none;
    background: var(--surface);
    font-size: 20px;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
  `;
  emojiToggle.onclick = () => {
    picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
  };

  const inputContainer = messageInput.parentElement;
  inputContainer.style.position = 'relative';
  inputContainer.appendChild(emojiToggle);

  document.addEventListener('click', (e) => {
    if (!picker.contains(e.target) && e.target !== emojiToggle) {
      picker.style.display = 'none';
    }
  });
}

function openModal(title, bodyHTML, onSave) {
  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHTML;
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
  nm.textContent = `${safeUsername(m.name || "Unknown", m.tag || "0000")} • ${timestamp}`;
  const tx = document.createElement("div");
  tx.textContent = filterSwearing(m.text);
  content.appendChild(nm);
  content.appendChild(tx);
  row.appendChild(av);
  row.appendChild(content);
  return row;
}

function setActiveRoomButton(id) {
  document.querySelectorAll(".room-btn").forEach(b => b.classList.remove("active"));
  const btn = document.getElementById(`roombtn_${id}`);
  if (btn) btn.classList.add("active");
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
  openModal(title, `<div><input id="usernameInput" class="input" placeholder="Your name"/></div>`, async () => {
    const val = (document.getElementById("usernameInput").value || "").trim();
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
    name: me.name,
    tag: me.tag,
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
      if (u.uid === me.uid) {
        u.name = me.name;
        u.tag = me.tag;
      }
      const row = document.createElement("div");
      row.className = "user-row";
      row.dataset.uid = u.uid;
      row.innerHTML = `
        <div class="avatar">${avatarLetter(u.name)}</div>
        <div>
          <div class="user-name">${safeUsername(u.name, u.tag)}${u.uid === me.uid ? " (you)" : ""}</div>
          <div class="user-meta">${u.status || "offline"}</div>
        </div>
      `;
      row.onclick = () => {
        if (u.uid !== me.uid) {
          createOrOpenDM(u.uid, u.name, u.tag);
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
        btn.id = `roombtn_${r.key}`;
        btn.textContent = r.label.replace("DM: ", "");
        btn.onclick = () => openRoom(r.kind, r.id, r.label);
        dmSection.appendChild(btn);
      });
    }

    if (sortedDMs.length > 0) {
      myChats.appendChild(dmSection);
    }

    if (sortedGroups.length > 0) {
      if (sortedDMs.length > 0) {
        const separator = document.createElement("div");
        separator.className = "side-title";
        separator.style.marginTop = "1rem";
        separator.textContent = "Groups";
        myChats.appendChild(separator);
      }

      sortedGroups.forEach(r => {
        const btn = document.createElement("button");
        btn.className = "room-btn";
        btn.id = `roombtn_${r.key}`;
        btn.textContent = r.label.replace("Group: ", "");
        btn.onclick = () => openRoom(r.kind, r.id, r.label);
        groupSection.appendChild(btn);
      });
      myChats.appendChild(groupSection);
    }

    if (sortedDMs.length === 0 && sortedGroups.length === 0) {
      const emptyMsg = document.createElement("div");
      emptyMsg.style.padding = "1rem";
      emptyMsg.style.color = "var(--text-muted)";
      emptyMsg.style.fontSize = "0.9rem";
      emptyMsg.textContent = "No conversations yet. Start a DM or create a group!";
      myChats.appendChild(emptyMsg);
    }

    setActiveRoomButton(current.id);
  };

  const dmQuery = query(collection(db, "dms"), where("memberUids", "array-contains", me.uid));
  const dmUnsub = onSnapshot(dmQuery, (snap) => {
    renderRooms.dms = snap.docs.map(d => {
      const r = d.data();
      const otherUid = (r.memberUids || []).find(x => x !== me.uid);
      const otherName = r.memberNames?.[otherUid] || "Unknown";
      const otherTag = r.memberTags?.[otherUid] || "0000";

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
      return {
        kind: "group",
        id: d.id,
        key: d.id,
        label: `Group: ${r.name || "Unnamed"}`,
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
  current = { type: kind, id, title };
  chatTitle.textContent = title;

  const renameBtn = document.getElementById("renameGroupBtn");
  if (renameBtn) {
    renameBtn.style.display = kind === "group" ? "inline-block" : "none";
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

  setActiveRoomButton(id);
}

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text || !me.uid || !me.name) return;

  try {
    const [c1, c2, c3] = roomPathForCurrent();
    await addDoc(collection(db, c1, c2, c3), {
      uid: me.uid,
      name: me.name,
      tag: me.tag,
      text,
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
  } catch (error) {
    console.error("Error sending message:", error);
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
    const options = [];

    usersSnap.forEach(d => {
      const u = d.data();
      if (u.uid === me.uid || !u.name) return;
      options.push(`
        <label class="list-row">
          <input type="radio" name="dmTarget" value="${u.uid}" data-name="${u.name}" data-tag="${u.tag}" />
          <div class="avatar">${avatarLetter(u.name)}</div>
          <div>${safeUsername(u.name, u.tag)}</div>
        </label>
      `);
    });

    openModal("Start a Direct Message",
      options.length ?
        `<div class="list">${options.join("")}</div><div class="hint">Pick exactly one person.</div>` :
        `<div class="hint">No other users yet.</div>`,
      async () => {
        const selected = modalBody.querySelector('input[name="dmTarget"]:checked');
        if (!selected) return;

        const targetUid = selected.value;
        const targetName = selected.dataset.name;
        const targetTag = selected.dataset.tag;

        await createOrOpenDM(targetUid, targetName, targetTag);
        closeModal();
      }
    );
  } catch (error) {
    console.error("Error loading users for DM:", error);
  }
};

async function createOrOpenDM(otherUid, otherName, otherTag) {
  if (otherUid === me.uid) return;

  try {
    const pair = [me.uid, otherUid].sort();
    const dmId = `dm_${pair[0]}_${pair[1]}`;
    const dmRef = doc(db, "dms", dmId);

    await setDoc(dmRef, {
      id: dmId,
      kind: "dm",
      memberUids: pair,
      memberNames: {
        [me.uid]: me.name,
        [otherUid]: otherName
      },
      memberTags: {
        [me.uid]: me.tag,
        [otherUid]: otherTag
      },
      updatedAt: serverTimestamp()
    }, { merge: true });

    openRoom("dm", dmId, `DM: ${safeUsername(otherName, otherTag)}`);
  } catch (error) {
    console.error("Error creating/opening DM:", error);
  }
}

createGroupBtn.onclick = async () => {
  try {
    const usersSnap = await getDocs(query(collection(db, "users"), orderBy("name")));
    const checks = [];

    usersSnap.forEach(d => {
      const u = d.data();
      if (u.uid === me.uid || !u.name) return;
      checks.push(`
        <label class="list-row">
          <input type="checkbox" name="groupTargets" value="${u.uid}" />
          <div class="avatar">${avatarLetter(u.name)}</div>
          <div>${safeUsername(u.name, u.tag)}</div>
        </label>
      `);
    });

    openModal("Create Group (up to 10)",
      `<input id="groupName" class="input" placeholder="Group name"/>
       <div class="list" style="margin-top:.6rem">
         ${checks.join("") || '<div class="hint">No other users.</div>'}
       </div>`,
      async () => {
        const name = (document.getElementById("groupName").value || "").trim();
        if (!name) return;

        const selected = Array.from(modalBody.querySelectorAll('input[name="groupTargets"]:checked'))
          .map(i => i.value);
        const members = Array.from(new Set([me.uid, ...selected])).slice(0, 10);

        const groupId = `grp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

        await setDoc(doc(db, "groups", groupId), {
          id: groupId,
          name,
          kind: "group",
          memberUids: members,
          updatedAt: serverTimestamp()
        }, { merge: true });

        closeModal();
        openRoom("group", groupId, `Group: ${name}`);
      }
    );
  } catch (error) {
    console.error("Error creating group:", error);
  }
};

renameGroupBtn.onclick = async () => {
  if (current.type !== "group") return;

  try {
    const groupRef = doc(db, "groups", current.id);
    const currentName = current.title.replace('Group: ', '');

    openModal("Rename Group",
      `<input id="newGroupName" class="input" placeholder="New group name" value="${currentName}"/>`,
      async () => {
        const newName = (document.getElementById("newGroupName").value || "").trim();
        if (!newName) return;

        await updateDoc(groupRef, {
          name: newName,
          updatedAt: serverTimestamp()
        });

        current.title = `Group: ${newName}`;
        chatTitle.textContent = current.title;

        const btn = document.getElementById(`roombtn_${current.id}`);
        if (btn) btn.textContent = current.title;

        closeModal();
      }
    );
  } catch (error) {
    console.error("Error renaming group:", error);
  }
};

if (me.name) {
  me.avatar = avatarLetter(me.name);
}