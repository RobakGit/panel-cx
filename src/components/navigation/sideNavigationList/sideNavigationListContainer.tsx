import { Drawer, Grid, List } from "@mui/material";
import { useRouter } from "next/router";
import NavigationListItem from "./navigationListItem";
import NavigationListDropdownItem from "./navigationListDropdownItem";

const SideNavigationListContainer = (props: {
  HeaderElement?: JSX.Element;
  dropdownKey?: string;
  listElements: Array<
    | { displayName: string; uid: string }
    | {
        displayName: string;
        uid: string;
        [key: string]: Array<{ displayName: string; uid: string }> | string;
      }
  >;
  selected?: string | undefined;
  type: string;
}) => {
  const { HeaderElement, listElements, selected, type, dropdownKey } = props;
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
          {listElements.map((item, index) =>
            dropdownKey ? (
              <NavigationListDropdownItem
                key={item.uid}
                item={item}
                dropdownKey={dropdownKey}
                uid={item.uid}
                displayName={item.displayName}
                selected={selected}
                selectElement={selectElement}
              />
            ) : (
              <NavigationListItem
                key={item.uid}
                uid={item.uid}
                displayName={item.displayName}
                selected={selected}
                selectElement={selectElement}
              />
            )
          )}
        </List>
      </Drawer>
    </Grid>
  );
};

export default SideNavigationListContainer;
