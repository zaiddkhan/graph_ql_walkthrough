import { mergeTypeDefs } from "@graphql-tools/merge";

import userTpyeDef from "./userTypeDef.js";
import transactionTypeDef from "./transactionTypeDef.js";

const mergedTypeDefs = mergeTypeDefs([userTpyeDef,transactionTypeDef]);


export default mergedTypeDefs;