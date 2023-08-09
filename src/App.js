import React, { useState } from "react";
import { Container, Row, Button, Form } from "react-bootstrap";

//Components
import Chat from "./components/chat/chat";

//React Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [showChat, setShowChat] = useState(false); // track whether chat is visible or not
  const [userName, setUserName] = useState(""); // track user's name

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim() !== "") {
      setShowChat(true); // show chat component if user has entered a name
    }
  };

  return (
    <div className="App">
      {showChat && <Chat userName={userName} />}
      {!showChat && (
        <Container>
          <Row className="justify-content-center align-items-center vh-100">
            <div className="card" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">Welcome!</h5>
                <p className="card-text">
                  This language assistant will help you practice your
                  English daily by correcting any mistakes you may
                  have. You just have to give it your name and it will
                  start a casual conversation with you about any
                  random topic.
                </p>
                <Form onSubmit={handleNameSubmit}>
                  <div className="d-grid gap-2">
                    <Form.Group controlId="formName">
                      <Form.Label>Put your name:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </Form.Group>
                    <Button variant="primary" size="lg" type="submit">
                      Start conversation
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </Row>
        </Container>
      )}
    </div>
  );
}

export default App;
