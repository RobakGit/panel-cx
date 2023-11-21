import { useState } from "react";
import { AppBar, Box, Dialog, DialogContent } from "@mui/material";
import InvertedMuiButton from "../buttons/invertedMuiButton";
import ImportPopUp from "../popups/importPopUp";
import ExportPopUp from "../popups/exportPopUp";

const HeaderContainer = (props: { headerHeight: number }) => {
  const { headerHeight } = props;
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const openImportPopUp = () => {
    setIsImportOpen(true);
  };

  const closeImportPopUp = () => {
    setIsImportOpen(false);
  };

  const openExportPopUp = () => {
    setIsExportOpen(true);
  };

  const closeExportPopUp = () => {
    setIsExportOpen(false);
  };

  return (
    <AppBar sx={{ height: headerHeight }} color="primary">
      <Box display={"flex"} flexDirection={"row-reverse"} p={2}>
        <InvertedMuiButton
          sx={{ mx: 1 }}
          size="small"
          text="Eksportuj"
          onClick={openExportPopUp}
        />
        <InvertedMuiButton
          sx={{ mx: 1 }}
          size="small"
          text="Importuj"
          onClick={openImportPopUp}
        />
      </Box>
      <ImportPopUp
        isImportOpen={isImportOpen}
        closeImportPopUp={closeImportPopUp}
      />
      <ExportPopUp
        isImportOpen={isExportOpen}
        closeExportPopUp={closeExportPopUp}
      />
    </AppBar>
  );
};

export default HeaderContainer;
