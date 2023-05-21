import { ListItem, ListItemButton, ListItemText } from "@mui/material";

const NavigationListItem = (props: {
  uid: string;
  displayName: string;
  selected: string | undefined;
  selectElement: (id: string) => void;
}) => {
  const { uid, displayName, selected, selectElement } = props;

  return (
    <ListItem
      disablePadding
      sx={uid === selected ? { backgroundColor: "background.default" } : null}
    >
      <ListItemButton
        autoFocus={uid === selected}
        onClick={() => selectElement(uid)}
      >
        <ListItemText primary={displayName} />
      </ListItemButton>
    </ListItem>
  );
};

export default NavigationListItem;
