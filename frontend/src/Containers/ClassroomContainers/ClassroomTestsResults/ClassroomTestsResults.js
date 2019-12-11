import React, { Component } from "react";
import axios from "../../../axios";
import { Button, Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import Modal from "../../../Components/UI/Modal/Modal";
import happyLogo from "../../../Assets/happy.png";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import { Redirect } from "react-router-dom";

class ClassroomWordList extends Component {
  state = {
    classroom_id: this.props.match.params.classroomID,
    classroom_name: "",
    tests: [],
    wordlist_name: "",
    success: false,
    message: ""
  };

  componentDidMount() {
    this.getClassroom();
    this.getTest();
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
          classroom_name: res.data.name
        });
      })
      .catch(error => {
        this.setState({
          redirect: true
        });
      });
  };

  getTest = () => {
    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/showstudenttests/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        // console.log(res.data);
        this.setState({
          tests: res.data
        });
      })
      .catch(error => {
        this.setState({
          redirect: true
        });
      });

    console.log(this.state.tests);
  };

  copyWordListHandler = (e, word_list_name, word_list_id) => {
    e.preventDefault();
    let words = [];
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/classwordlist/" + word_list_id + "/classwords/", {
        headers
      })
      .then(res => {
        words = res.data;
        return axios
          .post(
            "/api/word/userwordlist/",
            { name: "[" + this.state.classroom_name + "] " + word_list_name },
            { headers }
          )
          .then(res => {
            return axios
              .post("/api/word/userwordlist/" + res.data.id + "/words/", words, { headers })
              .then(res => {
                if (res.status === 201) {
                  this.setState({
                    success: true,
                    message: "Word list copied successfully. Check your word lists."
                  });
                }
              })
              .catch(error => {});
          })
          .catch(error => {});
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
    if (this.state.redirect) {
      return <Redirect to={"/classroom"} />;
    }

    const tests = this.state.tests.map(test => {
      return (
        <tr key={test.id}>
          <td>{test.classtest.name}</td>
          <td>{Math.round(test.grade, 1).toFixed(1)}</td>
          <td>{test.date}</td>

          <td>{test.correct_answers}</td>
          <td>{test.incorrect_answers}</td>
          <td>{Math.floor((test.correct_answers / (test.correct_answers + test.incorrect_answers)) * 100)}%</td>

          <td>
            <Link to={{ pathname: "/classrooms/" + this.state.classroom_id + "/tests-results/" + test.id }}>
              <Button variant="secondary" block>
                Details
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
          <i className="fas fa-clipboard-list" /> Tests results
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
          <BreadcrumbItem active>Tests results</BreadcrumbItem>
        </Breadcrumb>

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

export default withErrorHandler(ClassroomWordList, axios);
