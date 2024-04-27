import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import Badge from "@mui/material/Badge";
import { useContext, useState } from "react";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import { MyContext } from "../context";
// const user = {
//   avatar: "/assets/avatars/avatar-anika-visser.png",
//   city: "Los Angeles",
//   country: "USA",
//   jobTitle: "Senior Developer",
//   name: "Anika Visser",
//   timezone: "GTM-7",
// };
const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 25,
  height: 25,
  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
}));
export const AccountProfile = () => {
  const { user } = useContext(MyContext);
  const [uploadShow, setUploadShow] = useState(false);

  return (
    <>
      <Card>
        <CardContent>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <SmallAvatar
                  className="pointer"
                  onClick={() => setUploadShow(true)}
                  sx={{ bgcolor: "white" }}
                >
                  <EditIcon sx={{ color: "black", fontSize: "15px" }} />
                </SmallAvatar>
              }
            >
              {user && user.profileImg ? (
                <Avatar
                  sx={{
                    height: 100,
                    width: 100,
                    //   bgcolor: green[500],
                  }}
                  alt={user && user.name ? user.name : "Profile"}
                  src={user.profileImg}
                />
              ) : (
                <Avatar
                  // src={user.avatar}
                  sx={{
                    height: 100,
                    width: 100,
                    //   bgcolor: green[500],
                  }}
                >
                  {user && user.name && user.name.slice(0, 1)}
                </Avatar>
              )}
            </Badge>

            <Typography className="mt-3" gutterBottom variant="h5">
              {user && user.name}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user && user.post}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user && user.jobType}
            </Typography>
            {user && user.status ? (
              <Typography color="text.secondary" variant="body2">
                Status: <span style={{ color: "green" }}>Working</span>
              </Typography>
            ) : (
              <Typography color="text.secondary" variant="body2">
                Status: <span style={{ color: "red" }}>Former</span>
              </Typography>
            )}

            {/* <Typography color="text.secondary" variant="body2">
            {user.city} {user.country}
          </Typography> */}
          </Box>
        </CardContent>
        <Divider />
        <CardActions>
          {/* <Button fullWidth variant="text">
          Upload picture
        </Button> */}
        </CardActions>
      </Card>
      {/* <PhotoUpload
        // upDatedData={setEmployee}
        show={uploadShow}
        onHide={() => setUploadShow(false)}
        // data={employee}
      /> */}
    </>
  );
};
