import axios from "../../../axios";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Row, Col, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import { Line } from "react-chartjs-2";

class ClassroomDetail extends Component {
  state = {
    classroom_id: this.props.match.params.classroomID,
    student_tests: [],
    student_grade_list: [],
    student_labels_list: [],
    classroom_name: "",
    student_average_grade: 0,
    redirect: false
  };

  componentDidMount() {
    this.getClassroom();
    this.getStudentTestStatistics();
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

  getStudentTestStatistics = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    let student_average_grade = 0;

    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/studenttests/", { headers })
      .then(res => {
        const tests = [...res.data];
        const grade_list = [];
        const labels_list = [];

        tests.forEach(obj => {
          student_average_grade += obj.grade;
          grade_list.push(obj.grade);
          labels_list.push(obj.date);
        });

        if (student_average_grade !== 0) {
          student_average_grade = student_average_grade / tests.length;
        } else {
          student_average_grade = 0;
        }

        this.setState({
          student_tests: [...tests],
          student_average_grade: student_average_grade,
          student_grade_list: [...grade_list],
          student_labels_list: [...labels_list]
        });
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
          <i className="fas fa-chalkboard-teacher" /> {this.state.classroom_name}
        </h1>

        <Breadcrumb>
          <LinkContainer
            to={{
              pathname: "/classrooms/"
            }}
          >
            <BreadcrumbItem>Classrooms</BreadcrumbItem>
          </LinkContainer>
          <BreadcrumbItem active>{this.state.classroom_name}</BreadcrumbItem>
        </Breadcrumb>

        <Wrapper>
          <h5>Explore your classroom</h5>
          <Row>
            <Col>
              <Link to={{ pathname: "/classrooms/" + this.state.classroom_id + "/word-lists" }}>
                <Button variant="primary" block>
                  Word lists
                </Button>
              </Link>
            </Col>

            <Col>
              <Link to={{ pathname: "/classrooms/" + this.state.classroom_id + "/tests" }}>
                <Button variant="secondary" block>
                  Tests
                </Button>
              </Link>
            </Col>

            <Col>
              <Link to={{ pathname: "/classrooms/" + this.state.classroom_id + "/tests-results" }}>
                <Button variant="info" block>
                  Tests results
                </Button>
              </Link>
            </Col>
          </Row>
        </Wrapper>

        <Wrapper>
          <h5>Your grade-point average is: {Number(this.state.student_average_grade).toFixed(2)}</h5>
          <hr />
          <Line data={data} />
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(ClassroomDetail, axios);
