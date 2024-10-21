import { matchUserInQueue } from "../controller/matching-controller.js";

const matchScheduler = (io) => {
    console.log("Scheduler start...")
    setInterval(() => {
        matchUserInQueue(io)
    }, 1000);
};

export default matchScheduler;
