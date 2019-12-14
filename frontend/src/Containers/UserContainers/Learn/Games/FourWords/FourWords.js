import withErrorHandler from "../../../../../hoc/withErrorHandler/withErrorHandler";
import axios from "axios";
import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Button, Row, Col, Card, Breadcrumb, BreadcrumbItem, ProgressBar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import classes from "./FourWords.module.css";
import Wrapper from "../../../../../Components/UI/Wrapper/Wrapper";

class FourWords extends Component {
  state = {
    wordlist_id: this.props.match.params.wordlistID,
    user_words: [],
    user_answers: [],
    choosen_answers: [],
    user_wordlist_name: "",
    current_polish_word: "",
    current_english_word: "",
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

  checkIfDuplicateExists = list => {
    return new Set(list).size !== list.length;
  };

  getWordsfromList = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get("/api/word/userwordlist/" + this.state.wordlist_id + "/words/", { headers })
      .then(res => {
        if (res.status === 200) {
          // Check for english duplicates
          const en_words = [];
          res.data.forEach(en_word => {
            en_words.push(en_word.english);
          });

          if (this.checkIfDuplicateExists(en_words)) {
            this.setState({
              redirect: true
            });
            return false;
          }

          const progressvalue = (1 / res.data.length) * 100;
          this.setState({
            user_words: [...res.data],
            user_words_length: res.data.length,
            current_polish_word: res.data[0].polish,
            current_english_word: res.data[0].english,
            progressvalue: progressvalue
          });
        }
        this.gameLauncher();
      })
      .catch(error => {});
  };

  gameLauncher = () => {
    const choosen_en_words = [];
    choosen_en_words.push(this.state.current_english_word);

    let index = 1;
    do {
      let unique = true;
      const random_en_word = this.state.user_words[Math.floor(Math.random() * this.state.user_words.length)].english;

      choosen_en_words.forEach(choosen_word => {
        // Check if en word is already in choosen words
        if (choosen_word === random_en_word) {
          unique = false;
        }
      });
      // If en word is unique add  it to choosen words
      if (unique === true) {
        choosen_en_words.push(random_en_word);
        index++;
      }
    } while (index !== 4);

    // Randomize words in array
    choosen_en_words.sort(() => Math.random() - 0.5);

    this.setState({
      choosen_answers: [...choosen_en_words]
    });
  };

  gameGenerator = en_word => {
    const choosen_en_words = [];
    choosen_en_words.push(en_word);

    let index = 1;
    do {
      let unique = true;
      const random_en_word = this.state.user_words[Math.floor(Math.random() * this.state.user_words.length)].english;

      choosen_en_words.forEach(choosen_word => {
        // Check if en word is already in choosen words
        if (choosen_word === random_en_word) {
          unique = false;
        }
      });
      // If en word is unique add  it to choosen words
      if (unique === true) {
        choosen_en_words.push(random_en_word);
        index++;
      }
    } while (index !== 4);

    // Randomize words in array
    choosen_en_words.sort(() => Math.random() - 0.5);

    this.setState({
      choosen_answers: [...choosen_en_words]
    });
  };

  gameHandler = choosen_user_en_word => {
    const words_index = this.state.words_index + 1;
    let correct_answers = this.state.correct_answers;
    let incorrect_answers = this.state.incorrect_answers;

    // Check if answer is correct
    if (this.state.current_english_word === choosen_user_en_word) {
      correct_answers++;
    } else {
      incorrect_answers++;
    }

    // Check if game completed
    if (words_index === this.state.user_words_length) {
      this.setState({
        game_completed: true,
        correct_answers: correct_answers,
        incorrect_answers: incorrect_answers
      });
    } else {
      const progressvalue = ((this.state.word_counter + 1) / this.state.user_words_length) * 100;
      this.setState({
        words_index: words_index,
        current_english_word: this.state.user_words[words_index].english,
        current_polish_word: this.state.user_words[words_index].polish,
        word_counter: this.state.word_counter + 1,
        progressvalue: progressvalue,
        correct_answers: correct_answers,
        incorrect_answers: incorrect_answers
      });

      this.gameGenerator(this.state.user_words[words_index].english);
    }
  };

  render() {
    if (this.state.redirect || this.state.error) {
      return <Redirect to={{ pathname: "/word-lists/" + this.state.wordlist_id + "/learn" }} />;
    }

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
        {this.state.showEnglishWord ? <p className="text-center">{this.state.current_english_word}</p> : <br />}
        <Row>
          <Col className={classes.ButtonCol}>
            <Button
              block
              variant="outline-primary"
              onClick={this.gameHandler.bind(this, this.state.choosen_answers[0])}
            >
              {this.state.choosen_answers[0]}
            </Button>
          </Col>
          <Col className={classes.ButtonCol}>
            <Button
              block
              variant="outline-primary"
              onClick={this.gameHandler.bind(this, this.state.choosen_answers[1])}
            >
              {this.state.choosen_answers[1]}
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className={classes.ButtonCol}>
            <Button
              block
              variant="outline-primary"
              onClick={this.gameHandler.bind(this, this.state.choosen_answers[2])}
            >
              {this.state.choosen_answers[2]}
            </Button>
          </Col>
          <Col className={classes.ButtonCol}>
            <Button
              block
              variant="outline-primary"
              onClick={this.gameHandler.bind(this, this.state.choosen_answers[3])}
            >
              {this.state.choosen_answers[3]}
            </Button>
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
          <BreadcrumbItem active>4 Words mode</BreadcrumbItem>
        </Breadcrumb>
        {this.state.game_completed ? result : game}
      </Wrapper>
    );
  }
}

export default withErrorHandler(FourWords, axios);
