import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, Stack } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
// import { useRouter } from "next/navigation";
import SearchProduct from "../search/searchProduct";
import { useParams, usePathname } from "next/navigation";
import SearchOrder from "../search/searchOrder";

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

export const TopNav = (props) => {
  const params = useParams();
  const pathname = usePathname();
  // const router = useRouter();
  const { onNavOpen } = props;
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  // const { user } = useContext(MyContext);
  //   const accountPopover = usePopover();

  return (
    <>
      <Box
        component="header"
        sx={{
          backdropFilter: "blur(6px)",
          backgroundColor: "#edf1f7",
          position: "sticky",
          left: {
            lg: `${SIDE_NAV_WIDTH}px`,
          },
          top: 0,
          width: {
            lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
          },
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{
            minHeight: TOP_NAV_HEIGHT,
            px: 2,
          }}
        >
          <Stack alignItems="center" direction="row" spacing={2}>
            {!lgUp && (
              <IconButton onClick={onNavOpen}>
                <MenuIcon />
              </IconButton>
            )}
          </Stack>
          {params && params.id && (
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              style={{ marginLeft: "5px" }}
            >
              <SearchProduct warehouse={params.id} />
            </Stack>
          )}
          {pathname === "/dashboard/order" && (
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              style={{ marginLeft: "5px" }}
            >
              <SearchOrder warehouse={params.id} />
            </Stack>
          )}
        </Stack>
      </Box>
    </>
  );
};
