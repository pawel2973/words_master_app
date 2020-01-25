import axios from "../../../axios";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import React, { Component } from "react";
import { Button, Form, Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";

class ClassroomTest extends Component {
  state = {
    classroom_id: this.props.match.params.classroomID,
    test_id: this.props.match.params.testID,
    class_test_words: [],
    ratingsystem: {},
    class_wordlist_id: "",
    class_wordlist_name: "",
    rating_system_id: "",
    success_redirect: false
  };

  componentDidMount() {
    this.getClassroom();
    this.getTestDetails();
  }

  getClassroom = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/", { headers })
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
          class_wordlist_id: res.data.classwordlist,
          class_wordlist_name: res.data.name
        });

        return (
          axios
            // Get words from list
            .get(
              "/api/word/classroom/" +
                this.state.classroom_id +
                "/classwordlist/" +
                this.state.class_wordlist_id +
                "/classwords/",
              { headers }
            )
            .then(res => {
              const class_test_words = res.data.map(obj => ({ ...obj, answer: "" }));
              this.setState({
                class_test_words: [...class_test_words]
              });
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
                      ratingsystem: { ...res.data }
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
    e.preventDefault();
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    let correct_answers = 0;
    let incorrect_answers = 0;

    // Check if answer is correct and add it to list
    const answers = [...this.state.class_test_words].map(obj => {
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

    axios
      .post(
        "/api/word/classroom/" + this.state.classroom_id + "/classtests/" + this.state.test_id + "/studenttestcreate/",
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
    const words = [...this.state.class_test_words];
    words[id].answer = e.target.value;
    this.setState({ class_test_words: words });
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

    const new_test = this.state.class_test_words.map((word, index) => {
      return (
        <tr key={word.id}>
          <td>{this.state.class_test_words[index].polish}</td>
          <td>
            <Form.Control
              type="text"
              placeholder=""
              required
              value={this.state.class_test_words[index].answer}
              onChange={this.onUpdateWordHandler.bind(this, index)}
            />
          </td>
        </tr>
      );
    });

    return (
      <Wrapper>
        <h1>
          <i className="fas fa-trophy" /> {this.state.class_wordlist_name}
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
          <BreadcrumbItem active>{this.state.class_wordlist_name}</BreadcrumbItem>
        </Breadcrumb>

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

export default withErrorHandler(ClassroomTest, axios);
