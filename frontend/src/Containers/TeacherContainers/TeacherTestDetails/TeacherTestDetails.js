import React, { Component } from "react";
import axios from "../../../axios";
import { Button, Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import Modal from "../../../Components/UI/Modal/Modal";
import happyLogo from "../../../Assets/happy.png";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import { Redirect } from "react-router-dom";
import { Pie } from "react-chartjs-2";

class TeacherTestDetails extends Component {
  state = {
    classroom_id: this.props.match.params.classroomID,
    class_test_id: this.props.match.params.testID,
    classroom_name: "",
    tests: [],
    wordlist_name: "",
    success: false,
    message: "",
    class_test_name: "",
    average_grade: ""
  };

  componentDidMount() {
    this.getClassroom();
    this.getClassTest();
    this.getTest();
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

  getClassTest = () => {
    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/classtests/" + this.state.class_test_id, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        this.setState({
          class_test_name: res.data.name
        });
      })
      .catch(error => {
        this.setState({
          redirect: true
        });
      });
  };

  getTest = () => {
    axios
      .get(
        "/api/word/classroom/" + this.state.classroom_id + "/classtests/" + this.state.class_test_id + "/studenttest/",
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`
          }
        }
      )
      .then(res => {
        console.log(res.data);
        // console.log(res.data);
        let average_grade = 0;

        const tests = [...res.data];
        let grade_list = [];
        let labels_list = [];

        tests.forEach(obj => {
          average_grade += obj.grade;
          grade_list.push(obj.grade);
        });

        console.log("AVG");
        console.log(average_grade);
        console.log(tests.length);

        // var arr = [5, 5, 5, 2, 2, 2, 2, 2, 9, 4]
        grade_list.sort((a, b) => a - b);
        const map = grade_list.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

        grade_list = [...map.values()];
        labels_list = [...map.keys()];

        if (average_grade !== 0) {
          average_grade = average_grade / tests.length;
        } else {
          average_grade = 0;
        }

        this.setState({
          tests: res.data,
          average_grade: average_grade,
          grade_list: grade_list,
          labels_list: labels_list
        });
      })
      .catch(error => {
        this.setState({
          redirect: true
        });
      });

    console.log(this.state.tests);
  };

  copyWordListHandler = (e, word_list_name, word_list_id) => {
    e.preventDefault();
    let words = [];
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/classwordlist/" + word_list_id + "/classwords/", {
        headers
      })
      .then(res => {
        words = res.data;
        return axios
          .post(
            "/api/word/userwordlist/",
            { name: "[" + this.state.classroom_name + "] " + word_list_name },
            { headers }
          )
          .then(res => {
            return axios
              .post("/api/word/userwordlist/" + res.data.id + "/words/", words, { headers })
              .then(res => {
                if (res.status === 201) {
                  this.setState({
                    success: true,
                    message: "Word list copied successfully. Check your word lists."
                  });
                }
              })
              .catch(error => {});
          })
          .catch(error => {});
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
    if (this.state.redirect) {
      return <Redirect to={"/classroom"} />;
    }

    const tests = this.state.tests.map(test => {
      return (
        <tr key={test.id}>
          <td>
            {test.user.first_name} {test.user.last_name}
          </td>
          <td>{Math.round(test.grade, 1).toFixed(1)}</td>
          <td>{test.date}</td>

          <td>{test.correct_answers}</td>
          <td>{test.incorrect_answers}</td>
          <td>{Math.floor((test.correct_answers / (test.correct_answers + test.incorrect_answers)) * 100)}%</td>

          <td>
            <Link
              to={{
                pathname: "/teacher/" + this.state.classroom_id + "/teacher-tests/" + test.classtest.id + "/" + test.id
              }}
            >
              <Button variant="secondary" block>
                Details
              </Button>
            </Link>
          </td>
        </tr>
      );
    });

    const data = {
      labels: this.state.labels_list,
      datasets: [
        {
          label: "Grades Chart",
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          data: this.state.grade_list
        }
      ]
    };

    return (
      <Wrapper>
        <Modal show={this.state.success} modalClosed={this.successConfirmedHandler}>
          <img src={happyLogo} alt="happy" />
          {this.state.message}
        </Modal>

        <h1>
          <i className="fas fa-clipboard-list" /> Tests results
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
          <BreadcrumbItem active>{this.state.class_test_name}</BreadcrumbItem>
        </Breadcrumb>

        <Wrapper>
          <h5>Test history</h5>
          <hr />
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Student</th>
                <th>Grade</th>
                <th>Date</th>
                <th>Correct anserws</th>
                <th>Incorrect anserws</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>{tests}</tbody>
          </Table>
        </Wrapper>

        <Wrapper>
          <h5>Test grade-point average is: {Number(this.state.average_grade).toFixed(2)}</h5>
          <hr />
          <Pie data={data} />
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(TeacherTestDetails, axios);
