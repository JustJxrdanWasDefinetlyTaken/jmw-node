// okay okay don't judge i kinda used copilot and chatgpt for 60% of the script so yk if you see some suspicious skiddy shit dont blame me i only know 15% javascript 🥀

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, doc, setDoc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = { apiKey:"AIzaSyB6-0VPDW3W5TigkzxBYMgZV_3iqw8GGkM", authDomain:"chattingbackendsincenodebreaks.firebaseapp.com", projectId:"chattingbackendsincenodebreaks", storageBucket:"chattingbackendsincenodebreaks.firebasestorage.app", messagingSenderId:"628300382438", appId:"1:628300382438:web:c5a701929b899f45267b27", measurementId:"G-YV919TVGCY" };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

let me = { uid:null, name:localStorage.getItem("username")||"", tag:localStorage.getItem("usertag")||"", avatar:"?" };
let current = { type:"public", id:"public", title:"General Chat" };
let unsubMsgs=null, unsubMyRooms=null, unsubUsers=null;

const usersPanel=document.getElementById("usersPanel");
const toggleUsersBtn=document.getElementById("toggleUsers");
const usersList=document.getElementById("usersList");
const chatTitle=document.getElementById("chatTitle");
const messagesEl=document.getElementById("messages");
const messageInput=document.getElementById("messageInput");
const sendBtn=document.getElementById("sendBtn");
const publicBtn=document.getElementById("publicBtn");
const myChats=document.getElementById("myChats");
const startDmBtn=document.getElementById("startDmBtn");
const createGroupBtn=document.getElementById("createGroupBtn");
const changeNameBtn=document.getElementById("changeNameBtn");
const renameGroupBtn=document.getElementById("renameGroupBtn");

const modalOverlay=document.getElementById("modalOverlay");
const modalTitle=document.getElementById("modalTitle");
const modalBody=document.getElementById("modalBody");
const modalCancel=document.getElementById("modalCancel");
const modalSave=document.getElementById("modalSave");

function avatarLetter(name){return(name?.trim()[0]||"?").toUpperCase();}
function randomTag(){return Math.floor(1000+Math.random()*9000).toString();}
function safeUsername(name,tag){return `${name}#${tag}`;}

function openModal(title,bodyHTML,onSave){
  modalTitle.textContent=title;
  modalBody.innerHTML=bodyHTML;
  modalOverlay.style.display="flex";
  const firstInput=modalBody.querySelector("input");
  if(firstInput) setTimeout(()=>firstInput.focus(),0);
  modalSave.onclick=async()=>{await onSave?.();};
}
function closeModal(){modalOverlay.style.display="none"; modalBody.innerHTML=""; modalSave.onclick=null;}
modalCancel.onclick=closeModal;

function roomPathForCurrent(){
  if(current.type==="public") return ["rooms","public","messages"];
  if(current.type==="dm") return ["dms",current.id,"messages"];
  if(current.type==="group") return ["groups",current.id,"messages"];
  return ["rooms","public","messages"];
}

function renderMessage(m){
  const row=document.createElement("div");
  row.className="bubble"+(m.uid===me.uid?" me":"");
  const av=document.createElement("div"); av.className="avatar"; av.textContent=avatarLetter(m.name);
  const content=document.createElement("div"); content.className="content";
  const nm=document.createElement("div"); nm.className="name"; nm.textContent=safeUsername(m.name||"Unknown",m.tag||"0000");
  const tx=document.createElement("div"); tx.textContent=m.text;
  content.appendChild(nm); content.appendChild(tx); row.appendChild(av); row.appendChild(content);
  return row;
}

function setActiveRoomButton(id){
  document.querySelectorAll(".room-btn").forEach(b=>b.classList.remove("active"));
  const btn=document.getElementById(`roombtn_${id}`);
  if(btn) btn.classList.add("active");
  if(id==="public") publicBtn.classList.add("active");
}

onAuthStateChanged(auth,async(user)=>{
  if(!user) return;
  me.uid=user.uid;
  if(!me.name){showUsernameModal("Set Username");}
  else{me.avatar=avatarLetter(me.name); await upsertUserProfile(); startListeners();}
});
signInAnonymously(auth).catch(console.error);

function showUsernameModal(title){
  openModal(title,`<div><input id="usernameInput" class="input" placeholder="Your name"/></div>`,async()=>{
    const val=(document.getElementById("usernameInput").value||"").trim();
    if(!val) return;
    me.name=val; me.tag=randomTag(); me.avatar=avatarLetter(val);
    localStorage.setItem("username",me.name); localStorage.setItem("usertag",me.tag);
    await upsertUserProfile(); closeModal(); startListeners();
  });
}
changeNameBtn.onclick=()=>showUsernameModal("Change Username");

async function upsertUserProfile(){
  if(!me.uid) return;
  const ref=doc(db,"users",me.uid);
  await setDoc(ref,{uid:me.uid,name:me.name,tag:me.tag,avatar:avatarLetter(me.name),status:"online",lastSeen:serverTimestamp()},{merge:true});
  window.addEventListener("beforeunload",async()=>{try{await updateDoc(ref,{status:"offline",lastSeen:serverTimestamp()});}catch{}});
}

function startListeners(){
  if(unsubUsers) unsubUsers();
  unsubUsers=onSnapshot(query(collection(db,"users"),orderBy("name")),(snap)=>{
    usersList.innerHTML="";
    snap.forEach(d=>{
      const u=d.data();
      if(!u.name) return;
      if(u.uid===me.uid) u.name=me.name; u.tag=me.tag;
      const row=document.createElement("div"); row.className="user-row"; row.dataset.uid=u.uid;
      row.innerHTML=`<div class="avatar">${avatarLetter(u.name)}</div><div><div class="user-name">${safeUsername(u.name,u.tag)}${u.uid===me.uid?" (you)":""}</div><div class="user-meta">${u.status||"offline"}</div></div>`;
      row.onclick=()=>{if(u.uid!==me.uid){createOrOpenDM(u.uid,u.name,u.tag); usersPanel.classList.remove("open");}};
      usersList.appendChild(row);
    });
  });
  if(unsubMyRooms) unsubMyRooms();
  const dmQ=query(collection(db,"dms"),where("memberUids","array-contains",me.uid));
  const gpQ=query(collection(db,"groups"),where("memberUids","array-contains",me.uid));
  const renderRooms={dms:[],groups:[]};
  const drawRooms=()=>{
    myChats.innerHTML="";
    [...renderRooms.dms,...renderRooms.groups].sort((a,b)=>(a.updatedAt?.seconds||0)-(b.updatedAt?.seconds||0)).reverse().forEach(r=>{
      const btn=document.createElement("button"); btn.className="room-btn"; btn.id=`roombtn_${r.key}`; btn.textContent=r.label;
      btn.onclick=()=>openRoom(r.kind,r.id,r.label); myChats.appendChild(btn);
    });
    setActiveRoomButton(current.id);
  };
  const dmUnsub=onSnapshot(dmQ,(snap)=>{renderRooms.dms=snap.docs.map(d=>{const r=d.data(); const other=(r.memberUids||[]).find(x=>x!==me.uid); const otherName=r.memberNames?.[other]||r.memberNames?.[me.uid]||"DM"; const otherTag=r.memberTags?.[other]||"0000"; return {kind:"dm",id:d.id,key:d.id,label:`DM: ${safeUsername(otherName,otherTag)}`,updatedAt:r.updatedAt};}); drawRooms();});
  const gpUnsub=onSnapshot(gpQ,(snap)=>{renderRooms.groups=snap.docs.map(d=>{const r=d.data(); return {kind:"group",id:d.id,key:d.id,label:`Group: ${r.name||"Unnamed"}`,updatedAt:r.updatedAt};}); drawRooms();});
  unsubMyRooms=()=>{dmUnsub(); gpUnsub();};
  openRoom(current.type,current.id,current.title);
}

function openRoom(kind,id,title){
  current={type:kind,id,title};
  chatTitle.textContent=title;
  if(unsubMsgs) unsubMsgs();
  messagesEl.innerHTML="";
  const [c1,c2,c3]=roomPathForCurrent();
  const qy=query(collection(db,c1,c2,c3),orderBy("timestamp"));
  unsubMsgs=onSnapshot(qy,(snap)=>{snap.docChanges().forEach(change=>{if(change.type==="added"){const m=change.doc.data(); messagesEl.appendChild(renderMessage(m));}}); messagesEl.scrollTop=messagesEl.scrollHeight;});
  setActiveRoomButton(id);
}

async function sendMessage(){
  const text=messageInput.value.trim(); if(!text||!me.uid||!me.name) return;
  const [c1,c2,c3]=roomPathForCurrent();
  await addDoc(collection(db,c1,c2,c3),{uid:me.uid,name:me.name,tag:me.tag,text,timestamp:serverTimestamp()});
  if(current.type==="dm") await updateDoc(doc(db,"dms",current.id),{updatedAt:serverTimestamp()});
  else if(current.type==="group") await updateDoc(doc(db,"groups",current.id),{updatedAt:serverTimestamp()});
  messageInput.value="";
}
sendBtn.onclick=sendMessage; messageInput.addEventListener("keydown",e=>{if(e.key==="Enter") sendMessage();});

publicBtn.onclick=()=>openRoom("public","public","General Chat");
toggleUsersBtn.onclick=()=>usersPanel.classList.toggle("open");

startDmBtn.onclick=async()=>{
  const usersSnap=await getDocs(query(collection(db,"users"),orderBy("name")));
  const options=[]; usersSnap.forEach(d=>{const u=d.data(); if(u.uid===me.uid) return; options.push(`<label class="list-row"><input type="radio" name="dmTarget" value="${u.uid}" /> <div class="avatar">${avatarLetter(u.name)}</div> <div>${safeUsername(u.name,u.tag)}</div></label>`);});
  openModal("Start a Direct Message", options.length?`<div class="list">${options.join("")}</div><div class="hint">Pick exactly one person.</div>`:`<div class="hint">No other users yet.</div>`,async()=>{
    const selected=modalBody.querySelector('input[name="dmTarget"]:checked');
    if(!selected) return;
    const targetUid=selected.value;
    const targetDoc=(await getDocs(query(collection(db,"users"),where("uid","==",targetUid)))).docs[0];
    const target=targetDoc?.data();
    if(!target) return;
    await createOrOpenDM(target.uid,target.name,target.tag);
    closeModal();
  });
};

async function createOrOpenDM(otherUid,otherName,otherTag){
  if(otherUid===me.uid) return;
  const pair=[me.uid,otherUid].sort();
  const dmId=`dm_${pair[0]}_${pair[1]}`;
  const dmRef=doc(db,"dms",dmId);
  await setDoc(dmRef,{id:dmId,kind:"dm",memberUids:pair,memberNames:{[me.uid]:me.name,[otherUid]:otherName},memberTags:{[me.uid]:me.tag,[otherUid]:otherTag},updatedAt:serverTimestamp()},{merge:true});
  openRoom("dm",dmId,`DM: ${safeUsername(otherName,otherTag)}`);
}

createGroupBtn.onclick=async()=>{
  const usersSnap=await getDocs(query(collection(db,"users"),orderBy("name")));
  const checks=[]; usersSnap.forEach(d=>{const u=d.data(); if(u.uid===me.uid) return; checks.push(`<label class="list-row"><input type="checkbox" name="groupTargets" value="${u.uid}" /> <div class="avatar">${avatarLetter(u.name)}</div> <div>${safeUsername(u.name,u.tag)}</div></label>`);});
  openModal("Create Group (up to 10)",`<input id="groupName" class="input" placeholder="Group name"/><div class="list" style="margin-top:.6rem">${checks.join("")||'<div class="hint">No other users.</div>'}</div>`,async()=>{
    const name=(document.getElementById("groupName").value||"").trim();
    if(!name) return;
    const selected=Array.from(modalBody.querySelectorAll('input[name="groupTargets"]:checked')).map(i=>i.value);
    const members=Array.from(new Set([me.uid,...selected])).slice(0,10);
    const groupId=`grp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`;
    await setDoc(doc(db,"groups",groupId),{id:groupId,name,kind:"group",memberUids:members,updatedAt:serverTimestamp()},{merge:true});
    closeModal();
    openRoom("group",groupId,`Group: ${name}`);
  });
};

renameGroupBtn.onclick=async()=>{
  const groupRef=doc(db,"groups",current.id);
  openModal("Rename Group",`<input id="newGroupName" class="input" placeholder="New group name" value="${current.title.replace('Group: ','')}"/>`,async()=>{
    const newName=(document.getElementById("newGroupName").value||"").trim();
    if(!newName) return;
    await updateDoc(groupRef,{name:newName,updatedAt:serverTimestamp()});
    chatTitle.childNodes[0].nodeValue=`Group: ${newName}`;
    const btn=document.getElementById(`roombtn_${current.id}`);
    if(btn) btn.textContent=`Group: ${newName}`;
    closeModal();
  });
};

if(me.name) me.avatar=avatarLetter(me.name);
