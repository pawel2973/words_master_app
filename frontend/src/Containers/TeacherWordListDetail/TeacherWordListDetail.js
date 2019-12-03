import React, { Component } from "react";
import axios from "../../axios";
import { Button, Row, Col, Form, Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import classes from "./TeacherWordListDetail.module.css";
import Wrapper from "../../Components/UI/Wrapper/Wrapper";
import { Redirect } from "react-router-dom";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import happyLogo from "../../Assets/happy.png";
import Modal from "../../Components/UI/Modal/Modal";
import { LinkContainer } from "react-router-bootstrap";

class TeacherWordListDetail extends Component {
  state = {
    words: [],
    wordlist_id: this.props.match.params.wordlistID,
    classroom_id: this.props.match.params.classroomID,
    classroom_name: "",
    wordlist_name: "",
    wordlist_name_to_update: "",
    wordlist_visibility: null,
    success: false,
    message: "",
    redirect: false,
    new_english: "",
    new_polish: "",
    error: false
  };

  componentDidMount() {
    this.getClassroom();
    this.getClassWordsList();
    this.getWordsfromList();
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

  getClassWordsList = () => {
    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/classwordlist/" + this.state.wordlist_id + "/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        this.setState({
          wordlist_name: res.data.name,
          wordlist_name_to_update: res.data.name,
          wordlist_visibility: res.data.visibility
        });
      })
      .catch(error => {
        this.setState({
          error: true
        });
      });
  };

  getWordsfromList = () => {
    axios
      .get(
        "/api/word/classroom/" + this.state.classroom_id + "/classwordlist/" + this.state.wordlist_id + "/classwords/",
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`
          }
        }
      )
      .then(res => {
        this.setState({ words: res.data });
      })
      .catch(error => {});
  };

  updateWordListNameHandler = (e, name) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    axios
      .patch(
        "/api/word/classroom/" + this.state.classroom_id + "/classwordlist/" + this.state.wordlist_id + "/",
        formData,
        { headers }
      )
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
      .delete("/api/word/classroom/" + this.state.classroom_id + "/classwordlist/" + this.state.wordlist_id + "/", {
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
      .post(
        "/api/word/classroom/" + this.state.classroom_id + "/classwordlist/" + this.state.wordlist_id + "/classwords/",
        formData,
        { headers }
      )
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
      .patch(
        "/api/word/classroom/" +
          this.state.classroom_id +
          "/classwordlist/" +
          this.state.wordlist_id +
          "/classwords/" +
          word_id +
          "/",
        formData,
        { headers }
      )
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

  switchVisibilityHandler = e => {
    // ==================================
    e.preventDefault();
    const visibility = !this.state.wordlist_visibility;
    console.log(visibility);
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    axios
      .patch(
        "/api/word/classroom/" + this.state.classroom_id + "/classwordlist/" + this.state.wordlist_id + "/",
        { visibility: visibility },
        { headers }
      )
      .then(response => {
        if (response.status === 200) {
          this.setState({
            success: true,
            wordlist_visibility: visibility,
            message: "Successful word list visibility update."
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

  deleteWordHandler = (e, arr_id, word_id) => {
    axios
      .delete(
        "/api/word/classroom/" +
          this.state.classroom_id +
          "/classwordlist/" +
          this.state.wordlist_id +
          "/classwords/" +
          word_id +
          "/",
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` }
        }
      )
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
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/teacher/" + this.state.classroom_id + "/word-lists"
          }}
        />
      );
    }

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

          <BreadcrumbItem active>{this.state.wordlist_name}</BreadcrumbItem>
        </Breadcrumb>

        <Wrapper>
          <Form>
            <h5>Manage your word list</h5>
            <Form.Group controlId="TeacherWordListDetail.Title">
              <Form.Row>
                <Col xl={8} lg={6} md={6} sm={12} xs={12}>
                  <Form.Control
                    type="text"
                    placeholder="name"
                    className={classes.NameInput}
                    value={this.state.wordlist_name_to_update}
                    onChange={event =>
                      this.setState({
                        wordlist_name_to_update: event.target.value
                      })
                    }
                  />
                </Col>
                <Col xl={2} lg={3} md={3} sm={6} xs={6}>
                  <Button
                    variant="primary"
                    block
                    onClick={e => this.updateWordListNameHandler(e, this.state.wordlist_name_to_update)}
                  >
                    change name
                  </Button>
                </Col>
                <Col xl={2} lg={3} md={3} sm={6} xs={6}>
                  <Button variant="danger" block onClick={e => this.deleteWordListHandler(e)}>
                    delete
                  </Button>
                </Col>
              </Form.Row>
            </Form.Group>
          </Form>
          <hr />
          <Row>
            <Col>
              Is word list visible:{" "}
              {!this.state.wordlist_visibility ? (
                <Button variant="danger" onClick={e => this.switchVisibilityHandler(e)}>
                  {String(this.state.wordlist_visibility)}
                </Button>
              ) : (
                <Button variant="success" onClick={e => this.switchVisibilityHandler(e)}>
                  {String(this.state.wordlist_visibility)}
                </Button>
              )}
            </Col>
          </Row>
        </Wrapper>

        <Wrapper>
          <h5>Add word to your list</h5>
          <hr />
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Polish</th>
                <th>English</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Form.Control
                    type="text"
                    placeholder="Polish"
                    value={this.state.new_polish}
                    onChange={event => this.setState({ new_polish: event.target.value })}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    placeholder="English"
                    value={this.state.new_english}
                    onChange={event => this.setState({ new_english: event.target.value })}
                  />
                </td>
                <td>
                  <Button variant="success" block onClick={this.addWordHandler}>
                    add
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Wrapper>

        <Wrapper>
          <h5>Manage your words in list</h5>
          <hr />
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Polish</th>
                <th>English</th>
              </tr>
            </thead>
            <tbody>{words}</tbody>
          </Table>
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(TeacherWordListDetail, axios);
