import { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import ChatMessage from "./ChatMessage";
import ChatService from "./ChatService";
import "./chat.css";

function Chat(username) {
  const [aiRole, setAiRole] = useState();
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isConversationStarted, setIsConversationStarted] =
    useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (
      !isConversationStarted &&
      !(typeof username === "undefined")
    ) {
      sendInitialMessage(username);
      setIsConversationStarted(true);
    } // eslint-disable-next-line
  }, [isConversationStarted, username]);

  const sendInitialMessage = async (username) => {
    const response = await ChatService.startConversation(username);
    const aiMessage = {
      role: response.role,
      content: response.content,
      isAi: true,
      comments: "",
      language: true,
    };
    setAiRole(response.role);
    addMessage(aiMessage);
  };

  const sendMessage = async (messageToAdd) => {
    const role = "user";
    const content = messageToAdd;
    const response = await ChatService.sendMessage([
      ...conversation,
      { role, content },
    ]);
    const aiMessage = {
      role: response.role,
      content: response.content,
      isAi: true,
      comments: "",
      language: true,
    };
    addMessage(aiMessage);
    setIsAiTyping(false);
  };

  const addMessage = ({
    role,
    content,
    isAi,
    comments,
    language,
  }) => {
    setMessages((messages) => [
      ...messages,
      { role, content, isAi, comments, language },
    ]);
    setConversation((conversation) => [
      ...conversation,
      { role, content },
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ChatService.verifyLanguage(input)
      .then((language) => {
        if (language) {
          ChatService.verifyMessage(input)
            .then((comments) => {
              console.log(comments);
              const userMessage = {
                role: "user",
                content: input,
                isAi: false,
                comments: comments,
                language: true,
              };
              addMessage(userMessage);
              sendMessage(input);
              setInput("");
              setIsAiTyping(true);
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          const userMessage = {
            role: "user",
            content: input,
            isAi: false,
            comments: "",
            language: false,
          };
          addMessage(userMessage);
          const aiMessage = {
            role: aiRole,
            content: `I can't understand you, please write me in English`,
            isAi: true,
            comments: "",
            language: true,
          };
          addMessage(aiMessage);
          setInput("");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const scrollToBottom = () => {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <Container className="vh-100">
      <Row className="justify-content-center">
        <Col md={12} className="mt-5">
          <div className="chat-container">
            <div
              id="chat-log"
              className="chat-messages overflow-auto"
            >
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  message={message.content}
                  comments={message.comments}
                  isAi={message.isAi}
                  language={message.language}
                />
              ))}
              {isAiTyping && (
                <ChatMessage
                  role="assistant"
                  message="Typing..."
                  comments=""
                  isAi={true}
                  language={true}
                />
              )}
              <div ref={chatEndRef} />
            </div>
            <Form onSubmit={handleSubmit}>
              <div className="d-grid gap-2">
                <Form.Control
                  type="text"
                  placeholder="Type your message here"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={!isConversationStarted || isAiTyping}
                />
                <Button
                  variant="primary"
                  type="submit"
                  disabled={
                    !isConversationStarted ||
                    isAiTyping ||
                    input === ""
                  }
                >
                  Send
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Chat;
