import {
  Dialog,
  DialogContent,
  TextField,
  Tooltip,
  List,
  ListItem,
  InputAdornment,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { Portal } from "@mui/base";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ChangeEvent, useState } from "react";
import { getActualAgent } from "@/localStorage/locatStorage";

const ExportPopUp = (props: {
  isImportOpen: boolean;
  closeExportPopUp: () => void;
}) => {
  const { isImportOpen, closeExportPopUp } = props;

  const [agentName, setAgentName] = useState("");
  const [agentDisplayName, setAgentDisplayName] = useState("");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [requestStatus, setRequestStatus] = useState<"success" | "error">();
  const [alertMessage, setAllertMessage] = useState("");

  const exportAgent = () => {
    const agent = getActualAgent();
    console.log(agent);
    if (agent) {
      fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent }),
      })
        .then(response => {
          if (!response.ok) {
            setRequestStatus("error");
          } else {
            setRequestStatus("success");
            closeExportPopUp();
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          setAllertMessage(data.responseMessage);
          setIsSnackbarOpen(true);
        });
    }
  };

  const closeSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  return (
    <>
      <Dialog
        fullWidth
        sx={{ textAlign: "center" }}
        maxWidth="md"
        open={isImportOpen}
        onClose={closeExportPopUp}
      >
        <DialogContent
          sx={{
            pt: 8,
            px: { xs: 8, sm: 15 },
            position: "relative",
          }}
        >
          <List>
            <ListItem
              sx={{ display: "flex", justifyContent: "center" }}
            ></ListItem>
            <ListItem sx={{ display: "flex", justifyContent: "right" }}>
              <Button variant="contained" sx={{ m: 2 }} onClick={exportAgent}>
                Eksportuj do Dialogflow
              </Button>
              <Button
                variant="contained"
                sx={{ m: 2 }}
                onClick={closeExportPopUp}
              >
                Anuluj
              </Button>
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
      <Portal>
        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={6000}
          onClose={closeSnackbar}
        >
          <Alert
            onClose={closeSnackbar}
            severity={requestStatus}
            sx={{ width: "100%" }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </Portal>
    </>
  );
};

export default ExportPopUp;
