import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useState } from "react";
import { MyContext } from "../context";
import { closeMessage, openMessage } from "../functions/message";

const ForgetPassword = (props) => {
  const [email, setEmail] = useState("");
  function emailChange(e) {
    setEmail(e.target.value);
    setValidated(false);
    // setisValid(true);
  }
  const { messageApi } = useContext(MyContext);
  const [validated, setValidated] = useState(false);
  //   const [isValid, setisValid] = useState(true);
  //   const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      closeMessage(messageApi, "Enter valid email", "error");
      setValidated(false);
    } else {
      openMessage(messageApi, "Sending...");
      setValidated(true);
      setDisabled(true);
      const { data } = await axios.post("/api/password/forgetPasswordEmail", {
        email: email,
      });
      if (data.success) {
        closeMessage(messageApi, data.message, "success");
        props.onHide();
      } else {
        closeMessage(messageApi, data.message, "error");
        // setError(data.message);
        setValidated(false);
        // setisValid(false);
      }
      setDisabled(false);
      // console.log(data);
    }
  }
  function clear() {
    setEmail("");
    setValidated(false);
    // setisValid(true);
  }
  return (
    <div>
      <Modal
        onExit={() => {
          clear();
        }}
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Password Recovery
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* {!isValid && (
            <div class="alert alert-danger" role="alert">
              {error}
            </div>
          )} */}
          <small id="emailHelp" class="form-text text-muted mb-3">
            To recover your Password Please enter the Email registered with your
            account.
          </small>
          <Form
            style={{ marginTop: "10px" }}
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => emailChange(e)}
              placeholder="Enter Email"
              required
            />
            {/* <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback> */}
            <Modal.Footer>
              <Button disabled={disabled} type="submit">
                Send Email
              </Button>
              <Button variant="secondary" onClick={props.onHide}>
                Close
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ForgetPassword;
