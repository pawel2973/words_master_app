import React, { Component } from "react";
import axios from "../../axios";
import {
  Button,
  Col,
  Form,
  Table,
  Breadcrumb,
  BreadcrumbItem,
  Alert
} from "react-bootstrap";
import classes from "./Teacher.module.css";
import Wrapper from "../../Components/UI/Wrapper/Wrapper";
import Modal from "../../Components/UI/Modal/Modal";
import happyLogo from "../../Assets/happy.png";
import { Link } from "react-router-dom";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

class Teacher extends Component {
  state = {
    wordlists: [],
    classroom_name: "",
    success: false,
    message: "",

    isTeacher: false,
    description: "",
    isApplicationSend: false
  };

  componentDidMount() {
    this.getTecher();
    this.getTeacherApplications();
  }

  getTecher = () => {
    //Get teachers from db
    axios
      .get("/api/word/teacher/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        //Check if the user is a teacher
        const teachers = res.data;
        teachers.forEach(teacher => {
          if (teacher.user === this.props.user_id) {
            this.setState({
              isTeacher: true
            });
          }
        });
      })
      .catch(error => {});
  };

  getTeacherApplications = () => {
    //Get teacher applications from db
    axios
      .get("/api/word/teacherapplication/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        //Check if the user is a teacher
        const applications = res.data;
        applications.forEach(application => {
          if (application.user === this.props.user_id) {
            console.log("KIEAA");
            this.setState({
              isApplicationSend: true
            });
          }
        });
      })
      .catch(error => {});
  };

  teacherApplicationHandler = () => {
    const formData = new FormData();
    formData.append("description", this.state.description);
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    axios
      .post("/api/word/teacherapplication/", formData, { headers })
      .then(response => {
        if (response.status === 201) {
          this.setState({
            classroom_name: "",
            success: true,
            message: "Teacher application was send."
          });
          this.getTeacherApplications();
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
    const wordlists = this.state.wordlists.map(wordlist => {
      return (
        <tr key={wordlist.id}>
          <td>{wordlist.name}</td>
          <td>{wordlist.date}</td>
          <td>{wordlist.total_words}</td>
          <td>
            <Link to={{ pathname: "/word-lists/" + wordlist.id }}>
              <Button
                className={classes.ButtonCreate}
                variant="secondary"
                block
              >
                Manage
              </Button>
            </Link>
          </td>
          <td>
            <Button className={classes.ButtonCreate} variant="success" block>
              Learn
            </Button>
          </td>
          <td>
            <Link
              to={{
                pathname: "/word-lists/" + wordlist.id + "/test",
                state: {
                  classroom_name: wordlist.name
                }
              }}
            >
              <Button className={classes.ButtonCreate} variant="primary" block>
                Test
              </Button>
            </Link>
          </td>
        </tr>
      );
    });

    return (
      <Wrapper>
        <Modal
          show={this.state.success}
          modalClosed={this.successConfirmedHandler}
        >
          <img src={happyLogo} alt="happy" />
          {this.state.message}
        </Modal>
        <h1>
          <i className="fas fa-chalkboard-teacher" /> Teacher
        </h1>
        <Breadcrumb>
          <BreadcrumbItem active>Teacher</BreadcrumbItem>
        </Breadcrumb>

        {(() => {
          if (
            this.state.isTeacher === false &&
            this.state.isApplicationSend === false
          )
            return (
              <>
                <Alert variant="warning">
                  <i className="fas fa-info-circle" /> You are currently{" "}
                  <strong>not a teacher.</strong> Apply if you want to create a
                  classroom.
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
                            value={this.state.description}
                            onChange={event =>
                              this.setState({ description: event.target.value })
                            }
                          />
                        </Col>
                        <Col xl={2} lg={3} md={3} sm={4} xs={4}>
                          <Button
                            className={classes.ButtonCreate}
                            variant="primary"
                            onClick={this.teacherApplicationHandler}
                            block
                          >
                            Apply
                          </Button>
                        </Col>
                      </Form.Row>
                    </Form.Group>
                  </Form>
                </Wrapper>
              </>
            );
          else if (
            this.state.isTeacher === false &&
            this.state.isApplicationSend === true
          )
            return (
              <Alert variant="primary">
                <i className="fas fa-info-circle" /> You have{" "}
                <strong>already sent</strong> the teacher's application.
                <hr />
                You must wait for an administrator response.
              </Alert>
            );
          else if (this.state.isTeacher === true);
          return (
            // Teacher's code
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
                          value={this.state.classroom_name}
                          onChange={event =>
                            this.setState({
                              classroom_name: event.target.value
                            })
                          }
                        />
                      </Col>
                      <Col xl={2} lg={3} md={3} sm={4} xs={4}>
                        <Button
                          className={classes.ButtonCreate}
                          variant="primary"
                          onClick={this.addWordListHandler}
                          block
                        >
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
                      <th>Created</th>
                      <th>Total words</th>
                    </tr>
                  </thead>
                  <tbody>{wordlists}</tbody>
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
