import withErrorHandler from "../../../../../hoc/withErrorHandler/withErrorHandler";
import axios from "axios";
import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { ButtonGroup, Button, Row, Col, Card, Breadcrumb, BreadcrumbItem, ProgressBar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import classes from "./RandomLetter.module.css";
import Wrapper from "../../../../../Components/UI/Wrapper/Wrapper";

class RandomLetter extends Component {
  state = {
    wordlist_id: this.props.match.params.wordlistID,
    user_words: [],
    user_wordlist_name: "",
    current_polish_word: "",
    current_english_word: "",
    current_hint_word_array: [],
    current_hint_word_index_array: [],
    current_english_word_length: null,
    showEnglishWord: false,
    error: false,
    redirect: false,
    game_completed: false,
    progressvalue: null,
    user_words_length: null,
    correct_answers: 0,
    incorrect_answers: 0,
    words_index: 0,
    word_counter: 1
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
          if (res.data.total_words < 4) {
            this.setState({
              redirect: true
            });
          } else {
            this.setState({
              user_wordlist_name: res.data.name
            });
          }
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
          const progressvalue = (1 / res.data.length) * 100;
          const english_word_array = res.data[0].english.split("");
          const hint_word_array = [];

          english_word_array.forEach(el => {
            hint_word_array.push("*");
          });

          this.setState({
            user_words: [...res.data],
            user_words_length: res.data.length,
            current_polish_word: res.data[0].polish,
            current_english_word: res.data[0].english,
            current_english_word_length: res.data[0].english.length,
            progressvalue: progressvalue,
            current_hint_word_array: [...hint_word_array]
          });
        }
      })
      .catch(error => {});
  };

  hintHandler = () => {
    if (this.state.current_hint_word_index_array.length < this.state.current_english_word_length) {
      const current_hint_word_array = [...this.state.current_hint_word_array];
      const index_array = [...this.state.current_hint_word_index_array];
      const en_word_array = this.state.current_english_word.split("");

      if (this.state.current_hint_word_index_array.length === 0) {
        const random_index = Math.floor(Math.random() * (this.state.current_english_word_length - 1));
        index_array.push(random_index);
        current_hint_word_array[random_index] = en_word_array[random_index];

        this.setState({
          current_hint_word_index_array: [...index_array],
          current_hint_word_array: current_hint_word_array
        });
      } else {
        let success = false;
        let unique = true;
        let random_index = null;
        do {
          random_index = Math.floor(Math.random() * this.state.current_english_word_length);
          this.state.current_hint_word_index_array.forEach(index => {
            if (index === random_index) {
              unique = false;
            }
          });

          if (unique === true) {
            success = true;
          }
          unique = true;
        } while (success === false);

        index_array.push(random_index);
        current_hint_word_array[random_index] = en_word_array[random_index];

        this.setState({
          current_hint_word_index_array: [...index_array],
          current_hint_word_array: current_hint_word_array
        });
      }
    }
  };

  goodAnswerHandler = () => {
    const words_index = this.state.words_index + 1;
    if (words_index === this.state.user_words_length) {
      this.setState({
        correct_answers: this.state.correct_answers + 1,
        game_completed: true
      });
    } else {
      const progressvalue = ((this.state.word_counter + 1) / this.state.user_words_length) * 100;
      const english_word_array = this.state.user_words[words_index].english.split("");
      const hint_word_array = [];

      english_word_array.forEach(el => {
        hint_word_array.push("*");
      });

      this.setState({
        words_index: words_index,
        current_english_word: this.state.user_words[words_index].english,
        current_english_word_length: this.state.user_words[words_index].english.length,
        current_english_word_index: -1,
        current_hint_word_array: hint_word_array,
        current_polish_word: this.state.user_words[words_index].polish,
        correct_answers: this.state.correct_answers + 1,
        word_counter: this.state.word_counter + 1,
        showEnglishWord: false,
        progressvalue: progressvalue,
        current_hint_word_index_array: []
      });
    }
  };

  badAnswerHandler = () => {
    const words_index = this.state.words_index + 1;
    if (words_index === this.state.user_words_length) {
      this.setState({
        incorrect_answers: this.state.incorrect_answers + 1,
        game_completed: true
      });
    } else {
      const progressvalue = ((this.state.word_counter + 1) / this.state.user_words_length) * 100;
      const english_word_array = this.state.user_words[words_index].english.split("");
      const hint_word_array = [];

      english_word_array.forEach(el => {
        hint_word_array.push("*");
      });

      this.setState({
        words_index: words_index,
        current_english_word: this.state.user_words[words_index].english,
        current_english_word_length: this.state.user_words[words_index].english.length,
        current_english_word_index: -1,
        current_hint_word_array: [...hint_word_array],
        current_polish_word: this.state.user_words[words_index].polish,
        incorrect_answers: this.state.incorrect_answers + 1,
        word_counter: this.state.word_counter + 1,
        showEnglishWord: false,
        progressvalue: progressvalue,
        current_hint_word_index_array: []
      });
    }
  };

  render() {
    if (this.state.redirect || this.state.error) {
      return <Redirect to={{ pathname: "/word-lists/" + this.state.wordlist_id + "/learn" }} />;
    }

    const characterList = this.state.current_hint_word_array.map((letter, index) => {
      return (
        <div key={index} className={classes.Char}>
          {(() => {
            if (letter === "*") {
              return <i className="far fa-eye" />;
            } else {
              return letter;
            }
          })()}
        </div>
      );
    });

    const game = (
      <Wrapper>
        <h5 className="text-right">
          {this.state.word_counter} / {this.state.user_words_length}
        </h5>
        <ProgressBar striped variant="warning" now={this.state.progressvalue} />
        <br />
        <h2 className="text-center">
          <strong>{this.state.current_polish_word}</strong>
        </h2>
        <Row>
          <div className={classes.Center}>{characterList}</div>
        </Row>
        <Row>
          <Col>
            <div className="d-flex flex-column">
              <ButtonGroup>
                <Button variant="outline-danger" onClick={this.badAnswerHandler}>
                  I don't know
                </Button>
                <Button variant="outline-primary" onClick={this.hintHandler}>
                  Hint
                </Button>
                <Button variant="outline-success" onClick={this.goodAnswerHandler}>
                  I know
                </Button>
              </ButtonGroup>
            </div>
          </Col>
        </Row>
      </Wrapper>
    );

    const result = (
      <Wrapper>
        <h5 className="text-center">Result</h5>
        <hr />
        <Row>
          <Col>
            <Card bg="success" text="white" className="text-center">
              <Card.Header>Correct answers</Card.Header>
              <Card.Body>
                <h1>{this.state.correct_answers}</h1>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card bg="danger" text="white" className="text-center">
              <Card.Header>Incorrect answers</Card.Header>
              <Card.Body>
                <h1>{this.state.incorrect_answers}</h1>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <br />
        <Link to={{ pathname: "/word-lists/" + this.state.wordlist_id + "/learn" }}>
          <Button variant="outline-primary">Back to learning modes</Button>
        </Link>
      </Wrapper>
    );
    return (
      <Wrapper>
        <h1>
          <i className="fab fa-leanpub" /> {this.state.user_wordlist_name}
        </h1>
        <Breadcrumb>
          <LinkContainer
            to={{
              pathname: "/word-lists/"
            }}
          >
            <BreadcrumbItem>Word Lists</BreadcrumbItem>
          </LinkContainer>
          <LinkContainer to={{ pathname: "/word-lists/" + this.state.wordlist_id + "/learn" }}>
            <BreadcrumbItem>Learn</BreadcrumbItem>
          </LinkContainer>
          <BreadcrumbItem active>Random letter mode</BreadcrumbItem>
        </Breadcrumb>
        {this.state.game_completed ? result : game}
      </Wrapper>
    );
  }
}

export default withErrorHandler(RandomLetter, axios);
