import React, { Component } from "react";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import _ from "lodash";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import Main from "./Main.js";
import Address from "./Address";
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
  Tab,
  Input,
  Loader,
  Form,
  Table,
  Button,
  Modal
} from "semantic-ui-react";
import { NavLink, Switch, Route } from "react-router-dom";
library.add(fab, faLink);

class App extends Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={Main} />
        <Route path="/address/:address" component={Address} />
      </div>
    );
  }
}

export default App;
