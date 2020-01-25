import axios from "../../../axios";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Col, Form, Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import classes from "./WordListDetails.module.css";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import Modal from "../../../Components/UI/Modal/Modal";
import happyLogo from "../../../Assets/happy.png";

class WordListDetails extends Component {
  state = {
    wordlist_id: this.props.match.params.wordlistID,
    user_words: [],
    user_wordlist_name: "",
    user_wordlist_name_to_update: "",
    new_english_word: "",
    new_polish_word: "",
    message: "",
    success: false,
    redirect: false,
    error: false
  };

  componentDidMount() {
    this.getUserWordsList();
    this.getWordsfromList();
  }

  getUserWordsList = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get("/api/word/userwordlist/" + this.state.wordlist_id + "/", { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            user_wordlist_name: res.data.name,
            user_wordlist_name_to_update: res.data.name
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
      .get("/api/word/userwordlist/" + this.state.wordlist_id + "/words/", { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            user_words: [...res.data]
          });
        }
      })
      .catch(error => {});
  };

  deleteWordListHandler = e => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .delete("/api/word/userwordlist/" + this.state.wordlist_id + "/", { headers })
      .then(res => {
        if (res.status === 204) {
          this.setState({
            redirect: true
          });
        }
      })
      .catch(error => {});
  };

  updateWordListNameHandler = (e, name) => {
    e.preventDefault();
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    const formData = new FormData();
    formData.append("name", name);

    axios
      .patch("/api/word/userwordlist/" + this.state.wordlist_id + "/", formData, { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            success: true,
            user_wordlist_name: name,
            message: "Successful word list name update."
          });
        }
      })
      .catch(error => {});
  };

  addUserWordHandler = e => {
    e.preventDefault();
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    const formData = new FormData();
    formData.append("english", this.state.new_english_word.toLowerCase());
    formData.append("polish", this.state.new_polish_word.toLowerCase());

    axios
      .post("/api/word/userwordlist/" + this.state.wordlist_id + "/words/", formData, { headers })
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

  deleteUserWordHandler = (e, arr_id, word_id) => {
    axios
      .delete("/api/word/userwordlist/" + this.state.wordlist_id + "/words/" + word_id + "/", {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` }
      })
      .then(res => {
        if (res.status === 204) {
          const words = [...this.state.user_words];
          words.splice(arr_id, 1);
          this.setState({
            user_words: words,
            success: true,
            message: "Successful word delete."
          });
        }
      })
      .catch(error => {});
  };

  updateUserWordHandler = (e, arr_id, word_id) => {
    e.preventDefault();
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    const word = {
      polish: this.state.user_words[arr_id].polish.toLowerCase(),
      english: this.state.user_words[arr_id].english.toLowerCase()
    };
    const formData = new FormData();
    Object.keys(word).map(item => formData.append(item, word[item]));

    axios
      .patch("/api/word/userwordlist/" + this.state.wordlist_id + "/words/" + word_id + "/", formData, { headers })
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

  onUpdateUserWordHandler = (id, lang, e) => {
    const words = [...this.state.user_words];

    if (lang === "pl") {
      words[id].polish = e.target.value;
    } else if (lang === "en") {
      words[id].english = e.target.value;
    }

    this.setState({
      user_words: words
    });
  };

  successConfirmedHandler = () => {
    this.setState({
      success: false,
      message: ""
    });
  };

  render() {
    if (this.state.redirect || this.state.error) {
      return <Redirect to={"/word-lists"} />;
    }

    const words = this.state.user_words.map((word, index) => {
      return (
        <tr key={word.id}>
          <td>
            <Form.Control
              type="text"
              placeholder="Polish"
              value={this.state.user_words[index].polish}
              onChange={this.onUpdateUserWordHandler.bind(this, index, "pl")}
            />
          </td>
          <td>
            <Form.Control
              type="text"
              placeholder="English"
              value={this.state.user_words[index].english}
              onChange={this.onUpdateUserWordHandler.bind(this, index, "en")}
            />
          </td>
          <td>
            <Button
              className={classes.ButtonCreate}
              variant="primary"
              block
              onClick={e => this.updateUserWordHandler(e, index, word.id)}
            >
              update
            </Button>
          </td>
          <td>
            <Button
              className={classes.ButtonCreate}
              variant="danger"
              block
              onClick={e => this.deleteUserWordHandler(e, index, word.id)}
            >
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
          <i className="far fa-edit" /> {this.state.user_wordlist_name}
        </h1>

        <Breadcrumb>
          <LinkContainer
            to={{
              pathname: "/word-lists/"
            }}
          >
            <BreadcrumbItem>Word Lists</BreadcrumbItem>
          </LinkContainer>
          <BreadcrumbItem active>{this.state.user_wordlist_name}</BreadcrumbItem>
        </Breadcrumb>

        <Wrapper>
          <Form>
            <h5>Manage your word list</h5>
            <Form.Group controlId="WordListDetails.Title">
              <Form.Row>
                <Col xl={8} lg={6} md={6} sm={12} xs={12}>
                  <Form.Control
                    type="text"
                    placeholder="name"
                    className={classes.NameInput}
                    value={this.state.user_wordlist_name_to_update}
                    onChange={event =>
                      this.setState({
                        user_wordlist_name_to_update: event.target.value
                      })
                    }
                  />
                </Col>
                <Col xl={2} lg={3} md={3} sm={6} xs={6}>
                  <Button
                    className={classes.ButtonCreate}
                    variant="primary"
                    block
                    onClick={e => this.updateWordListNameHandler(e, this.state.user_wordlist_name_to_update)}
                  >
                    change name
                  </Button>
                </Col>
                <Col xl={2} lg={3} md={3} sm={6} xs={6}>
                  <Button
                    className={classes.ButtonCreate}
                    variant="danger"
                    block
                    onClick={e => this.deleteWordListHandler(e)}
                  >
                    delete
                  </Button>
                </Col>
              </Form.Row>
            </Form.Group>
          </Form>
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
                  <Button className={classes.ButtonCreate} variant="success" block onClick={this.addUserWordHandler}>
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

export default withErrorHandler(WordListDetails, axios);
