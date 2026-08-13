document.addEventListener("DOMContentLoaded", () => {
    const sendButton = document.getElementById("send-btn");
    const messageInput = document.getElementById("message-input");
    const chatBox = document.getElementById("chat-box");

    // Connect securely to Ably using a token endpoint we'll host on Netlify
    const ably = new Ably.Realtime({ authUrl: '/.netlify/functions/auth' });
    const channel = ably.channels.get('aim-global-chat');

    // Listen for incoming messages from the live web server
    channel.subscribe('message', (msg) => {
        const newMessage = document.createElement("p");
        newMessage.style.margin = "4px 0";
        
        // Style incoming text with a classic red "Buddy:" or "You:" label
        newMessage.innerHTML = `<span style="color: red; font-weight: bold;">Buddy:</span> ${msg.data}`;
        
        chatBox.appendChild(newMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    // Function to publish your text to everyone on the internet
    function sendLiveMessage() {
        const text = messageInput.value.trim();
        if (text === "") return;

        // Broadcast the text to the Ably global channel
        channel.publish('message', text);

        // Clear the typing field immediately
        messageInput.value = "";
    }

    // Bind triggers to your actions
    if (sendButton) sendButton.addEventListener("click", sendLiveMessage);
    if (messageInput) {
        messageInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") sendLiveMessage();
        });
    }
});
