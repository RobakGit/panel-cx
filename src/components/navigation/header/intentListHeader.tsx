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

const IntentListHeader = (props: {
  searchValue: string;
  setSearchValue: (value: string) => void;
  searchType: string;
  setSearchType: (value: string) => void;
}) => {
  const { searchValue, setSearchValue, searchType, setSearchType } = props;
  const [isSearch, setIsSearch] = useState(false);

  const router = useRouter();

  const selectElement = (id: string) => {
    router.query["intent"] = id;
    router.push(router);
  };

  return (
    <Grid container>
      <Grid item container direction={"row"} p={2}>
        <Grid item xs={6}>
          <b>Intencje</b>
        </Grid>
        <Grid item display={"flex"} justifyContent={"flex-end"} xs={6}>
          <IconButton onClick={() => setIsSearch(!isSearch)}>
            <SearchIcon sx={{ cursor: "pointer" }} />
          </IconButton>
        </Grid>
      </Grid>
      {isSearch && (
        <Grid item>
          Szukaj po:
          <Grid item>
            <RadioGroup
              row
              value={searchType}
              onChange={e => setSearchType(e.target.value)}
            >
              <FormControlLabel
                value="name"
                control={<Radio />}
                label="nazwie"
              />
              <FormControlLabel
                value="phrase"
                control={<Radio />}
                label="frazach"
              />
            </RadioGroup>
          </Grid>
          <TextField
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <ListItem
          key={"create-new"}
          disablePadding
          sx={{ backgroundColor: "secondary.main" }}
          onClick={() => selectElement("new")}
        >
          <ListItemButton>
            <ListItemText primary="Dodaj intencję" />
          </ListItemButton>
        </ListItem>
      </Grid>
    </Grid>
  );
};

export default IntentListHeader;
