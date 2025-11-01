import {run, retry} from "./runner.js";

let interval = 5000;
let retryInterval = 20000;

setInterval(run, interval);
setInterval(retry, retryInterval);