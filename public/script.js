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

// const name = prompt('Enter your name to join');
// socket.emit('new-user-joined', name);


let name = '';

while (!name.trim()) {
  name = prompt('Enter your name to join');
}



socket.emit('new-user-joined', name);

socket.on('user-joined', (name) => {
  appendMessage(`${name} joined the chat`, 'left');
});




socket.on('user-left', (name) => {
  appendMessage(`${name} left the chat`, 'left');
  playMessageSound(); 
});

socket.on('receive', (data) => {
  if (data.name !== name) {
    appendMessage(`${data.name}: ${data.message}`, 'left');
  }
});
function playMessageSound() {
  messageSound.currentTime = 0; 
  messageSound.play();
}

