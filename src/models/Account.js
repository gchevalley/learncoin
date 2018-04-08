export class Account {
  constructor({ id, nickname, transactions, friends, balance, avatarUrl }) {
    this.id = id;
    this.nickname = nickname;
    this.transactions = transactions;
    this.friends = friends;
    this.balance = balance;
    this.avatarUrl = avatarUrl;
  }
}
