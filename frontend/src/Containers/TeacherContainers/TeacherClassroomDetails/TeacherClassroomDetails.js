import axios from "../../../axios";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { Button, Row, Col, Form, Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import Modal from "../../../Components/UI/Modal/Modal";
import happyLogo from "../../../Assets/happy.png";
import errorLogo from "../../../Assets/error.png";

class TeacherClassroomDetail extends Component {
  state = {
    classroom_id: this.props.match.params.classroomID,
    students: [],
    student: {},
    student_email: "",
    classroom_name: "",
    message: "",
    student_id: null,
    isStudentExist: false,
    isStudentInClassroom: false,
    redirect: false,
    success: false,
    error: false
  };

  componentDidMount() {
    this.getClassroom();
    this.getClassroomStudents();
  }

  getClassroom = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/", { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            classroom_name: res.data.name
          });
        }
      })
      .catch(error => {
        this.setState({
          redirect: true
        });
      });
  };

  getClassroomStudents = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      // Get students from classroom
      .get("/api/word/classroom/" + this.state.classroom_id + "/", { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            students: [...res.data.students]
          });
        }
      })
      .catch(error => {});
  };

  addStudentHandler = e => {
    e.preventDefault();
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    // Find user with provided email
    axios
      .get("/api/word/user/", { headers })
      .then(res => {
        if (res.status === 200) {
          const users = res.data;
          users.forEach(user => {
            if (user.email === this.state.student_email) {
              // User Found
              this.state.students.forEach(student => {
                // Check if user is already in the classroom
                if (student.email === user.email) {
                  this.setState({
                    isStudentInClassroom: true
                  });
                }
              });
              if (this.state.isStudentInClassroom === false) {
                // If students is not in classroom
                this.setState({
                  isStudentExist: true,
                  student: user,
                  message: "Do you want to add a student to the class?"
                });
              }
            }
          });

          if (this.state.isStudentExist === false) {
            this.setState({
              error: true,
              message: "User not found."
            });
          }

          if (this.state.isStudentInClassroom === true) {
            this.setState({
              isStudentInClassroom: false,
              message: "The student already belongs to the classroom."
            });
          }
        }
      })
      .catch(error => {});
  };

  confirmAddStudentHandler = e => {
    e.preventDefault();
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    const students = [...this.state.students];
    const student = { ...this.state.student };
    students.push(student);

    axios
      .patch("/api/word/classroom/" + this.state.classroom_id + "/", { students: students }, { headers })
      .then(response => {
        if (response.status === 200) {
          this.setState({
            isStudentExist: false,
            student_email: ""
          });
        }
        this.getClassroomStudents();
      })
      .catch(error => {});
  };

  successConfirmedHandler = () => {
    this.setState({
      success: false,
      message: ""
    });
  };

  deleteStudentHandler = (e, arr_id) => {
    e.preventDefault();
    const students = [...this.state.students];
    students.splice(arr_id, 1);

    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    axios
      .patch("/api/word/classroom/" + this.state.classroom_id + "/", { students: students }, { headers })
      .then(response => {
        if (response.status === 200) {
          this.setState({
            students: students
          });
        }
      })
      .catch(error => {});
  };

  successAddStudentHandler = () => {
    this.setState({
      isStudentExist: false,
      message: ""
    });
  };

  errorConfirmedHandler = () => {
    this.setState({
      error: false,
      message: ""
    });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={"/teacher/"} />;
    }

    const students = this.state.students.map((student, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>
            {student.first_name} {student.last_name}
          </td>
          <td>{student.email}</td>
          <td>
            <Link to={{ pathname: "/teacher/" + this.state.classroom_id + "/student/" + student.id }}>
              <Button variant="primary" block>
                details
              </Button>
            </Link>
          </td>
          <td>
            <Button variant="danger" block onClick={e => this.deleteStudentHandler(e, index)}>
              delete
            </Button>
          </td>
        </tr>
      );
    });

    return (
      <Wrapper>
        <Modal show={this.state.success}>
          <img src={happyLogo} alt="happy" />
          {this.state.message}
        </Modal>

        <Modal show={this.state.isStudentExist} modalClosed={this.successAddStudentHandler}>
          <img src={happyLogo} alt="happy" />
          <Row>
            <Col>{this.state.message}</Col>
          </Row>
          <Row>
            <Col>
              <Button variant="success" onClick={this.confirmAddStudentHandler}>
                Confirm
              </Button>
            </Col>
          </Row>
        </Modal>

        <Modal show={this.state.error} modalClosed={this.errorConfirmedHandler}>
          <img src={errorLogo} alt="error" />
          {this.state.message}
        </Modal>

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
          <BreadcrumbItem active>{this.state.classroom_name}</BreadcrumbItem>
        </Breadcrumb>

        <Wrapper>
          <h5>Manage your classroom</h5>
          <Row>
            <Col>
              <Link to={{ pathname: "/teacher/" + this.state.classroom_id + "/word-lists" }}>
                <Button variant="primary" block>
                  Word lists
                </Button>
              </Link>
            </Col>

            <Col>
              <Link to={{ pathname: "/teacher/" + this.state.classroom_id + "/teacher-tests" }}>
                <Button variant="secondary" block>
                  Tests
                </Button>
              </Link>
            </Col>
          </Row>
        </Wrapper>

        <Wrapper>
          <h5>Students</h5>
          <hr />
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>{students}</tbody>
          </Table>
        </Wrapper>

        <Wrapper>
          <h5>Add student to class</h5>
          <Row>
            <Col xl={10} lg={9} md={9} sm={8} xs={8}>
              <Form.Control
                type="text"
                placeholder="provide student email"
                value={this.state.student_email}
                onChange={event =>
                  this.setState({
                    student_email: event.target.value
                  })
                }
              />
            </Col>

            <Col xl={2} lg={3} md={3} sm={4} xs={4}>
              <Button variant="primary" onClick={this.addStudentHandler} block>
                Add
              </Button>
            </Col>
          </Row>
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(TeacherClassroomDetail, axios);
