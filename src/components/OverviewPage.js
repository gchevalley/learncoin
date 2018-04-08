import React, { Component } from 'react';
import classNames from "classnames";
import {Card} from "./Card";
import shuffle from "lodash.shuffle";
import uniq from "lodash.uniq";
import euler from "cytoscape-euler";
import sample from "lodash.sample";
import cytoscape from "cytoscape";
import range from "lodash.range";
import {generateTransaction} from "../models/Transaction";
import sortBy from "lodash.sortby";
import flatMap from "lodash.flatmap";

const e = (id, source, target) => ({ group: "edges", data: { id: `e${id}`, source, target} });
const n = (id) => ({ group: "nodes", data: { id: `n${id}` }, position: { x: Math.random(), y: Math.random() }  });

export class OverviewPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transactions: []
    }
  }

  __generateTheGraph = () => {
    let updateState = false;
    let updateData = {};

    console.log("ref", this.graph);
    cytoscape.use(euler);

    this.cy = cytoscape({
      container: this.graph,
      layout: {
        name: "null"
      }
    });

    const generateEdge = nodes => () => {
      const shuffledNodes = shuffle(nodes);
      const from = shuffledNodes[0];
      const to = shuffledNodes[1];

      return { from, to };
    };

    let nodesCount = Math.round(Math.random() * 80 + 20); // ~[20, 100];
    const edgesCount = Math.round(Math.random() * nodesCount / 2 + nodesCount / 2); // [nodes / 2, nodes]

    const nodes = range(nodesCount).map(i => n(i + 1));
    const edges = range(edgesCount).map(generateEdge(nodes));
    const nodesToAdd = sortBy(uniq(flatMap(edges , x => [x.from, x.to])), x => x);
    const edgesToAdd = edges.map((x, i) => e(i, x.from.data.id, x.to.data.id));

    const toAdd = [].concat(nodesToAdd, edgesToAdd);

    const containsNode = n => this.cy.nodes().map(x => x.id()).includes(n.data.id);

    const addRandomEdge = () => {
      const { from, to } = generateEdge(nodes)();

      if(!containsNode(from)) {
        this.cy.add(from);
      }
      if(!containsNode(to)) {
        this.cy.add(to);
      }

      this.cy.add(e(this.cy.edges().length, from.data.id, to.data.id));

      updateState = true;
    };

    const addRandomNodes = () => {
      if(Math.random() > 0.5) {
        // pair
        const i = nodesCount + 1;
        const i1 = i;
        const i2 = i + 1;
        nodesCount++; nodesCount++;

        this.cy.add(n(i1));
        this.cy.add(n(i2));

        console.log("inserted", i1, i2);

        const iEdge = this.cy.edges().length;
        this.cy.add(e(iEdge, "n" + (i1), "n" + (i2)));

        updateState = true;
      }
      else {
        const i = nodesCount + 1;
        nodesCount++;

        this.cy.add(n(i));
        console.log("inserted", i, "max", nodesCount + 1);


        const otherNode = sample(this.cy.nodes()).id();

        const iEdge = this.cy.edges().length;
        this.cy.add(e(iEdge, "n" + (i), otherNode));

        updateState = true;
      }
    };

    const loop = () => {
      updateState = false;
      console.log(this.cy.edges().length, this.cy.nodes().length);

      if(Math.random() > 0.25) {
        console.log("add node");
        addRandomNodes();
      }
      else {
        console.log("add edge");
        addRandomEdge();
      }


      layout.stop();
      layout = this.cy.layout(options);
      layout.run();

      setTimeout(loop, Math.random() * 2000 + 2000);

      if(updateState)
        this.setState({ transactions: [].concat(generateTransaction(), this.state.transactions) })
    };

    this.cy.add(toAdd);

    let first = true;
    const options = {
      name: "euler",
      refresh: 3,
      infinite: true,
      springLength: edge => {
        if(first) {
          first = false;
          console.log(edge);
        }

        return 80;
      }
    };

    let layout = this.cy.layout(options);

    layout.run();
    loop()
  };

  componentDidMount() {
    this.__generateTheGraph();
  }

  render() {
    const {transactions} = this.state;

    return <div>
      <Card className="OverviewPage" title={`Discover the UBS currency`}>
        <div className="OverviewPage-transaction-list">
          {transactions.map((tx, i) =>
            <div
              className={classNames("OverviewPage-transaction", {"new-item": i === 0})}
              key={tx.id}>
              <div className="timestamp">{tx.timestamp.fromNow()}</div>
              <div className="amount">UBS <span>{tx.amount}</span></div>
              <div className="arrow">→</div>
              <div className="from">{tx.from}</div>
              <div className="to">{tx.to}</div>
            </div>
          )}
        </div>
      </Card>
      <div className="graph" ref={elem => this.graph = elem} />
    </div>
  }
}
