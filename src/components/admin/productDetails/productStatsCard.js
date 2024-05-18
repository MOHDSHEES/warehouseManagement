import {
  Avatar,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export const ProductStatsCard = (props) => {
  const {
    title,
    data,
    color = "primary.main",
    icon = true,
    variant = "h6",
    iconData,
    difference = null,
    positive = true,
    number = false,
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
        {difference !== null && (
          <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
            <Stack alignItems="center" direction="row" spacing={0.5}>
              <SvgIcon color={positive ? "success" : "error"} fontSize="small">
                {positive ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              </SvgIcon>
              <Typography
                color={positive ? "success.main" : "error.main"}
                variant="body2"
              >
                {number ? difference : `${difference}%`}
                {/* {`${(difference * 100).toFixed(1)}%`} */}
              </Typography>
            </Stack>
            <Typography color="text.secondary" variant="caption">
              Since last month
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
