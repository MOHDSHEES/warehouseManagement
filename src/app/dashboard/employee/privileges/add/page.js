"use client";
import { MyContext } from "@/src/components/context";
import Privilages from "@/src/components/employee/privilages/privileges";
import TopComponent from "@/src/components/employee/privilages/topComponent";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import React, { useContext, useRef, useState } from "react";
import axios from "axios";
import { closeMessage } from "@/src/components/functions/message";
import UserAccessLayout from "@/src/components/layout/userAccessLayout";

const Page = () => {
  const { user, messageApi, setBackDropOpen, privilegeOptions } =
    useContext(MyContext);
  const [state, setState] = useState(privilegeOptions);
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [disable, setDisable] = useState(false);
  const nameRef = useRef(null);

  function clear() {
    setState(privilegeOptions);
    setName("");
    setError("");
    setDisable("false");
  }

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };
  async function handleSave(e) {
    e.preventDefault();
    if (name.trim() === "") {
      setError(true);
      nameRef.current.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      setDisable(true);
      setBackDropOpen(true);
      const { data } = await axios.post("/api/user/privilegeTemplate", {
        data: {
          name: name,
          roles: state,
          company: user.company && user.company._id,
        },
        // company: user.company && user.company._id,
      });
      if (data.status === 200) {
        closeMessage(messageApi, data.msg, "success");
        clear();
      } else if (data.status === 500)
        closeMessage(messageApi, data.msg, "error");

      setDisable(false);
      setBackDropOpen(false);
    }
  }
  return (
    <UserAccessLayout>
      <Container requiredprivilege="Add_Privilege" maxWidth="xl">
        <Typography variant="h4">Privileges</Typography>
        <form>
          <Stack spacing={3}>
            <div ref={nameRef} className="mt-5">
              <small>
                <b>Note: </b> By utilizing templates, you can easily register
                employees and establish their access privileges. For more
                details, read through the Instruction Guide.
              </small>
              <TopComponent
                name={name}
                setName={setName}
                error={error}
                setError={setError}
              />
              {/* <Tasks /> */}
            </div>
            {/* <Container maxWidth="xl" sx={{ mt: 4, mb: 4, padding: 0 }}> */}
            <div className="mt-2">
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  py: 5,
                }}
              >
                <Privilages
                  state={state}
                  setState={setState}
                  disabled={false}
                  handleChange={handleChange}
                />
              </Box>
            </div>
            {/* <TaskStatsComponent /> */}
            {/* </Container> */}
          </Stack>
          <Button disabled={disable} onClick={handleSave} variant="contained">
            Save
          </Button>
        </form>
      </Container>
    </UserAccessLayout>
  );
};

export default Page;
