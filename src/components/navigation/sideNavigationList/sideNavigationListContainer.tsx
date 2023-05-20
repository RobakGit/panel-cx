import {
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useRouter } from "next/router";

const SideNavigationListContainer = (props: {
  HeaderElement?: JSX.Element;
  listElements: Array<{ displayName: string; uid: string }>;
  selected?: string | undefined;
  type: string;
}) => {
  const { HeaderElement, listElements, selected, type } = props;
  const router = useRouter();

  const selectElement = (id: string) => {
    router.query[type] = id;
    router.push(router);
  };

  return (
    <Grid item xs={2}>
      <Drawer
        sx={{
          height: "100%",
          position: "relative",
          width: "100%",
          "& .MuiDrawer-paper": {
            width: "100%",
            position: "absolute",
            transition: "none !important",
          },
        }}
        variant="persistent"
        anchor="left"
        open={true}
      >
        {HeaderElement}
        <List sx={{ wordBreak: "break-all" }}>
          {listElements.map((item, index) => (
            <ListItem
              key={item.uid}
              disablePadding
              sx={
                item.uid === selected
                  ? { backgroundColor: "background.default" }
                  : null
              }
            >
              <ListItemButton
                autoFocus={item.uid === selected}
                onClick={() => selectElement(item.uid)}
              >
                <ListItemText primary={item.displayName} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Grid>
  );
};

export default SideNavigationListContainer;
