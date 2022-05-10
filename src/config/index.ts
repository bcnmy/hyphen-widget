import constants from "./constants";
import { ENV } from "types/environment";

let hyphenBaseUrl;
if (process.env.REACT_APP_ENV === ENV.production) {
  hyphenBaseUrl = "https://hyphen-v2-api.biconomy.io";
} else if (process.env.REACT_APP_ENV === ENV.test) {
  hyphenBaseUrl = "https://hyphen-v2-integration-api.biconomy.io";
} else {
  hyphenBaseUrl = "https://hyphen-v2-staging-api.biconomy.io";
}

const hyphen = {
  baseURL: hyphenBaseUrl,
  getTokenGasPricePath: "/api/v1/insta-exit/get-token-price",
};

function getBaseURL(env: string | undefined): string {
  if (env === ENV.production) {
    return "ttps://hyphen-v2-api.biconomy.io";
  } else if (env === ENV.test) {
    return "https://hyphen-v2-integration-api.biconomy.io";
  } else {
    return "https://hyphen-v2-staging-api.biconomy.io";
  }
}

export const config = {
  hyphen,
  constants,
  getBaseURL,
};

export default config;
