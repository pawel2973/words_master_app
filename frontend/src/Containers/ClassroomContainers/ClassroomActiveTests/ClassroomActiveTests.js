import axios from "../../../axios";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";

class ClassroomActiveTests extends Component {
  state = {
    classroom_id: this.props.match.params.classroomID,
    classroom_tests: [],
    classroom_name: ""
  };

  componentDidMount() {
    this.getClassroom();
    this.getClassTests();
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
      .catch(error => {});
  };

  getClassTests = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    let classtests = [];

    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/classtests/", { headers })
      .then(res => {
        classtests = [...res.data];
        return axios
          .get("/api/word/classroom/" + this.state.classroom_id + "/studenttests/", { headers })
          .catch(error => {});
      })
      .then(res => {
        const student_tests = [...res.data];
        const classroom_tests_to_remove = [];

        classtests.forEach(c_test => {
          student_tests.forEach(s_test => {
            if (c_test.id === s_test.classtest) {
              classroom_tests_to_remove.push(c_test);
            }
          });
        });

        classroom_tests_to_remove.forEach(r_test => {
          classtests = classtests.filter(currentValue => currentValue.id !== r_test.id);
        });

        this.setState({
          classroom_tests: [...classtests]
        });
      });
  };

  render() {
    const classroom_tests = this.state.classroom_tests.map(test => {
      return (
        <tr key={test.id}>
          <td>{test.name}</td>
          <td>{test.date}</td>
          <td>
            <Link to={{ pathname: "/classrooms/" + this.state.classroom_id + "/tests/" + test.id }}>
              <Button variant="primary" block>
                Start Test
              </Button>
            </Link>
          </td>
        </tr>
      );
    });

    return (
      <Wrapper>
        <h1>
          <i className="fas fa-trophy" /> Tests
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
          <BreadcrumbItem active>Tests</BreadcrumbItem>
        </Breadcrumb>

        <Wrapper>
          <h5>Active tests</h5>
          <hr />
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>{classroom_tests}</tbody>
          </Table>
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(ClassroomActiveTests, axios);
