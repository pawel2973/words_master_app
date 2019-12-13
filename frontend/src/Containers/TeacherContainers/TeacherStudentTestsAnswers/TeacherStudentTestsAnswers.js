import React, { Component } from "react";
import axios from "../../../axios";
import { Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import happyLogo from "../../../Assets/happy.png";
import Modal from "../../../Components/UI/Modal/Modal";
import { LinkContainer } from "react-router-bootstrap";
import classes from "./TeacherStudentTestsAnswers.module.css";

class TeacherStudentTestsAnswers extends Component {
  state = {
    answers: [],
    test: {},
    classroom_id: this.props.match.params.classroomID,
    test_id: this.props.match.params.testID,
    stud_test_id: this.props.match.params.studenttestID,
    wordlist_name: "",
    test_name: ""
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
      // # api/word/classroom/{pk}/classtests/{pk}/studenttest/{pk}/studentanswers/
      .get(
        "/api/word/classroom/" +
          this.state.classroom_id +
          "/classtests/" +
          this.state.test_id +
          "/studenttest/" +
          this.state.stud_test_id +
          "/",
        { headers }
      )
      .then(res => {
        console.log(res.data);
        this.setState({
          test: res.data,
          test_name: res.data.classtest.name
        });
        return axios
          .get(
            "/api/word/classroom/" +
              this.state.classroom_id +
              "/classtests/" +
              this.state.test_id +
              "/studenttest/" +
              this.state.stud_test_id +
              "/studentanswers/",
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
        console.log(this.state.answers);
      })
      .catch(error => {});
  };

  successConfirmedHandler = () => {
    this.setState({ success: false, message: "" });
  };

  render() {
    const answers = this.state.answers.map((answer, index) => {
      console.log("D");
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
              pathname: "/teacher/"
            }}
          >
            <BreadcrumbItem>Teacher</BreadcrumbItem>
          </LinkContainer>
          <LinkContainer
            to={{
              pathname: "/teacher/" + this.state.classroom_id
            }}
          >
            <BreadcrumbItem>{this.state.classroom_name}</BreadcrumbItem>
          </LinkContainer>
          <LinkContainer
            to={{
              pathname: "/teacher/" + this.state.classroom_id + "/teacher-tests"
            }}
          >
            <BreadcrumbItem>Tests</BreadcrumbItem>
          </LinkContainer>

          <LinkContainer
            to={{
              pathname: "/teacher/" + this.state.classroom_id + "/teacher-tests/" + this.state.test_id
            }}
          >
            <BreadcrumbItem>{this.state.test_name}</BreadcrumbItem>
          </LinkContainer>

          <BreadcrumbItem active>Answers</BreadcrumbItem>
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

export default withErrorHandler(TeacherStudentTestsAnswers, axios);
