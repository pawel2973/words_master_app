import axios from "../../../axios";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import React, { Component } from "react";
import { Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import classes from "./TeacherStudentTestsAnswers.module.css";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import Modal from "../../../Components/UI/Modal/Modal";
import happyLogo from "../../../Assets/happy.png";

class TeacherStudentTestsAnswers extends Component {
  state = {
    classroom_id: this.props.match.params.classroomID,
    class_test_id: this.props.match.params.testID,
    stud_test_id: this.props.match.params.studenttestID,
    student_answers: [],
    student_test: {},
    wordlist_name: "",
    class_test_name: ""
  };

  componentDidMount() {
    this.getClassroom();
    this.getStudentTestAndAnswers();
  }

  getClassroom = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/", { headers })
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

  getStudentTestAndAnswers = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get(
        "/api/word/classroom/" +
          this.state.classroom_id +
          "/classtests/" +
          this.state.class_test_id +
          "/studenttest/" +
          this.state.stud_test_id +
          "/",
        { headers }
      )
      .then(res => {
        this.setState({
          student_test: { ...res.data },
          class_test_name: res.data.classtest.name
        });
        return axios
          .get(
            "/api/word/classroom/" +
              this.state.classroom_id +
              "/classtests/" +
              this.state.class_test_id +
              "/studenttest/" +
              this.state.stud_test_id +
              "/studentanswers/",
            { headers }
          )
          .catch(error => {});
      })
      .then(res => {
        this.setState({
          student_answers: [...res.data]
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
    const student_answers = this.state.student_answers.map((answer, index) => {
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
          <i className="fas fa-history" /> Test: {this.state.class_test_name}
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
              pathname: "/teacher/" + this.state.classroom_id + "/teacher-tests/" + this.state.class_test_id
            }}
          >
            <BreadcrumbItem>{this.state.class_test_name}</BreadcrumbItem>
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
            <tbody>{student_answers}</tbody>
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
                <td>
                  {(this.state.student_test.correct_answers + this.state.student_test.incorrect_answers).toString()}
                </td>
                <td className={classes.Correct}>{this.state.student_test.correct_answers}</td>
                <td className={classes.Incorrect}>{this.state.student_test.incorrect_answers}</td>
                <td>
                  {Math.floor(
                    (this.state.student_test.correct_answers /
                      (this.state.student_test.correct_answers + this.state.student_test.incorrect_answers)) *
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
