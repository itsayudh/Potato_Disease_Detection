import { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
// import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress } from "@material-ui/core";
import plogo from "./plogo.png";
import image from "./bg1.png";
import { DropzoneArea } from 'material-ui-dropzone';
import { common } from '@material-ui/core/colors';
import Clear from '@material-ui/icons/Clear';



// 💡 Disease Suggestions Object
const diseaseSuggestions = {
  early_blight: {
    message: `⚠️ Detected: Early Blight

Suggested Action:
- Apply fungicides like Mancozeb or Chlorothalonil.
- Remove affected leaves.
- Avoid overhead watering.
- Rotate crops annually.`,
    link: "https://www.planetnatural.com/pest-problem-solver/plant-disease/early-blight/"
  },
  late_blight: {
    message: `⚠️ Detected: Late Blight

Suggested Action:
- Use fungicides like copper-based sprays.
- Remove and destroy infected plants.
- Avoid high humidity conditions.
- Space plants for air flow.`,
    link: "https://extension.umn.edu/diseases/late-blight"
  },
  healthy: {
    message: `✅ Your potato plant looks healthy! Keep up the good care!`,
    link: null
  }
};



const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(common.white),
    backgroundColor: common.white,
    '&:hover': {
      backgroundColor: '#ffffff7a',
    },
  },
}))(Button);
const axios = require("axios").default;

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  clearButton: {
    width: "-webkit-fill-available",
    borderRadius: "15px",
    padding: "15px 22px",
    color: "#000000a6",
    fontSize: "20px",
    fontWeight: 900,
  },
  root: {
    maxWidth: 345,
    flexGrow: 1,
  },
  media: {
    height: 400,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  gridContainer: {
    justifyContent: "center",
    padding: "4em 1em 0 1em",
  },
  mainContainer: {
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: "93vh",
    marginTop: "8px",
  },
  imageCard: {
    margin: "auto",
    maxWidth: 400,
    height: 500,
    backgroundColor: 'transparent',
    boxShadow: '0px 9px 70px 0px rgb(0 0 0 / 30%) !important',
    borderRadius: '15px',
  },
  imageCardEmpty: {
    height: 'auto',
  },
  noImage: {
    margin: "auto",
    width: 400,
    height: "400 !important",
  },
  input: {
    display: 'none',
  },
  uploadIcon: {
    background: 'white',
  },
  tableContainer: {
    backgroundColor: 'transparent !important',
    boxShadow: 'none !important',
  },
  table: {
    backgroundColor: 'transparent !important',
  },
  tableHead: {
    backgroundColor: 'transparent !important',
  },
  tableRow: {
    backgroundColor: 'transparent !important',
  },
  tableCell: {
    fontSize: '22px',
    backgroundColor: 'transparent !important',
    borderColor: 'transparent !important',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '1px 24px 1px 16px',
  },
  tableCell1: {
    fontSize: '14px',
    backgroundColor: 'transparent !important',
    borderColor: 'transparent !important',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '1px 24px 1px 16px',
  },
  tableBody: {
    backgroundColor: 'transparent !important',
  },
  text: {
    color: 'white !important',
    textAlign: 'center',
  },
  buttonGrid: {
    maxWidth: "416px",
    width: "100%",
  },
  detail: {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  appbar: {
    background: ' #556B2F',
    boxShadow: 'none',
    color: 'white'
  },
  loader: {
    color: '#be6a77 !important',
  }
}));
export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  let confidence = 0;

  const sendFile = async () => {
    if (image) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      console.log("Sending to backend:", process.env.REACT_APP_API_URL);
      let res = await axios({
        method: "post",
        url: process.env.REACT_APP_API_URL,
        data: formData,
      });
      if (res.status === 200) {
        console.log("Backend Response:", res.data); 
        setData(res.data);
      }
      setIsloading(false);
    }
  }
  

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
      return;
    }
    setIsloading(true);
    sendFile();
  }, [preview]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <img
          src={plogo}
          alt="Potato Logo"
          style={{ width: 70, height: 50, marginRight: 10 }}
        />
        <Typography className={classes.title} variant="h6" noWrap>
          Potato Disease Classification
        </Typography>
      </Toolbar>
    </AppBar>
      <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
        <Grid
          className={classes.gridContainer}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
         

          {/* hello */}
           {/* 🖼️ Image / Dropzone / Prediction Table */}
          <Grid item xs={12} md={8}>
            <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ''}`}>
              {image ? (
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={preview}
                    component="img"
                    title="Leaf Preview"
                  />
                </CardActionArea>
              ) : (
                <CardContent className={classes.content}>
                  <DropzoneArea
                    acceptedFiles={['image/*']}
                    dropzoneText={"Drag and drop an image of a potato plant leaf to process"}
                    onChange={onSelectFile}
                  />
                </CardContent>
              )}

              {data && (
                <CardContent className={classes.detail}>
                  <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table size="small" aria-label="prediction table">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Label</strong></TableCell>
                          <TableCell align="right"><strong>Confidence</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{data.class}</TableCell>
                          <TableCell align="right">{confidence}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              )}

              {isLoading && (
                <CardContent className={classes.detail}>
                  <CircularProgress color="secondary" className={classes.loader} />
                  <Typography className={classes.title} variant="h6" noWrap>
                    Processing...
                  </Typography>
                </CardContent>
              )}
            </Card>
          </Grid>

          {/* ✅ Suggestion Box */}
          {data?.class && (
  <Grid item xs={12} md={4}>
    <Card style={{ padding: 16, height: "100%" }}>
      <Typography variant="h6" align="center" gutterBottom>
        📝 Suggestion
      </Typography>

      {(() => {
        const normalizedClass = data.class?.replace(/\s+/g, "_").toLowerCase();
        const suggestion = diseaseSuggestions[normalizedClass];

        if (!suggestion) {
          return (
            <Typography style={{ color: "gray", fontStyle: "italic" }}>
              No suggestion available for this disease.
            </Typography>
          );
        }

        return (
          <>
            <Typography
              style={{
                color: normalizedClass === "healthy" ? "green" : "red",
                fontWeight: "bold",
                whiteSpace: "pre-wrap"
              }}
            >
              {suggestion.message}
            </Typography>

            {suggestion.link && (
              <div style={{ marginTop: 16, textAlign: "center" }}>
                <a
                  href={suggestion.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#3f51b5", fontWeight: "bold", textDecoration: "none" }}
                >
                  🔗 Learn more
                </a>
              </div>
            )}
          </>
        );
      })()}
    </Card>
  </Grid>
)}

          
        


         


          

         



          {data &&
            <Grid item className={classes.buttonGrid} >

              <ColorButton variant="contained" className={classes.clearButton} color="primary" component="span" size="large" onClick={clearData} startIcon={<Clear fontSize="large" />}>
                Clear
              </ColorButton>
            </Grid>}
        </Grid >
      </Container >
    </React.Fragment >
  );
  console.log("Data State:", data);

};
