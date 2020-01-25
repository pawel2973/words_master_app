import axios from "../../../axios";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Button, Row, Col, Form, Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import classes from "./TeacherWordListDetail.module.css";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import Modal from "../../../Components/UI/Modal/Modal";
import happyLogo from "../../../Assets/happy.png";

class TeacherWordListDetail extends Component {
  state = {
    class_wordlist_id: this.props.match.params.wordlistID,
    classroom_id: this.props.match.params.classroomID,
    class_words: [],
    classroom_name: "",
    class_wordlist_name: "",
    class_wordlist_name_to_update: "",
    new_english_word: "",
    new_polish_word: "",
    message: "",
    class_wordlist_visibility: null,
    success: false,
    redirect: false,
    error: false
  };

  componentDidMount() {
    this.getClassroom();
    this.getClassWordsList();
    this.getWordsfromList();
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

  getClassWordsList = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/classwordlist/" + this.state.class_wordlist_id + "/", {
        headers
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            class_wordlist_name: res.data.name,
            class_wordlist_name_to_update: res.data.name,
            class_wordlist_visibility: res.data.visibility
          });
        }
      })
      .catch(error => {
        this.setState({
          error: true
        });
      });
  };

  getWordsfromList = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get(
        "/api/word/classroom/" +
          this.state.classroom_id +
          "/classwordlist/" +
          this.state.class_wordlist_id +
          "/classwords/",
        { headers }
      )
      .then(res => {
        if (res.status === 200) {
          this.setState({ class_words: [...res.data] });
        }
      })
      .catch(error => {});
  };

  updateClassWordListNameHandler = (e, name) => {
    e.preventDefault();
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    const formData = new FormData();
    formData.append("name", name);

    axios
      .patch(
        "/api/word/classroom/" + this.state.classroom_id + "/classwordlist/" + this.state.class_wordlist_id + "/",
        formData,
        { headers }
      )
      .then(res => {
        if (res.status === 200) {
          this.setState({
            success: true,
            class_wordlist_name: name,
            message: "Successful word list name update."
          });
        }
      })
      .catch(error => {});
  };

  deleteClassWordListHandler = e => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .delete(
        "/api/word/classroom/" + this.state.classroom_id + "/classwordlist/" + this.state.class_wordlist_id + "/",
        {
          headers
        }
      )
      .then(res => {
        if (res.status === 204) {
          this.setState({
            redirect: true
          });
        }
      })
      .catch(error => {});
  };

  addClassWordHandler = e => {
    e.preventDefault();
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    const formData = new FormData();
    formData.append("english", this.state.new_english_word.toLowerCase());
    formData.append("polish", this.state.new_polish_word.toLowerCase());

    axios
      .post(
        "/api/word/classroom/" +
          this.state.classroom_id +
          "/classwordlist/" +
          this.state.class_wordlist_id +
          "/classwords/",
        formData,
        { headers }
      )
      .then(res => {
        if (res.status === 201) {
          this.setState({
            new_english_word: "",
            new_polish_word: ""
          });
          this.getWordsfromList();
        }
      })
      .catch(error => {});
  };

  updateClassWordHandler = (e, arr_id, word_id) => {
    e.preventDefault();
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    const word = {
      polish: this.state.class_words[arr_id].polish.toLowerCase(),
      english: this.state.class_words[arr_id].english.toLowerCase()
    };
    const formData = new FormData();
    Object.keys(word).map(item => formData.append(item, word[item]));

    axios
      .patch(
        "/api/word/classroom/" +
          this.state.classroom_id +
          "/classwordlist/" +
          this.state.class_wordlist_id +
          "/classwords/" +
          word_id +
          "/",
        formData,
        { headers }
      )
      .then(res => {
        if (res.status === 200) {
          this.setState({
            success: true,
            message: "Successful word update."
          });
        }
      })
      .catch(error => {});
  };

  onUpdateClassWordHandler = (id, lang, e) => {
    const class_words = [...this.state.class_words];
    if (lang === "pl") {
      class_words[id].polish = e.target.value;
    } else if (lang === "en") {
      class_words[id].english = e.target.value;
    }
    this.setState({
      class_words: [...class_words]
    });
  };

  switchVisibilityHandler = e => {
    e.preventDefault();
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    const class_wordlist_visibility = !this.state.class_wordlist_visibility;

    axios
      .patch(
        "/api/word/classroom/" + this.state.classroom_id + "/classwordlist/" + this.state.class_wordlist_id + "/",
        { visibility: class_wordlist_visibility },
        { headers }
      )
      .then(res => {
        if (res.status === 200) {
          this.setState({
            success: true,
            class_wordlist_visibility: class_wordlist_visibility,
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
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .delete(
        "/api/word/classroom/" +
          this.state.classroom_id +
          "/classwordlist/" +
          this.state.class_wordlist_id +
          "/classwords/" +
          word_id +
          "/",
        { headers }
      )
      .then(res => {
        if (res.status === 204) {
          const class_words = [...this.state.class_words];
          class_words.splice(arr_id, 1);
          this.setState({
            class_words: [...class_words],
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

    const class_words = this.state.class_words.map((word, index) => {
      return (
        <tr key={word.id}>
          <td>
            <Form.Control
              type="text"
              placeholder="Polish"
              value={this.state.class_words[index].polish}
              onChange={this.onUpdateClassWordHandler.bind(this, index, "pl")}
            />
          </td>
          <td>
            <Form.Control
              type="text"
              placeholder="English"
              value={this.state.class_words[index].english}
              onChange={this.onUpdateClassWordHandler.bind(this, index, "en")}
            />
          </td>
          <td>
            <Button variant="primary" block onClick={e => this.updateClassWordHandler(e, index, word.id)}>
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
          <i className="far fa-edit" /> {this.state.class_wordlist_name}
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

          <BreadcrumbItem active>{this.state.class_wordlist_name}</BreadcrumbItem>
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
                    value={this.state.class_wordlist_name_to_update}
                    onChange={event =>
                      this.setState({
                        class_wordlist_name_to_update: event.target.value
                      })
                    }
                  />
                </Col>
                <Col xl={2} lg={3} md={3} sm={6} xs={6}>
                  <Button
                    variant="primary"
                    block
                    onClick={e => this.updateClassWordListNameHandler(e, this.state.class_wordlist_name_to_update)}
                  >
                    change name
                  </Button>
                </Col>
                <Col xl={2} lg={3} md={3} sm={6} xs={6}>
                  <Button variant="danger" block onClick={e => this.deleteClassWordListHandler(e)}>
                    delete
                  </Button>
                </Col>
              </Form.Row>
            </Form.Group>
          </Form>
          <hr />
          <Row>
            <Col>
              Is word list visible:
              {!this.state.class_wordlist_visibility ? (
                <Button variant="danger" onClick={e => this.switchVisibilityHandler(e)}>
                  {String(this.state.class_wordlist_visibility)}
                </Button>
              ) : (
                <Button variant="success" onClick={e => this.switchVisibilityHandler(e)}>
                  {String(this.state.class_wordlist_visibility)}
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
                    value={this.state.new_polish_word}
                    onChange={event => this.setState({ new_polish_word: event.target.value })}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    placeholder="English"
                    value={this.state.new_english_word}
                    onChange={event => this.setState({ new_english_word: event.target.value })}
                  />
                </td>
                <td>
                  <Button variant="success" block onClick={this.addClassWordHandler}>
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
            <tbody>{class_words}</tbody>
          </Table>
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(TeacherWordListDetail, axios);
