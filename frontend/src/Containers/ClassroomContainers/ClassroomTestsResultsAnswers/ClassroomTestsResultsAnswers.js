import React, { Component } from "react";
import axios from "../../../axios";
import { Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import happyLogo from "../../../Assets/happy.png";
import Modal from "../../../Components/UI/Modal/Modal";
import { LinkContainer } from "react-router-bootstrap";
import classes from "./ClassroomTestsResultsAnswers.module.css";

class ClassroomTestsResultsAnswers extends Component {
  state = {
    answers: [],
    test: {},
    classroom_id: this.props.match.params.classroomID,
    test_id: this.props.match.params.testID,
    wordlist_name: ""
  };

  componentDidMount() {
    this.getClassroom();
    this.getTestAndAnswers();
  }

  getClassroom = () => {
    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        this.setState({
          classroom_name: res.data.name
        });
      })
      .catch(error => {
        this.setState({
          redirect: true
        });
      });
  };

  getTestAndAnswers = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/showstudenttests/" + this.state.test_id, { headers })
      .then(res => {
        console.log(res.data);
        this.setState({
          test: res.data,
          test_name: res.data.classtest.name
        });
        return axios
          .get(
            "/api/word/classroom/" + this.state.classroom_id + "/showstudenttests/" + this.state.test_id + "/answers/",
            {
              headers
            }
          )
          .catch(error => {});
      })
      .then(res => {
        console.log(res.data);
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
          <i className="fas fa-history" /> Test: {this.state.test_name}
        </h1>

        <Breadcrumb>
          <LinkContainer
            to={{
              pathname: "/classrooms/"
            }}
          >
            <BreadcrumbItem>Classroom</BreadcrumbItem>
          </LinkContainer>
          <LinkContainer
            to={{
              pathname: "/classrooms/" + this.state.classroom_id
            }}
          >
            <BreadcrumbItem>{this.state.classroom_name}</BreadcrumbItem>
          </LinkContainer>
          <LinkContainer
            to={{
              pathname: "/classrooms/" + this.state.classroom_id + "/tests-results"
            }}
          >
            <BreadcrumbItem>Tests results</BreadcrumbItem>
          </LinkContainer>
          <BreadcrumbItem active>{this.state.test_name}</BreadcrumbItem>
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

export default withErrorHandler(ClassroomTestsResultsAnswers, axios);
