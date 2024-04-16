import React, { useState } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import Tooltip from "@mui/material/Tooltip";
import { QuestionCircleOutlined } from "@ant-design/icons";
import PopupViewer from "./PopupViewer";
interface DataType {
  url: string;
  algorithm: string;
  hfen: number;
  nmi: number;
  rmse: number;
  mad: number;
  cc1: number;
  cc2: number;
  gxe: number;
  nrmse: number;
  xsim: number;
  elo: number;
}

interface ResultTableProps {
  tableHeight: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: () => (
      <>
        Algorithm{" "}
        <Tooltip title="QSM pipeline with different combinations of algorithms">
          <QuestionCircleOutlined />
        </Tooltip>
      </>
    ),
    dataIndex: "algorithm",
    render: (_, record) => (
      <div>
        {record.algorithm}{" "}
        <PopupViewer algo={record.algorithm} url={record.url} />
      </div>
    ),
  },
  {
    title: (
      <>
        HFEN{" "}
        <Tooltip title="High Frequency Error Norm (HFEN) between the predicted and reference data (the lower the better)">
          <QuestionCircleOutlined />
        </Tooltip>
      </>
    ),
    dataIndex: "hfen",
    sorter: (a, b) => a.hfen - b.hfen,
  },
  {
    title: (
      <>
        NMI{" "}
        <Tooltip title="Normalized Mutual Information (NMI) between the predicted and reference data (the higher the better)">
          <QuestionCircleOutlined />
        </Tooltip>
      </>
    ),
    dataIndex: "nmi",
    sorter: (a, b) => b.nmi - a.nmi,
  },
  {
    title: (
      <>
        RMSE{" "}
        <Tooltip title="Root Mean Square Error (RMSE) between the predicted and reference data (the lower the better)">
          <QuestionCircleOutlined />
        </Tooltip>
      </>
    ),
    dataIndex: "rmse",
    sorter: (a, b) => a.rmse - b.rmse,
  },
  {
    title: (
      <>
        MAD{" "}
        <Tooltip title="Mean Absolute Difference (MAD) between the predicted and reference data (the lower the better)">
          <QuestionCircleOutlined />
        </Tooltip>
      </>
    ),
    dataIndex: "mad",
    sorter: (a, b) => a.mad - b.mad,
  },
  {
    title: (
      <>
        CC1{" "}
        <Tooltip title="Pearson Correlation Coefficient (the higher the better)">
          <QuestionCircleOutlined />
        </Tooltip>
      </>
    ),
    dataIndex: "cc1",
    sorter: (a, b) => b.cc1 - a.cc1,
  },
  {
    title: (
      <>
        CC2{" "}
        <Tooltip title="p-value (the lower the better)">
          <QuestionCircleOutlined />
        </Tooltip>
      </>
    ),
    dataIndex: "cc2",
    sorter: (a, b) => a.cc2 - b.cc2,
  },
  {
    title: (
      <>
        GXE{" "}
        <Tooltip title="Gradient difference error (GXE) between the predicted and reference data (the lower the better)">
          <QuestionCircleOutlined />
        </Tooltip>
      </>
    ),
    dataIndex: "gxe",
    sorter: (a, b) => a.gxe - b.gxe,
  },
  {
    title: (
      <>
        NRMSE{" "}
        <Tooltip title="Normalized Root Mean Square Error (NRMSE) between the predicted and reference data (the lower the better)">
          <QuestionCircleOutlined />
        </Tooltip>
      </>
    ),
    dataIndex: "nrmse",
    sorter: (a, b) => a.nrmse - b.nrmse,
  },
  {
    title: (
      <>
        XSIM{" "}
        <Tooltip title="Structural similarity (XSIM) between the predicted and reference data (the higher the better)">
          <QuestionCircleOutlined />
        </Tooltip>
      </>
    ),
    dataIndex: "xsim",
    sorter: (a, b) => b.xsim - a.xsim,
  },
  {
    title: (
      <>
        ELO{" "}
        <Tooltip title="Qualitative ranking (the higher the better)">
          <QuestionCircleOutlined />
        </Tooltip>
      </>
    ),
    dataIndex: "elo",
    sorter: (a, b) => b.elo - a.elo,
  },
];

const ResultTable: React.FC<ResultTableProps> = ({ tableHeight }) => {
  const [result, setResult] = useState<DataType[]>([]);

  // Initialize Parse
  Parse.initialize(
    process.env.REACT_APP_APPLICATION_ID as string,
    process.env.REACT_APP_APPLICATION_KEY
  );
  Parse.serverURL = "https://parseapi.back4app.com/";

  async function retrieveScore() {
    await Parse.Cloud.run("retrieveScore")
      .then((result) => {
        setResult(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  React.useEffect(() => {
    retrieveScore();
  }, []);

  return (
    <Table
      columns={columns}
      dataSource={result}
      scroll={{ y: tableHeight }}
      pagination={{ pageSize: 6 }}
      showSorterTooltip={false}
    />
  );
};

export default ResultTable;
