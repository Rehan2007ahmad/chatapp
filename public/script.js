const socket = io('http://localhost:3000');
const messageContainer = document.getElementById('messageContainer');
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageSound = document.getElementById('messageSound');

const appendMessage = (message, position) => {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add('message', position);
  messageContainer.appendChild(messageElement);
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = messageInput.value;
  appendMessage(`You: ${message}`, 'right');
  socket.emit('send', message);
  messageInput.value = '';
  playMessageSound(); 
});

let name = '';

// Prompt user for name
while (!name.trim()) {
  name = prompt('Enter your name to join');
}

// Send the user's name to the server
socket.emit('new-user-joined', name);

// Listen for user joined event
socket.on('user-joined', (name) => {
  appendMessage(`${name} joined the chat`, 'left');
  playMessageSound(); // Play sound when user joins
});

// Listen for user left event
socket.on('user-left', (name) => {
  appendMessage(`${name} left the chat`, 'left');
  playMessageSound(); // Play sound when user leaves
});

// Listen for received messages
socket.on('receive', (data) => {
  if (data.name !== name) {
    appendMessage(`${data.name}: ${data.message}`, 'left');
    playMessageSound(); // Play sound when message is received
  }
});

// Function to play message sound
function playMessageSound() {
  messageSound.currentTime = 0; 
  messageSound.play();
}
