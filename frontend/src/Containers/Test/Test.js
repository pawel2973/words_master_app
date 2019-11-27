import React, { Component } from "react";
import axios from "../../axios";
import {
  Button,
  Col,
  Form,
  Table,
  Breadcrumb,
  BreadcrumbItem
} from "react-bootstrap";
import classes from "./Test.module.css";
import Wrapper from "../../Components/UI/Wrapper/Wrapper";
import { Redirect } from "react-router-dom";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import happyLogo from "../../Assets/happy.png";
import Modal from "../../Components/UI/Modal/Modal";
import { LinkContainer } from "react-router-bootstrap";

//TODO: REFACTOR
class Test extends Component {
  state = {
    words: [],
    tests: [],
    name: "",
    wordlist_id: this.props.match.params.wordlistID,
    wordlist_name: "",
    wordlist_name_to_update: "",
    success: false,
    message: "",
    redirect: false,
    new_english: "",
    new_polish: "",
    error: false,
    created_test_id: ""
  };

  componentDidMount() {
    this.getList();
    this.getWordsfromList();
    this.getTests();
  }

  getList = () => {
    axios
      .get("/api/word/userwordlist/" + this.state.wordlist_id + "/", {
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
      .catch(error => {});
  };

  getWordsfromList = () => {
    axios
      .get("/api/word/userwordlist/" + this.state.wordlist_id + "/words/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        const words = res.data.map(obj => ({ ...obj, answer: "" }));
        this.setState({ words: words });
      })
      .catch(error => {});
  };

  getTests = () => {
    axios
      .get("/api/word/userwordlist/" + this.state.wordlist_id + "/tests/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        this.setState({
          tests: res.data
        });
        // console.log(res.data);
      })
      .catch(error => {});
  };

  deleteTestHandler = (e, arr_id, test_id) => {
    axios
      .delete(
        "/api/word/userwordlist/" +
          this.state.wordlist_id +
          "/tests/" +
          test_id +
          "/",
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` }
        }
      )
      .then(response => {
        if (response.status === 204) {
          const tests = [...this.state.tests];
          tests.splice(arr_id, 1);
          this.setState({
            tests: tests,
            success: true,
            message: "Successful test delete."
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  // TODO: delete test
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

  finshTestHandler = e => {
    // Check if answer is correct and add it to list
    let correct_answers = 0;
    let incorrect_answers = 0;
    const answers = [...this.state.words].map(obj => {
      if (obj.english === obj.answer) {
        correct_answers++;
        return {
          ...obj,
          correct: true
        };
      } else {
        incorrect_answers++;
        return {
          ...obj,
          correct: false
        };
      }
    });

    //Create user test model in db
    const formTestData = new FormData();
    formTestData.append("correct_answers", correct_answers);
    formTestData.append("incorrect_answers", incorrect_answers);
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .post(
        "/api/word/userwordlist/" + this.state.wordlist_id + "/tests/",
        formTestData,
        { headers }
      )
      .then(response => {
        console.log("1 post");
        //Save answers for test in db
        return axios
          .post(
            "/api/word/userwordlist/" +
              this.state.wordlist_id +
              "/tests/" +
              response.data.id +
              "/answers/",
            answers,
            { headers }
          )
          .catch(error => {});
      })
      .then(response => {})
      .catch(error => {});
  };

  onUpdateWordHandler = (id, e) => {
    const words = [...this.state.words];
    words[id].answer = e.target.value;
    this.setState({ words: words });
  };

  successConfirmedHandler = () => {
    this.setState({ success: null, message: null });
  };

  render() {
    const words_new_test = this.state.words.map((word, index) => {
      return (
        <tr key={word.id}>
          <td>{this.state.words[index].polish}</td>
          <td>
            <Form.Control
              type="text"
              placeholder=""
              required
              value={this.state.words[index].answer}
              onChange={this.onUpdateWordHandler.bind(this, index)}
            />
          </td>
        </tr>
      );
    });

    const test_history = this.state.tests.map((test, index) => {
      return (
        <tr key={test.id}>
          <td>{test.date}</td>
          <td>{test.correct_answers + test.incorrect_answers}</td>
          <td>{test.correct_answers}</td>
          <td>{test.incorrect_answers}</td>
          <td>
            {Math.floor(
              (test.correct_answers /
                (test.correct_answers + test.incorrect_answers)) *
                100
            )}
            %
          </td>
          <td>
            <Button
              className={classes.ButtonCreate}
              variant="danger"
              block
              onClick={e => this.deleteTestHandler(e, index, test.id)}
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

        <h1>
          <i className="fas fa-trophy" /> {this.state.wordlist_name}
        </h1>

        <Breadcrumb>
          <LinkContainer
            to={{
              pathname: "/word-lists/"
            }}
          >
            <BreadcrumbItem>Word Lists</BreadcrumbItem>
          </LinkContainer>
          <LinkContainer
            to={{
              pathname: "/word-lists/1"
            }}
          >
            <BreadcrumbItem>{this.state.wordlist_name}</BreadcrumbItem>
          </LinkContainer>
          <BreadcrumbItem active>Test</BreadcrumbItem>
        </Breadcrumb>

        <Wrapper>
          <h5>Tests history</h5>
          <hr />
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Total words</th>
                <th>Correct answers</th>
                <th>Incorrect answers</th>
                <th>Percentage</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>{test_history}</tbody>
          </Table>
        </Wrapper>

        <Wrapper>
          <h5>Take the test</h5>
          <hr />
          <Form onSubmit={this.finshTestHandler}>
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Polish</th>
                  <th>Write an English answer</th>
                </tr>
              </thead>
              <tbody>{words_new_test}</tbody>
            </Table>
            <Button
              className={classes.ButtonCreate}
              variant="primary"
              block
              type="submit"
            >
              Finish the test
            </Button>
          </Form>
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(Test, axios);
