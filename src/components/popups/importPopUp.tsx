import {
  Dialog,
  DialogContent,
  TextField,
  Tooltip,
  Icon,
  List,
  ListItem,
  ListItemAvatar,
  InputAdornment,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { Portal } from "@mui/base";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useState } from "react";

const ImportPopUp = (props: {
  isImportOpen: boolean;
  closeImportPopUp: () => void;
}) => {
  const { isImportOpen, closeImportPopUp } = props;

  const [agentName, setAgentName] = useState("");
  const [agentDisplayName, setAgentDisplayName] = useState("");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [requestStatus, setRequestStatus] = useState<"success" | "error">();
  const [alertMessage, setAllertMessage] = useState("");

  const importAgent = () => {
    fetch("/api/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentName, agentDisplayName }),
    })
      .then(response => {
        if (!response.ok) {
          setRequestStatus("error");
        } else {
          setRequestStatus("success");
          closeImportPopUp();
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setAllertMessage(data.responseMessage);
        setIsSnackbarOpen(true);
      });
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
        onClose={closeImportPopUp}
      >
        <DialogContent
          sx={{
            pt: 8,
            px: { xs: 8, sm: 15 },
            position: "relative",
          }}
        >
          <List>
            <ListItem sx={{ display: "flex", justifyContent: "center" }}>
              <TextField
                required
                label="Nazwa agenta z dialogflow"
                variant="standard"
                fullWidth
                value={agentName}
                onChange={e => setAgentName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tooltip
                        sx={{ cursor: "help" }}
                        title="Wybierz projekt na dialogflow, następnie przy wyborze agenta kliknij trzy kropki z rozwijanym menu i skopiuj nazwę"
                      >
                        <InfoOutlinedIcon color="primary" />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </ListItem>
            <ListItem sx={{ display: "flex", justifyContent: "center" }}>
              <TextField
                required
                label="Nazwa własna agenta"
                variant="standard"
                fullWidth
                value={agentDisplayName}
                onChange={e => setAgentDisplayName(e.target.value)}
              />
            </ListItem>
            <ListItem sx={{ display: "flex", justifyContent: "right" }}>
              <Button variant="contained" sx={{ m: 2 }} onClick={importAgent}>
                Importuj
              </Button>
              <Button
                variant="contained"
                sx={{ m: 2 }}
                onClick={closeImportPopUp}
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

export default ImportPopUp;