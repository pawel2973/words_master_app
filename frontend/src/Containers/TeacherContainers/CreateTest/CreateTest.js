import React, { Component } from "react";
import axios from "../../../axios";
import { Button, Form, Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import { Redirect } from "react-router-dom";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import errorLogo from "../../../Assets/error.png";
import Modal from "../../../Components/UI/Modal/Modal";
import { LinkContainer } from "react-router-bootstrap";
// import classes from "./CreateTest.module.css";

class CreateTest extends Component {
  state = {
    words: [],
    wordlist_id: this.props.match.params.wordlistID,
    classroom_id: this.props.match.params.classroomID,
    classroom_name: "",
    wordlist_name: "",

    message: "",
    redirect: false,
    error: false,
    up_to_2: 29,
    up_to_3: 50,
    up_to_4: 80,
    rating_system_id: null,
    test_name: ""
  };

  componentDidMount() {
    this.getClassroom();
    this.getClassWordList();
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
          teacher_id: res.data.teacher
        });
      })
      .catch(error => {
        this.setState({
          redirect: true
        });
      });
  };

  getClassWordList = () => {
    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/classwordlist/" + this.state.wordlist_id + "/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        this.setState({
          wordlist_name: res.data.name,
          test_name: "[TEST] " + res.data.name
        });
      })
      .catch(error => {
        this.setState({
          error: true
        });
      });
  };

  createTestHandler = () => {
    if (this.state.up_to_2 < this.state.up_to_3 && this.state.up_to_3 < this.state.up_to_4) {
      if (this.state.up_to_2 > 99 || this.state.up_to_3 > 99 || this.state.up_to_4 > 99) {
        this.setState({
          error: true,
          message: "Values must be less than 100%."
        });
      } else {
        const headers = {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type": "application/x-www-form-urlencoded"
        };
        const ratingsystem = {
          grade_2: this.state.up_to_2,
          grade_3: this.state.up_to_3,
          grade_4: this.state.up_to_4
        };
        const formData = new FormData();
        Object.keys(ratingsystem).map(item => formData.append(item, ratingsystem[item]));
        axios
          .post(
            "/api/word/classroom/" +
              this.state.classroom_id +
              "/classwordlist/" +
              this.state.wordlist_id +
              "/ratingsystem/",
            formData,
            { headers }
          )
          .then(res => {
            this.setState({
              rating_system_id: res.data.id
            });
            const formData2 = new FormData();
            formData2.append("name", this.state.test_name);
            formData2.append("ratingsystem", this.state.rating_system_id);
            return axios
              .post(
                "/api/word/classroom/" +
                  this.state.classroom_id +
                  "/classwordlist/" +
                  this.state.wordlist_id +
                  "/classtests/",
                formData2,
                { headers }
              )
              .catch(error => {});
          })
          .then(res => {
            if (res.status === 201) {
              this.setState({
                redirect: true
              });
            }
          })
          .catch(error => {});
      }
    } else {
      this.setState({
        error: true,
        message: "You have entered the wrong percentage ranges."
      });
    }
  };

  errorConfirmedHandler = () => {
    this.setState({
      error: false,
      message: ""
    });
  };

  render() {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/teacher/" + this.state.classroom_id + "/teacher-tests"
          }}
        />
      );
    }

    return (
      <Wrapper>
        <Modal show={this.state.error} modalClosed={this.errorConfirmedHandler}>
          <img src={errorLogo} alt="happy" />
          {this.state.message}
        </Modal>

        <h1>
          <i className="far fa-edit" /> {this.state.wordlist_name}
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

          <LinkContainer
            to={{
              pathname: "/teacher/" + this.state.classroom_id + "/word-lists"
            }}
          >
            <BreadcrumbItem>Word lists</BreadcrumbItem>
          </LinkContainer>

          <LinkContainer
            to={{
              pathname: "/teacher/" + this.state.classroom_id + "/word-lists/" + this.state.wordlist_id
            }}
          >
            <BreadcrumbItem>{this.state.wordlist_name}</BreadcrumbItem>
          </LinkContainer>

          <BreadcrumbItem active>Create test</BreadcrumbItem>
        </Breadcrumb>

        <Wrapper>
          <h5>Test name</h5>
          <Form.Control
            type="text"
            placeholder="test name"
            value={this.state.test_name}
            onChange={event => this.setState({ test_name: event.target.value })}
          />
        </Wrapper>

        <Wrapper>
          <h5>Create rating system for test</h5>
          <hr />
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Grade</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Test percentage value of grade 2
                  <br />
                  <strong>(0 - {this.state.up_to_2}%)</strong>
                </td>
                <td>
                  <Form.Control
                    type="number"
                    placeholder="up to 2"
                    min={0}
                    max={100}
                    value={this.state.up_to_2}
                    onChange={event =>
                      this.setState({
                        up_to_2: event.target.value
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>
                  Test percentage value of grade 3
                  <br />
                  <strong>
                    ({Number(this.state.up_to_2) + 1} - {this.state.up_to_3}%)
                  </strong>
                </td>
                <td>
                  <Form.Control
                    type="number"
                    placeholder="up to 3"
                    min={0}
                    max={100}
                    value={this.state.up_to_3}
                    onChange={event =>
                      this.setState({
                        up_to_3: event.target.value
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>
                  Test percentage value of grade 4
                  <br />
                  <strong>
                    ({Number(this.state.up_to_3) + 1} - {this.state.up_to_4}%)
                  </strong>
                </td>
                <td>
                  <Form.Control
                    type="number"
                    placeholder="up to 4"
                    min={0}
                    max={100}
                    value={this.state.up_to_4}
                    onChange={event =>
                      this.setState({
                        up_to_4: event.target.value
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Test percentage value of grade 5</td>
                <td>({Number(this.state.up_to_4) + 1} - 100%)</td>
              </tr>
            </tbody>
          </Table>
          <Button variant="success" block onClick={this.createTestHandler}>
            Create
          </Button>
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(CreateTest, axios);
