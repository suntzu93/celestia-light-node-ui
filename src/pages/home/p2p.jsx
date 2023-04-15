import React, { useState, useEffect } from "react";
import * as Data from "../data";
import styles from "./styles.module.css";
import Tooltip from "@mui/material/Tooltip";
import { ReactComponent as Copy } from "../../assets/copy.svg";
import * as Const from "../../utils/Cons";
import * as Utils from "../../utils/utils";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Loader from "../../components/loader";
import PeerTable from "../../components/table/peers";

const copyToClipBoard = (data) => {
  try {
    if (navigator.clipboard) { // If normal copy method available, use it
      navigator.clipboard.writeText(data);
    } else { // Otherwise fallback to the above function
      unsecuredCopyToClipboard(data);
    }
  } catch (err) {}
};

function unsecuredCopyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Unable to copy to clipboard', err);
  }
  document.body.removeChild(textArea);
}

function P2pTab({ resourceState }) {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", padding: "0px" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab
              style={{ textTransform: "none", color: "black" }}
              label="Overview"
              value="1"
            />
            <Tab
              style={{ textTransform: "none", color: "black" }}
              label="Peers"
              value="2"
            />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ padding: "0px" }}>
          {Overview(resourceState)}
        </TabPanel>
        <TabPanel value="2" sx={{ padding: "0px" }}>
          {Peers(resourceState)}
        </TabPanel>
      </TabContext>
    </Box>
  );
}

const P2PPage = () => {
  const [nodeId, setNodeId] = useState(Const.LOADING_TEXT);
  const [upTime, setUpTime] = useState(Const.LOADING_TEXT);

  const [bandwidthStats, setBandwidthStats] = useState({
    TotalIn: Const.LOADING_TEXT,
    TotalOut: Const.LOADING_TEXT,
  });

  const [resourceState, setResourceState] = useState({
    isLoading: false,
    data: {},
  });

  const [peers, setPeers] = useState(Const.LOADING_TEXT);

  const loadData = () => {
    Data.getBandwidthStats().then((info) => {
      setBandwidthStats(info);
    });

    Data.getPeers().then((info) => {
      setPeers(info);
    });

    Data.getNodeId().then((nodeId) => {
      setNodeId(nodeId);
      Data.getUptime(nodeId).then((uptime) => {
        setUpTime(uptime);
      });
    });

    Data.getResourceState().then((resourceState) => {
      setResourceState({ isLoading: false, data: resourceState });
    });
  };

  useEffect(() => {
    if (!Utils.isValidData()) {
      return;
    }

    setResourceState({ isLoading: true, data: {} });
    //for first time
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 20000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <div className={styles.operator_detail_header}>
        <div className={styles.operator_detail_header_address}>
          <h3>
            {nodeId !== Const.LOADING_TEXT
              ? Data.formatString(nodeId)
              : Const.LOADING_TEXT}
            <Tooltip title="Copied">
              <Copy
                style={{ cursor: "pointer" }}
                onClick={(e) => copyToClipBoard(nodeId)}
              />
            </Tooltip>
          </h3>
          <h6>
            {upTime !== Const.LOADING_TEXT
              ? upTime !== null
                ? "Uptime : " + upTime + " %"
                : ""
              : "Uptime : " + Const.LOADING_TEXT}
          </h6>
        </div>
        <div className={styles.operator_detail_header_value}>
          <div className={styles.operator_detail_header_value_item}>
            <div className={styles.operator_detail_header_value_item_lable}>
              bandwidth total in
            </div>
            <div>
              <div>
                {bandwidthStats?.TotalIn !== Const.LOADING_TEXT
                  ? Data.convertBytesToMB(bandwidthStats?.TotalIn)
                  : Const.LOADING_TEXT}
              </div>
            </div>
          </div>
          <div className={styles.operator_detail_header_value_item}>
            <div className={styles.operator_detail_header_value_item_lable}>
              bandwidth total out
            </div>
            <div>
              <div>
                {bandwidthStats?.TotalIn !== Const.LOADING_TEXT
                  ? Data.convertBytesToMB(bandwidthStats?.TotalOut)
                  : Const.LOADING_TEXT}
              </div>
            </div>
          </div>
          <div className={styles.operator_detail_header_value_item}>
            <div className={styles.operator_detail_header_value_item_lable}>
              peers
            </div>
            <div>
              <div>
                {peers !== Const.LOADING_TEXT
                  ? peers?.length
                  : Const.LOADING_TEXT}
              </div>
            </div>
          </div>
        </div>
      </div>
      {resourceState.isLoading ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Loader />
        </div>
      ) : (
        <div>
          <P2pTab resourceState={resourceState?.data} />
        </div>
      )}
    </div>
  );
};

function Peers(resourceState) {
  const peers = resourceState?.Peers;
  if (!peers) {
    return;
  }

  const transformedData = Object.keys(peers).map((key) => {
    return {
      peer: key,
      ...peers[key],
    };
  });

  return (
    <PeerTable
      columns={Data.peers_column}
      data={transformedData}
      isLoading={false}
    />
  );
}

function RenderServices({ services }) {
  if (!services) {
    return;
  }
  const keys = Object.keys(services);
  return keys.map((key) => (
    <>
      <tbody className={styles.operator_detail_overview_table_tbody}>
        <tr>
          <th colSpan="2" style={{ fontWeight: "bold" }}>
            {key}
          </th>
        </tr>
      </tbody>
      <tbody className={styles.operator_detail_overview_table_tbody_sub}>
        <tr>
          <th>Num Streams Inbound</th>
          <td>{services[key].NumStreamsInbound}</td>
        </tr>
        <tr>
          <th>Num Streams Outbound</th>
          <td>{services[key].NumStreamsOutbound}</td>
        </tr>
        <tr>
          <th>Num Conns Inbound</th>
          <td>{services[key].NumConnsInbound}</td>
        </tr>
        <tr>
          <th>NumConns Outbound</th>
          <td>{services[key].NumConnsOutbound}</td>
        </tr>
        <tr>
          <th>NumFD</th>
          <td>{services[key].NumFD}</td>
        </tr>
        <tr>
          <th>Memory</th>
          <td>{Data.convertBytesToMB(services[key].Memory)}</td>
        </tr>
      </tbody>
    </>
  ));
}

function RenderProtocol({ protocols }) {
  if (!protocols) {
    return;
  }
  const keys = Object.keys(protocols);
  return keys.map((key) => (
    <>
      <tbody className={styles.operator_detail_overview_table_tbody}>
        <tr>
          <th colSpan="2" style={{ fontWeight: "bold" }}>
            {key}
          </th>
        </tr>
      </tbody>
      <tbody className={styles.operator_detail_overview_table_tbody_sub}>
        <tr>
          <th>Num Streams Inbound</th>
          <td>{protocols[key].NumStreamsInbound}</td>
        </tr>
        <tr>
          <th>Num Streams Outbound</th>
          <td>{protocols[key].NumStreamsOutbound}</td>
        </tr>
        <tr>
          <th>Num Conns Inbound</th>
          <td>{protocols[key].NumConnsInbound}</td>
        </tr>
        <tr>
          <th>NumConns Outbound</th>
          <td>{protocols[key].NumConnsOutbound}</td>
        </tr>
        <tr>
          <th>NumFD</th>
          <td>{protocols[key].NumFD}</td>
        </tr>
        <tr>
          <th>Memory</th>
          <td>{Data.convertBytesToMB(protocols[key].Memory)}</td>
        </tr>
      </tbody>
    </>
  ));
}

function Overview(resourceState) {
  return (
    <div className={styles.operator_detail_overview}>
      <div style={{ flex: "1 1 0%" }}>
        <table className={styles.operator_detail_overview_table}>
          <tbody>
            <tr>
              <th colSpan="2" style={{ fontWeight: "bold" }}>
                System
              </th>
            </tr>
          </tbody>
          <tbody className={styles.operator_detail_overview_table_tbody}>
            <tr>
              <th>Num Streams Inbound</th>
              <td>{resourceState?.System?.NumStreamsInbound}</td>
            </tr>
            <tr>
              <th>Num Streams Outbound</th>
              <td>{resourceState?.System?.NumStreamsOutbound}</td>
            </tr>
            <tr>
              <th>Num Conns Inbound</th>
              <td>{resourceState?.System?.NumConnsInbound}</td>
            </tr>
            <tr>
              <th>Num Conns Outbound</th>
              <td>{resourceState?.System?.NumConnsOutbound}</td>
            </tr>
            <tr>
              <th>NumFD</th>
              <td>{resourceState?.System?.NumFD}</td>
            </tr>
            <tr>
              <th>Memory</th>
              <td>{Data.convertBytesToMB(resourceState?.System?.Memory)}</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <th colSpan="2" style={{ fontWeight: "bold" }}>
                Transient
              </th>
            </tr>
          </tbody>
          <tbody className={styles.operator_detail_overview_table_tbody}>
            <tr>
              <th>Num Streams Inbound</th>
              <td>{resourceState?.Transient?.NumStreamsInbound}</td>
            </tr>
            <tr>
              <th>Num Streams Outbound</th>
              <td>{resourceState?.Transient?.NumStreamsOutbound}</td>
            </tr>
            <tr>
              <th>Num Conns Inbound</th>
              <td>{resourceState?.Transient?.NumConnsInbound}</td>
            </tr>
            <tr>
              <th>Num Conns Outbound</th>
              <td>{resourceState?.Transient?.NumConnsOutbound}</td>
            </tr>
            <tr>
              <th>NumFD</th>
              <td>{resourceState?.Transient?.NumFD}</td>
            </tr>
            <tr>
              <th>Memory</th>
              <td>{Data.convertBytesToMB(resourceState?.Transient?.Memory)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ flex: "1 1 0%" }}>
        <table className={styles.operator_detail_overview_table}>
          <tbody>
            <tr>
              <th colSpan="2" style={{ fontWeight: "bold" }}>
                Services
              </th>
            </tr>
          </tbody>
          <RenderServices services={resourceState?.Services} />
        </table>
      </div>
      <div style={{ flex: "1 1 0%" }}>
        <table className={styles.operator_detail_overview_table}>
          <tbody>
            <tr>
              <th colSpan="2" style={{ fontWeight: "bold" }}>
                Protocols
              </th>
            </tr>
          </tbody>
          <RenderProtocol protocols={resourceState?.Protocols} />
        </table>
      </div>
    </div>
  );
}

export default P2PPage;
