import IntentEditorContainer from "@/components/intent/IntentEditorContainer";
import SideNavigationListContainer from "@/components/navigation/sideNavigationList/sideNavigationListContainer";
import { getActualAgent } from "@/localStorage/locatStorage";
import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

const IntentListHeader = () => {
  return (
    <Grid container direction={"row"} p={2}>
      <Grid item xs={6}>
        <b>Intencje</b>
      </Grid>
      <Grid item display={"flex"} justifyContent={"flex-end"} xs={6}>
        <SearchIcon sx={{ cursor: "pointer" }} />
      </Grid>
    </Grid>
  );
};

export default function Intent() {
  const router = useRouter();
  const [intents, setIntents] = useState<
    Array<{ displayName: string; uid: string }>
  >([]);
  const { intent } = router.query;

  useEffect(() => {
    const agent = getActualAgent();
    fetch("/api/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent }),
    })
      .then(data => data.json())
      .then(data => setIntents(data));
  }, []);

  return (
    <Grid container direction={"row"} sx={{ height: "100%" }}>
      <SideNavigationListContainer
        HeaderElement={IntentListHeader}
        listElements={intents}
        type="intent"
        selected={intent?.toString()}
      />
      <Grid item xs={10} sx={{ height: "100%", overflowY: "auto" }}>
        <IntentEditorContainer intent={intent?.toString()} />
      </Grid>
    </Grid>
  );
}
