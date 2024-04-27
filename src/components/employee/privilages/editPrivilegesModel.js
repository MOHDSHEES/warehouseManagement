import * as React from "react";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { blue } from "@mui/material/colors";
import axios from "axios";
// import UpdateIcon from "@mui/icons-material/Update";
import EditIcon from "@mui/icons-material/Edit";
import { closeMessage } from "../../functions/message";
import { MyContext } from "../../context";

export default function EditPrivilegesModel({
  open,
  setOpen,
  setUpdateModel,
  data: template,
  setData,
  privilegesTemplates,
  setPrivilegesTemplates,
}) {
  const { messageApi, setBackDropOpen } = React.useContext(MyContext);
  // console.log(privilegesTemplates);
  const handleClose = () => {
    setData("");
    setOpen(false);
    // setSelectedValue(value);
  };

  async function isTemplateUsed() {
    const { data } = await axios.post("/api/user/privilegeTemplate/isUsed", {
      template: template._id,
    });
    return data;
  }

  async function deleteHandler(e) {
    e.preventDefault();
    setBackDropOpen(true);
    const value = await isTemplateUsed();
    if (value.status === 200 && value.data) {
      closeMessage(
        messageApi,
        "The template is currently active. Kindly revoke the privileges template from the employee before proceeding with deletion",
        "error",
        4
      );
    } else if (value.status === 500)
      closeMessage(
        messageApi,
        "Something Went wrong. Please try again Later",
        "error"
      );
    else {
      // proceeding with deletion
      // setBackDropOpen(true);
      const { data } = await axios.post("/api/user/privilegeTemplate/delete", {
        template: template._id,
      });
      // console.log(data);
      if (data.status === 200) {
        closeMessage(messageApi, data.msg, "success");
        const filteredTemplates = privilegesTemplates.filter(
          (temp) => temp._id !== template._id
        );
        setPrivilegesTemplates(filteredTemplates);
        handleClose();
      } else {
        closeMessage(messageApi, data.msg, "error");
      }
      // setBackDropOpen(false);
    }
    setBackDropOpen(false);
  }

  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Settings</DialogTitle>
        <List sx={{ pt: 0 }}>
          <ListItem disableGutters>
            <ListItemButton
              onClick={() => {
                setUpdateModel(true);
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <EditIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Edit Privileges" />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters>
            <ListItemButton
              onClick={(e) => {
                deleteHandler(e);
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <EditIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Delete Template" />
            </ListItemButton>
          </ListItem>
        </List>
      </Dialog>
    </>
  );
}
