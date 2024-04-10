import React from "react";
import { Box, Button } from "@mui/material";
import RangeSlider from "./Slider";
import Parse from "parse/dist/parse.min.js";

export function NiivuePanel(props) {
  const canvas = React.useRef(null);

  React.useEffect(() => {
    async function fetchData() {
      const nv = props.nv;
      nv.attachToCanvas(canvas.current);
    }
    fetchData();
  });

  const run = async function (winner, loser) {
    await server(winner, loser);
  };

  const server = async function (winner, loser) {
    Parse.initialize(
      process.env.REACT_APP_APPLICATION_ID,
      process.env.REACT_APP_APPLICATION_KEY
    );
    Parse.serverURL = "https://parseapi.back4app.com/";
    const params = { winner: winner, loser: loser };
    await Parse.Cloud.run("elo", params).then((result) => {
      props.setPick(true);
    });
  };

  function setImageElo() {
    run(props.winner, props.loser);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "auto",
        height: "70%",
        padding: "50px",
        justifyContent: "center",
      }}
    >
      <RangeSlider nv={props.nv} pick={props.pick} />
      <canvas ref={canvas} height={480} width={640} />
      {!props.setView ? (
        <Button
          variant="contained"
          style={{ justifyContent: "center", marginTop: "30px" }}
          onClick={setImageElo}
        >
          Pick
        </Button>
      ) : (
        <></>
      )}
    </Box>
  );
}
