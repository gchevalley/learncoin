import sample from "lodash.sample";
import range from "lodash.range";
import moment from "moment";

export class Transaction {
  constructor({ id, timestamp, from, to, amount }) {
    this.id = id;
    this.timestamp = timestamp;
    this.from = from;
    this.to = to;
    this.amount = amount;
  }
}

let id = 0;
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const generateId = () => range(10 ).map(i => sample(alphabet)).join("");

export const generateTransaction = () => {
  id++;
  return new Transaction({
    id,
    timestamp: moment(),
    from: generateId(),
    to: generateId(),
    amount: Math.round((Math.random() * 1000) * 100) / 100
  });
};
