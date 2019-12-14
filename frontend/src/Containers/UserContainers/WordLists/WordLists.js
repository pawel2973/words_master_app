import axios from "../../../axios";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Form, Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import Modal from "../../../Components/UI/Modal/Modal";
import happyLogo from "../../../Assets/happy.png";

class WordLists extends Component {
  state = {
    user_wordlists: [],
    user_wordlist_name: "",
    message: "",
    success: false
  };

  componentDidMount() {
    this.getUserWordLists();
  }

  getUserWordLists = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get("/api/word/userwordlist/", { headers })
      .then(res => {
        this.setState({
          user_wordlists: [...res.data]
        });
      })
      .catch(error => {});
  };

  addUserWordListHandler = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    const formData = new FormData();
    formData.append("name", this.state.user_wordlist_name);

    axios
      .post("/api/word/userwordlist/", formData, { headers })
      .then(res => {
        if (res.status === 201) {
          this.setState({
            user_wordlist_name: "",
            success: true,
            message: "Successful word list create."
          });
          this.getUserWordLists();
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
    const user_wordlists = this.state.user_wordlists.map(wordlist => {
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
            <Link to={{ pathname: "/word-lists/" + wordlist.id + "/learn" }}>
              <Button variant="success" block>
                Learn
              </Button>
            </Link>
          </td>
          <td>
            <Link
              to={{
                pathname: "/word-lists/" + wordlist.id + "/test",
                state: {
                  user_wordlist_name: wordlist.name
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
                    value={this.state.user_wordlist_name}
                    onChange={event => this.setState({ user_wordlist_name: event.target.value })}
                  />
                </Col>
                <Col xl={2} lg={3} md={3} sm={4} xs={4}>
                  <Button variant="primary" onClick={this.addUserWordListHandler} block>
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
            <tbody>{user_wordlists}</tbody>
          </Table>
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(WordLists, axios);
