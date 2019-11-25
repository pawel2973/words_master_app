import React, { Component } from "react";
import axios from "../../axios";
import { Button, Col, Form, Table } from "react-bootstrap";
import classes from "./WordListDetail.module.css";
import Wrapper from "../../Components/UI/Wrapper/Wrapper";
import { Redirect } from "react-router-dom";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import happyLogo from "../../Assets/happy.png";
import Modal from "../../Components/UI/Modal/Modal";

class WordListDetail extends Component {
  state = {
    words: [],
    name: "",
    wordlist_id: this.props.match.params.wordlistID,
    wordlist_name: "",
    wordlist_name_to_update: "",
    success: false,
    message: "",
    redirect: false,
    new_english: "",
    new_polish: "",
    error: false
  };

  componentDidMount() {
    try {
      this.setState({
        wordlist_name: this.props.location.state.wordlist_name,
        wordlist_name_to_update: this.props.location.state.wordlist_name
      });
      this.getWordsfromList();
    } catch (error) {
      this.setState({ error: true });
    }
  }

  getWordsfromList = () => {
    axios
      .get("/api/word/userwordlist/" + this.state.wordlist_id + "/words/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
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
        "/api/word/userwordlist/" + this.state.wordlist_id + "/",
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
      .delete("/api/word/userwordlist/" + this.state.wordlist_id + "/", {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` }
      })
      .then(response => {
        this.setState({ redirect: true });
      })
      .catch(error => {
        console.log(error);
      });
  };

  addWordHandler = () => {
    const formData = new FormData();
    formData.append("english", this.state.new_english);
    formData.append("polish", this.state.new_polish);
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    axios
      .post(
        "/api/word/userwordlist/" + this.state.wordlist_id + "/words/",
        formData,
        { headers }
      )
      .then(response => {
        console.log(response.status);
        if (response.status === 201) {
          this.setState({ new_english: "", new_polish: "" });
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
        "/api/word/userwordlist/" +
          this.state.wordlist_id +
          "/words/" +
          word_id +
          "/",
        formData,
        { headers }
      )
      .then(response => {
        this.setState({
          success: true,
          message: "Successful word update."
        });
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
    this.setState({ words: words });
  };

  successConfirmedHandler = () => {
    this.setState({ success: null, message: null });
  };

  deleteWordHandler = (e, arr_id, word_id) => {
    axios
      .delete(
        "/api/word/userwordlist/" +
          this.state.wordlist_id +
          "/words/" +
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
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    if (this.state.redirect || this.state.error) {
      return <Redirect to={"/word-lists"} />;
    }

    const tablehead = (
      <thead>
        <tr>
          <th>Polish</th>
          <th>English</th>
        </tr>
      </thead>
    );
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
            <Button
              className={classes.ButtonCreate}
              variant="primary"
              block
              onClick={e => this.updateWordHandler(e, index, word.id)}
            >
              update
            </Button>
          </td>
          <td>
            <Button
              className={classes.ButtonCreate}
              variant="danger"
              block
              onClick={e => this.deleteWordHandler(e, index, word.id)}
            >
              delete
            </Button>
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
        <h1>{this.state.wordlist_name}</h1>
        <Wrapper>
          <Form>
            <h5>Manage your word list</h5>
            <Form.Group controlId="WordListDetail.Title">
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
                    className={classes.ButtonCreate}
                    variant="primary"
                    block
                    onClick={e =>
                      this.updateWordListNameHandler(
                        e,
                        this.state.wordlist_name_to_update
                      )
                    }
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
                    value={this.state.new_polish}
                    onChange={event =>
                      this.setState({ new_polish: event.target.value })
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    placeholder="English"
                    value={this.state.new_english}
                    onChange={event =>
                      this.setState({ new_english: event.target.value })
                    }
                  />
                </td>
                <td>
                  <Button
                    className={classes.ButtonCreate}
                    variant="success"
                    block
                    onClick={this.addWordHandler}
                  >
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
            {tablehead}
            <tbody>{words}</tbody>
          </Table>
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(WordListDetail, axios);
