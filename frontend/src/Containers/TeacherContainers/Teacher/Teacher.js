import axios from "../../../axios";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Form, Table, Breadcrumb, BreadcrumbItem, Alert } from "react-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import Modal from "../../../Components/UI/Modal/Modal";
import happyLogo from "../../../Assets/happy.png";

class Teacher extends Component {
  state = {
    teacher_classrooms: [],
    new_classroom_name: "",
    teacher_application_description: "",
    message: "",
    isTeacher: false,
    classroom_to_delete_id: null,
    isTeacherApplicationSend: false,
    success: false
  };

  componentDidMount() {
    this.getTecher();
    this.getTeacherClassrooms();
  }

  getTecher = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    //Get teachers from db
    axios
      .get("/api/word/teacher/", { headers })
      .then(res => {
        if (res.status === 200) {
          const teachers = res.data;
          teachers.forEach(teacher => {
            //Check if the user is a teacher
            if (teacher.user === this.props.user_id) {
              this.setState({
                isTeacher: true
              });
            } else {
              this.getTeacherApplications();
            }
          });
        }
      })
      .catch(error => {});
  };

  getTeacherApplications = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    //Get teacher applications from db
    axios
      .get("/api/word/teacherapplication/", { headers })
      .then(res => {
        //Check if the user is a teacher
        const applications = res.data;
        applications.forEach(application => {
          if (application.user === this.props.user_id) {
            this.setState({
              isTeacherApplicationSend: true
            });
          }
        });
      })
      .catch(error => {});
  };

  teacherApplicationHandler = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    const formData = new FormData();
    formData.append("teacher_application_description", this.state.teacher_application_description);

    axios
      .post("/api/word/teacherapplication/", formData, { headers })
      .then(response => {
        if (response.status === 201) {
          this.setState({
            success: true,
            message: "Teacher application was send."
          });
          this.getTeacherApplications();
        }
      })
      .catch(error => {});
  };

  createClasroomHandler = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    const formData = new FormData();
    formData.append("name", this.state.new_classroom_name);

    axios
      .post("/api/word/classroom/", formData, { headers })
      .then(response => {
        if (response.status === 201) {
          this.setState({
            success: true,
            message: "Teacher classroom successfully was send.",
            new_classroom_name: ""
          });
          this.getTeacherClassrooms();
        }
      })
      .catch(error => {});
  };

  deleteClassroomHandler = (e, arr_id, classroom_to_delete_id) => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .delete("/api/word/classroom/" + classroom_to_delete_id + "/", { headers })
      .then(response => {
        if (response.status === 204) {
          const teacher_classrooms = [...this.state.teacher_classrooms];
          teacher_classrooms.splice(arr_id, 1);
          this.setState({
            teacher_classrooms: teacher_classrooms,
            success: true,
            message: "Successful classroom delete."
          });
        }
      })
      .catch(error => {});
  };

  getTeacherClassrooms = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    //Get teacher applications from db
    axios
      .get("/api/word/classroom/", { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            teacher_classrooms: [...res.data]
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
    const teacher_classrooms = this.state.teacher_classrooms.map((classroom, index) => {
      return (
        <tr key={classroom.id}>
          <td>{classroom.name}</td>
          <td>{classroom.students.length}</td>
          <td>
            <Link to={{ pathname: "/teacher/" + classroom.id }}>
              <Button variant="secondary" block>
                Manage
              </Button>
            </Link>
          </td>
          <td>
            <Button variant="danger" block onClick={e => this.deleteClassroomHandler(e, index, classroom.id)}>
              Delete
            </Button>
          </td>
        </tr>
      );
    });

    const teacherapplication = (
      <>
        <Alert variant="warning">
          <i className="fas fa-info-circle" /> You are currently <strong>not a teacher.</strong> Apply if you want to
          create a classroom.
        </Alert>
        <Wrapper>
          <Form>
            <h5>Apply for a teacher account</h5>
            <Form.Group>
              <Form.Row>
                <Col xl={10} lg={9} md={9} sm={8} xs={8}>
                  <Form.Control
                    as="textarea"
                    rows="3"
                    placeholder="Tell something about you and your school."
                    value={this.state.teacher_application_description}
                    onChange={event => this.setState({ teacher_application_description: event.target.value })}
                  />
                </Col>
                <Col xl={2} lg={3} md={3} sm={4} xs={4}>
                  <Button variant="primary" onClick={this.teacherApplicationHandler} block>
                    Apply
                  </Button>
                </Col>
              </Form.Row>
            </Form.Group>
          </Form>
        </Wrapper>
      </>
    );

    const teacherapplicationalert = (
      <Alert variant="primary">
        <i className="fas fa-info-circle" /> You have <strong>already sent</strong> the teacher's application.
        <hr /> You must wait for an administrator response.
      </Alert>
    );

    return (
      <Wrapper>
        <Modal show={this.state.success} modalClosed={this.successConfirmedHandler}>
          <img src={happyLogo} alt="happy" />
          {this.state.message}
        </Modal>
        <h1>
          <i className="fas fa-school" /> Teacher
        </h1>
        <Breadcrumb>
          <BreadcrumbItem active>Teacher</BreadcrumbItem>
        </Breadcrumb>

        {(() => {
          if (this.state.isTeacher === false && this.state.isTeacherApplicationSend === false)
            // Return teacher application form
            return teacherapplication;
          else if (this.state.isTeacher === false && this.state.isTeacherApplicationSend === true)
            // Return information about verification of a sent user application
            return teacherapplicationalert;
          else if (this.state.isTeacher === true);
          return (
            // Classroom managament
            <>
              <Wrapper>
                <Form>
                  <h5>Create classroom</h5>
                  <Form.Group>
                    <Form.Row>
                      <Col xl={10} lg={9} md={9} sm={8} xs={8}>
                        <Form.Control
                          type="text"
                          placeholder="classroom name"
                          value={this.state.new_classroom_name}
                          onChange={event => this.setState({ new_classroom_name: event.target.value })}
                        />
                      </Col>
                      <Col xl={2} lg={3} md={3} sm={4} xs={4}>
                        <Button variant="primary" onClick={this.createClasroomHandler} block>
                          Create
                        </Button>
                      </Col>
                    </Form.Row>
                  </Form.Group>
                </Form>
              </Wrapper>

              <Wrapper>
                <h5>Your classrooms</h5>
                <hr />
                <Table responsive striped bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Total students</th>
                    </tr>
                  </thead>
                  <tbody>{teacher_classrooms}</tbody>
                </Table>
              </Wrapper>
            </>
          );
        })()}
      </Wrapper>
    );
  }
}

export default withErrorHandler(Teacher, axios);
