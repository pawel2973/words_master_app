import axios from "../../../axios";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import React, { Component } from "react";
import { Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import classes from "./TestAnswers.module.css";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import Modal from "../../../Components/UI/Modal/Modal";
import happyLogo from "../../../Assets/happy.png";

class TestAnswers extends Component {
  state = {
    user_wordlist_id: this.props.match.params.wordlistID,
    user_test_id: this.props.match.params.testID,
    user_test_answers: [],
    user_test: {},
    user_wordlist_name: ""
  };

  componentDidMount() {
    this.getUserWordsList();
    this.getUserTestAndAnswers();
  }

  getUserWordsList = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get("/api/word/userwordlist/" + this.state.user_wordlist_id + "/", { headers })
      .then(res => {
        this.setState({
          user_wordlist_name: res.data.name
        });
      })
      .catch(error => {});
  };

  getUserTestAndAnswers = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get("/api/word/userwordlist/" + this.state.user_wordlist_id + "/tests/" + this.state.user_test_id, { headers })
      .then(res => {
        this.setState({
          user_test: { ...res.data }
        });
        return axios
          .get(
            "/api/word/userwordlist/" + this.state.user_wordlist_id + "/tests/" + this.state.user_test_id + "/answers/",
            {
              headers
            }
          )
          .catch(error => {});
      })
      .then(res => {
        this.setState({
          user_test_answers: [...res.data]
        });
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
    const user_test_answers = this.state.user_test_answers.map((answer, index) => {
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
          <i className="fas fa-history" /> Test: {this.state.user_test.date}
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
              pathname: "/word-lists/" + this.state.user_wordlist_id
            }}
          >
            <BreadcrumbItem>{this.state.user_wordlist_name}</BreadcrumbItem>
          </LinkContainer>
          <LinkContainer
            to={{
              pathname: "/word-lists/" + this.state.user_wordlist_id + "/test"
            }}
          >
            <BreadcrumbItem>Test</BreadcrumbItem>
          </LinkContainer>
          <BreadcrumbItem active>{this.state.user_test.date}</BreadcrumbItem>
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
            <tbody>{user_test_answers}</tbody>
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
                <td>{(this.state.user_test.correct_answers + this.state.user_test.incorrect_answers).toString()}</td>
                <td className={classes.Correct}>{this.state.user_test.correct_answers}</td>
                <td className={classes.Incorrect}>{this.state.user_test.incorrect_answers}</td>
                <td>
                  {Math.floor(
                    (this.state.user_test.correct_answers /
                      (this.state.user_test.correct_answers + this.state.user_test.incorrect_answers)) *
                      100
                  ).toString()}
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
