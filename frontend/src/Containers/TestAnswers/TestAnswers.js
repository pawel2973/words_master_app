import React, { Component } from "react";
import axios from "../../axios";
import { Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import Wrapper from "../../Components/UI/Wrapper/Wrapper";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import happyLogo from "../../Assets/happy.png";
import Modal from "../../Components/UI/Modal/Modal";
import { LinkContainer } from "react-router-bootstrap";
import classes from "./TestAnswers.module.css";

class TestAnswers extends Component {
  state = {
    answers: [],
    test: {},
    wordlist_id: this.props.match.params.wordlistID,
    test_id: this.props.match.params.testID,
    wordlist_name: ""
  };

  componentDidMount() {
    this.getWordsList();
    this.getTestAndAnswers();
  }

  getWordsList = () => {
    axios
      .get("/api/word/userwordlist/" + this.state.wordlist_id + "/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        this.setState({
          wordlist_name: res.data.name
        });
      })
      .catch(error => {});
  };

  getTestAndAnswers = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get("/api/word/userwordlist/" + this.state.wordlist_id + "/tests/" + this.state.test_id, { headers })
      .then(res => {
        this.setState({
          test: res.data
        });
        return axios
          .get("/api/word/userwordlist/" + this.state.wordlist_id + "/tests/" + this.state.test_id + "/answers/", {
            headers
          })
          .catch(error => {});
      })
      .then(res => {
        this.setState({
          answers: res.data
        });
      })
      .catch(error => {});
  };

  successConfirmedHandler = () => {
    this.setState({ success: false, message: "" });
  };

  render() {
    const answers = this.state.answers.map((answer, index) => {
      return (
        <tr key={answer.id} className={answer.correct ? classes.Correct : classes.Incorrect}>
          <td>{answer.polish}</td>
          <td>{answer.english}</td>
          <td>{answer.answer}</td>
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
          <i className="fas fa-trophy" /> Test: {this.state.test.date}
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
            <BreadcrumbItem>{this.state.wordlist_name}</BreadcrumbItem>
          </LinkContainer>
          <LinkContainer
            to={{
              pathname: "/word-lists/" + this.state.wordlist_id + "/test"
            }}
          >
            <BreadcrumbItem>Test</BreadcrumbItem>
          </LinkContainer>
          <BreadcrumbItem active>{this.state.test.date}</BreadcrumbItem>
        </Breadcrumb>

        <Wrapper>
          <h5>Test answers</h5>
          <Table responsive bordered>
            <thead>
              <tr>
                <th>Polish</th>
                <th>English</th>
                <th>Your english answer</th>
              </tr>
            </thead>
            <tbody>{answers}</tbody>
          </Table>
        </Wrapper>

        <Wrapper>
          <h5>Summary</h5>
          <hr />
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Total words</th>
                <th>Correct answers</th>
                <th>Incorrect answers</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{(this.state.test.correct_answers + this.state.test.incorrect_answers).toString()}</td>
                <td className={classes.Correct}>{this.state.test.correct_answers}</td>
                <td className={classes.Incorrect}>{this.state.test.incorrect_answers}</td>
                <td>
                  {Math.floor(
                    (this.state.test.correct_answers /
                      (this.state.test.correct_answers + this.state.test.incorrect_answers)) *
                      100
                  )}
                  %
                </td>
              </tr>
            </tbody>
          </Table>
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(TestAnswers, axios);
