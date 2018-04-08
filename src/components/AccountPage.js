import React, { Component } from 'react';
import {Card} from "./Card";
import {Link, NavLink} from "react-router-dom";
import {Route, Switch, withRouter} from "react-router";
import {Overlay} from "./Overlay";
import {TransactionProgress} from "./TransactionProgress";
import classNames from "classnames";

export class AccountPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: undefined,
      contact: undefined,
    }

    const {transactionForm} = this;
    this.askTransactionForm = transactionForm("Ask");
    this.sendTransactionForm = transactionForm("Send");
  }

  AccountItem = ({friend, selected}) =>
    <div
      className={classNames("Contact", { selected })}
      onClick={() => this.setState({ contact: friend })}
    >
      <div className="Contact-name">{friend.nickname}</div>
      <div className="Contact-id">{friend.id}</div>
    </div>;

   ContactForm = () => {
     const {AccountItem} = this;

     return (
       <div>
         {this.props.account.friends.map(friend =>
           <AccountItem
             key={friend.id}
             friend={friend}
             selected={friend === this.state.contact}
           />)}
       </div>
     );
   }

  AmountForm = () =>
    <div className="AmountForm">
      <label htmlFor="amount" className="AmountForm-label">UBS</label>
      <input
        id="amount"
        size={8}
        type="numeric"
        value={this.state.amount}
        onChange={e => this.setState({ amount: e.target.value })}
      />
      <span className="AmountForm-underline"/>
    </div>;

  transactionForm = action => () => {
    const {AmountForm, ContactForm} = this;
    return (
      <div>
        <AmountForm/>
        <ContactForm/>
        <Link
          to="progress"
          className="submit"
          type="button"
        >
          {action}!
        </Link>
      </div>
    );
  };

  render() {
    const {account} = this.props;
    const {amount, contact} = this.state;

    const TransactionProgressWithOverlay = () =>
      <Overlay>
        <TransactionProgress/>
      </Overlay>;

    return <div>
      <Route path="/account/:action/progress"
             component={TransactionProgressWithOverlay} key="overlay"/>
      <div className="AccountPage">
        <div className="AccountPage-nickname">
          {account.nickname}
        </div>
        <div className="AccountPage-picture">
          <img src="https://randomuser.me/api/portraits/men/32.jpg"/>
        </div>
        <div className="AccountPage-balance">UBS {account.balance}</div>

        <div className="AccountPage-actions">
          <NavLink
            to="/account/send/choose-contact"
            activeClassName="selected"
          >
            Send
          </NavLink>
          <NavLink
            to="/account/ask/choose-contact"
            activeClassName="selected"
          >
            Ask
          </NavLink>
        </div>
        <Switch>
          <Route path="/account/send/" component={this.sendTransactionForm}/>
          <Route path="/account/ask/" component={this.askTransactionForm}/>
        </Switch>
        <pre>{JSON.stringify({ amount, contact }, null, 2)}</pre>
      </div>
    </div>;
  }
};
