import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Stack } from "@mui/material";
import TopComponent from "../employee/privilages/topComponent";
import Privilages from "../employee/privilages/privileges";
import axios from "axios";
import { MyContext } from "../context";
import { closeMessage, openMessage } from "../functions/message";
// import { useRouter } from "next/router";

export default function UpdatePrivileges({
  open,
  setOpen,
  data,
  setData,
  setPrivilegesTemplates,
  setOpenEditPrivilegesModel,
  privilegesTemplates,
}) {
  const {
    user,
    messageApi,
    setUser,
    setPrivileges,
    isAdmin,
    privilegeOptions,
  } = useContext(MyContext);
  const [name, setName] = useState(data.name);
  const [selectedPrivilege, setSelectedPrivilege] = useState(data);
  const [state, setState] = useState(privilegeOptions);
  //   const router = useRouter();
  const nameRef = useRef();

  const [disable, setDisable] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (data && data !== "") {
      //   console.log(data.roles);
      setSelectedPrivilege(data);
      setName(data.name);
      setState(data.roles);
    }
  }, [data]);
  const handleClose = () => {
    setOpen(false);
    setSelectedPrivilege(data);
    setName(data.name);
    setState(data.roles);
  };
  //   console.log(state);
  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  async function handleSave() {
    setDisable(true);
    openMessage(messageApi, "Updating...");
    const { data } = await axios.post("/api/user/privilegeTemplate/update", {
      company: user.company._id,
      name: name,
      id: selectedPrivilege._id,
      state: state,
    });
    if (data.status === 200) {
      const newPrivileges = privilegesTemplates.map((template) => {
        if (template._id === data.data._id) return data.data;
        else return template;
      });
      setPrivilegesTemplates(newPrivileges);
      if (
        !isAdmin &&
        user &&
        user.privilegesTemplate &&
        user.privilegesTemplate._id === data.data._id
      ) {
        const updatedUser = {
          ...user,
          privilegesTemplates: data.data,
        };
        setUser(updatedUser);
        setPrivileges(data.data.roles);
      }
      //   const updatedUser = {
      //     ...user,
      //     company: {
      //       ...user.company,
      //       privilegesTemplate: newPrivileges,
      //     },
      //   };
      //   setUser(updatedUser);

      //   filterPrivileges(updatedUser);
      handleClose();
      setOpenEditPrivilegesModel(false);
      setData("");

      closeMessage(messageApi, "Successfully updated", "success");
      //   window.location.reload();
      //   router.reload();
    } else {
      closeMessage(messageApi, data.msg, "error");
    }
    setDisable(false);
  }
  return (
    <Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog
        open={open}
        maxWidth="lg"
        // onClose={handleClose}
      >
        <DialogTitle>Edit:</DialogTitle>

        <DialogContent>
          {state === "" ? (
            "Loading..."
          ) : (
            <form>
              <Stack spacing={3}>
                <div ref={nameRef} className="mt-1">
                  {/* <small>
                    <b>Note: </b> By utilizing templates, you can easily
                    register employees and establish their access privileges.
                    For more details, read through the Instruction Guide.
                  </small> */}
                  <TopComponent
                    component="update"
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
              <Button
                disabled={disable}
                onClick={handleSave}
                variant="contained"
              >
                Udate
              </Button>
            </form>
          )}
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
