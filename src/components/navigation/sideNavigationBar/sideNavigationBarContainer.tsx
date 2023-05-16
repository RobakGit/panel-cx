import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SideNavigationBarHeader from "./sideNavigationBarHeader";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import { Agent } from "@prisma/client";

const menuItems = [
  { title: "Intencje", href: "/intent", icon: <ChatOutlinedIcon /> },
  { title: "Encje", href: "/entity", icon: <CategoryOutlinedIcon /> },
  { title: "Page", href: "/page", icon: <FileCopyOutlinedIcon /> },
  {
    title: "Testy automatyczne",
    href: "/test",
    icon: <ScienceOutlinedIcon />,
  },
];

const SideNavigationBarContainer = (props: {
  drawerWidth: number;
  open: boolean;
  handleDrawerOpen?: () => void;
  handleDrawerClose?: () => void;
}) => {
  const { drawerWidth, open, handleDrawerOpen, handleDrawerClose } = props;
  const [agents, setAgents] = useState<Array<Agent>>([]);

  useEffect(() => {
    fetch("/api/agent")
      .then(data => data.json())
      .then(data => setAgents(data));
  }, []);

  return (
    <>
      <MenuIcon
        onClick={handleDrawerOpen}
        sx={{
          color: "primary.contrastText",
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 1100,
          cursor: "pointer",
        }}
      />
      <Drawer
        sx={{
          pt: 100,
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            marginTop: 2,
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <SideNavigationBarHeader
          agents={agents}
          handleDrawerClose={handleDrawerClose}
        />
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton href={item.href}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default SideNavigationBarContainer;
