import React, { Component } from "react";
import axios from "../../../axios";
import { Button, Col, Form, Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import Modal from "../../../Components/UI/Modal/Modal";
import happyLogo from "../../../Assets/happy.png";
import { Link } from "react-router-dom";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";

class WordLists extends Component {
  state = {
    wordlists: [],
    wordlist_name: "",
    success: false,
    message: ""
  };

  componentDidMount() {
    this.getLists();
  }

  getLists = () => {
    axios
      .get("/api/word/userwordlist/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        this.setState({
          wordlists: res.data
        });
      })
      .catch(error => {});
  };

  addWordListHandler = () => {
    const formData = new FormData();
    formData.append("name", this.state.wordlist_name);
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    axios
      .post("/api/word/userwordlist/", formData, { headers })
      .then(response => {
        if (response.status === 201) {
          this.setState({
            wordlist_name: "",
            success: true,
            message: "Successful word list create."
          });
          this.getLists();
        }
      })
      .catch(error => {});
  };

  successConfirmedHandler = () => {
    this.setState({
      success: false,
      message: ""
    });
  };

  render() {
    const wordlists = this.state.wordlists.map(wordlist => {
      return (
        <tr key={wordlist.id}>
          <td>{wordlist.name}</td>
          <td>{wordlist.date}</td>
          <td>{wordlist.total_words}</td>
          <td>
            <Link to={{ pathname: "/word-lists/" + wordlist.id }}>
              <Button variant="secondary" block>
                Manage
              </Button>
            </Link>
          </td>
          <td>
            <Button variant="success" block>
              Learn
            </Button>
          </td>
          <td>
            <Link
              to={{
                pathname: "/word-lists/" + wordlist.id + "/test",
                state: {
                  wordlist_name: wordlist.name
                }
              }}
            >
              <Button variant="primary" block>
                Test
              </Button>
            </Link>
          </td>
        </tr>
      );
    });
    return (
      <Wrapper>
        <Modal show={this.state.success} modalClosed={this.successConfirmedHandler}>
          <img src={happyLogo} alt="happy" />
          {this.state.message}
        </Modal>

        <h1>
          <i className="fas fa-clipboard-list" /> Word lists
        </h1>

        <Breadcrumb>
          <BreadcrumbItem active>Word lists</BreadcrumbItem>
        </Breadcrumb>

        <Wrapper>
          <Form>
            <h5>Create word list</h5>
            <Form.Group controlId="WordLists.Title">
              <Form.Row>
                <Col xl={10} lg={9} md={9} sm={8} xs={8}>
                  <Form.Control
                    type="text"
                    placeholder="word list name"
                    value={this.state.wordlist_name}
                    onChange={event => this.setState({ wordlist_name: event.target.value })}
                  />
                </Col>
                <Col xl={2} lg={3} md={3} sm={4} xs={4}>
                  <Button variant="primary" onClick={this.addWordListHandler} block>
                    Create
                  </Button>
                </Col>
              </Form.Row>
            </Form.Group>
          </Form>
        </Wrapper>

        <Wrapper>
          <h5>Your word lists</h5>
          <hr />
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Created</th>
                <th>Total words</th>
              </tr>
            </thead>
            <tbody>{wordlists}</tbody>
          </Table>
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(WordLists, axios);
