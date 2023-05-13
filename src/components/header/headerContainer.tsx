import { useState } from "react";
import { AppBar, Box, Dialog, DialogContent } from "@mui/material";
import InvertedMuiButton from "../buttons/invertedMuiButton";
import ImportPopUp from "../popups/importPopUp";

const HeaderContainer = (props: {}) => {
  const [isImportOpen, setIsImportOpen] = useState(false);

  const openImportPopUp = () => {
    setIsImportOpen(true);
  };

  const closeImportPopUp = () => {
    setIsImportOpen(false);
  };

  return (
    <AppBar color="primary">
      <Box display={"flex"} flexDirection={"row-reverse"} p={2}>
        <InvertedMuiButton sx={{ mx: 1 }} size="small" text="Eksportuj" />
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
    </AppBar>
  );
};

export default HeaderContainer;
