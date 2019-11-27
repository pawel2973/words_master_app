import React, { Component } from "react";
import axios from "../../axios";
import {
  Button,
  Col,
  Form,
  Table,
  Breadcrumb,
  BreadcrumbItem
} from "react-bootstrap";
import classes from "./WordLists.module.css";
import Wrapper from "../../Components/UI/Wrapper/Wrapper";
import { Link } from "react-router-dom";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

class WordLists extends Component {
  // TODO spinner
  state = {
    wordlists: [],
    name: ""
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
        this.setState({ wordlists: res.data });
      })
      .catch(error => {});
  };

  createWordListHandler = () => {
    const formData = new FormData();
    formData.append("name", this.state.name);
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    axios
      .post("/api/word/userwordlist/", formData, { headers })
      .then(response => {
        if (response.status === 201) {
          this.setState({ name: "" });
          this.getLists();
        }
      })
      .catch(error => {});
  };

  render() {
    const wordlists = this.state.wordlists.map(wordlist => {
      return (
        <tr key={wordlist.id}>
          <td>{wordlist.name}</td>
          <td>{wordlist.date}</td>
          <td>{wordlist.total_words}</td>
          <td>
            <Link
              to={{
                pathname: "/word-lists/" + wordlist.id,
                state: {
                  wordlist_name: wordlist.name
                }
              }}
            >
              <Button
                className={classes.ButtonCreate}
                variant="secondary"
                block
              >
                Manage
              </Button>
            </Link>
          </td>
          <td>
            <Button className={classes.ButtonCreate} variant="success" block>
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
              <Button className={classes.ButtonCreate} variant="primary" block>
                Test
              </Button>
            </Link>
          </td>
        </tr>
      );
    });
    return (
      <Wrapper>
        <h1>
          <i class="fas fa-clipboard-list" /> Word lists
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
                    value={this.state.name}
                    onChange={event =>
                      this.setState({ name: event.target.value })
                    }
                  />
                </Col>
                <Col xl={2} lg={3} md={3} sm={4} xs={4}>
                  <Button
                    className={classes.ButtonCreate}
                    variant="primary"
                    onClick={this.createWordListHandler}
                    block
                  >
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
