import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import _ from "lodash";
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
  Input
} from "semantic-ui-react";

const panes = [
  {
    menuItem: "My ",
    render: () => <Tab.Pane loading>Tab 1 Content</Tab.Pane>
  },
  {
    menuItem: "My Receiving",
    render: () => <Tab.Pane>Tab 2 Content</Tab.Pane>
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSearch(event) {
    alert("A name was submitted: " + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <Menu borderless fixed="top">
          <Container>
            <Menu.Item as="a" header>
              <Image
                size="small"
                src="/images/ledgerfit.png"
                style={{ marginRight: "1.5em" }}
              />
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                <form onSubmit={this.handleSearch}>
                  <Input
                    type="text"
                    icon="search"
                    placeholder="Enter Address"
                    value={this.state.value}
                    onChange={this.handlechange}
                  />
                </form>
              </Menu.Item>
            </Menu.Menu>
            {/* <Menu.Item as="a">Home</Menu.Item>
  
          <Dropdown item simple text="Dropdown">
            <Dropdown.Menu>
              <Dropdown.Item>List Item</Dropdown.Item>
              <Dropdown.Item>List Item</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Header>Header Item</Dropdown.Header>
              <Dropdown.Item>
                <i className="dropdown icon" />
                <span className="text">Submenu</span>
                <Dropdown.Menu>
                  <Dropdown.Item>List Item</Dropdown.Item>
                  <Dropdown.Item>List Item</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Item>
              <Dropdown.Item>List Item</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}
          </Container>
        </Menu>

        <Container text style={{ marginTop: "7em" }}>
          <Tab panes={panes} />
        </Container>
      </div>
    );
  }
}

export default App;
