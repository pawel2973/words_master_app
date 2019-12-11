import React, { Component } from "react";
import axios from "../../../axios";
import { Button, Form, Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
// import classes from "./ClassroomTest.module.css";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import happyLogo from "../../../Assets/happy.png";
import Modal from "../../../Components/UI/Modal/Modal";
import { LinkContainer } from "react-router-bootstrap";
import { Redirect } from "react-router-dom";

class ClassroomTest extends Component {
  state = {
    words: [],
    tests: [],
    wordlist_id: "",
    wordlist_name: "",
    message: "",
    error: false,

    classroom_id: this.props.match.params.classroomID,
    test_id: this.props.match.params.testID,
    rating_system_id: "",
    classwordlist_id: "",
    ratingsystem: {},
    success_redirect: false
  };

  componentDidMount() {
    this.getClassroom();
    this.getTestDetails();
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
          classroom_name: res.data.name,
          number_of_students: res.data.students.length
        });
      })
      .catch(error => {
        this.setState({
          redirect: true
        });
      });
  };

  getTestDetails = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    axios
      // Get test information
      .get("/api/word/classroom/" + this.state.classroom_id + "/classtests/" + this.state.test_id + "/", { headers })
      .then(res => {
        this.setState({
          rating_system_id: res.data.ratingsystem,
          classwordlist_id: res.data.classwordlist,
          wordlist_name: res.data.name
        });

        return (
          axios
            // Get words from list
            .get(
              "/api/word/classroom/" +
                this.state.classroom_id +
                "/classwordlist/" +
                this.state.classwordlist_id +
                "/classwords/",
              { headers }
            )
            .then(res => {
              const words = res.data.map(obj => ({ ...obj, answer: "" }));
              this.setState({ words: words });
              return (
                axios
                  // Get rating system
                  .get(
                    "/api/word/classroom/" +
                      this.state.classroom_id +
                      "/classwordlist/" +
                      res.data.classwordlist +
                      "/ratingsystem/" +
                      this.state.rating_system_id +
                      "/",
                    { headers }
                  )
                  .then(res => {
                    this.setState({
                      ratingsystem: res.data
                    });
                  })
                  .catch(error => {})
              );
            })
            .catch(error => {})
        );
      })
      .catch(error => {});
  };

  finshTestHandler = e => {
    // Check if answer is correct and add it to list
    e.preventDefault();
    let correct_answers = 0;
    let incorrect_answers = 0;
    const answers = [...this.state.words].map(obj => {
      if (obj.english === obj.answer) {
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

    // Test result
    const percent = Math.floor((correct_answers / (correct_answers + incorrect_answers)) * 100);
    const ratingsystem = this.state.ratingsystem;
    let grade = null;

    if (percent <= ratingsystem.grade_2) {
      grade = 2;
    } else if (percent > ratingsystem.grade_2 && percent <= ratingsystem.grade_3) {
      grade = 3;
    } else if (percent > ratingsystem.grade_3 && percent <= ratingsystem.grade_4) {
      grade = 4;
    } else {
      grade = 5;
    }

    //Create student test model in db
    const formTestData = new FormData();
    formTestData.append("correct_answers", correct_answers);
    formTestData.append("incorrect_answers", incorrect_answers);
    formTestData.append("grade", grade);
    formTestData.append("classroom", this.state.classroom_id);
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    axios
      .post(
        "/api/word/classroom/" + this.state.classroom_id + "/classtests/" + this.state.test_id + "/studenttest/",
        formTestData,
        { headers }
      )
      .then(res => {
        //Save answers for test in db
        return axios
          .post(
            "/api/word/classroom/" +
              this.state.classroom_id +
              "/classtests/" +
              this.state.test_id +
              "/studenttest/" +
              res.data.id +
              "/studentanswers/",
            answers,
            { headers }
          )
          .catch(error => {});
      })
      .then(res => {
        this.setState({
          success_redirect: true
        });
      })
      .catch(error => {});
  };

  onUpdateWordHandler = (id, e) => {
    const words = [...this.state.words];
    words[id].answer = e.target.value;
    this.setState({ words: words });
  };

  render() {
    if (this.state.success_redirect) {
      return (
        <Redirect
          to={{
            pathname: "/classrooms/" + this.state.classroom_id + "/tests-results"
          }}
        />
      );
    }

    const new_test = this.state.words.map((word, index) => {
      return (
        <tr key={word.id}>
          <td>{this.state.words[index].polish}</td>
          <td>
            <Form.Control
              type="text"
              placeholder=""
              required
              value={this.state.words[index].answer}
              onChange={this.onUpdateWordHandler.bind(this, index)}
            />
          </td>
        </tr>
      );
    });

    return (
      <Wrapper>
        <h1>
          <i className="fas fa-trophy" /> {this.state.wordlist_name}
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
              pathname: "/classrooms/" + this.state.classroom_id + "/tests"
            }}
          >
            <BreadcrumbItem>{this.state.classroom_name}</BreadcrumbItem>
          </LinkContainer>
          <LinkContainer
            to={{
              pathname: "/classrooms/" + this.state.classroom_id + "/tests"
            }}
          >
            <BreadcrumbItem>Tests</BreadcrumbItem>
          </LinkContainer>
          <BreadcrumbItem active>{this.state.wordlist_name}</BreadcrumbItem>
        </Breadcrumb>

        <Wrapper>
          <h5>Take the test</h5>
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

export default withErrorHandler(ClassroomTest, axios);
