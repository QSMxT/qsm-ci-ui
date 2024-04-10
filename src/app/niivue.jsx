import React from "react";
import { Box } from "@mui/material";
import ResultTable from "./components/ResultTable";
import ComparePanel from "./components/ComparePanel";
import "../index.css";
import { ResizableBox } from "react-resizable";

export default class NiiVue extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableHeight: 300,
      ref: React.createRef(),
    };
  }

  componentDidMount() {
    this.updateTableHeight();
    window.addEventListener("click", this.updateTableHeight);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.ref !== prevState.ref) {
      this.updateTableHeight();
    }
  }

  updateTableHeight = () => {
    const node = this.state.ref.current;

    if (!node) return;
    const height = node.state.height;

    const TABLE_HEADER_HEIGHT = 100;
    this.setState({
      tableHeight: height - TABLE_HEADER_HEIGHT,
    });
  };

  render() {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          height: "100vh",
          backgroundColor: "black",
        }}
      >
        <ComparePanel />

        <div className="layoutRoot">
          <ResizableBox
            className="box"
            width={"100%"}
            height={300}
            axis="y"
            minConstraints={["100%", 150]}
            resizeHandles={["nw", "ne"]}
            ref={this.state.ref}
          >
            <ResultTable tableHeight={this.state.tableHeight} />
          </ResizableBox>
        </div>
      </Box>
    );
  }
}
