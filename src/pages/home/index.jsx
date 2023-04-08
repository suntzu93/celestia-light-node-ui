import React, { useState, useEffect } from "react";
import * as Data from "../data";
import About from "./about";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { browserHistory } from "react-router";
import styles from "./styles.module.css";
import LightNodePage from "./lightnode";
import * as Const from "../../utils/Cons";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Menu from "@mui/material/Menu";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { ReactComponent as Logo } from "../../../public/logo.svg";

const HomePage = () => {
  const [tab, setTab] = React.useState("light_node");
  const [anchorElSetting, setAnchorElSetting] = React.useState(null);
  const [searchInput, setSearchInput] = React.useState("");
  const [isSearch, setIsSearch] = React.useState(false);

  // const [authToken, setAuthToken] = React.useState(
  //   localStorage.getItem(Const.KEY_AUTH)
  // );
  // const [ipNode, setIpNode] = React.useState(
  //   localStorage.getItem(Const.KEY_IP)
  // );

  // const openSetting = Boolean(anchorElSetting);

  useEffect(() => {
    if (
      !localStorage.getItem(Const.KEY_IP) ||
      localStorage.getItem(Const.KEY_IP) !== import.meta.env.VITE_RPC
    ) {
      localStorage.setItem(Const.KEY_IP, import.meta.env.VITE_RPC);
    }
    if (
      !localStorage.getItem(Const.KEY_AUTH) ||
      localStorage.getItem(Const.KEY_AUTH) !== import.meta.env.VITE_TOKEN
    ) {
      localStorage.setItem(Const.KEY_AUTH, import.meta.env.VITE_TOKEN);
    }
  }, []);

  function LightNode() {
    return (
      <div>
        <LightNodePage isSearch={isSearch} searchInput={searchInput} />
      </div>
    );
  }

  function about() {
    return <About />;
  }

  function tabs() {
    const handleChange = (event, newValue) => {
      setTab(newValue);
      switch (newValue) {
        case "light_node":
          return browserHistory.push("/lightNode");
        case "p2p":
          return browserHistory.push("/p2p");
        default:
          return browserHistory.push("/lightNode");
      }
    };

    const handleClickOpenSetting = (event) => {
      setAnchorElSetting(event.currentTarget);
    };
    const handleCloseOpenSetting = () => {
      setAnchorElSetting(null);
    };

    const handleChangeSearchInput = (event) => {
      setSearchInput(event.target.value);
      if (event.target.value.trim().length === 0) {
        setIsSearch(false);
      }
    };

    const submitSearch = () => {
      if (searchInput.length > 0) {
        setIsSearch(true);
      }
    };

    function authTokenChange(e) {
      localStorage.setItem(Const.KEY_AUTH, e.target.value);
      setAuthToken(e.target.value);
    }

    function ipChange(e) {
      localStorage.setItem(Const.KEY_IP, e.target.value);
      setIpNode(e.target.value);
    }

    return (
      <Box sx={{ width: "100%", typography: "body" }}>
        <TabContext value={tab}>
          <Box
            sx={{
              mb: 0,
              borderBottom: 1,
              borderColor: "divider",
              textAlign: "left",
              marginLeft: "20px",
              paddingTop: "20px",
              display: "flex",
              flexDirection: "row",
              overflowX: "scroll",
              overflowY: "hidden",
              height: "90px",
            }}
          >
            <div className={styles.logo_header}>
              <a href="/">
                <Logo height={50} />
              </a>
            </div>
            <TabList
              onChange={handleChange}
              aria-label=""
              sx={{ display: "flex", paddingLeft: "20px", minWidth: "500px" }}
            >
              <Tab sx={{ padding: 0 }} label="Light node" value="light_node" />
            </TabList>
            <div style={{ flex: "1 1 0%" }}></div>
            <div className={styles.search}>
              <TextField
                label="block number / block hash"
                variant="outlined"
                fullWidth
                value={searchInput}
                onChange={handleChangeSearchInput}
                onKeyUp={(event) => {
                  if (event.key === "Enter") submitSearch();
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton>
                      <SearchIcon onClick={() => submitSearch()} />
                    </IconButton>
                  ),
                }}
              />
            </div>
            {/*<div className={styles.setting}>*/}
            {/*  <IconButton*/}
            {/*    color="primary"*/}
            {/*    component="label"*/}
            {/*    aria-controls={openSetting ? "basic-menu" : undefined}*/}
            {/*    aria-haspopup="true"*/}
            {/*    aria-expanded={openSetting ? "true" : undefined}*/}
            {/*    onClick={handleClickOpenSetting}*/}
            {/*  >*/}
            {/*    <SettingsIcon />*/}
            {/*  </IconButton>*/}
            {/*  <Menu*/}
            {/*    style={{ marginTop: "20px" }}*/}
            {/*    anchorEl={anchorElSetting}*/}
            {/*    open={openSetting}*/}
            {/*    onClose={handleCloseOpenSetting}*/}
            {/*    MenuListProps={{*/}
            {/*      "aria-labelledby": "basic-button",*/}
            {/*    }}*/}
            {/*    PaperProps={{*/}
            {/*      style: {*/}
            {/*        width: 350,*/}
            {/*      },*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <span style={{ padding: "10px" }}>Your Light node info</span>*/}
            {/*    <div style={{ padding: "10px" }}>*/}
            {/*      <TextField*/}
            {/*        id="outlined-basic"*/}
            {/*        label="Auth token"*/}
            {/*        variant="outlined"*/}
            {/*        onChange={authTokenChange}*/}
            {/*        value={authToken}*/}
            {/*        sx={{ width: "100%" }}*/}
            {/*      />*/}
            {/*    </div>*/}
            {/*    <div style={{ padding: "10px" }}>*/}
            {/*      <TextField*/}
            {/*        id="outlined-basic"*/}
            {/*        label="IP"*/}
            {/*        variant="outlined"*/}
            {/*        sx={{ width: "100%" }}*/}
            {/*        value={ipNode}*/}
            {/*        onChange={ipChange}*/}
            {/*      />*/}
            {/*    </div>*/}
            {/*  </Menu>*/}
            {/*</div>*/}
            <div className={styles.about}>
              <TabList
                className={styles.tab}
                onChange={handleChange}
                aria-label=""
              >
                <Tab sx={{ padding: 0 }} label="About" value="about" />
              </TabList>
            </div>
          </Box>
          <TabPanel value="light_node">{LightNode()}</TabPanel>
          {/*<TabPanel value="p2p">{operators()}</TabPanel>*/}
          {/*<TabPanel value="operatorDetail">{operatorDetail()}</TabPanel>*/}
          <TabPanel value="about">{about()}</TabPanel>
        </TabContext>
      </Box>
    );
  }

  return <div>{tabs()}</div>;
};

export default HomePage;
