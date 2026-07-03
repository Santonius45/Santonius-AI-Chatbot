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

const API_URL = "https://santonius-ai-chatbot-production.up.railway.app/chat";

// ==========================================
// Menambahkan Pesan ke Chat
// ==========================================

function addMessage(sender, text) {

    const message = document.createElement("div");
    message.className = "message " + sender;

    const bubble = document.createElement("div");
    bubble.className = "bubble";

    bubble.innerHTML = text.replace(/\n/g, "<br>");

    message.appendChild(bubble);

    chatBox.appendChild(message);

    chatBox.scrollTop = chatBox.scrollHeight;

}

// ==========================================
// Mengirim Pesan ke Backend
// ==========================================

async function sendMessage() {

    const message = messageInput.value.trim();

    if (message === "") {
        return;
    }

    // Tampilkan pesan user
    addMessage("user", message);

    // Kosongkan input
    messageInput.value = "";

    // Loading AI
    addMessage("ai", "⏳ AI sedang mengetik...");

    const loadingMessage = chatBox.lastElementChild;

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });

        if (!response.ok) {
            throw new Error("Server Error");
        }

        const data = await response.json();

        // Hapus loading
        loadingMessage.remove();

        // Tampilkan jawaban AI
        addMessage("ai", data.reply);

    } catch (error) {

        loadingMessage.remove();

        addMessage(
            "ai",
            "❌ Gagal terhubung ke server."
        );

        console.error("Error:", error);

    }

}

// ==========================================
// Klik Tombol Kirim
// ==========================================

sendBtn.addEventListener("click", function () {
    sendMessage();
});

// ==========================================
// Tekan Enter
// ==========================================

messageInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});

// ==========================================
// Fokus ke Input Saat Dibuka
// ==========================================

window.onload = function () {
    messageInput.focus();
};