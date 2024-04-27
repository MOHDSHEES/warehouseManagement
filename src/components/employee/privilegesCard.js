import React from "react";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { Button, Chip, IconButton, Stack } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

export default function PrivilegesCard({ template, setOpen }) {
  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        overflow: { xs: "auto", sm: "initial" },
      }}
    >
      <Card
        orientation="horizontal"
        sx={{
          width: "100%",
          overflow: "auto",
        }}
      >
        <CardContent>
          <Typography fontSize="xl" fontWeight="lg">
            {template.name}
            <IconButton
              style={{ float: "right", marginRight: "5px" }}
              onClick={() => setOpen(template)}
              aria-label="settings"
            >
              <SettingsIcon color="primary" fontSize="small" />
            </IconButton>
            {/* <Button
              style={{ float: "right", marginRight: "5px" }}
              variant="contained"
              //   onClick={openEditModel}
              color="primary"
            >
              Edit
            </Button> */}
          </Typography>

          <Stack direction="row" sx={{ flexWrap: "wrap" }} spacing={1}>
            {template.roles &&
              Object.entries(template.roles).map(([key, value], idx) => {
                return value ? (
                  <Chip
                    style={{ margin: "5px" }}
                    key={idx}
                    label={key}
                    size="small"
                    color="success"
                  />
                ) : (
                  <Chip
                    style={{ margin: "5px" }}
                    key={idx}
                    label={key}
                    size="small"
                    // color="tertiary"
                  />
                );
              })}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
