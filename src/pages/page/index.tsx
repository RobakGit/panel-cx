import EntityEditorContainer from "@/components/entity/entityEditorContainer";
import FlowEditorContainer from "@/components/flow/flowEditorContainer";
import EntityListHeader from "@/components/navigation/header/entityListHeader";
import FlowListHeader from "@/components/navigation/header/flowListHeader";
import SideNavigationListContainer from "@/components/navigation/sideNavigationList/sideNavigationListContainer";
import PageEditorContainer from "@/components/page/pageEditorContainer";
import { getActualAgent } from "@/localStorage/locatStorage";
import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const { page, flow } = router.query;

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
        HeaderElement={<FlowListHeader />}
        listElements={pagesOnFlow}
        dropdownKey="page"
        dropdownParentKey="flow"
        type="page"
        parentType="flow"
        selected={flow?.toString() || page?.toString()}
        newElementText={"Dodaj page"}
      />
      <Grid item xs={10} sx={{ height: "100%", overflowY: "auto" }}>
        {page ? (
          <PageEditorContainer
            page={page?.toString()}
            flow={flow?.toString()}
            pagesOnFlow={pagesOnFlow}
          />
        ) : (
          <FlowEditorContainer
            flow={flow?.toString()}
            pagesOnFlow={pagesOnFlow}
          />
        )}
      </Grid>
    </Grid>
  );
}
