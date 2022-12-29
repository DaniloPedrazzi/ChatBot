import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector("form");
const chatContainer = document.getElementById("chat_container");

let loadInterval;

//Animação 3 pontinhos
function loading(element){
  element.textContent = '.';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if(element.textContent === '.....'){
      element.textContent = '.';
    }
  }, 300)
}

//Animação Bot Escrevendo
function typeText(element, text){
  let index = 0;

  let interval = setInterval(() => {
    if(index < text.length){
      element.innerHTML += text.charAt(index);
      index++;
    }else{
      clearInterval(interval);
    }
  }, 20);
}

//Geração de ID único por data e número aleatório Ex: "id-291220220019-1092849182"
function generateId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`; //tá em string pq é pra nome de class
}

//HTML pra gerar mensagem e imagem de perfil
function chatStripe(isAi, message, Id) {
  return(
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img src=${isAi ? bot : user} />
          </div>
          <div class="message" id=${Id}>${message}</div>
        </div>
      </div>
    `
  )
}

//Action do Form
const handleSubmit = async (e) => {
  e.preventDefault(); //não recarrega a página

  const data = new FormData(form); //pega o prompt escrito

  //Joga o Prompt no chat
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();

  //Ativa o Loading do Bot (FrontEnd)
  const uniqueId = generateId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
  chatContainer.scrollTop = chatContainer.scrollHeight; //desce confome ele escreve
  const messageDiv = document.getElementById(uniqueId);
  loading(messageDiv);

  //Request pra API do Bot
  const response = await fetch('https://chatbot-eebe.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

  //Para o Loading e Limpa o texto para ser escrito no próximo bloco
  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  //Pega a resposta do backend e escreve
  if(response.ok){
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  }else {
    const err = await response.text();
    messageDiv.innerHTML = "Algo deu errado.";
    alert(err);
  }
}

form.addEventListener('submit', handleSubmit);
//Aciona a função quando aperta enter
form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13){
    handleSubmit(e);
  }
})