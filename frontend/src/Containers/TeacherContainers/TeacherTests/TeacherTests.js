import axios from "../../../axios";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import Modal from "../../../Components/UI/Modal/Modal";
import happyLogo from "../../../Assets/happy.png";

class TeacherTest extends Component {
  state = {
    classroom_id: this.props.match.params.classroomID,
    class_tests: [],
    classroom_name: "",
    message: "",
    number_of_students: null,
    success: false
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
        if (res.status === 200) {
          this.setState({
            classroom_name: res.data.name,
            number_of_students: res.data.students.length
          });
        }
      })
      .catch(error => {
        this.setState({
          redirect: true
        });
      });
  };

  getClassTests = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/classtests/", {
        headers
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            class_tests: [...res.data]
          });
        }
      })
      .catch(error => {
        this.setState({
          redirect: true
        });
      });
  };

  deleteTestHandler = (e, arr_id, test_id) => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    axios
      .delete("/api/word/classroom/" + this.state.classroom_id + "/classtests/" + test_id + "/", {
        headers
      })
      .then(response => {
        if (response.status === 204) {
          const class_tests = [...this.state.class_tests];
          class_tests.splice(arr_id, 1);
          this.setState({
            class_tests: [...class_tests],
            success: true,
            message: "Successful test delete."
          });
        }
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
    const class_tests = this.state.class_tests.map((class_test, index) => {
      return (
        <tr key={class_test.id}>
          <td>{class_test.name}</td>
          <td>{class_test.date}</td>
          <td>
            {class_test.tests_resolved} / {this.state.number_of_students}
          </td>
          <td>
            <Link to={{ pathname: "/teacher/" + this.state.classroom_id + "/teacher-tests/" + class_test.id }}>
              <Button variant="primary" block>
                details
              </Button>
            </Link>
          </td>
          <td>
            <Button variant="danger" block onClick={e => this.deleteTestHandler(e, index, class_test.id)}>
              delete
            </Button>
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
          <i className="fas fa-trophy" /> Tests
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

export default withErrorHandler(TeacherTest, axios);
