const socket = io();

console.log(socket);
const chatMessages = document.getElementById("chat-messages");
const messageInput = document.getElementById("message-input");

const sendButton = document.getElementById("send-button");
const currentUserspace = document.getElementById("user-space");
const usernameInput = document.getElementById("username-input");
const updateUsernameButton = document.getElementById("updateusername-button");

let humanElement = null;

socket.on("set_user", (data) => {
  const userAvatar = document.createElement("img");
  userAvatar.src = data.avatar;

  humanElement = document.createElement("p");
  humanElement.textContent = data.username;

  const nameDiv = document.createElement("div");
  nameDiv.className = "nameDiv";
  nameDiv.appendChild(humanElement);

  const constText = document.createElement("p");
  constText.className = "small-text";
  constText.textContent = "Your Username";
  nameDiv.appendChild(constText);

  currentUserspace.appendChild(userAvatar);
  currentUserspace.appendChild(nameDiv);
});

socket.on("user_joined", (data) => {
  addMessage(`${data.username} joined the chat`, "system");
});
socket.on("user_left", (data) => {
  addMessage(`${data.username} left the chat`, "system");
});

socket.on("new_message", (data) => {
  addMessage(data.message, "user", data.username, data.avatar);
});

socket.on("username_updated", (data) => {
  addMessage(
    `${data.old_username} changed theire name is to ${data.new_username}`,
    "system"
  );
  if (data.old_username === humanElement.textContent) {
    humanElement.textContent = data.new_username;
  }
});

sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key == "Enter") sendMessage();
});
updateUsernameButton.addEventListener("click", updateUsername);
function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit("send_message", { message });
    messageInput.value = "";
  }
}
function addMessage(message, type, username = "", avatar = "") {
  const messageElement = document.createElement("div");
  messageElement.className = "message";

  if (type == "user") {
    const avatarImg = document.createElement("img");
    avatarImg.src = avatar;
    messageElement.appendChild(avatarImg);

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";

    const usernameDiv = document.createElement("div");
    usernameDiv.className = "message-username";
    usernameDiv.textContent = username;
    const isSendMessage = username === humanElement.textContent;
    if (isSendMessage) {
      messageElement.classList.add("sent");
      usernameDiv.textContent = "You";
    }
    contentDiv.appendChild(usernameDiv);

    const messageText = document.createElement("p");
    messageText.className = "message-text";
    messageText.textContent = message;
    contentDiv.appendChild(messageText);

    messageElement.appendChild(contentDiv);
  } else {
    messageElement.className = "system-message";
    messageElement.textContent = message;
  }

  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function updateUsername() {
  const newUsername = usernameInput.value.trim();
  if (newUsername && newUsername !== humanElement.textContent) {
    socket.emit("update_username", { username: newUsername });
    usernameInput.value = "";
  }
}
