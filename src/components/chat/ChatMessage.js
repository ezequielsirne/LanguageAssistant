import React from "react";
import { Alert } from "react-bootstrap";

const ChatMessage = ({ role, message, isAi, comments, language }) => {
  const messageClass = isAi ? "ai-message" : "user-message";
  const messageBody = message;
  const messageComments = comments;
  const errors = comments
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .includes("no tienes errores");

  return (
    <Alert
      variant={
        isAi
          ? "secondary"
          : !language
          ? "danger"
          : errors
          ? "info"
          : "danger"
      }
      className={`chat-message ${messageClass}`}
    >
      <Alert.Heading>{messageBody}</Alert.Heading>
      {role === "user" && language && (
        <>
          <hr />
          <p>{messageComments}</p>
        </>
      )}
    </Alert>
  );
};

export default ChatMessage;
