import EntityEditorContainer from "@/components/entity/entityEditorContainer";
import EntityListHeader from "@/components/navigation/header/entityListHeader";
import SideNavigationListContainer from "@/components/navigation/sideNavigationList/sideNavigationListContainer";
import { getActualAgent } from "@/localStorage/locatStorage";
import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Entity() {
  const router = useRouter();
  const { entity } = router.query;

  const [entities, setEntities] = useState<
    Array<{ displayName: string; uid: string }>
  >([]);
  const [filteredEntities, setFilteredEntities] = useState<
    Array<{ displayName: string; uid: string }>
  >([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("name");

  useEffect(() => {
    const agent = getActualAgent();
    fetch("/api/entity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent }),
    })
      .then(data => data.json())
      .then(data => {
        if (Array.isArray(data)) setEntities(data);
      });
  }, []);

  useEffect(() => {
    if (searchType === "name") {
      setFilteredEntities([
        ...entities.filter(el =>
          el.displayName.toLowerCase().match(searchValue.toLowerCase())
        ),
      ]);
    } else {
      const agent = getActualAgent();
      fetch("/api/entity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent, searchValue }),
      })
        .then(data => data.json())
        .then(data => {
          setFilteredEntities(data);
        });
    }
  }, [searchType, searchValue, entities]);

  return (
    <Grid container direction={"row"} sx={{ height: "100%" }}>
      <SideNavigationListContainer
        HeaderElement={
          <EntityListHeader
            searchType={searchType}
            searchValue={searchValue}
            setSearchType={setSearchType}
            setSearchValue={setSearchValue}
          />
        }
        listElements={filteredEntities}
        type="entity"
        selected={entity?.toString()}
      />
      <Grid item xs={10} sx={{ height: "100%", overflowY: "auto" }}>
        <EntityEditorContainer entity={entity?.toString()} />
      </Grid>
    </Grid>
  );
}
