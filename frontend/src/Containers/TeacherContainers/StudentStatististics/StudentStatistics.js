import axios from "../../../axios";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import { Line } from "react-chartjs-2";

class StudentStatististics extends Component {
  state = {
    classroom_id: this.props.match.params.classroomID,
    student_id: this.props.match.params.studentID,
    student_tests: [],
    student_grade_list: [],
    student_labels_list: [],
    student: {},
    classroom_name: "",
    student_average_grade: 0
  };

  componentDidMount() {
    this.getClassroom();
    this.getStudent();
    this.getStudentTestStatistics();
  }

  getClassroom = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/", { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({ classroom_name: res.data.name });
        }
      })
      .catch(error => {
        this.setState({
          redirect: true
        });
      });
  };

  getStudent = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get("/api/word/user/" + this.state.student_id + "/", { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({ student: res.data });
        }
      })
      .catch(error => {
        this.setState({
          redirect: true
        });
      });
  };

  getStudentTestStatistics = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    let student_average_grade = 0;

    axios
      .get(
        "/api/word/classroom/" +
          this.state.classroom_id +
          "/student/" +
          this.state.student_id +
          "/teacherstudenttests/",
        { headers }
      )
      .then(res => {
        if (res.status === 200) {
          const tests = [...res.data];
          const student_grade_list = [];
          const student_labels_list = [];

          tests.forEach(obj => {
            student_average_grade += obj.grade;
            student_grade_list.push(obj.grade);
            student_labels_list.push(obj.date);
          });

          if (student_average_grade !== 0) {
            student_average_grade = student_average_grade / tests.length;
          } else {
            student_average_grade = 0;
          }

          this.setState({
            student_tests: res.data,
            student_average_grade: student_average_grade,
            student_grade_list: student_grade_list.reverse(),
            student_labels_list: student_labels_list.reverse()
          });
        }
      })
      .catch(error => {
        this.setState({
          redirect: true
        });
      });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={"/teacher/"} />;
    }

    const tests = this.state.student_tests.map(test => {
      return (
        <tr key={test.id}>
          <td>{test.classtest.name}</td>
          <td>{Math.round(test.grade, 1).toFixed(1)}</td>
          <td>{test.date}</td>

          <td>{test.correct_answers}</td>
          <td>{test.incorrect_answers}</td>
          <td>{Math.floor((test.correct_answers / (test.correct_answers + test.incorrect_answers)) * 100)}%</td>
        </tr>
      );
    });

    const data = {
      labels: this.state.student_labels_list,
      datasets: [
        {
          label: "Grades Chart",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state.student_grade_list
        }
      ]
    };

    return (
      <Wrapper>
        <h1>
          <i class="fas fa-graduation-cap" /> {this.state.student.first_name} {this.state.student.last_name}
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
          <BreadcrumbItem active>
            {this.state.student.first_name} {this.state.student.last_name}
          </BreadcrumbItem>
        </Breadcrumb>

        <Wrapper>
          <h5>
            {this.state.student.first_name} {this.state.student.last_name} grade-point average is:{" "}
            {Number(this.state.student_average_grade).toFixed(2)}
          </h5>
          <hr />
          <Line data={data} />
        </Wrapper>

        <Wrapper>
          <h5>Test history</h5>
          <hr />
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
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
      </Wrapper>
    );
  }
}

export default withErrorHandler(StudentStatististics, axios);
