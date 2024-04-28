import {
  Avatar,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";

export const ProductStatsCard = (props) => {
  const {
    title,
    data,
    color = "primary.main",
    icon = true,
    variant = "h6",
    iconData,
    sx,
  } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              {title}
            </Typography>
            <Typography variant={variant}>{data}</Typography>
          </Stack>
          {icon && (
            <Avatar
              sx={{
                backgroundColor: color,
                height: 45,
                width: 45,
              }}
            >
              <SvgIcon>{iconData}</SvgIcon>
            </Avatar>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
