import { Chip, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Image from "next/image";

const ImageEditor = (props: {
  index: number;
  imageData: { rawUrl: string; accessibilityText: string };
  editImage: (imageData: { rawUrl: string; accessibilityText: string }) => void;
}) => {
  const { index, imageData, editImage } = props;
  const [rawUrl, setRawUrl] = useState(imageData.rawUrl);
  const [accessibilityText, setAccessibilityText] = useState(
    imageData.accessibilityText
  );

  const saveImage = () => {
    editImage({ rawUrl, accessibilityText });
  };

  return (
    <Grid
      item
      display={"flex"}
      flexDirection={"column"}
      bgcolor={"primary.contrastText"}
      m={1}
      p={2}
      borderRadius={2}
      boxShadow={1}
      alignItems={"center"}
    >
      <b>{index}-imageRich- </b>
      {rawUrl.match(/^(https:\/\/)./) && (
        <Image src={rawUrl} alt={accessibilityText} width={300} height={200} />
      )}
      <TextField
        fullWidth
        label="url"
        value={rawUrl}
        onChange={event => setRawUrl(event.target.value)}
        onBlur={saveImage}
      />
      <TextField
        fullWidth
        label="accessibilityText"
        value={accessibilityText}
        onChange={event => setAccessibilityText(event.target.value)}
        onBlur={saveImage}
      />
    </Grid>
  );
};

export default ImageEditor;
