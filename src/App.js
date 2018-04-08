import React, { Component } from 'react';
import {AccountPage} from "./components/AccountPage";
import {Route, Router, Switch} from "react-router";
import createBrowserHistory from 'history/createBrowserHistory';
import classNames from "classnames";

import {Account} from "./models/Account";
import {OverviewPage} from "./components/OverviewPage";

const history = createBrowserHistory();

const generateFriend = ({nickname, id}) =>
  new Account({
    nickname,
    id,
    transactions: [],
    balance: "100.00",
    friends: []
  });

const friends = [
  { nickname: "Julie", id: "1QHY5Z7BV28IQPMV6OYAA4E0HP8" },
  { nickname: "Raphaël", id: "3FPMO0WDE8Y59JKH16ZL6G69ZHWGT" },
  { nickname: "Rayan", id: "1RPRFYSG4FT2QU5CQRVDV1Z6J357V6Q" },
  { nickname: "Ambre", id: "1F2OSIGFQFOCDLAB2LIA5DRHEIE" },
  //{ nickname: "Valentin", id: "37LMST14SGK90R3DDX0WXA9MINH5Z19JT1" },
  //{ nickname: "Alexandre", id: "30YX0OIQZ7MY12HRNPYN730TS9RZ" },
  //{ nickname: "Camille", id: "3YMUYGDSYHTLXE77HMGN46WWOH8" }
].map(generateFriend);

const account = new Account({
  nickname: "Bob",
  id: "mon-id",
  transactions: [],
  balance: "2343.32",
  friends
});

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    history.listen(x => this.setState({ location: window.location.href }));

    console.log("location", history.location.pathname);
    const isBlurred = history.location.pathname.match("/progress");
    const isDark  = history.location.pathname === "/";
    console.log(history);

    if(isDark)
      document.body.classList.add("dark");
    else
      document.body.classList.remove("dark");

    return (
      <div className={classNames("App", { "App-dark": isDark, "App-blur": isBlurred })}>
          <Router history={history}>
            <Switch>
              <Route path="/" exact component={OverviewPage} />
              <Route path="/account" component={x => <AccountPage account={account} {...x} />} />
            </Switch>
          </Router>
      </div>
    );
  }
}

export default App;
