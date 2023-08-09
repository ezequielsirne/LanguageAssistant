import Config from "../../config/Config";

const ChatService = {
  startConversation: async (username) => { 
        
    const requestBody = {
      model: Config.MODEL,
      messages: [{ role: 'user', content: `Hi, I'm ${username['userName']}. ${Config.INITIAL_MESSAGE}` }],
      temperature: Config.TEMPERATURE,
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Config.API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();
    const message = data.choices[0].message;
    return { role: message.role, content: message.content.trim() };
  },

  verifyLanguage: async (messageToVerify) => { 
        
    const requestBody = {
      model: Config.MODEL,
      messages: [{ role: 'user', content: `Indicame si el mensaje que está a continuación está escrito en inglés: 
      ${messageToVerify}.
      Responde de forma corta si o no`, }],
      temperature: Config.CORRECTIONS_TEMPERATURE,
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Config.API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    const answer = data.choices[0].message.content.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return answer.includes("si");
  },


  verifyMessage: async (messageToVerify) => { 
        
    const requestBody = {
      model: Config.MODEL,
      messages: [{ role: 'user', content: `dime como está mi comunicación en ingles: 
      ${messageToVerify}.
      Si no tiene errores, responde solamente: No tenés errores.
      Si tiene errores:  responde el mensaje tiene errores y coloca su corrección.` }],
      temperature: Config.CORRECTIONS_TEMPERATURE,
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Config.API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();
    const comment = data.choices[0].message;
    return comment.content.trim();
  },

  sendMessage: async (conversation) => {

    const requestBody = {
      model: Config.MODEL,
      messages: conversation,
      temperature: Config.TEMPERATURE,
    };
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Config.API_KEY}`,
      },
      body: JSON.stringify(requestBody),
  });
  const data = await response.json();
  return data.choices[0].message;
  },
};

export default ChatService;
