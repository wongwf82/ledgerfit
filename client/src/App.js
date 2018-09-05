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
  var table = Axios.post("/get-transactions", {
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
    return <Doughnut height={150} data={props.data} />;
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
    Axios.post("/get-transactions", {
      address: self.props.props.address
    }).then(function(result) {
      let table = [];
      var categories = [];
      var totalPer = 0;
      for (var i in result.data.out) {
        var _price = 0;
        var __price = parseInt(result.data.out[i].value);
        if (__price > 0) {
          // 1 Wei = 0.000000000000000001 ETH
          // 5 Wei = x ETH
          _price = (0.000000000000000001 * __price).toFixed(3) + " ETH";
        }

        var _txCost = 0;
        var __txCost = parseInt(result.data.out[i].gasUsed) / 1000000000; // Wei to Gwei
        var _gasPrice = parseInt(result.data.out[i].gasPrice) / 1000000000; // Wei to Gwei
        if (__txCost > 0) {
          // 1 Wei = 0.000000000000000001 ETH
          // 5 Wei = x ETH
          _txCost = __txCost * _gasPrice + " ETH";
        }
        table.push(
          <tr>
            <td style={{ textOverflow: "ellipsis", wordBreak: "break-word" }}>
              <a href="#" title={result.data.out[i].hash}>
                {result.data.out[i].hash}
              </a>
            </td>
            <td>{result.data.out[i].to}</td>
            <td>
              {result.data.out[i].category} - {result.data.out[i].name}
            </td>
            <td>{_price}</td>
            <td>{_txCost}</td>
          </tr>
        );
        if (categories.indexOf(result.data.out[i].category) >= 0) {
          categories[result.data.out[i].category]++;
          totalPer++;
        } else if (result.data.out[i].category != null) {
          categories[result.data.out[i].category] = 1;
          totalPer++;
        }
      }

      var categoriesNameWithPercentage = [];
      for (var cat in categories) {
        var cPer = (categories[cat] / totalPer) * 100;
        var name = cat + " (" + cPer.toFixed(2) + "%)";
        categoriesNameWithPercentage.push(name);
      }

      self.setState({
        donut: {
          datasets: [
            {
              data: Object.values(categories),
              backgroundColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)"
              ]
            }
          ],
          labels: categoriesNameWithPercentage
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
              <Table.HeaderCell style={{ width: "30%" }}>Tx</Table.HeaderCell>
              <Table.HeaderCell style={{ width: "30%" }}>To</Table.HeaderCell>
              <Table.HeaderCell style={{ width: "16%" }}>
                Category
              </Table.HeaderCell>
              <Table.HeaderCell style={{ width: "12%" }}>
                Price
              </Table.HeaderCell>
              <Table.HeaderCell style={{ width: "12%" }}>
                Actual Tx Cost/Fee
              </Table.HeaderCell>
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
  show = (size, address) => () => {
    this.setState({ size, address, open: true });
  };
  close = () => this.setState({ open: false });

  showRemark = (size, review) => () => {
    if (review != null) {
      this.setState({
        size: size,
        remarks: review,
        openRemark: true
      });
    }
  };
  closeRemark = () => this.setState({ openRemark: false });

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      donut: [],
      dataFetched: false,
      isLoading: false,
      open: false,
      openRemark: false,
      remarks: "",
      address: ""
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleCloseRemark = this.handleCloseRemark.bind(this);
    this.reloadTable = this.reloadTable.bind(this);
  }

  // handleSetRemark(event) {
  //   event.preventDefault();
  //   var self = this;
  //   console.log(this.state);
  // }

  reloadTable() {
    var self = this;
    Axios.post("/get-transactions", {
      address: self.props.props.address
    }).then(function(result) {
      let table = [];
      var categories = [];
      for (var i in result.data.in) {
        var _price = 0;
        var __price = parseInt(result.data.in[i].value);
        if (__price > 0) {
          // 1 Wei = 0.000000000000000001 ETH
          // 5 Wei = x ETH
          _price = (0.000000000000000001 * __price).toFixed(3) + " ETH";
        }
        var _txCost = 0;
        var __txCost = parseInt(result.data.out[i].gasUsed) / 1000000000; // Wei to Gwei
        var _gasPrice = parseInt(result.data.out[i].gasPrice) / 1000000000; // Wei to Gwei
        if (__txCost > 0) {
          // 1 Wei = 0.000000000000000001 ETH
          // 5 Wei = x ETH
          _txCost = __txCost * _gasPrice + " ETH";
        }
        table.push(
          <tr>
            <td style={{ textOverflow: "ellipsis", wordBreak: "break-word" }}>
              <a href="#" title={result.data.in[i].hash}>
                {result.data.in[i].hash}
              </a>
            </td>
            <td>{result.data.in[i].from}</td>
            <td>{_price}</td>
            <td>{_txCost}</td>
            <td>
              <Button
                small
                onClick={self.showRemark("small", result.data.in[i].review)}
              >
                Remarks
              </Button>
              <Button small onClick={self.show("tiny", result.data.in[i].hash)}>
                Leave Remark
              </Button>
            </td>
          </tr>
        );
      }

      self.setState({ data: table });
      self.setState({ isLoading: false });
    });
  }

  componentDidMount() {
    var self = this;
    self.setState({ isLoading: true });
    Axios.post("/get-transactions", {
      address: self.props.props.address
    }).then(function(result) {
      let table = [];
      var categories = [];
      for (var i in result.data.in) {
        var _price = 0;
        var __price = parseInt(result.data.in[i].value);
        if (__price > 0) {
          // 1 Wei = 0.000000000000000001 ETH
          // 5 Wei = x ETH
          _price = (0.000000000000000001 * __price).toFixed(3) + " ETH";
        }
        var _txCost = 0;
        var __txCost = parseInt(result.data.out[i].gasUsed) / 1000000000; // Wei to Gwei
        var _gasPrice = parseInt(result.data.out[i].gasPrice) / 1000000000; // Wei to Gwei
        if (__txCost > 0) {
          // 1 Wei = 0.000000000000000001 ETH
          // 5 Wei = x ETH
          _txCost = __txCost * _gasPrice + " ETH";
        }
        table.push(
          <tr>
            <td style={{ textOverflow: "ellipsis", wordBreak: "break-word" }}>
              <a href="#" title={result.data.in[i].hash}>
                {result.data.in[i].hash}
              </a>
            </td>
            <td>{result.data.in[i].from}</td>
            <td>{_price}</td>
            <td>{_txCost}</td>
            <td>
              <Button
                small
                onClick={self.showRemark("small", result.data.in[i].review)}
              >
                Remarks
              </Button>
              <Button small onClick={self.show("tiny", result.data.in[i].hash)}>
                Leave Remark
              </Button>
            </td>
          </tr>
        );
      }

      self.setState({ data: table });
      self.setState({ isLoading: false });
    });
  }

  onChange = e => {
    // Because we named the inputs to match their corresponding values in state, it's
    // super easy to update the state
    this.setState({ [e.target.name]: e.target.value });
  };

  handleCloseRemark = e => {
    this.setState({ openRemark: false });
  };

  handleClose = e => {
    this.setState({ open: false });
  };

  handleSetRemark = e => {
    e.preventDefault();
    var self = this;
    const { remarks, address } = this.state;
    Axios.post("/add-review", {
      remarks,
      address
    }).then(result => {
      self.reloadTable();
      self.close();
    });
  };

  render() {
    const { open, openRemark, size } = this.state;
    return (
      <Tab.Pane>
        <RenderChart
          datafetched={this.state.dataFetched}
          data={this.state.donut}
        />
        <Table striped style={{ width: "100%" }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{ width: "20%" }}>Tx</Table.HeaderCell>
              <Table.HeaderCell style={{ width: "30%" }}>From</Table.HeaderCell>
              <Table.HeaderCell style={{ width: "10%" }}>
                Price
              </Table.HeaderCell>
              <Table.HeaderCell style={{ width: "10%" }}>
                Actual Tx Cost/Fee
              </Table.HeaderCell>
              <Table.HeaderCell style={{ width: "20%" }} />
            </Table.Row>
          </Table.Header>

          <Table.Body>{this.state.data}</Table.Body>
        </Table>
        <RenderLoader loading={this.state.isLoading} />
        <Modal size={size} open={openRemark} onClose={this.closeRemark}>
          <Modal.Header>Remarks</Modal.Header>
          <Modal.Content>
            <p>{this.state.remarks}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={this.handleCloseRemark}>
              Close
            </Button>
            {/* <Button
              positive
              icon="checkmark"
              labelPosition="right"
              content="Confirm"
            /> */}
          </Modal.Actions>
        </Modal>

        <Modal size={size} open={open} onClose={this.close}>
          <Modal.Header>Leave remark</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSetRemark}>
              <textarea
                name="remarks"
                onChange={this.onChange}
                style={{ width: "100%" }}
                row="5"
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={this.handleClose}>
              Cancel
            </Button>
            <Button
              onClick={this.handleSetRemark}
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
    render: props => <MyGiving props={props} />
  },
  {
    menuItem: "My Receivings",
    render: props => <MyReceiving props={props} />
  }
];

function noAddress(props) {
  return <h3>Enter address</h3>;
}

function RenderTab(props) {
  const isLoggedIn = props.isLoggedIn;
  const address = props.address;
  const otherProps = {
    address: props.address
  };
  if (isLoggedIn && address != null) {
    return (
      <div>
        <h4>Social Ledger for: {address}</h4>
        <br />
        <Tab {...otherProps} panes={panes} />
      </div>
    );
  } else {
    return "Enter wallet address";
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: null,
      _address: null,
      value: "",
      isLoading: false,
      addressAvailableAndValid: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleExample = this.handleExample.bind(this);
  }

  onChange = e => {
    // Because we named the inputs to match their corresponding values in state, it's
    // super easy to update the state
    this.setState({ [e.target.name]: e.target.value });
  };

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
    this.setState({
      isLoading: true,
      address: this.state._address
    });
    // var self = this;
    // Axios.post("https://ledgerfitbackend.herokuapp.com/get-transactions", {
    //   address: self.state.value
    // }).then(function(result) {
    //   console.log("yay");
    // });
  }

  handleExample(event) {
    event.preventDefault();
    this.setState({
      isLoading: true,
      address: "0x02f5359117678f8ea38f82a3d601e43e4db92f9e"
    });
  }

  render() {
    const addressAvailableAndvalid = this.state.addressAvailableAndValid;
    const isLoading = this.state.isLoading;
    const address = this.state.address;
    return (
      <div>
        <div className="announcement">
          <p style={{ float: "left", paddingLeft: "20px" }}>
            This is <a href="https://www.greenlink.io">GreenLink</a>'s proof of
            concept for a Social Ledger and is an open source project. Visit{" "}
            <a href="https://www.github.com/greenlink-io/ledgerfit">GitHub</a>{" "}
            and download the source code
          </p>
          <p
            className="icon-links"
            style={{ float: "right", paddingRight: "20px" }}
          >
            <a href="https://www.greenlink.io">
              <FontAwesomeIcon icon="link" />
            </a>
            <a href="https://www.github.com/greenlink-io/ledgerfit">
              <FontAwesomeIcon icon={["fab", "github"]} />
            </a>
          </p>
        </div>
        <Menu borderless style={{ marginTop: "0px" }}>
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
                    name="_address"
                    placeholder="Enter Address"
                    onChange={this.onChange}
                  />
                </Form>
              </Menu.Item>
              <Menu.Item>
                <Button onClick={this.handleExample}>Show Example</Button>
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
          <RenderTab
            isLoggedIn={true}
            isLoading={isLoading}
            address={address}
          />
        </Container>
      </div>
    );
  }
}

export default App;
