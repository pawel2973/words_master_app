import React, { Component } from "react";
import axios from "../../../axios";
import { Button, Row, Col, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import { Redirect } from "react-router-dom";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";

class ClassroomDetail extends Component {
  state = {
    classroom_id: this.props.match.params.classroomID,
    classroom_name: "",
    average_grade: 0,
    tests: [],
    grade_list: [],
    labels_list: []
  };

  componentDidMount() {
    this.getClassroom();
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

  getTestAndAnswers = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/showstudenttests/" + this.state.test_id, { headers })
      .then(res => {
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
        this.setState({
          answers: res.data
        });
      })
      .catch(error => {});
  };

  getTestStatistics = () => {
    let average_grade = 0;

    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/showstudenttests/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
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
    if (this.state.redirect) {
      return <Redirect to={"/teacher/"} />;
    }

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
          <h5>Your grade-point average is: {Math.round(this.state.average_grade, 2).toFixed(2)}</h5>
          <hr />
          <Line data={data} />
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(ClassroomDetail, axios);
