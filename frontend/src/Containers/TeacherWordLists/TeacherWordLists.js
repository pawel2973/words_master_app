import React, { Component } from "react";
import axios from "../../axios";
import { Button, Col, Form, Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import Wrapper from "../../Components/UI/Wrapper/Wrapper";
import Modal from "../../Components/UI/Modal/Modal";
import happyLogo from "../../Assets/happy.png";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import { Redirect } from "react-router-dom";

class TeacherWordLists extends Component {
  state = {
    classroom_id: this.props.match.params.classroomID,
    classroom_name: "",
    teacher_id: "",

    wordlists: [],
    wordlist_name: "",
    success: false,
    message: ""
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
      .get("/api/word/classroom/" + this.state.classroom_id + "/classwordlist/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        this.setState({
          wordlists: res.data
        });
      })
      .catch(error => {
        this.setState({
          redirect: true
        });
      });
  };

  addWordListHandler = () => {
    const formData = new FormData();
    formData.append("name", this.state.wordlist_name);
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    axios
      .post("/api/word/classroom/" + this.state.classroom_id + "/classwordlist/", formData, { headers })
      .then(response => {
        if (response.status === 201) {
          this.setState({
            wordlist_name: "",
            success: true,
            message: "Successful word list create."
          });
          this.getClassWordList();
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
    if (this.state.redirect) {
      return <Redirect to={"/teacher"} />;
    }

    const wordlists = this.state.wordlists.map(wordlist => {
      return (
        <tr key={wordlist.id}>
          <td>{wordlist.name}</td>
          <td>{wordlist.date}</td>
          <td>{wordlist.total_words}</td>
          <td>{String(wordlist.visibility)}</td>
          <td>
            {/* /api/word/classroom/{pk}/classwordlist/{pk}/classwords/ */}
            {/* path="/teacher/:classroomID/word-lists/:wordlistID" */}
            <Link to={{ pathname: "/teacher/" + this.state.classroom_id + "/word-lists/" + wordlist.id }}>
              <Button variant="secondary" block>
                Manage
              </Button>
            </Link>
          </td>
          <td>
            <Link
              to={{
                pathname: "/teacher/" + this.state.classroom_id + "/word-lists/" + wordlist.id + "/create-test"
              }}
            >
              <Button variant="primary" block>
                Create Test
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
          <i className="fas fa-clipboard-list" /> Word lists
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
          <BreadcrumbItem active>Word lists</BreadcrumbItem>
        </Breadcrumb>

        <Wrapper>
          <Form>
            <h5>Create word list</h5>
            <Form.Group controlId="TeacherWordLists.Title">
              <Form.Row>
                <Col xl={10} lg={9} md={9} sm={8} xs={8}>
                  <Form.Control
                    type="text"
                    placeholder="word list name"
                    value={this.state.wordlist_name}
                    onChange={event => this.setState({ wordlist_name: event.target.value })}
                  />
                </Col>
                <Col xl={2} lg={3} md={3} sm={4} xs={4}>
                  <Button variant="primary" onClick={this.addWordListHandler} block>
                    Create
                  </Button>
                </Col>
              </Form.Row>
            </Form.Group>
          </Form>
        </Wrapper>

        <Wrapper>
          <h5>Your word lists</h5>
          <hr />
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Created</th>
                <th>Total words</th>
                <th>Visible</th>
              </tr>
            </thead>
            <tbody>{wordlists}</tbody>
          </Table>
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(TeacherWordLists, axios);
