import { getActualAgent } from "@/localStorage/locatStorage";
import { Button, Grid, IconButton, TextField } from "@mui/material";
import {
  DataGrid,
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridColDef,
  GridRenderEditCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import HTMLReactParser from "html-react-parser";
import CellEditor from "./cellEditor/cellEditor";
import stc from "string-to-color";

const IntentEditorContainer = (props: { intent: string | undefined }) => {
  const { intent } = props;
  const [name, setName] = useState("");
  const [trainingPhrases, setTrainingPhrases] = useState<
    Array<
      Array<{
        auto: boolean;
        text: string;
        parameterId?: string;
      }>
    >
  >([]);
  const [entities, setEntities] = useState<
    Array<{ id: string; entityType: string }>
  >([]);
  const [phrase, setPhrase] = useState("");
  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});

  useEffect(() => {
    if (intent) {
      fetch(`/api/intent/${intent}`)
        .then(data => data.json())
        .then(data => {
          setName(data.displayName);
          setTrainingPhrases(
            data.trainingPhrases?.map(
              (trainingPhrase: {
                parts: Array<{
                  auto: boolean;
                  text: string;
                  parameterId?: string;
                }>;
              }) => trainingPhrase?.parts
              // }) => trainingPhrase?.parts.map(part => part.text).join("")
            )
          );
          setEntities(
            data.parameters.map(
              (parameter: { id: string; entityType: string }) => {
                return { id: parameter.id, entityType: parameter.entityType };
              }
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
      setTrainingPhrases([
        ...trainingPhrases,
        ...phrase.split(/\n/).map(p => {
          return [{ auto: true, text: p }];
        }),
      ]);
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
              trainingPhrase?.parts.map(part => part)
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

  const handleCellClick = useCallback(
    (params: GridCellParams, event: React.MouseEvent) => {
      if (!params.isEditable) {
        return;
      }

      // Ignore portal
      if (
        (event.target as any).nodeType === 1 &&
        !event.currentTarget.contains(event.target as Element)
      ) {
        return;
      }

      setCellModesModel(prevModel => {
        return {
          // Revert the mode of the other cells from other rows
          ...Object.keys(prevModel).reduce(
            (acc, id) => ({
              ...acc,
              [id]: Object.keys(prevModel[id]).reduce(
                (acc2, field) => ({
                  ...acc2,
                  [field]: { mode: GridCellModes.View },
                }),
                {}
              ),
            }),
            {}
          ),
          [params.id]: {
            // Revert the mode of other cells in the same row
            ...Object.keys(prevModel[params.id] || {}).reduce(
              (acc, field) => ({
                ...acc,
                [field]: { mode: GridCellModes.View },
              }),
              {}
            ),
            [params.field]: { mode: GridCellModes.Edit },
          },
        };
      });
    },
    []
  );

  const handleCellModesModelChange = useCallback(
    (newModel: GridCellModesModel) => {
      setCellModesModel(newModel);
    },
    []
  );

  const columns: GridColDef[] = [
    {
      field: "phrase",
      headerName: "Fraza",
      editable: true,
      flex: 10,
      renderEditCell(row: GridRenderEditCellParams) {
        return (
          <CellEditor
            parameters={row.row.parameters}
            entities={entities}
            editMessage={(val, param) => {
              console.log("edit", val, param);
              console.log("pohras", trainingPhrases);
              const newPhrases = trainingPhrases;
              newPhrases[row.id] = param;
              setTrainingPhrases(newPhrases);
            }}
          />
        );
      },
      valueGetter: (params: GridValueGetterParams) => {
        return params.value.map(phrase => phrase.text).join("");
      },
      renderCell: (row: GridCellParams) => {
        return HTMLReactParser(`<p>
          ${row.row.phrase
            .map(phrase => {
              let text = "";
              if (phrase.parameterId) {
                text = `<mark data-parameter="${
                  phrase.parameterId
                }" style="background-color: ${stc(phrase.parameterId)}33">${
                  phrase.text
                }</mark>`;
              } else {
                text = phrase.text;
              }
              return text;
            })
            .join("")}</p>
        `);
      },
      valueSetter(params) {
        return {
          id: params.row.id,
          parameters: params.row.phrase,
        };
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
            rowSelection={false}
            columnHeaderHeight={0}
            cellModesModel={cellModesModel}
            onCellModesModelChange={handleCellModesModelChange}
            onCellClick={handleCellClick}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[10, 25, 100]}
            rows={trainingPhrases
              .map((trainingPhrase, index) => {
                return {
                  id: index,
                  phrase: trainingPhrase,
                };
              })
              .reverse()}
            onProcessRowUpdateError={error => console.log("UPERR:", error)}
            processRowUpdate={(newRow, oldRow) => {
              return newRow;
            }}
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
            rowSelection={false}
            columnHeaderHeight={0}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[10, 25, 100]}
            rows={entities
              .map((entity, index) => {
                return {
                  id: index,
                  entity: entity.entityType,
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
