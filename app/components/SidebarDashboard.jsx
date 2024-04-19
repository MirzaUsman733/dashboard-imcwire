"use client";
import React, { use } from "react";
import AddTaskIcon from "@mui/icons-material/AddTask";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { LuPackage2 } from "react-icons/lu";
import { GrTransaction } from "react-icons/gr";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { FaBuilding } from "react-icons/fa";
import { BsBuildingAdd } from "react-icons/bs";
import { TbReport } from "react-icons/tb";
import { signOut, useSession } from "next-auth/react";
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { useRouter } from "next/navigation";


const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  backgroundColor: "#7E22CE",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const SidebarDashboard = ({ children }) => {
const router = useRouter();
  const [open, setOpen] = React.useState(true);
  const [windowWidth, setWindowWidth] = React.useState(0);
  const { data: session, status: sessionStatus } = useSession();
  const handleToggleDrawer = () => {
    setOpen(!open);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setOpen(false);
    }
  };
  React.useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("dashboard.imcwire.com/login");
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} className="bg-none text-white">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" className="bg-[#7E22CE">
            <div className="text-center">User Dashboard</div>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            zIndex: 100,
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <div className="flex justify-between items-center">
          <div className="ps-4 font-bold">IMCWIRE</div>
          <DrawerHeader>
            <IconButton
              onClick={handleToggleDrawer}
              className="block"
            >
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
        </div>
        <Divider />
        <List>
          <ListItemButton
            component={Link}
            href="/press-dashboard/pr-balance"
            onClick={handleLinkClick}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
          {/* <ListItemButton
            component={Link}
            href="/press-dashboard"
            onClick={handleLinkClick}
          >
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Press Release" />
          </ListItemButton> */}
          <ListItemButton
            component={Link}
            href="https://imcwire.com/pricing"
            onClick={handleLinkClick}
          >
            <ListItemIcon>
              <AddTaskIcon />
            </ListItemIcon>
            <ListItemText primary="Add Press Release" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            href="/press-dashboard/reports"
            onClick={handleLinkClick}
          >
            <ListItemIcon>
              <TbReport />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            href="https://imcwire.com/pricing/"
            onClick={handleLinkClick}
          >
            <ListItemIcon>
              <LuPackage2 />
            </ListItemIcon>
            <ListItemText primary="Packages" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            href="/press-dashboard/transaction"
            onClick={handleLinkClick}
          >
            <ListItemIcon>
              <GrTransaction />
            </ListItemIcon>
            <ListItemText primary="Transaction" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            href="/press-dashboard/view-companies"
            onClick={handleLinkClick}
          >
            <ListItemIcon>
              <FaBuilding />
            </ListItemIcon>
            <ListItemText primary="View Companies" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            href="/press-dashboard/add-company"
            onClick={handleLinkClick}
          >
            <ListItemIcon>
              <BsBuildingAdd />
            </ListItemIcon>
            <ListItemText primary="Add Company" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            href="/press-dashboard/pr-balance"
            onClick={handleLinkClick}
          >
            <ListItemIcon>
              <MdOutlineAccountBalanceWallet />
            </ListItemIcon>
            <ListItemText primary="Press Release" />
          </ListItemButton>
        </List>
        <Divider />
        <List>
          {session ? (
            <ListItemButton
              // component={Link}
              // href="/login"
              onClick={handleSignOut}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          ) : (
            <ListItemButton
              component={Link}
              href="/login"
              onClick={handleLinkClick}
            >
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton>
          )}
        </List>
        {session?.user?.role === "admin" ? (
          <List>
            <ListItemButton
              component={Link}
              href="/press-dashboard-admin"
              onClick={handleLinkClick}
            >
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Admin Dashboard" />
            </ListItemButton>
          </List>
        ) : (
          ""
        )}
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
};

export default SidebarDashboard;
