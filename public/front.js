const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");


let userMessage;
const createChatLi = (message, className) => {
  // Create a chat <li> element with passed message and className
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p>${message}</p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
  chatLi.innerHTML = chatContent;
  return chatLi;
};


const handleChat = (data, type) => {
  userMessage = data.trim(); // Get user entered message and remove extra whitespace
  if (!userMessage) return;

  chatbox.appendChild(createChatLi(userMessage, type));
};


function send() {
    const id = document.getElementById("idd").value
    const msg = document.getElementById("messageInput").value


    fetch('http://localhost:7070/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, msg })
          })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }

                return response.json();
              })
              .then(data => {
                
                handleChat("You: " + msg, "outgoing");
                console.log('Success:', data.message);

              })
}
sendChatBtn.addEventListener("click", send);