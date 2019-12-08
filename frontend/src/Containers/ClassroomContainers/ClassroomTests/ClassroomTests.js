import React, { Component } from "react";
import axios from "../../../axios";
import { Button, Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import Modal from "../../../Components/UI/Modal/Modal";
import happyLogo from "../../../Assets/happy.png";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";

class ClassroomTests extends Component {
  state = {
    classroom_id: this.props.match.params.classroomID,
    classroom_name: "",

    class_tests: [],
    success: false,
    message: "",
    number_of_students: ""
  };

  componentDidMount() {
    this.getClassroom();
    this.getClassTests();
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

  getClassTests = () => {
    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/classtests/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        this.setState({
          class_tests: res.data
        });
      })
      .catch(error => {
        this.setState({
          redirect: true
        });
      });
  };

  successConfirmedHandler = () => {
    this.setState({
      success: false,
      message: ""
    });
  };

  render() {
    const class_tests = this.state.class_tests.map((class_test, index) => {
      return (
        <tr key={class_test.id}>
          <td>{class_test.name}</td>
          <td>{class_test.date}</td>
          <td>YES / NO</td>
          <td>
            <Link to={{ pathname: "/classrooms/" + this.state.classroom_id + "/tests/" + class_test.id }}>
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
        <Modal show={this.state.success} modalClosed={this.successConfirmedHandler}>
          <img src={happyLogo} alt="happy" />
          {this.state.message}
        </Modal>

        <h1>
          <i className="fas fa-clipboard-list" /> Tests
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
          <h5>Created tests</h5>
          <hr />
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Created</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>{class_tests}</tbody>
          </Table>
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(ClassroomTests, axios);
