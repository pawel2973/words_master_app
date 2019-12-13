import React, { Component } from "react";
import axios from "../../../axios";
import { Button, Table, Row, Col, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import { Redirect } from "react-router-dom";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";

class StudentStatististics extends Component {
  state = {
    classroom_id: this.props.match.params.classroomID,
    student_id: this.props.match.params.studentID,
    classroom_name: "",
    average_grade: 0,
    tests: [],
    grade_list: [],
    labels_list: [],
    student: {}
  };

  componentDidMount() {
    this.getClassroom();
    this.getUser();
    this.getTestStatistics();
  }

  getClassroom = () => {
    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        this.setState({ classroom_name: res.data.name });
      })
      .catch(error => {
        this.setState({
          redirect: true
        });
      });
  };

  getUser = () => {
    axios
      .get("/api/word/user/" + this.state.student_id + "/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        console.log(res.data);

        this.setState({ student: res.data });
      })
      .catch(error => {
        this.setState({
          redirect: true
        });
      });
  };

  getTestStatistics = () => {
    let average_grade = 0;
    axios
      .get(
        "/api/word/classroom/" +
          this.state.classroom_id +
          "/student/" +
          this.state.student_id +
          "/teacherstudenttests/",
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`
          }
        }
      )
      .then(res => {
        console.log(res.data);
        const tests = [...res.data];
        const grade_list = [];
        const labels_list = [];

        tests.forEach(obj => {
          average_grade += obj.grade;
          grade_list.push(obj.grade);
          labels_list.push(obj.date);
        });

        if (average_grade !== 0) {
          average_grade = average_grade / tests.length;
        } else {
          average_grade = 0;
        }

        this.setState({
          tests: res.data,
          average_grade: average_grade,
          grade_list: grade_list.reverse(),
          labels_list: labels_list.reverse()
        });
      })
      .catch(error => {
        this.setState({
          redirect: true
        });
      });
    // console.log(average_grade);
  };

  render() {
    // if (this.state.redirect) {
    //   return <Redirect to={"/teacher/"} />;
    // }

    const tests = this.state.tests.map(test => {
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
      labels: this.state.labels_list,
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
          data: this.state.grade_list
        }
      ]
    };

    return (
      <Wrapper>
        <h1>
          <i className="fas fa-chalkboard-teacher" /> {this.state.classroom_name}
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
            {Number(this.state.average_grade).toFixed(2)}
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
