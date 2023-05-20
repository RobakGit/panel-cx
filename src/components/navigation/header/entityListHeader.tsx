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

const EntityListHeader = (props: {
  searchValue: string;
  setSearchValue: (value: string) => void;
  searchType: string;
  setSearchType: (value: string) => void;
}) => {
  const { searchValue, setSearchValue, searchType, setSearchType } = props;
  const [isSearch, setIsSearch] = useState(false);

  const router = useRouter();

  const selectElement = () => {
    delete router.query["entity"];
    router.push(router);
  };

  return (
    <Grid container>
      <Grid item container direction={"row"} p={2}>
        <Grid item xs={6}>
          <b>Encje</b>
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
                value="synonym"
                control={<Radio />}
                label="synonimie"
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
          onClick={() => selectElement()}
        >
          <ListItemButton>
            <ListItemText primary="Dodaj Encję" />
          </ListItemButton>
        </ListItem>
      </Grid>
    </Grid>
  );
};

export default EntityListHeader;
