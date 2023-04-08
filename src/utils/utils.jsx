import * as Const from "./Cons";

export const validatorLink = (valAddress) => {
  return (
    "https://testnet.mintscan.io/celestia-incentivized-testnet/validators/" +
    valAddress
  );
};

export const isValidData = () => {
  return (
    localStorage.getItem(Const.KEY_IP) && localStorage.getItem(Const.KEY_AUTH)
  );
};

export const getURL = () => {
  const url = localStorage.getItem(Const.KEY_IP);
  if (url.startsWith("http")) return url;
  return "http://" + url;
};
