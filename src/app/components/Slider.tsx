import React from "react";
import { Slider } from "antd";

interface SliderProps {
  nv: any;
  pick: boolean;
}

interface SliderRange {
  defaultRange: number[];
  increment: number;
}

export default function RangeSlider({ nv, pick }: SliderProps) {
  let sliderRange: SliderRange = {
    defaultRange: [-0.2, 0.2],
    increment: 0.01,
  };
  const { increment, defaultRange } = sliderRange;
  const [range, setRange] = React.useState(defaultRange);
  const LOADING_TIMEOUT = 10000;

  async function waitUntilNvIsUp(nv: any): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      async function checkNv() {
        const niivue = await nv;
        if (niivue.volumes[0]) {
          return resolve(nv);
        } else {
          setTimeout(async () => {
            await checkNv();
          }, 500);
        }
      }
      checkNv();
    });
  }

  async function waitForDuration(duration: number): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(false);
      }, duration);
    });
  }

  React.useEffect(() => {
    Promise.race([waitUntilNvIsUp(nv), waitForDuration(LOADING_TIMEOUT)]).then(
      (nv: any) => {
        try {
          nv.volumes[0].cal_min = range[0];
          nv.volumes[0].cal_max = range[1];
          nv.updateGLVolume();
        } catch (error) {
          console.error(error);
        }
      }
    );
  }, [pick, nv]);

  function onRangeChange(newValue: number[]) {
    let symmetricRange;
    if (newValue[0] !== range[0] && newValue[1] === range[1]) {
      symmetricRange = [newValue[0], -newValue[0]];
    } else if (newValue[1] !== range[1] && newValue[0] === range[0]) {
      symmetricRange = [-newValue[1], newValue[1]];
    } else {
      symmetricRange = newValue;
    }
    setRange(symmetricRange);

    nv.volumes[0].cal_min = range[0];
    nv.volumes[0].cal_max = range[1];
    nv.updateGLVolume();
  }

  return (
    <Slider
      step={increment}
      value={range}
      max={defaultRange[1]}
      min={defaultRange[0]}
      onAfterChange={onRangeChange}
      range
      disabled={false}
    />
  );
}
