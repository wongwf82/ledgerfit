import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import _ from "lodash";
import Axios from "axios";
import { Doughnut } from "react-chartjs-2";
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

function renderTable() {
  var datas = [];
  var table = Axios.post("http://localhost:3000/get-transactions", {
    address: "0x02f5359117678f8ea38f82a3d601e43e4db92f9e"
  }).then(function(result) {
    let table = [];
    for (var i in result.data.out) {
      table.push(
        <tr>
          <td>{result.data.out[i].hash}</td>
          <td>{result.data.out[i].to}</td>
          <td>{result.data.out[i].category}</td>
        </tr>
      );
    }
    return table;
  });
}

function RenderChart(props) {
  const dataFetched = props.datafetched;
  if (dataFetched) {
    console.log(props.data);
    return <Doughnut data={props.data} />;
  } else {
    return "";
  }
}

function RenderLoader(props) {
  const loading = props.loading;
  if (loading) {
    return <Loader active inline="centered" />;
  } else {
    return "";
  }
}

class MyGiving extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      donut: [],
      dataFetched: false,
      isLoading: false
    };
  }

  componentDidMount() {
    var self = this;
    self.setState({ isLoading: true });
    Axios.post("http://localhost:3000/get-transactions", {
      address: "0x02f5359117678f8ea38f82a3d601e43e4db92f9e"
    }).then(function(result) {
      let table = [];
      var categories = [];
      for (var i in result.data.out) {
        table.push(
          <tr>
            <td style={{ textOverflow: "ellipsis" }}>
              <a href="#" title={result.data.out[i].hash}>
                {result.data.out[i].hash}
              </a>
            </td>
            <td>{result.data.out[i].to}</td>
            <td>{result.data.out[i].category}</td>
          </tr>
        );
        if (categories.indexOf(result.data.out[i].category) >= 0) {
          categories[result.data.out[i].category]++;
        } else if (result.data.out[i].category != null) {
          categories[result.data.out[i].category] = 1;
        }
      }

      self.setState({
        donut: {
          datasets: [
            {
              data: Object.values(categories)
            }
          ],
          labels: Object.keys(categories)
        },
        dataFetched: true
      });
      self.setState({ data: table });
      self.setState({ isLoading: false });
    });
  }

  render() {
    return (
      <Tab.Pane>
        <RenderChart
          datafetched={this.state.dataFetched}
          data={this.state.donut}
        />
        <Table striped style={{ width: "100%" }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Tx</Table.HeaderCell>
              <Table.HeaderCell>To</Table.HeaderCell>
              <Table.HeaderCell>Category</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>{this.state.data}</Table.Body>
        </Table>
        <RenderLoader loading={this.state.isLoading} />
      </Tab.Pane>
    );
  }
}

class MyReceiving extends Component {
  show = size => () => this.setState({ size, open: true });
  close = () => this.setState({ open: false });

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      donut: [],
      dataFetched: false,
      isLoading: false,
      open: false
    };
  }

  componentDidMount() {
    var self = this;
    self.setState({ isLoading: true });
    Axios.post("http://localhost:3000/get-transactions", {
      address: "0x02f5359117678f8ea38f82a3d601e43e4db92f9e"
    }).then(function(result) {
      let table = [];
      var categories = [];
      for (var i in result.data.in) {
        console.log(result.data.in);
        table.push(
          <tr>
            <td style={{ textOverflow: "ellipsis" }}>
              <a href="#" title={result.data.in[i].hash}>
                {result.data.in[i].hash}
              </a>
            </td>
            <td>{result.data.in[i].from}</td>
            <td>
              <Button onClick={self.show("tiny")}>Leave Remark</Button>
            </td>
          </tr>
        );
      }

      self.setState({ data: table });
      self.setState({ isLoading: false });
    });
  }

  render() {
    const { open, size } = this.state;
    return (
      <Tab.Pane>
        <RenderChart
          datafetched={this.state.dataFetched}
          data={this.state.donut}
        />
        <Table striped style={{ width: "100%" }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Tx</Table.HeaderCell>
              <Table.HeaderCell>From</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>

          <Table.Body>{this.state.data}</Table.Body>
        </Table>
        <RenderLoader loading={this.state.isLoading} />
        <Modal size={size} open={open} onClose={this.close}>
          <Modal.Header>Leave remark</Modal.Header>
          <Modal.Content>
            <textarea name="remark" style={{ width: "100%" }} row="5" />
          </Modal.Content>
          <Modal.Actions>
            <Button negative>Cancel</Button>
            <Button
              positive
              icon="checkmark"
              labelPosition="right"
              content="Save"
            />
          </Modal.Actions>
        </Modal>
      </Tab.Pane>
    );
  }
}

const panes = [
  {
    menuItem: "My Givings",
    render: () => <MyGiving />
  },
  {
    menuItem: "My Receivings",
    render: () => <MyReceiving />
  }
];

function noAddress(props) {
  return <h3>Enter address</h3>;
}

function RenderTab(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <Tab panes={panes} />;
  } else {
    return "";
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      address: null,
      isLoading: false,
      addressAvailableAndValid: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSearch(event) {
    event.preventDefault();
    console.log(this.state.value);
    this.setState({
      isLoading: true
    });
    // var self = this;
    // Axios.post("http://localhost:3000/get-transactions", {
    //   address: self.state.value
    // }).then(function(result) {
    //   console.log("yay");
    // });
  }

  render() {
    const addressAvailableAndvalid = this.state.addressAvailableAndValid;
    const isLoading = this.state.isLoading;
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
                <Form onSubmit={this.handleSearch}>
                  <Input
                    type="text"
                    icon="search"
                    name="address"
                    placeholder="Enter Address"
                    onChange={this.handlechange}
                  />
                </Form>
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

        <Container style={{ marginTop: "7em" }}>
          <RenderTab isLoggedIn={true} isLoading={isLoading} />
        </Container>
      </div>
    );
  }
}

export default App;
