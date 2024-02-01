import IntentEditorContainer from "@/components/intent/IntentEditorContainer";
import IntentListHeader from "@/components/navigation/header/intentListHeader";
import SideNavigationListContainer from "@/components/navigation/sideNavigationList/sideNavigationListContainer";
import { getActualAgent } from "@/localStorage/locatStorage";
import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
        if (Array.isArray(data)) {
          setFilteredIntents(data);
          setIntents(data);
        }
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
