import Popup from "reactjs-popup";
import React from "react";
import "../../index.css";
import { NiivuePanel } from "./NiivuePanel";
import { Niivue } from "@niivue/niivue";

export default function PopupViewer({ algo, url }) {
  const nv = new Niivue({
    loadingText: "Loading",
    dragAndDropEnabled: true,
    textHeight: "0.02",
    backColor: [0, 0, 0, 1],
    crosshairColor: [244, 243, 238, 0.5],
  });

  React.useEffect(() => {
    async function loadImage(url) {
      await nv
        .addVolumeFromUrl({ url: url, colormap: "gray" })
        .catch((error) => {
          console.log(error);
        });
    }
    loadImage(url);
  }, [url, nv]);

  return (
    <Popup trigger={<button className="button"> View </button>} modal>
      {(close) => (
        <div className="modal">
          <button className="close" onClick={close}>
            &times;
          </button>
          <div className="header"> {algo} </div>
          <div className="content">
            <NiivuePanel nv={nv} setView={true}></NiivuePanel>
          </div>
        </div>
      )}
    </Popup>
  );
}
