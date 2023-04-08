import * as Const from "../utils/Cons";
import moment from "moment";
import * as Utils from "../utils/utils";

export const signatures_column = [
  {
    header: "Signature",
    accessor: "signature",
  },
  {
    header: "Validator",
    accessor: "validator_address",
  },
  {
    header: "Time",
    accessor: "timestamp",
  },
];

export const validators_column = [
  {
    header: "Address",
    accessor: "address",
  },
  {
    header: "Proposer Priority",
    accessor: "validator_address",
  },
  {
    header: "Voting power",
    accessor: "voting_power",
  },
];

export const formatString = (data) => {
  if (data == null) {
    return "...";
  }
  if (data.length < 15) {
    return data;
  }

  const fistSymbol = data.slice(0, 15);
  const endSymbol = data.slice(data.length - 15);
  return fistSymbol + " ... " + endSymbol;
};

export const formatSignature = (data) => {
  const fistSymbol = data.slice(0, 25);
  const endSymbol = data.slice(data.length - 25);
  return fistSymbol + " ... " + endSymbol;
};

export const formatGwei = (value) => {
  return parseFloat(value / Const.DECIMAL_TIA).toFixed(7);
};

export const formatNumberToDecimal = (value) => {
  return new Intl.NumberFormat().format(value);
};

export function formatTimeToText(timestamp) {
  if (timestamp === 0) return "Didn't staked";
  const date = moment.duration(
    moment(new Date().getTime()).diff(moment(timestamp))
  );
  const day = date.days();
  const month = date.months();
  const year = date.years();
  const hour = date.hours();
  const minute = date.minutes();
  const second = date.seconds();
  const time = { year, month, day, hour, minute, second };
  const units = {
    year: "years",
    month: "months",
    day: "days",
    hour: "hours",
    minute: "minutes",
    second: "seconds",
  };
  for (const unit in time) {
    if (time[unit] > 0) {
      if (time[unit] === 1) {
        return time[unit] + " " + unit + " ago";
      } else {
        return time[unit] + " " + units[unit] + " ago";
      }
    }
  }
}

export const formatHeader = (result) => ({
  chain_id: result.header.chain_id,
  height: result.header.height,
  time: result.header.time,
  block_hash: result.commit.block_id.hash,
  last_block_hash: result.header.last_block_id.hash,
  last_commit_hash: result.header.last_commit_hash,
  data_hash: result.header.data_hash,
  validators_hash: result.header.validators_hash,
  next_validators_hash: result.header.next_validators_hash,
  consensus_hash: result.header.consensus_hash,
  app_hash: result.header.app_hash,
  last_results_hash: result.header.last_results_hash,
  proposer_address: result.header.proposer_address,
  validators: result.validator_set.validators,
  signatures: result.commit.signatures.filter(
    (item) => item.signature !== null
  ),
  dah: result.dah,
});

export const formatBalance = (balances) => {
  if (balances.length > 0) {
    const utiaBalance = balances.find((balance) => balance.denom === "utia");
    if (utiaBalance) {
      return utiaBalance.amount;
    }
  }
  return "0";
};

export const getAccountAddress = async () => {
  try {
    const url = Utils.getURL();
    const token = localStorage.getItem(Const.KEY_AUTH);
    const headers = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };
    const data = JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "state.AccountAddress",
      params: [],
    });

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: data,
    });
    const dataJson = await response.json();
    return dataJson.result;
  } catch (e) {
    console.log("get sampling stats error " + e);
    return null;
  }
};

export const getNodeId = async () => {
  try {
    const url = Utils.getURL();
    const token = localStorage.getItem(Const.KEY_AUTH);
    const headers = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };
    const data = JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "p2p.Info",
      params: [],
    });

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: data,
    });
    const dataJson = await response.json();
    return dataJson.result?.ID;
  } catch (e) {
    console.log("get sampling stats error " + e);
    return null;
  }
};

export const getBalance = async (address) => {
  try {
    if (address) {
      const response = await fetch(Const.URL_GET_BALANCE + address);
      const dataJson = await response.json();
      return formatBalance(dataJson.balances);
    }
  } catch (e) {
    console.log("get balance error " + e);
  }
  return "0";
};

export const getSamplingStats = async () => {
  try {
    const url = Utils.getURL();
    const token = localStorage.getItem(Const.KEY_AUTH);
    const headers = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };
    const data = JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "das.SamplingStats",
      params: [],
    });

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: data,
    });
    const dataJson = await response.json();
    return dataJson.result;
  } catch (e) {
    console.log("get sampling stats error " + e);
    return null;
  }
};

export const getPeers = async () => {
  try {
    const url = Utils.getURL();
    const token = localStorage.getItem(Const.KEY_AUTH);
    const headers = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };
    const data = JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "p2p.Peers",
      params: [],
    });

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: data,
    });
    const dataJson = await response.json();
    return dataJson.result.length;
  } catch (e) {
    console.log("get getPeers error " + e);
    return null;
  }
};

export const getHeaders = async (isSearch, searchInput) => {
  try {
    const url = Utils.getURL();
    const token = localStorage.getItem(Const.KEY_AUTH);
    const headers = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };
    let data;
    if (isSearch && searchInput?.length > 0) {
      let method = "header.GetByHash";
      if (!isNaN(searchInput)) {
        method = "header.GetByHeight";
        searchInput = parseInt(searchInput);
      }
      data = JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: method,
        params: [searchInput],
      });
    } else {
      data = JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "header.LocalHead",
        params: [],
      });
    }
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: data,
    });
    const dataJson = await response.json();
    return formatHeader(dataJson.result);
  } catch (e) {
    console.log("get header error " + e);
    return null;
  }
};
