import { getActualAgent } from "@/localStorage/locatStorage";
import { Button, Grid, IconButton, TextField } from "@mui/material";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

const IntentEditorContainer = (props: { intent: string | undefined }) => {
  const { intent } = props;
  const [name, setName] = useState("");
  const [trainingPhrases, setTrainingPhrases] = useState<Array<string>>([]);
  const [entities, setEntities] = useState<Array<string>>([]);
  const [phrase, setPhrase] = useState("");

  useEffect(() => {
    if (intent) {
      fetch(`/api/intent/${intent}`)
        .then(data => data.json())
        .then(data => {
          setName(data.displayName);
          setTrainingPhrases(
            data.trainingPhrases?.map(
              (trainingPhrase: { parts: Array<{ text: string }> }) =>
                trainingPhrase?.parts.map(part => part.text).join("")
            )
          );
          setEntities(
            data.parameters.map(
              (parameter: { id: string; entityType: string }) =>
                parameter.entityType
            )
          );
          console.log(data.trainingPhrases);
        });
    }
  }, [intent]);

  const changeName = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setName(event.target.value);
  };

  const changePhrase = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPhrase(event.target.value);
  };

  const removePhrase = (index: number) => {
    console.log(index);
    let newPhrases = trainingPhrases;
    newPhrases.splice(index, 1);
    setTrainingPhrases([...newPhrases]);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      setTrainingPhrases([...trainingPhrases, ...phrase.split(/\n/)]);
      setPhrase("");
      event.preventDefault();
    }
  };

  const saveIntent = () => {
    const agent = getActualAgent();
    fetch(`/api/intent/${intent}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: name, trainingPhrases, agent }),
    })
      .then(data => data.json())
      .then(data => {
        setName(data.displayName);
        setTrainingPhrases(
          data.trainingPhrases?.map(
            (trainingPhrase: { parts: Array<{ text: string }> }) =>
              trainingPhrase?.parts.map(part => part.text).join("")
          )
        );
        console.log(data.trainingPhrases);
      });
  };

  const removeIntent = () => {
    fetch(`/api/intent/${intent}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then(data => data.json())
      .then(data => {});
  };

  const columns: GridColDef[] = [
    {
      field: "text",
      headerName: "Fraza",
      editable: true,
      flex: 10,
      valueSetter(params) {
        const tempPhrases = trainingPhrases;
        tempPhrases[params.row.id] = params.value;
        setTrainingPhrases([...tempPhrases]);
        return { ...params.row };
      },
    },
    {
      field: "action",
      headerName: "Akcja",
      sortable: false,
      renderCell: (row: GridCellParams) => {
        return (
          <IconButton
            onClick={() => {
              removePhrase(row.id as number);
            }}
          >
            <HighlightOffOutlinedIcon />
          </IconButton>
        );
      },
      flex: 1,
    },
  ];

  const columnsEntity: GridColDef[] = [
    {
      field: "entity",
      headerName: "Entities",
      flex: 10,
    },
    {
      field: "action",
      headerName: "Akcja",
      sortable: false,
      renderCell: (row: GridCellParams) => {
        return (
          <IconButton
            onClick={() => {
              // removePhrase(row.id as number);
            }}
          >
            <HighlightOffOutlinedIcon />
          </IconButton>
        );
      },
      flex: 1,
    },
  ];

  return (
    <Grid
      container
      direction={"column"}
      justifyContent={"center"}
      p={4}
      spacing={4}
    >
      <Grid item container direction={"row"}>
        <Grid item xs={8}>
          <TextField
            required
            label="Nazwa intencji"
            fullWidth
            value={name}
            onChange={changeName}
          />
        </Grid>
        <Grid item container xs={4} direction={"row-reverse"}>
          <Grid>
            <Button variant="contained" sx={{ mx: 1 }} onClick={saveIntent}>
              Zapisz
            </Button>
            <Button variant="contained" sx={{ mx: 1 }} onClick={removeIntent}>
              Usuń
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <TextField
          fullWidth
          multiline
          rows={4}
          label={"Frazy treningowe"}
          placeholder="Wpisz frazę. Możesz oddzielać frazy wciskając shift + enter."
          value={phrase}
          onChange={changePhrase}
          onKeyDown={handleKeyPress}
        />
      </Grid>

      <Grid item>
        <h3>Frazy treningowe</h3>
        {trainingPhrases && trainingPhrases.length > 0 && (
          <DataGrid
            columns={columns}
            autoHeight
            getRowId={r => r.id}
            columnHeaderHeight={0}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[10, 25, 100]}
            rows={trainingPhrases
              .map((trainingPhrase, index) => {
                return {
                  id: index,
                  text: trainingPhrase,
                };
              })
              .reverse()}
          />
        )}
      </Grid>

      <Grid item>
        <h3>Encje</h3>
        {entities && entities.length > 0 && (
          <DataGrid
            columns={columnsEntity}
            autoHeight
            getRowId={r => r.id}
            columnHeaderHeight={0}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[10, 25, 100]}
            rows={entities
              .map((entity, index) => {
                return {
                  id: index,
                  entity: entity,
                };
              })
              .reverse()}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default IntentEditorContainer;
