import { IconButton, MenuItem } from "@mui/material";
import Menu from "@mui/material/Menu";

export default function EditMenu({
  openMenu,
  setOpenMenu,
  setClickedRow,
  handleRemove,
  setOpenEdit,
}) {
  // const [openMenu, setOpenMenu] = React.useState(null);
  const open = Boolean(openMenu);
  //   const handleClick = (event) => {
  //     setOpenMenu(event.currentTarget);
  //   };
  const handleClose = () => {
    setOpenMenu(null);
    setClickedRow({ data: "", idx: "" });
  };
  const handleEditOption = () => {
    setOpenEdit(true);
  };
  return (
    <div>
      {/* <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Dashboard
      </Button> */}
      <Menu
        id="basic-menu"
        anchorEl={openMenu}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleEditOption}>Edit</MenuItem>
        <MenuItem onClick={handleRemove}>Remove</MenuItem>
      </Menu>
    </div>
  );
}
