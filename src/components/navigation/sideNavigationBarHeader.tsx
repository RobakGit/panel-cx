import {
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  styled,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Agent } from "@prisma/client";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const SideNavigationBarHeader = (props: {
  agents: Array<Agent>;
  handleDrawerClose: () => void;
}) => {
  const { agents, handleDrawerClose } = props;
  return (
    <DrawerHeader>
      <List sx={{ width: "100%" }}>
        <ListItem
          sx={{ flexDirection: "row-reverse", pb: 3, pt: 1 }}
          disablePadding
        >
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </ListItem>
        <ListItem disablePadding>
          <FormControl fullWidth margin="dense">
            <InputLabel id={"agentSelectorLabel"}>Agent</InputLabel>
            <Select
              labelId="agentSelectorLabel"
              fullWidth
              sx={{ margin: "auto" }}
            >
              {agents.map(agent => {
                return (
                  <MenuItem key={agent.uid} value={agent.uid}>
                    {agent.displayName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </ListItem>
      </List>
    </DrawerHeader>
  );
};

export default SideNavigationBarHeader;
