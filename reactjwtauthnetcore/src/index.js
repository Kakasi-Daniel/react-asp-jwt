import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {ContextWrapper} from './store'

ReactDOM.render(<ContextWrapper><App /></ContextWrapper>, document.getElementById("root"));
