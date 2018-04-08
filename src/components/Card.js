import React, { Component } from 'react';
import classNames from "classnames";

export const Card = ({ className, title, children }) =>
  <div className={classNames("Card", className)}>
    <div className="Card-header">{title}</div>
    <div className="Card-content">
      {children}
    </div>
  </div>;
