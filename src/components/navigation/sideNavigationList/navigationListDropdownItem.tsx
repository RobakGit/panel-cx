import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import { useState } from "react";

const NavigationListDropdownItem = (props: {
  item: { [key: string]: [{ uid: string; displayName: string }] };
  dropdownKey: string;
  uid: string;
  displayName: string;
  selected: string | undefined;
  selectElement: (id: string) => void;
}) => {
  const { item, dropdownKey, uid, displayName, selected, selectElement } =
    props;
  const [isOpen, setIsOpen] = useState(
    item[dropdownKey].find(el => el.uid === selected) ? true : false
  );

  return (
    <>
      <ListItemButton onClick={() => setIsOpen(!isOpen)}>
        <ListItemText primary={displayName} />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
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
