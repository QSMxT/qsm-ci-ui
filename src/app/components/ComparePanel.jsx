import React from "react";
import { Box } from "@mui/material";
import { Niivue } from "@niivue/niivue";
import { NiivuePanel } from "./NiivuePanel";
import Parse from "parse/dist/parse.min.js";

const nv1 = new Niivue({
  loadingText: "Loading",
  dragAndDropEnabled: true,
  textHeight: "0.02",
  backColor: [0, 0, 0, 1],
  crosshairColor: [244, 243, 238, 0.5],
});

const nv2 = new Niivue({
  loadingText: "Loading",
  dragAndDropEnabled: true,
  textHeight: "0.02",
  backColor: [0, 0, 0, 1],
  crosshairColor: [244, 243, 238, 0.5],
});

// The NiiVue component wraps all other components in the UI.
// It is exported so that it can be used in other projects easily
export default function ComparePanel() {
  const [[url1, elo1], setUrl1] = React.useState([]);
  const [[url2, elo2], setUrl2] = React.useState([]);
  const [picked, setPick] = React.useState(true);

  React.useEffect(() => {
    if (!picked) return;
    if (url1 !== undefined && url2 !== undefined) {
      nv1.removeVolumeByUrl(url1);
      nv2.removeVolumeByUrl(url2);
    }
    retrieveTwo();
    // eslint-disable-next-line
  }, [picked]);
  // Initialize Parse
  Parse.initialize(
    process.env.REACT_APP_APPLICATION_ID,
    process.env.REACT_APP_APPLICATION_KEY
  );
  Parse.serverURL = "https://parseapi.back4app.com/";

  async function retrieveTwo() {
    await Parse.Cloud.run("retrieveTwo").then(async (twoImages) => {
      setUrl1([twoImages.url1, twoImages.elo1]);
      await nv1.addVolumeFromUrl({ url: twoImages.url1 });
      setUrl2([twoImages.url2, twoImages.elo2]);
      await nv2.addVolumeFromUrl({ url: twoImages.url2 });
    });
    setPick(false);
  }

  function syncImages() {
    if (nv1.isLoaded && nv2.isLoaded) {
      nv1.broadcastTo(nv2);
      nv2.broadcastTo(nv1);
    }
  }

  nv1.onImageLoaded = () => {
    nv1.isLoaded = true;
    syncImages();
  };

  nv2.onImageLoaded = () => {
    nv2.isLoaded = true;
    syncImages();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100%",
        justifyContent: "space-around",
      }}
    >
      <div style={{ width: "50%" }}>
        <NiivuePanel
          nv={nv1}
          winner={[url1, elo1]}
          loser={[url2, elo2]}
          pick={picked}
          setPick={setPick}
        ></NiivuePanel>
      </div>
      <div style={{ width: "50%" }}>
        <NiivuePanel
          nv={nv2}
          winner={[url2, elo2]}
          loser={[url1, elo1]}
          pick={picked}
          setPick={setPick}
        ></NiivuePanel>
      </div>
    </Box>
  );
}
