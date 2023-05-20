import { getActualAgent } from "@/localStorage/locatStorage";
import { Button, Chip, Grid, IconButton, TextField } from "@mui/material";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  useGridApiContext,
} from "@mui/x-data-grid";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

function EditInputCell(props: {
  row: GridRenderCellParams<any, number>;
  entities: Array<{
    value: string;
    synonyms: Array<string>;
    languageCode: string;
  }>;
  setEntities: (
    entities: Array<{
      value: string;
      synonyms: Array<string>;
      languageCode: string;
    }>
  ) => void;
}) {
  const { row, entities, setEntities } = props;
  if (!Array.isArray(row.value)) return;
  const apiRef = useGridApiContext();
  const [newValue, setNewValue] = useState("");

  const handleChange = () => {
    apiRef.current.setEditCellValue({
      id: row.id,
      field: row.field,
      value: [...row.value, newValue],
    });
    let tempEntities = entities;
    tempEntities[row.id].synonyms.push(newValue);
    setEntities([...tempEntities]);
  };

  const handleRef = (element: HTMLDivElement) => {
    if (element) {
      const input =
        element.querySelector<HTMLInputElement>(`input[type="text"]`);
      input?.focus();
    }
  };

  return (
    <Grid container py={1}>
      {row.value.map((synonym: string) => {
        return (
          <Grid key={`${row.id}-synonymGrid-${synonym}`} item my={1} mr={1}>
            <Chip key={`${row.id}-synonym-${synonym}`} label={synonym} />
          </Grid>
        );
      })}
      <Grid item my={1} mr={1}>
        <TextField
          ref={handleRef}
          size="small"
          variant="standard"
          value={newValue}
          onChange={e => setNewValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") handleChange();
          }}
        />
      </Grid>
    </Grid>
  );
}

const EntityEditorContainer = (props: { entity: string | undefined }) => {
  const { entity } = props;
  const [name, setName] = useState("");
  const [entities, setEntities] = useState<
    Array<{ value: string; synonyms: Array<string>; languageCode: string }>
  >([{ value: "", synonyms: [], languageCode: "pl" }]);

  useEffect(() => {
    if (entity) {
      fetch(`/api/entity/${entity}`)
        .then(data => data.json())
        .then(data => {
          setName(data.displayName);
          setEntities([
            ...data.entities,
            { value: "", synonyms: [], languageCode: "pl" },
          ]);
          console.log(data.trainingPhrases);
        });
    }
  }, [entity]);

  useEffect(() => {
    if (
      entities.length > 0 &&
      entities[entities.length - 1].synonyms.length > 0
    ) {
      setEntities(prevEntities => [
        ...prevEntities,
        { value: "", synonyms: [], languageCode: "pl" },
      ]);
    }
  }, [entities]);

  const changeName = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setName(event.target.value);
  };

  const saveEntityType = () => {
    const agent = getActualAgent();
    fetch(`/api/entity/${entity}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: name,
        entities: entities.filter(
          entity => entity.value && entity.synonyms.length > 0
        ),
        agent,
      }),
    })
      .then(data => data.json())
      .then(data => {
        setName(data.displayName);
        setEntities(data.entities);
        console.log(data.trainingPhrases);
      });
  };

  const removeEntityType = () => {
    fetch(`/api/entity/${entity}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }).then(data => data.json());
  };

  const removeSynonym = (entityIndex: number, synonymIndex: number) => {
    let tempEntities = entities;
    tempEntities[entityIndex].synonyms.splice(synonymIndex, 1);
    setEntities([...tempEntities]);
  };

  const removeEntity = (entityIndex: number) => {
    let tempEntities = entities;
    tempEntities.splice(entityIndex, 1);
    setEntities([...tempEntities]);
  };

  const renderEditInputCell: GridColDef["renderCell"] = params => {
    return (
      <EditInputCell
        row={params}
        entities={entities}
        setEntities={setEntities}
      />
    );
  };

  const columnsEntity: GridColDef[] = [
    {
      field: "entity",
      headerName: "Encje",
      editable: true,
      valueSetter(params) {
        const tempEntities = entities;
        tempEntities[params.row.id].value = params.value;
        setEntities([...tempEntities]);
        return { ...params.row };
      },
      flex: 3,
    },
    {
      field: "synonyms",
      headerName: "Synonimy",
      editable: true,
      renderCell: (row: GridCellParams) => {
        if (Array.isArray(row.value))
          return (
            <Grid container py={1}>
              {row.value.map((synonym, index) => {
                return (
                  <Grid
                    key={`${row.id}-synonymGrid-${synonym}`}
                    item
                    my={1}
                    mr={1}
                  >
                    <Chip
                      key={`${row.id}-synonym-${synonym}`}
                      label={synonym}
                      onDelete={() => removeSynonym(row.id as number, index)}
                    />
                  </Grid>
                );
              })}
            </Grid>
          );
      },
      renderEditCell: row => renderEditInputCell(row),
      flex: 10,
    },
    {
      field: "action",
      headerName: "",
      sortable: false,
      renderCell: (row: GridCellParams) => {
        return (
          <IconButton
            onClick={() => {
              removeEntity(row.id as number);
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
            <Button variant="contained" sx={{ mx: 1 }} onClick={saveEntityType}>
              Zapisz
            </Button>
            <Button
              variant="contained"
              sx={{ mx: 1 }}
              onClick={removeEntityType}
            >
              Usuń
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <h3>Encje</h3>
        {entities && (
          <DataGrid
            columns={columnsEntity}
            autoHeight
            rowSelection={false}
            getRowId={r => r.id}
            getRowHeight={() => "auto"}
            pageSizeOptions={[]}
            rows={entities.map((entity, index) => {
              return {
                id: index,
                entity: entity.value,
                synonyms: entity.synonyms,
              };
            })}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default EntityEditorContainer;
