import React, { Component } from "react";
import axios from "../../axios";
import { Button, Row, Col, Form, Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import classes from "./TeacherClassroomDetail.module.css";
import Wrapper from "../../Components/UI/Wrapper/Wrapper";
import { Redirect } from "react-router-dom";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import happyLogo from "../../Assets/happy.png";
import Modal from "../../Components/UI/Modal/Modal";
import { LinkContainer } from "react-router-bootstrap";

class TeacherClassroomDetail extends Component {
  state = {
    words: [],

    wordlist_name: "",
    wordlist_name_to_update: "",
    success: false,
    message: "",
    redirect: false,
    new_english: "",
    new_polish: "",
    error: false,

    classroom_id: this.props.match.params.classroomID,
    classroom_name: ""
  };

  componentDidMount() {
    this.getClassroom();
    // this.getWordsList();
    // this.getWordsfromList();
  }

  getWordsList = () => {
    axios
      .get("/api/word/userwordlist/" + this.state.classroom_id + "/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        this.setState({
          wordlist_name: res.data.name,
          wordlist_name_to_update: res.data.name
        });
      })
      .catch(error => {
        this.setState({
          error: true
        });
      });
  };

  getClassroom = () => {
    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        this.setState({ classroom_name: res.data.name });
      })
      .catch(error => {});
  };

  updateWordListNameHandler = (e, name) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    axios
      .patch("/api/word/userwordlist/" + this.state.classroom_id + "/", formData, { headers })
      .then(response => {
        if (response.status === 200) {
          this.setState({
            success: true,
            wordlist_name: name,
            message: "Successful word list name update."
          });
        }
      })
      .catch(error => {});
  };

  deleteWordListHandler = e => {
    axios
      .delete("/api/word/userwordlist/" + this.state.classroom_id + "/", {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` }
      })
      .then(response => {
        this.setState({
          redirect: true
        });
      })
      .catch(error => {});
  };

  addWordHandler = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("english", this.state.new_english);
    formData.append("polish", this.state.new_polish);
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    axios
      .post("/api/word/userwordlist/" + this.state.classroom_id + "/words/", formData, { headers })
      .then(response => {
        if (response.status === 201) {
          this.setState({
            new_english: "",
            new_polish: ""
          });
          this.getWordsfromList();
        }
      })
      .catch(error => {});
  };

  updateWordHandler = (e, arr_id, word_id) => {
    e.preventDefault();
    const word = {
      polish: this.state.words[arr_id].polish,
      english: this.state.words[arr_id].english
    };

    const formData = new FormData();
    Object.keys(word).map(item => formData.append(item, word[item]));
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    axios
      .patch("/api/word/userwordlist/" + this.state.classroom_id + "/words/" + word_id + "/", formData, { headers })
      .then(response => {
        if (response.status === 200) {
          this.setState({
            success: true,
            message: "Successful word update."
          });
        }
      })
      .catch(error => {});
  };

  onUpdateWordHandler = (id, lang, e) => {
    const words = [...this.state.words];
    if (lang === "pl") {
      words[id].polish = e.target.value;
    } else if (lang === "en") {
      words[id].english = e.target.value;
    }
    this.setState({
      words: words
    });
  };

  successConfirmedHandler = () => {
    this.setState({
      success: false,
      message: ""
    });
  };

  deleteWordHandler = (e, arr_id, word_id) => {
    axios
      .delete("/api/word/userwordlist/" + this.state.classroom_id + "/words/" + word_id + "/", {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` }
      })
      .then(response => {
        if (response.status === 204) {
          const words = [...this.state.words];
          words.splice(arr_id, 1);
          this.setState({
            words: words,
            success: true,
            message: "Successful word delete."
          });
        }
      })
      .catch(error => {});
  };

  render() {
    // if (this.state.redirect || this.state.error) {
    //   return <Redirect to={"/word-lists"} />;
    // }

    const words = this.state.words.map((word, index) => {
      return (
        <tr key={word.id}>
          <td>
            <Form.Control
              type="text"
              placeholder="Polish"
              value={this.state.words[index].polish}
              onChange={this.onUpdateWordHandler.bind(this, index, "pl")}
            />
          </td>
          <td>
            <Form.Control
              type="text"
              placeholder="English"
              value={this.state.words[index].english}
              onChange={this.onUpdateWordHandler.bind(this, index, "en")}
            />
          </td>
          <td>
            <Button variant="primary" block onClick={e => this.updateWordHandler(e, index, word.id)}>
              update
            </Button>
          </td>
          <td>
            <Button variant="danger" block onClick={e => this.deleteWordHandler(e, index, word.id)}>
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
              <Button variant="primary" block>
                Word lists
              </Button>
            </Col>

            <Col>
              <Button variant="secondary" block>
                Tests
              </Button>
            </Col>

            <Col>
              <Button variant="info" block>
                Statistics
              </Button>
            </Col>
          </Row>
        </Wrapper>

        <Wrapper>
          <h5>Students</h5>
          <hr />
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Average grade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mateusz Kowalski</td>
                <td>mate@mat.pl</td>
                <td>4,65</td>
                <td>
                  <Button variant="success" block onClick={this.addWordHandler}>
                    Details
                  </Button>
                </td>
                <td>
                  <Button variant="danger" block onClick={this.addWordHandler}>
                    Delete
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Wrapper>
        {/* EDIT HERE !!!!!!!!!!!!!!!!!!!!! */}
        <Wrapper>
          <Form>
            <h5>Add student to class</h5>
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
                  <Button variant="primary" onClick={this.createClasroomHandler} block>
                    Create
                  </Button>
                </Col>
              </Form.Row>
            </Form.Group>
          </Form>
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(TeacherClassroomDetail, axios);
