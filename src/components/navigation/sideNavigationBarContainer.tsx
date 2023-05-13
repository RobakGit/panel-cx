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

const drawerWidth = 240;
const menuItems = [
  { title: "Intencje", icon: <ChatOutlinedIcon /> },
  { title: "Encje", icon: <CategoryOutlinedIcon /> },
  { title: "Page", icon: <FileCopyOutlinedIcon /> },
  { title: "Testy automatyczne", icon: <ScienceOutlinedIcon /> },
];

const SideNavigationBarContainer = (props: {}) => {
  const [open, setOpen] = useState(true);
  const [agents, setAgents] = useState<Array<Agent>>([]);

  useEffect(() => {
    fetch("/api/agent")
      .then(data => data.json())
      .then(data => setAgents(data))
      .then(() => console.log(agents));
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <MenuIcon
        onClick={handleDrawerOpen}
        sx={{
          color: "primary.contrastText",
          position: "absolute",
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
              <ListItemButton>
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
