import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Collapse,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useState } from "react";

const NavigationListDropdownItem = (props: {
  item: {
    displayName: string;
    uid: string;
    [key: string]: Array<{ displayName: string; uid: string }> | string;
  };
  dropdownKey: string;
  uid: string;
  displayName: string;
  selected: string | undefined;
  selectElement: (id: string, parentUid?: string) => void;
  newElementText?: string;
}) => {
  const {
    item,
    dropdownKey,
    uid,
    displayName,
    selected,
    selectElement,
    newElementText,
  } = props;
  const [isOpen, setIsOpen] = useState(
    item[dropdownKey].find(el => el.uid === selected) || item.uid === selected
      ? true
      : false
  );

  return (
    <>
      <ListItemButton onClick={() => selectElement(null, item.uid)}>
        <ListItemText primary={displayName} />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        {newElementText && (
          <ListItem
            key={"create-new"}
            disablePadding
            sx={{ backgroundColor: "secondary.main" }}
            onClick={() => selectElement("new", item.uid)}
          >
            <ListItemButton>
              <ListItemText primary={newElementText} />
            </ListItemButton>
          </ListItem>
        )}
        <List component="div" disablePadding>
          {item[dropdownKey] &&
            item[dropdownKey].map(element => (
              <ListItemButton
                key={`${uid}-${element.uid}`}
                sx={
                  element.uid === selected
                    ? { backgroundColor: "background.default", pl: 4 }
                    : { pl: 4 }
                }
                autoFocus={element.uid === selected}
                onClick={() => selectElement(element.uid)}
              >
                <ListItemText primary={element.displayName} />
              </ListItemButton>
            ))}
        </List>
      </Collapse>
    </>
  );
};

export default NavigationListDropdownItem;
