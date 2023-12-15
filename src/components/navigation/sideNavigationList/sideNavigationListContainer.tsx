import { Drawer, Grid, List } from "@mui/material";
import { useRouter } from "next/router";
import NavigationListItem from "./navigationListItem";
import NavigationListDropdownItem from "./navigationListDropdownItem";

const SideNavigationListContainer = (props: {
  HeaderElement?: JSX.Element;
  dropdownKey?: string;
  dropdownParentKey?: string;
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
  parentType?: string;
  newElementText?: string;
}) => {
  const {
    HeaderElement,
    listElements,
    selected,
    type,
    parentType,
    dropdownKey,
    dropdownParentKey,
    newElementText,
  } = props;
  const router = useRouter();

  const selectElement = (id: string | null, parentUid?: string) => {
    if (parentType) {
      if (parentUid) {
        router.query[parentType] = parentUid;
      } else {
        delete router.query[parentType];
      }
    }
    if (id) {
      router.query[type] = id;
    } else {
      delete router.query[type];
    }
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
                dropdownParentKey={dropdownParentKey}
                uid={item.uid}
                displayName={item.displayName}
                selected={selected}
                selectElement={selectElement}
                newElementText={newElementText}
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
