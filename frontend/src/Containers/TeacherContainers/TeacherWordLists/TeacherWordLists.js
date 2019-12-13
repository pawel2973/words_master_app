import axios from "../../../axios";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { Button, Col, Form, Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import Modal from "../../../Components/UI/Modal/Modal";
import happyLogo from "../../../Assets/happy.png";

class TeacherWordLists extends Component {
  state = {
    classroom_id: this.props.match.params.classroomID,
    class_wordlists: [],
    class_wordlist_name: "",
    classroom_name: "",
    message: "",
    success: false
  };

  componentDidMount() {
    this.getClassroom();
    this.getClassWordList();
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

  getClassWordList = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/classwordlist/", { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            class_wordlists: [...res.data]
          });
        }
      })
      .catch(error => {
        this.setState({
          redirect: true
        });
      });
  };

  addClassWordListHandler = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    const formData = new FormData();
    formData.append("name", this.state.class_wordlist_name);

    axios
      .post("/api/word/classroom/" + this.state.classroom_id + "/classwordlist/", formData, { headers })
      .then(response => {
        if (response.status === 201) {
          this.setState({
            class_wordlist_name: "",
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

    const class_wordlists = this.state.class_wordlists.map(wordlist => {
      return (
        <tr key={wordlist.id}>
          <td>{wordlist.name}</td>
          <td>{wordlist.date}</td>
          <td>{wordlist.total_words}</td>
          <td>{String(wordlist.visibility)}</td>
          <td>
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
                    value={this.state.class_wordlist_name}
                    onChange={event => this.setState({ class_wordlist_name: event.target.value })}
                  />
                </Col>
                <Col xl={2} lg={3} md={3} sm={4} xs={4}>
                  <Button variant="primary" onClick={this.addClassWordListHandler} block>
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
            <tbody>{class_wordlists}</tbody>
          </Table>
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(TeacherWordLists, axios);
