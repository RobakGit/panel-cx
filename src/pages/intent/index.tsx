import IntentEditorContainer from "@/components/intent/IntentEditorContainer";
import SideNavigationListContainer from "@/components/navigation/sideNavigationList/sideNavigationListContainer";
import { getActualAgent } from "@/localStorage/locatStorage";
import {
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

const IntentListHeader = (props: {
  searchValue: string;
  setSearchValue: (value: string) => void;
  searchType: string;
  setSearchType: (value: string) => void;
}) => {
  const { searchValue, setSearchValue, searchType, setSearchType } = props;
  const [isSearch, setIsSearch] = useState(false);
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
    </Grid>
  );
};

export default function Intent() {
  const router = useRouter();
  const { intent } = router.query;

  const [intents, setIntents] = useState<
    Array<{ displayName: string; uid: string }>
  >([]);
  const [filteredIntents, setFilteredIntents] = useState<
    Array<{ displayName: string; uid: string }>
  >([]);
  const [searchType, setSearchType] = useState("name");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const agent = getActualAgent();
    fetch("/api/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent }),
    })
      .then(data => data.json())
      .then(data => {
        setFilteredIntents(data);
        setIntents(data);
      });
  }, []);

  useEffect(() => {
    if (searchType === "name") {
      setFilteredIntents([
        ...intents.filter(el =>
          el.displayName.toLowerCase().match(searchValue.toLowerCase())
        ),
      ]);
    } else {
      const agent = getActualAgent();
      fetch("/api/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent, searchValue }),
      })
        .then(data => data.json())
        .then(data => {
          setFilteredIntents(data);
        });
    }
  }, [searchType, searchValue, intents]);

  return (
    <Grid container direction={"row"} sx={{ height: "100%" }}>
      <SideNavigationListContainer
        HeaderElement={
          <IntentListHeader
            searchType={searchType}
            searchValue={searchValue}
            setSearchType={setSearchType}
            setSearchValue={setSearchValue}
          />
        }
        listElements={filteredIntents}
        type="intent"
        selected={intent?.toString()}
      />
      <Grid item xs={10} sx={{ height: "100%", overflowY: "auto" }}>
        <IntentEditorContainer intent={intent?.toString()} />
      </Grid>
    </Grid>
  );
}
