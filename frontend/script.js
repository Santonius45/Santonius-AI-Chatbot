/* ==========================================
   Santonius AI Chatbot
   Developer : Santonius Hasibuan
========================================== */

// ==========================================
// Mengambil Element HTML
// ==========================================

const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

// ==========================================
// URL Backend Railway
// ==========================================

const API_URL =
"https://santonius-ai-chatbot-production.up.railway.app/chat";

// ==========================================
// Smooth Scroll
// ==========================================

function scrollBottom(){

    chatBox.scrollTo({

        top: chatBox.scrollHeight,

        behavior:"smooth"

    });

}

// ==========================================
// Membuat Avatar
// ==========================================

function createAvatar(sender){

    const avatar = document.createElement("div");

    avatar.className = "avatar";

    avatar.innerHTML =
        sender === "ai"
        ? "🤖"
        : "👤";

    return avatar;

}

// ==========================================
// Membuat Bubble
// ==========================================

function createBubble(text){

    const bubble = document.createElement("div");

    bubble.className = "bubble";

    bubble.innerHTML = text.replace(/\n/g,"<br>");

    return bubble;

}

// ==========================================
// Menambahkan Pesan
// ==========================================

function addMessage(sender,text){

    const message = document.createElement("div");

    message.className = "message " + sender;

    if(sender==="ai"){

        message.appendChild(createAvatar("ai"));

        message.appendChild(createBubble(text));

    }

    else{

        message.appendChild(createBubble(text));

        message.appendChild(createAvatar("user"));

    }

    chatBox.appendChild(message);

    scrollBottom();

}

// ==========================================
// Loading Animation
// ==========================================

function addLoading(){

    const loading = document.createElement("div");

    loading.className = "message ai";

    loading.id = "loading-message";

    loading.innerHTML = `

        <div class="avatar">

            🤖

        </div>

        <div class="bubble">

            <span class="typing">

                <span></span>

                <span></span>

                <span></span>

            </span>

        </div>

    `;

    chatBox.appendChild(loading);

    scrollBottom();

}

function removeLoading(){

    const loading =
    document.getElementById("loading-message");

    if(loading){

        loading.remove();

    }

}

// ==========================================
// Disable Input
// ==========================================

function lockInput(){

    sendBtn.disabled = true;

    messageInput.disabled = true;

}

function unlockInput(){

    sendBtn.disabled = false;

    messageInput.disabled = false;

    messageInput.focus();

}

// ==========================================
// Mengirim Pesan
// ==========================================

async function sendMessage(){

    const message =
    messageInput.value.trim();

    if(message==="") return;

    addMessage("user",message);

    messageInput.value="";

    lockInput();

    addLoading();

    try{

        const response =
        await fetch(API_URL,{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                message:message

            })

        });

        if(!response.ok){

            throw new Error("Server Error");

        }

        const data =
        await response.json();

        removeLoading();

        addMessage("ai",data.reply);

    }

    catch(error){

        removeLoading();

        addMessage(

            "ai",

            "❌ Maaf, server sedang tidak dapat dihubungi."

        );

        console.error(error);

    }

    unlockInput();

}

// ==========================================
// Klik Tombol
// ==========================================

sendBtn.addEventListener(

    "click",

    sendMessage

);

// ==========================================
// Enter
// ==========================================

messageInput.addEventListener(

    "keydown",

    function(event){

        if(

            event.key==="Enter"

            &&

            !event.shiftKey

        ){

            event.preventDefault();

            sendMessage();

        }

    }

);

// ==========================================
// Fokus Awal
// ==========================================

window.onload=function(){

    messageInput.focus();

}