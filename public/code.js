(function() {
    console.log("Script loaded");
    const app = document.querySelector(".app");
    if (!app) {
        console.error("App element not found");
        return;
    }
    const socket = io();

    let uname;

    const joinButton = app.querySelector(".join-screen #join-user");
    if (!joinButton) {
        console.error("Join button not found");
        return;
    }
    joinButton.addEventListener("click", function() {
        let username = app.querySelector(".join-screen #username").value;
        console.log("Join button clicked, username:", username); 
        if(username.length == 0) {
            console.log("Username is empty");
            return;
        }
        socket.emit("newuser", username);
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    const sendMessageButton = app.querySelector(".chat-screen #send-message");
    if (sendMessageButton) {
        sendMessageButton.addEventListener("click", function() {
            let message = app.querySelector(".chat-screen #message-input").value;
            if(message.length == 0) {
                return;
            }
            renderMessage("my", {
                username: uname,
                text: message
            });
            socket.emit("chat", {
                username: uname,
                text: message
            });
            app.querySelector(".chat-screen #message-input").value = "";
        });
    } else {
        console.error("Send message button not found");
    }

    const exitChatButton = app.querySelector(".chat-screen #exit-chat");
    if (exitChatButton) {
        exitChatButton.addEventListener("click", function() {
            socket.emit("exituser", uname);
            window.location.href = window.location.href; 
        });
    } else {
        console.error("Exit chat button not found");
    }

    socket.on("update", function(update) {
        renderMessage("update", update);
    });

    socket.on("chat", function(message) {
        renderMessage("other", message);
    });

    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        if(type == "my") {
            let el = document.createElement("div");
            el.setAttribute("class", "message my-message");
            el.innerHTML= `
                <div> 
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if(type == "other") {
            let el = document.createElement("div");
            el.setAttribute("class", "message other-message");
            el.innerHTML= `
                <div> 
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if(type == "update") {
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        // scroll chat to end
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
})();

