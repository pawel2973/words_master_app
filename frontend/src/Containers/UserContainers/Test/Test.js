import axios from "../../../axios";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Form, Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import Modal from "../../../Components/UI/Modal/Modal";
import happyLogo from "../../../Assets/happy.png";
import errorLogo from "../../../Assets/error.png";

class Test extends Component {
  state = {
    wordlist_id: this.props.match.params.wordlistID,
    user_tests: [],
    user_words: [],
    user_wordlist_name: "",
    user_wordlist_name_to_update: "",
    message: "",
    success: false,
    error: false
  };

  componentDidMount() {
    this.getUserWordsList();
    this.getWordsfromList();
    this.getUserTests();
  }

  getUserWordsList = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get("/api/word/userwordlist/" + this.state.wordlist_id + "/", { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            user_wordlist_name: res.data.name,
            user_wordlist_name_to_update: res.data.name
          });
        }
      })
      .catch(error => {});
  };

  getWordsfromList = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get("/api/word/userwordlist/" + this.state.wordlist_id + "/words/", { headers })
      .then(res => {
        if (res.status === 200) {
          const words = res.data.map(obj => ({ ...obj, answer: "" }));
          this.setState({ user_words: words });
        }
      })
      .catch(error => {});
  };

  getUserTests = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get("/api/word/userwordlist/" + this.state.wordlist_id + "/tests/", { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            user_tests: [...res.data]
          });
        }
      })
      .catch(error => {});
  };

  deleteTestHandler = (e, arr_id, test_id) => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .delete("/api/word/userwordlist/" + this.state.wordlist_id + "/tests/" + test_id + "/", { headers })
      .then(res => {
        if (res.status === 204) {
          const tests = [...this.state.user_tests];
          tests.splice(arr_id, 1);
          this.setState({
            user_tests: tests,
            success: true,
            message: "Successful test delete."
          });
        }
      })
      .catch(error => {});
  };

  finshTestHandler = e => {
    // Check if answer is correct and add it to list
    let correct_answers = 0;
    let incorrect_answers = 0;

    const answers = [...this.state.user_words].map(obj => {
      if (obj.english.toLowerCase() === obj.answer.toLowerCase()) {
        correct_answers++;
        return {
          ...obj,
          correct: true
        };
      } else {
        incorrect_answers++;
        return {
          ...obj,
          correct: false
        };
      }
    });

    if (correct_answers === 0 && incorrect_answers === 0) {
      this.setState({
        error: true,
        message: "Word list is empty."
      });
    } else {
      //Create user test model in db
      const formTestData = new FormData();
      formTestData.append("correct_answers", correct_answers);
      formTestData.append("incorrect_answers", incorrect_answers);
      const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

      axios
        .post("/api/word/userwordlist/" + this.state.wordlist_id + "/tests/", formTestData, { headers })
        .then(res => {
          //Save answers for test in db
          return axios
            .post("/api/word/userwordlist/" + this.state.wordlist_id + "/tests/" + res.data.id + "/answers/", answers, {
              headers
            })
            .catch(error => {});
        })
        .then(res => {})
        .catch(error => {});
    }
  };

  onUpdateWordHandler = (id, e) => {
    const words = [...this.state.user_words];
    words[id].answer = e.target.value;
    this.setState({
      user_words: words
    });
  };

  successConfirmedHandler = () => {
    this.setState({
      success: false,
      message: ""
    });
  };

  errorConfirmedHandler = () => {
    this.setState({
      error: false,
      message: ""
    });
  };

  render() {
    const new_test = this.state.user_words.map((word, index) => {
      return (
        <tr key={word.id}>
          <td>{this.state.user_words[index].polish}</td>
          <td>
            <Form.Control
              type="text"
              placeholder=""
              required
              value={this.state.user_words[index].answer}
              onChange={this.onUpdateWordHandler.bind(this, index)}
            />
          </td>
        </tr>
      );
    });

    const test_history = this.state.user_tests.map((test, index) => {
      return (
        <tr key={test.id}>
          <td>{test.date}</td>
          <td>{test.correct_answers + test.incorrect_answers}</td>
          <td>{test.correct_answers}</td>
          <td>{test.incorrect_answers}</td>
          <td>{Math.floor((test.correct_answers / (test.correct_answers + test.incorrect_answers)) * 100)}%</td>
          <td>
            <Link to={{ pathname: "/word-lists/" + this.state.wordlist_id + "/test/" + test.id }}>
              <Button variant="primary" block>
                details
              </Button>
            </Link>
          </td>
          <td>
            <Button variant="danger" block onClick={e => this.deleteTestHandler(e, index, test.id)}>
              delete
            </Button>
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

        <Modal show={this.state.error} modalClosed={this.errorConfirmedHandler}>
          <img src={errorLogo} alt="error" />
          {this.state.message}
        </Modal>

        <h1>
          <i className="fas fa-trophy" /> {this.state.user_wordlist_name}
        </h1>

        <Breadcrumb>
          <LinkContainer
            to={{
              pathname: "/word-lists/"
            }}
          >
            <BreadcrumbItem>Word Lists</BreadcrumbItem>
          </LinkContainer>
          <LinkContainer
            to={{
              pathname: "/word-lists/" + this.state.wordlist_id
            }}
          >
            <BreadcrumbItem>{this.state.user_wordlist_name}</BreadcrumbItem>
          </LinkContainer>
          <BreadcrumbItem active>Test</BreadcrumbItem>
        </Breadcrumb>

        <Wrapper>
          <h5>Tests history</h5>
          <hr />
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Total words</th>
                <th>Correct answers</th>
                <th>Incorrect answers</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>{test_history}</tbody>
          </Table>
        </Wrapper>

        <Wrapper>
          <h5>Complete the test</h5>
          <hr />
          <Form onSubmit={this.finshTestHandler}>
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Polish</th>
                  <th>Write an English answer</th>
                </tr>
              </thead>
              <tbody>{new_test}</tbody>
            </Table>
            <Button variant="primary" block type="submit">
              Finish the test
            </Button>
          </Form>
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(Test, axios);
