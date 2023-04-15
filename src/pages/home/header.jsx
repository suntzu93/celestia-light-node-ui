import React, { useState, useEffect } from "react";
import * as Data from "../data";
import styles from "./styles.module.css";
import Tooltip from "@mui/material/Tooltip";
import { ReactComponent as Copy } from "../../assets/copy.svg";
import * as Const from "../../utils/Cons";
import * as Utils from "../../utils/utils";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Loader from "../../components/loader";
import SignatureTable from "../../components/table/signatures";
import ValidatorTable from "../../components/table/validators";
import Link from "@mui/material/Link";
import { ReactComponent as ShareLink } from "../../assets/link.svg";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

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

function HeaderTab({ data, syncState, probabilityOfAvailability }) {
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
              label="Header"
              value="1"
            />
            <Tab
              style={{ textTransform: "none", color: "black" }}
              label="Signatures"
              value="2"
            />
            <Tab
              style={{ textTransform: "none", color: "black" }}
              label="Validators"
              value="3"
            />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ padding: "0px" }}>
          {Overview(data, syncState, probabilityOfAvailability)}
        </TabPanel>
        <TabPanel value="2" sx={{ padding: "0px" }}>
          {Signatures(data)}
        </TabPanel>
        <TabPanel value="3" sx={{ padding: "0px" }}>
          {Validator(data)}
        </TabPanel>
      </TabContext>
    </Box>
  );
}

const HeaderPage = ({ isSearch, searchInput }) => {
  const [pageData, setPageData] = useState({
    rowData: [],
    isLoading: false,
    pageNumber: 1,
    totalPassengers: 0,
  });
  const [address, setAddress] = useState(Const.LOADING_TEXT);
  const [nodeId, setNodeId] = useState(Const.LOADING_TEXT);

  const [balance, setBalance] = useState(Const.LOADING_TEXT);
  const [samplingStats, setSamplingStats] = useState({
    head_of_sampled_chain: Const.LOADING_TEXT,
    head_of_catchup: Const.LOADING_TEXT,
    network_head_height: Const.LOADING_TEXT,
    is_running: Const.LOADING_TEXT,
    catch_up_done: Const.LOADING_TEXT,
    failed: {},
  });

  const [peerCount, setPeerCount] = useState(Const.LOADING_TEXT);
  const [syncState, setSyncState] = useState(Const.LOADING_TEXT);

  const [probabilityOfAvailability, setProbabilityOfAvailability] = useState(
    Const.LOADING_TEXT
  );

  const [showFailed, setShowFailed] = useState(false);

  const loadSamplingStatAndPeers = () => {
    Data.getSamplingStats().then((info) => {
      setSamplingStats(info);
    });

    Data.getPeers().then((peers) => {
      setPeerCount(peers?.length);
    });

    Data.getSyncState().then((state) => {
      setSyncState(state);
    });

    Data.getProbabilityOfAvailability().then((probabilityOfAvailability) => {
      setProbabilityOfAvailability(probabilityOfAvailability);
    });
  };

  useEffect(() => {
    if (!Utils.isValidData()) {
      return;
    }
    Data.getAccountAddress().then((address) => {
      setAddress(address);
      //get balance
      Data.getBalance(address).then((info) => {
        setBalance(info);
      });
    });

    Data.getNodeId().then((nodeId) => {
      setNodeId(nodeId);
    });

    loadSamplingStatAndPeers();
    const interval = setInterval(() => {
      loadSamplingStatAndPeers();

      if (!isSearch) {
        Data.getHeaders(isSearch, searchInput).then((headers) => {
          setPageData({
            isLoading: false,
            rowData: headers,
            totalPassengers: 0,
          });
        });
      }
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!Utils.isValidData()) {
      return;
    }
    setPageData({
      isLoading: true,
      rowData: {},
    });

    Data.getHeaders(isSearch, searchInput).then((headers) => {
      setPageData({
        isLoading: false,
        rowData: headers,
        totalPassengers: 0,
      });
    });
  }, [isSearch]);

  function viewFailed() {
    setShowFailed(true);
  }

  return (
    <div>
      <div className={styles.operator_detail_header}>
        <div className={styles.operator_detail_header_address}>
          <h3>
            {address !== Const.LOADING_TEXT
              ? Data.formatString(address)
              : Const.LOADING_TEXT}
            <Tooltip title="Copied">
              <Copy
                style={{ cursor: "pointer" }}
                onClick={(e) => copyToClipBoard(address)}
              />
            </Tooltip>
          </h3>
          <h6>
            {nodeId !== Const.LOADING_TEXT
              ? Data.formatString(nodeId)
              : Const.LOADING_TEXT}{" "}
            <Tooltip title="Copied">
              <Copy
                style={{ cursor: "pointer" }}
                onClick={(e) => copyToClipBoard(nodeId)}
              />
            </Tooltip>
          </h6>
          <span>
            {balance !== Const.LOADING_TEXT
              ? Data.formatNumberToDecimal(Data.formatGwei(balance)) +
                " " +
                Const.DENOM
              : Const.LOADING_TEXT}
          </span>
        </div>
        <div className={styles.operator_detail_header_value}>
          <div className={styles.operator_detail_header_value_item}>
            <div className={styles.operator_detail_header_value_item_lable}>
              sampled chain
            </div>
            <div>
              <div>
                {samplingStats?.head_of_sampled_chain !== Const.LOADING_TEXT
                  ? Data.formatNumberToDecimal(
                      samplingStats?.head_of_sampled_chain
                    )
                  : Const.LOADING_TEXT}
              </div>
            </div>
          </div>
          <div className={styles.operator_detail_header_value_item}>
            <div className={styles.operator_detail_header_value_item_lable}>
              head of catchup
            </div>
            <div>
              <div>
                {samplingStats?.head_of_catchup !== Const.LOADING_TEXT
                  ? Data.formatNumberToDecimal(samplingStats?.head_of_catchup)
                  : Const.LOADING_TEXT}
              </div>
            </div>
          </div>
          <div className={styles.operator_detail_header_value_item}>
            <div className={styles.operator_detail_header_value_item_lable}>
              network head height
            </div>
            <div>
              <div>
                {samplingStats?.network_head_height !== Const.LOADING_TEXT
                  ? Data.formatNumberToDecimal(
                      samplingStats?.network_head_height
                    )
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
                {peerCount !== Const.LOADING_TEXT
                  ? peerCount
                  : Const.LOADING_TEXT}
              </div>
            </div>
          </div>
          <div className={styles.operator_detail_header_value_item}>
            <div className={styles.operator_detail_header_value_item_lable}>
              running
            </div>
            <div>
              <div>
                {samplingStats?.is_running !== Const.LOADING_TEXT
                  ? samplingStats?.is_running.toString()
                  : Const.LOADING_TEXT}
              </div>
            </div>
          </div>
          <div className={styles.operator_detail_header_value_item}>
            <div className={styles.operator_detail_header_value_item_lable}>
              catch up done
            </div>
            <div>
              <div>
                {samplingStats?.catch_up_done !== Const.LOADING_TEXT
                  ? samplingStats?.catch_up_done.toString()
                  : Const.LOADING_TEXT}
              </div>
            </div>
          </div>
          {samplingStats?.failed !== undefined &&
          JSON.stringify(samplingStats?.failed).length > 0 ? (
            <div className={styles.operator_detail_header_value_item}>
              <div
                className={styles.operator_detail_header_value_item_lable}
                style={{ textAlign: "center" }}
              >
                failed
              </div>
              <Button
                sx={{ textTransform: "none" }}
                variant="text"
                onClick={() => viewFailed()}
              >
                view
              </Button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      {pageData.isLoading ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Loader />
        </div>
      ) : (
        <div style={{ marginTop: "30px" }}>
          <HeaderTab
            data={pageData.rowData}
            syncState={syncState}
            probabilityOfAvailability={probabilityOfAvailability}
          />
        </div>
      )}
      {FailedDialog(showFailed, setShowFailed, samplingStats?.failed)}
    </div>
  );
};

function Signatures(data) {
  return (
    <SignatureTable
      columns={Data.signatures_column}
      data={data?.signatures}
      isLoading={false}
    />
  );
}

function Validator(data) {
  return (
    <ValidatorTable
      columns={Data.validators_column}
      data={data?.validators}
      isLoading={false}
    />
  );
}

function Overview(header, syncState, probabilityOfAvailability) {
  const [showEDS, setShowEDS] = useState(false);
  const [root, setRoot] = useState();

  const viewFullEDS = async (header) => {
    setShowEDS(true);
    setRoot(header?.dah);
  };

  return (
    <div className={styles.operator_detail_overview}>
      <div style={{ flex: "2 2 0%" }}>
        <table className={styles.operator_detail_overview_table}>
          <tbody>
            <tr>
              <th colSpan="2" style={{ fontWeight: "bold" }}>
                Latest Block
              </th>
            </tr>
          </tbody>
          <tbody className={styles.operator_detail_overview_table_tbody}>
            <tr>
              <th>Chain ID</th>
              <td>{header?.chain_id}</td>
            </tr>
            <tr>
              <th>Height</th>
              <td>
                {header?.height !== undefined
                  ? Data.formatNumberToDecimal(header.height)
                  : 0}
              </td>
            </tr>
            <tr>
              <th>Time</th>
              <td>
                <Tooltip title={header?.time}>
                  <span>
                    {header?.time !== undefined
                      ? Data.formatTimeToText(header?.time)
                      : 0}
                  </span>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <th>Block Hash</th>
              <td>
                <Tooltip title={header?.block_hash}>
                  <span>
                    {Data.formatString(header?.block_hash)}
                    <Copy
                      style={{ cursor: "pointer" }}
                      onClick={(e) => copyToClipBoard(header?.block_hash)}
                    />
                  </span>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <th>Last Block Hash</th>
              <td>
                <Tooltip title={header?.last_block_hash}>
                  <span>
                    {Data.formatString(header?.last_block_hash)}
                    <Copy
                      style={{ cursor: "pointer" }}
                      onClick={(e) => copyToClipBoard(header?.last_block_hash)}
                    />
                  </span>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <th>Last Commit Hash</th>
              <td>
                <Tooltip title={header?.last_commit_hash}>
                  <span>
                    {Data.formatString(header?.last_commit_hash)}
                    <Copy
                      style={{ cursor: "pointer" }}
                      onClick={(e) => copyToClipBoard(header?.last_commit_hash)}
                    />
                  </span>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <th>Data Hash</th>
              <td>
                <Tooltip title={header?.data_hash}>
                  <span>
                    {Data.formatString(header?.data_hash)}
                    <Copy
                      style={{ cursor: "pointer" }}
                      onClick={(e) => copyToClipBoard(header?.data_hash)}
                    />
                  </span>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <th>Validators Hash</th>
              <td>
                <Tooltip title={header?.validators_hash}>
                  <span>
                    {Data.formatString(header?.validators_hash)}
                    <Copy
                      style={{ cursor: "pointer" }}
                      onClick={(e) => copyToClipBoard(header?.validators_hash)}
                    />
                  </span>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <th>Consensus Hash</th>
              <td>
                <Tooltip title={header?.consensus_hash}>
                  <span>
                    {Data.formatString(header?.consensus_hash)}
                    <Copy
                      style={{ cursor: "pointer" }}
                      onClick={(e) => copyToClipBoard(header?.consensus_hash)}
                    />
                  </span>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <th>App Hash</th>
              <td>
                <Tooltip title={header?.app_hash}>
                  <span>
                    {Data.formatString(header?.app_hash)}
                    <Copy
                      style={{ cursor: "pointer" }}
                      onClick={(e) => copyToClipBoard(header?.app_hash)}
                    />
                  </span>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <th>Proposer</th>
              <td>
                <Link
                  target="_blank"
                  underline="hover"
                  href={Utils.validatorLink(header?.proposer_address)}
                  className={styles.link}
                >
                  {header?.proposer_address}
                </Link>
                <ShareLink />
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <th colSpan="2" style={{ fontWeight: "bold" }}>
                dah
              </th>
            </tr>
          </tbody>
          <tbody className={styles.operator_detail_overview_table_tbody}>
            <tr>
              <th>column roots</th>
              <div style={{ padding: "5px" }}>
                {header?.dah?.column_roots.map((item) => (
                  <div>{item}</div>
                ))}
              </div>
            </tr>
            <tr>
              <th>row roots</th>
              <div style={{ padding: "5px" }}>
                {header?.dah?.row_roots.map((item) => (
                  <div>{item}</div>
                ))}
              </div>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ flex: "1.5 1.5 0%" }}>
        <table className={styles.operator_detail_overview_table}>
          <tbody>
            <tr>
              <th colSpan="2" style={{ fontWeight: "bold" }}>
                Sync state
              </th>
            </tr>
          </tbody>
          <tbody className={styles.operator_detail_overview_table_tbody}>
            <tr>
              <th>Height</th>
              <td>{Data.formatNumberToDecimal(syncState?.Height)}</td>
            </tr>
            <tr>
              <th>From Height</th>
              <td>{Data.formatNumberToDecimal(syncState?.FromHeight)}</td>
            </tr>
            <tr>
              <th>To Height</th>
              <td>{Data.formatNumberToDecimal(syncState?.ToHeight)}</td>
            </tr>
            <tr>
              <th>From Hash</th>
              <td>
                {Data.formatString(syncState?.FromHash)}
                <Tooltip title="Copied">
                  <Copy
                    style={{ cursor: "pointer" }}
                    onClick={(e) => copyToClipBoard(syncState?.FromHash)}
                  />
                </Tooltip>
              </td>
            </tr>
            <tr>
              <th>To Hash</th>
              <td>
                {Data.formatString(syncState?.ToHash)}
                <Tooltip title="Copied">
                  <Copy
                    style={{ cursor: "pointer" }}
                    onClick={(e) => copyToClipBoard(syncState?.ToHash)}
                  />
                </Tooltip>
              </td>
            </tr>
            <tr>
              <th>Start</th>
              <td>
                <Tooltip title={syncState?.Start}>
                  <span>{Data.formatTimeToText(syncState?.Start)}</span>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <th>End</th>
              <td>
                <Tooltip title={syncState?.End}>
                  <span>{Data.formatTimeToText(syncState?.End)}</span>
                </Tooltip>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ flex: "1 1 0%" }}>
        <table className={styles.operator_detail_overview_table}>
          <tbody>
            <tr>
              <th colSpan="2" style={{ fontWeight: "bold" }}>
                Shares
              </th>
            </tr>
          </tbody>
          <tbody className={styles.operator_detail_overview_table_tbody}>
            <tr>
              <th>Probability Of Availability</th>
              <td>{probabilityOfAvailability}</td>
            </tr>
            <tr>
              <th>Full EDS identified</th>
              <Button
                variant="text"
                sx={{ marginLeft: "50px", textTransform: "none" }}
                onClick={() => viewFullEDS(header)}
              >
                view full
              </Button>
            </tr>
          </tbody>
        </table>
      </div>
      {EDSDialog(showEDS, setShowEDS, root)}
    </div>
  );
}

function EDSDialog(showEDS, setShowEDS, root) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [edsFull, setEdsFull] = React.useState([]);

  React.useEffect(() => {
    if (showEDS) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }

      setIsLoading(true);
      Data.getGetEDS(root).then((data) => {
        setIsLoading(false);
        setEdsFull(data);
      });
    }
  }, [showEDS]);

  const handleClose = () => {
    setShowEDS(false);
  };

  const descriptionElementRef = React.useRef(null);

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={showEDS}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Full EDS identified</DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Loader />
            </div>
          ) : (
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              {edsFull?.data_square?.map((item) => (
                <>
                  <div style={{ wordWrap: "break-word" }}>{item}</div>
                  <div className={styles.div_divide}></div>
                </>
              ))}
            </DialogContentText>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FailedDialog(showFailed, setShowFailed, failed) {
  const descriptionElementRef = React.useRef(null);

  React.useEffect(() => {
    if (showFailed) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [showFailed]);

  const handleClose = () => {
    setShowFailed(false);
  };

  let keys = [];
  if (failed) {
    keys = Object.keys(failed);
  }

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={"xs"}
        open={showFailed}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">List block failed </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {keys?.map((key) => (
              <>
                <div style={{ wordWrap: "break-word" }}>
                  {key} : {failed[key]}
                </div>
                <div className={styles.div_divide}></div>
              </>
            ))}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default HeaderPage;
