/* ==========================================================
   Santonius AI Chatbot
   Developer : Santonius Hasibuan
   Version   : 3.1
   Part      : 1
========================================================== */

/* ==========================================================
   HTML ELEMENT
========================================================== */

const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

const historyList = document.getElementById("historyList");
const newChatBtn = document.getElementById("newChatBtn");

const toast = document.getElementById("toast");
const scrollBottomBtn = document.getElementById("scrollBottom");
const floatButton = document.getElementById("floatButton");

const exportBtn = document.getElementById("exportChatBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const aboutBtn = document.getElementById("aboutBtn");

/* ==========================================================
   BACKEND RAILWAY
   (JANGAN DIUBAH)
========================================================== */

const API_URL =
"https://santonius-ai-chatbot-production.up.railway.app/chat";

/* ==========================================================
   GLOBAL VARIABLE
========================================================== */

const STORAGE_KEY = "santonius_ai_history";

let chats = [];

let currentChat = [];

let currentHistoryIndex = -1;

let isWaiting = false;

/* ==========================================================
   SMOOTH SCROLL
========================================================== */

function scrollBottom() {

    chatBox.scrollTo({

        top: chatBox.scrollHeight,

        behavior: "smooth"

    });

}

/* ==========================================================
   TOAST
========================================================== */

function showToast(message) {

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(function () {

        toast.classList.remove("show");

    }, 2000);

}

/* ==========================================================
   ESCAPE HTML
========================================================== */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}

/* ==========================================================
   AVATAR
========================================================== */

function createAvatar(sender) {

    const avatar = document.createElement("div");

    avatar.className = "avatar";

    avatar.textContent = sender === "ai"
        ? "🤖"
        : "👤";

    return avatar;

}

/* ==========================================================
   COPY BUTTON
========================================================== */

function createCopyButton(text) {

    const button = document.createElement("button");

    button.className = "copy-btn";

    button.textContent = "📋 Copy";

    button.addEventListener("click", async function () {

        try {

            await navigator.clipboard.writeText(text);

            showToast("Jawaban berhasil disalin.");

        }

        catch {

            showToast("Gagal menyalin jawaban.");

        }

    });

    return button;

}

/* ==========================================================
   FEEDBACK BUTTON
========================================================== */

function createFeedback() {

    const feedback = document.createElement("div");

    feedback.className = "feedback";

    const like = document.createElement("button");

    like.textContent = "👍";

    like.title = "Jawaban membantu";

    like.onclick = function () {

        showToast("Terima kasih atas feedback 👍");

    };

    const dislike = document.createElement("button");

    dislike.textContent = "👎";

    dislike.title = "Jawaban kurang tepat";

    dislike.onclick = function () {

        showToast("Feedback diterima 👎");

    };

    feedback.appendChild(like);

    feedback.appendChild(dislike);

    return feedback;

}

/* ==========================================================
   CHAT ACTION
========================================================== */

function createAction(text) {

    const action = document.createElement("div");

    action.className = "chat-actions";

    action.appendChild(createCopyButton(text));

    action.appendChild(createFeedback());

    return action;

}

/* ==========================================================
   TIMESTAMP
========================================================== */

function createTime() {

    const time = document.createElement("div");

    time.className = "time";

    time.textContent = new Date().toLocaleTimeString(

        "id-ID",

        {

            hour: "2-digit",

            minute: "2-digit"

        }

    );

    return time;

}

/* ==========================================================
   CHAT BUBBLE
========================================================== */

function createBubble(sender, text) {

    const bubble = document.createElement("div");

    bubble.className = "bubble";

    bubble.innerHTML = escapeHTML(text)

        .replace(/\n/g, "<br>");

    bubble.appendChild(createTime());

    if (sender === "ai") {

        bubble.appendChild(

            createAction(text)

        );

    }

    return bubble;

}

/* ==========================================================
   ADD MESSAGE
========================================================== */

function addMessage(

    sender,

    text,

    save = true

) {

    const message = document.createElement("div");

    message.className = "message " + sender;

    if (sender === "ai") {

        message.appendChild(

            createAvatar("ai")

        );

        message.appendChild(

            createBubble(

                sender,

                text

            )

        );

    }

    else {

        message.appendChild(

            createBubble(

                sender,

                text

            )

        );

        message.appendChild(

            createAvatar("user")

        );

    }

    chatBox.appendChild(message);

    scrollBottom();

    if (save) {

        currentChat.push({

            sender: sender,

            text: text

        });

    }

}

/* ==========================================================
   CLEAR CHAT
========================================================== */

function clearChat() {

    chatBox.innerHTML = "";

}

/* ==========================================================
   END PART 1
========================================================== */

/* ==========================================================
   Santonius AI Chatbot
   Developer : Santonius Hasibuan
   Version   : 3.1
   Part      : 2
========================================================== */

/* ==========================================================
   LOADING MESSAGE
========================================================== */

function addLoading() {

    const loading = document.createElement("div");

    loading.className = "message ai loading-message";

    loading.id = "loading-message";

    const avatar = createAvatar("ai");

    const bubble = document.createElement("div");

    bubble.className = "bubble";

    bubble.innerHTML = `

        <div class="typing">

            <span></span>

            <span></span>

            <span></span>

        </div>

    `;

    loading.appendChild(avatar);

    loading.appendChild(bubble);

    chatBox.appendChild(loading);

    scrollBottom();

}

/* ==========================================================
   REMOVE LOADING
========================================================== */

function removeLoading() {

    const loading = document.getElementById(

        "loading-message"

    );

    if (loading) {

        loading.remove();

    }

}

/* ==========================================================
   LOCK INPUT
========================================================== */

function lockInput() {

    isWaiting = true;

    messageInput.disabled = true;

    sendBtn.disabled = true;

}

/* ==========================================================
   UNLOCK INPUT
========================================================== */

function unlockInput() {

    isWaiting = false;

    messageInput.disabled = false;

    sendBtn.disabled = false;

    messageInput.focus();

}

/* ==========================================================
   SEND MESSAGE
========================================================== */

async function sendMessage() {

    if (isWaiting) {

        return;

    }

    const text = messageInput.value.trim();

    if (text === "") {

        return;

    }

    addMessage(

        "user",

        text

    );

    messageInput.value = "";

    lockInput();

    addLoading();

    try {

        const response = await fetch(

            API_URL,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    message: text

                })

            }

        );

        if (!response.ok) {

            throw new Error(

                "Server Error"

            );

        }

        const data = await response.json();

        removeLoading();

        addMessage(

            "ai",

            data.reply

        );

    }

    catch (error) {

        console.error(error);

        removeLoading();

        addMessage(

            "ai",

            "❌ Maaf, server sedang tidak dapat dihubungi."

        );

    }

    finally {

        unlockInput();

    }

}

/* ==========================================================
   SEND BUTTON
========================================================== */

if (sendBtn) {

    sendBtn.addEventListener(

        "click",

        sendMessage

    );

}

/* ==========================================================
   ENTER KEY
========================================================== */

if (messageInput) {

    messageInput.addEventListener(

        "keydown",

        function (event) {

            if (

                event.key === "Enter"

                &&

                !event.shiftKey

            ) {

                event.preventDefault();

                sendMessage();

            }

        }

    );

}

/* ==========================================================
   AUTO FOCUS
========================================================== */

window.addEventListener(

    "load",

    function () {

        messageInput.focus();

    }

);

/* ==========================================================
   END PART 2
========================================================== */

/* ==========================================================
   Santonius AI Chatbot
   Developer : Santonius Hasibuan
   Version   : 3.1
   Part      : 3
========================================================== */

/* ==========================================================
   SAVE HISTORY
========================================================== */

function saveHistory() {

    try {

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(chats)

        );

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================================
   LOAD HISTORY
========================================================== */

function loadHistory() {

    try {

        const data = localStorage.getItem(

            STORAGE_KEY

        );

        chats = data

            ? JSON.parse(data)

            : [];

    }

    catch {

        chats = [];

    }

    renderHistory();

}

/* ==========================================================
   FORMAT DATE
========================================================== */

function formatDate() {

    return new Date().toLocaleString(

        "id-ID",

        {

            day: "2-digit",

            month: "short",

            hour: "2-digit",

            minute: "2-digit"

        }

    );

}

/* ==========================================================
   CREATE CHAT TITLE
========================================================== */

function createTitle() {

    const first = currentChat.find(

        chat => chat.sender === "user"

    );

    if (!first) {

        return "Percakapan Baru";

    }

    return first.text.length > 35

        ? first.text.substring(0, 35) + "..."

        : first.text;

}

/* ==========================================================
   RENDER HISTORY
========================================================== */

function renderHistory() {

    if (!historyList) return;

    historyList.innerHTML = "";

    chats.forEach(function (chat, index) {

        const item = document.createElement("div");

        item.className = "history-item";

        if (index === currentHistoryIndex) {

            item.classList.add("active");

        }

        item.innerHTML = `

            <div class="history-item-title">

                ${chat.title}

            </div>

            <div class="history-item-time">

                ${chat.time}

            </div>

        `;

        item.addEventListener(

            "click",

            function () {

                openHistory(index);

            }

        );

        historyList.appendChild(item);

    });

}

/* ==========================================================
   OPEN HISTORY
========================================================== */

function openHistory(index) {

    const chat = chats[index];

    if (!chat) return;

    currentHistoryIndex = index;

    currentChat = [];

    clearChat();

    chat.messages.forEach(function (message) {

        addMessage(

            message.sender,

            message.text,

            false

        );

        currentChat.push({

            sender: message.sender,

            text: message.text

        });

    });

    renderHistory();

}

/* ==========================================================
   SAVE CURRENT CHAT
========================================================== */

function saveCurrentChat() {

    if (currentChat.length < 2) {

        return;

    }

    const data = {

        title: createTitle(),

        time: formatDate(),

        messages: [...currentChat]

    };

    if (

        currentHistoryIndex >= 0 &&

        chats[currentHistoryIndex]

    ) {

        chats[currentHistoryIndex] = data;

    }

    else {

        chats.unshift(data);

        currentHistoryIndex = 0;

    }

    if (chats.length > 30) {

        chats.pop();

    }

    saveHistory();

    renderHistory();

}

/* ==========================================================
   NEW CHAT
========================================================== */

function newChat() {

    saveCurrentChat();

    currentHistoryIndex = -1;

    currentChat = [];

    clearChat();

    addMessage(

        "ai",

        "Halo 👋\n\nSaya Santonius AI.\n\nAda yang bisa saya bantu?",

        false

    );

    renderHistory();

}

/* ==========================================================
   NEW CHAT BUTTON
========================================================== */

if (newChatBtn) {

    newChatBtn.addEventListener(

        "click",

        newChat

    );

}

/* ==========================================================
   LOAD HISTORY WHEN OPEN
========================================================== */

window.addEventListener(

    "load",

    function () {

        loadHistory();

    }

);

/* ==========================================================
   SAVE BEFORE REFRESH
========================================================== */

window.addEventListener(

    "beforeunload",

    function () {

        saveCurrentChat();

    }

);

/* ==========================================================
   END PART 3
========================================================== */

/* ==========================================================
   Santonius AI Chatbot
   Developer : Santonius Hasibuan
   Version   : 3.1
   Part      : 4
========================================================== */

/* ==========================================================
   EXPORT CHAT
========================================================== */

function exportChat() {

    if (currentChat.length === 0) {

        showToast(

            "Belum ada percakapan."

        );

        return;

    }

    let content = "";

    content += "====================================\n";
    content += "      Santonius AI Chatbot\n";
    content += "====================================\n\n";

    currentChat.forEach(function (chat) {

        if (chat.sender === "user") {

            content += "Anda : ";

        }

        else {

            content += "Santonius AI : ";

        }

        content += chat.text + "\n\n";

    });

    const blob = new Blob(

        [content],

        {

            type: "text/plain"

        }

    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "SantoniusAI-Chat.txt";

    document.body.appendChild(a);

    a.click();

    a.remove();

    URL.revokeObjectURL(url);

    showToast(

        "Chat berhasil diexport."

    );

}

/* ==========================================================
   CLEAR HISTORY
========================================================== */

function clearHistory() {

    const answer = confirm(

        "Yakin ingin menghapus semua riwayat?"

    );

    if (!answer) {

        return;

    }

    chats = [];

    currentChat = [];

    currentHistoryIndex = -1;

    localStorage.removeItem(

        STORAGE_KEY

    );

    renderHistory();

    clearChat();

    addMessage(

        "ai",

        "Halo 👋\n\nSaya Santonius AI.\n\nAda yang bisa saya bantu?",

        false

    );

    showToast(

        "Riwayat berhasil dihapus."

    );

}

/* ==========================================================
   COPY CONVERSATION
========================================================== */

function copyConversation() {

    if (currentChat.length === 0) {

        showToast(

            "Belum ada percakapan."

        );

        return;

    }

    let text = "";

    currentChat.forEach(function (chat) {

        if (chat.sender === "user") {

            text += "Anda : ";

        }

        else {

            text += "Santonius AI : ";

        }

        text += chat.text + "\n\n";

    });

    navigator.clipboard.writeText(text);

    showToast(

        "Percakapan berhasil disalin."

    );

}

/* ==========================================================
   SCROLL BUTTON
========================================================== */

if (scrollBottomBtn) {

    chatBox.addEventListener(

        "scroll",

        function () {

            const distance =

                chatBox.scrollHeight

                -

                chatBox.scrollTop

                -

                chatBox.clientHeight;

            if (distance > 250) {

                scrollBottomBtn.classList.add(

                    "show"

                );

            }

            else {

                scrollBottomBtn.classList.remove(

                    "show"

                );

            }

        }

    );

    scrollBottomBtn.addEventListener(

        "click",

        function () {

            scrollBottom();

        }

    );

}

/* ==========================================================
   FLOAT BUTTON
========================================================== */

if (floatButton) {

    floatButton.addEventListener(

        "click",

        function () {

            newChat();

        }

    );

}

/* ==========================================================
   EXPORT BUTTON
========================================================== */

if (exportBtn) {

    exportBtn.addEventListener(

        "click",

        exportChat

    );

}

/* ==========================================================
   CLEAR HISTORY BUTTON
========================================================== */

if (clearHistoryBtn) {

    clearHistoryBtn.addEventListener(

        "click",

        clearHistory

    );

}

/* ==========================================================
   ABOUT BUTTON
========================================================== */

if (aboutBtn) {

    aboutBtn.addEventListener(

        "click",

        function () {

            showToast(

                "Santonius AI Chatbot Version 3.1"

            );

        }

    );

}

/* ==========================================================
   SHORTCUT
========================================================== */

document.addEventListener(

    "keydown",

    function (event) {

        if (

            event.ctrlKey

            &&

            event.key.toLowerCase() === "e"

        ) {

            event.preventDefault();

            exportChat();

        }

        if (

            event.ctrlKey

            &&

            event.key.toLowerCase() === "l"

        ) {

            event.preventDefault();

            newChat();

        }

    }

);

/* ==========================================================
   END PART 4
========================================================== */

/* ==========================================================
   Santonius AI Chatbot
   Developer : Santonius Hasibuan
   Version   : 3.1
   Part      : 5
========================================================== */

/* ==========================================================
   INITIALIZE CHAT
========================================================== */

function initializeChat() {

    if (!chatBox) {

        return;

    }

    /* Jika HTML sudah memiliki greeting bawaan,
       simpan ke currentChat agar konsisten */

    if (

        currentChat.length === 0

        &&

        chatBox.querySelector(".message.ai")

    ) {

        const bubble = chatBox.querySelector(

            ".message.ai .bubble"

        );

        if (bubble) {

            const text = bubble.innerText

                .replace("📋 Copy", "")

                .replace("👍", "")

                .replace("👎", "")

                .trim();

            currentChat.push({

                sender: "ai",

                text: text

            });

        }

    }

    scrollBottom();

}

/* ==========================================================
   ABOUT MENU
========================================================== */

if (aboutBtn) {

    aboutBtn.addEventListener(

        "click",

        function () {

            alert(

`Santonius AI Chatbot

Developer :
Santonius Hasibuan

Powered by OpenAI GPT

Version 3.1`

            );

        }

    );

}

/* ==========================================================
   WINDOW LOAD
========================================================== */

window.addEventListener(

    "load",

    function () {

        initializeChat();

        loadHistory();

        scrollBottom();

        if (messageInput) {

            messageInput.focus();

        }

    }

);

/* ==========================================================
   WINDOW BEFORE UNLOAD
========================================================== */

window.addEventListener(

    "beforeunload",

    function () {

        saveCurrentChat();

    }

);

/* ==========================================================
   WINDOW RESIZE
========================================================== */

window.addEventListener(

    "resize",

    function () {

        scrollBottom();

    }

);

/* ==========================================================
   PREVENT DOUBLE CLICK SEND
========================================================== */

if (sendBtn) {

    sendBtn.addEventListener(

        "dblclick",

        function (event) {

            event.preventDefault();

        }

    );

}

/* ==========================================================
   END OF SCRIPT
========================================================== */

console.log(

    "Santonius AI Chatbot Version 3.1 Loaded"

);

/* ==========================================================
   END OF FILE
========================================================== */