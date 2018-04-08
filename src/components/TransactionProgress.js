import React, { Component } from 'react';
import classNames from "classnames";
import sample from "lodash.sample";
import sampleSize from "lodash.samplesize";
import flatMap from "lodash.flatmap";
import range from "lodash.range";

const possibleOperations = flatMap(range(1, 20), x => [+x, -x]).map(x => x * 5);

const TransactionItem = ({ i, last, operation, valid, className }) =>
  <div
    className={
      classNames(
        "TransactionItem",
        `TransactionItem-item-${i}`,
        { valid, last, first: i === 1, positive: operation > 0, negative: operation <= 0 },
        className
      )
    }>
    <span>{operation < 0 ? "-" : "+"}</span>
    {' '}
    <span className="amount">{Math.abs(operation)}.00</span>
  </div>;

const BalanceItem = ({ i, first, value, final }) =>
  <div
    className={
      classNames(
        "TransactionBalance",
        `balance-${i}`,
        {last: final, first: i === 1, final, positive: value > 0, negative: value <= 0 }
      )
    }>
    <span>{value < 0 ? "-" : "+"}</span>
    {' '}
    <span className="amount">{Math.abs(value)}.00</span>
  </div>;

export const TransactionProgress = () => {
  const numberOfOperation = sample(range(3, 7));
  const operations = [].concat(+100, sampleSize(possibleOperations, numberOfOperation));

  const {balance, valid, items} = operations.reduce(
    ({balance, valid, items}, operation, i) => {

      const newBalance = balance + operation;
      // inherit from the previous state
      const newValid = valid && newBalance >= 0;

      const item =
        <TransactionItem
          i={i + 1}
          last={i === operations.length - 1}
          operation={operation}
          valid={newValid}
        />;
      const balanceItem =
        <BalanceItem
          i={i + 1}
          value={newBalance}
          final={i === operations.length - 1}
        />;

      const newItems = [].concat(items, item, balanceItem);

      return {balance: newBalance, valid: newValid, items: newItems};
    },
    {balance: 0, valid: true, items: []}
  );

  return (
    <div className="TransactionProgress">
      <div className={classNames("TransactionProgress-grid", `children-${operations.length}`)}>
        {items}
        <div className="vertical-bar" />
        <div className="pointer">
          <span>&lt;--</span>
        </div>
      </div>
    </div>
  );
}
