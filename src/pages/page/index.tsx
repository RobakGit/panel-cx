import EntityEditorContainer from "@/components/entity/entityEditorContainer";
import EntityListHeader from "@/components/navigation/header/entityListHeader";
import SideNavigationListContainer from "@/components/navigation/sideNavigationList/sideNavigationListContainer";
import PageEditorContainer from "@/components/page/pageEditorContainer";
import { getActualAgent } from "@/localStorage/locatStorage";
import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const { page } = router.query;

  const [pagesOnFlow, setPagesOnFlow] = useState<
    Array<{
      displayName: string;
      uid: string;
      page: Array<{ displayName: string; uid: string }>;
    }>
  >([]);

  useEffect(() => {
    const agent = getActualAgent();
    fetch("/api/flow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent }),
    })
      .then(data => data.json())
      .then(data => {
        setPagesOnFlow(data);
      });
  }, []);

  return (
    <Grid container direction={"row"} sx={{ height: "100%" }}>
      <SideNavigationListContainer
        listElements={pagesOnFlow}
        dropdownKey="page"
        type="page"
        selected={page?.toString()}
      />
      <Grid item xs={10} sx={{ height: "100%", overflowY: "auto" }}>
        <PageEditorContainer
          page={page?.toString()}
          pagesOnFlow={pagesOnFlow}
        />
      </Grid>
    </Grid>
  );
}
