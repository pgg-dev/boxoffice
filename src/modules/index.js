import { combineReducers } from "redux";
import movies from "./movies";

console.log("modules/index");
const rootReducer = combineReducers({ movies });

export default rootReducer;
