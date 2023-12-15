import {
  FormControlLabel,
  Grid,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { useRouter } from "next/router";

const FlowListHeader = (props: {}) => {
  const router = useRouter();

  const selectElement = (id: string) => {
    router.query["flow"] = id;
    delete router.query["page"];
    router.push(router);
  };

  return (
    <Grid container>
      <Grid item container direction={"row"} p={2}>
        <Grid item xs={6}>
          <b>Flow</b>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <ListItem
          key={"create-new"}
          disablePadding
          sx={{ backgroundColor: "secondary.main" }}
          onClick={() => selectElement("new")}
        >
          <ListItemButton>
            <ListItemText primary="Dodaj flow" />
          </ListItemButton>
        </ListItem>
      </Grid>
    </Grid>
  );
};

export default FlowListHeader;
