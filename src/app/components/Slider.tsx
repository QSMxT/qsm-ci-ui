import React from "react";
import { Slider } from "antd";

export default function RangeSlider(props: any) {
  let sliderRange: any = {
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
    Promise.race([
      waitUntilNvIsUp(props.nv),
      waitForDuration(LOADING_TIMEOUT),
    ]).then((nv: any) => {
      try {
        setRange([nv.volumes[0].cal_min, nv.volumes[0].cal_max]);
      } catch (error) {
        console.error(error);
      }
    });
  }, [props.pick, props.nv]);

  function onRangeChange(newValue: number | number[]) {
    setRange(newValue);
    props.nv.volumes[0].cal_min = range[0];
    props.nv.volumes[0].cal_max = range[1];
    props.nv.updateGLVolume();
  }

  return (
    <Slider
      step={increment}
      value={range}
      max={defaultRange[1]}
      min={defaultRange[0]}
      onChange={onRangeChange}
      range
      disabled={false}
    />
  );
}
