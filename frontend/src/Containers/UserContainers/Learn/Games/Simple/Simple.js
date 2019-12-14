import withErrorHandler from "../../../../../hoc/withErrorHandler/withErrorHandler";
import axios from "axios";
import React, { Component } from "react";
import { ButtonGroup, Button, Row, Col } from "react-bootstrap";
import classes from "./Simple.module.css";
import Wrapper from "../../../../../Components/UI/Wrapper/Wrapper";

class Simple extends Component {
  state = {
    wordlist_id: this.props.match.params.wordlistID,
    user_words: [],
    user_wordlist_name: "",
    current_polish_word: "",
    current_english_word: "",
    showEnglishWord: false,
    error: false,
    game_completed: false,
    correct_answers: 0,
    incorrect_answers: 0,
    words_index: 0,
    word_counter: 1
  };

  componentDidMount() {
    console.log("OK");
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
            user_wordlist_name: res.data.name
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
          console.log(res.data);
          this.setState({
            user_words: [...res.data],
            current_polish_word: res.data[0].polish,
            current_english_word: res.data[0].english
          });
        }
      })
      .catch(error => {});
  };

  showWordHandler = () => {
    this.setState({
      showEnglishWord: !this.state.showEnglishWord
    });
  };

  goodAnswerHandler = () => {
    const words_index = this.state.words_index + 1;
    if (words_index === this.state.user_words.length) {
      this.setState({
        game_completed: true
      });
    } else {
      this.setState({
        words_index: words_index,
        current_english_word: this.state.user_words[words_index].english,
        current_polish_word: this.state.user_words[words_index].polish,
        correct_answers: this.state.correct_answers + 1,
        word_counter: this.state.word_counter + 1
      });
    }
  };

  badAnswerHandler = () => {
    const words_index = this.state.words_index + 1;
    if (words_index === this.state.user_words.length) {
      this.setState({
        game_completed: true
      });
    } else {
      this.setState({
        words_index: words_index,
        current_english_word: this.state.user_words[words_index].english,
        current_polish_word: this.state.user_words[words_index].polish,
        incorrect_answers: this.state.incorrect_answers + 1,
        word_counter: this.state.word_counter + 1
      });
    }
  };

  render() {
    const game = (
      <Wrapper>
        <h5 className="text-right">
          {this.state.word_counter} / {this.state.user_words.length}
        </h5>
        <hr />
        <h2 className="text-center">
          <strong>{this.state.current_polish_word}</strong>
        </h2>
        {this.state.showEnglishWord ? <p className="text-center">{this.state.current_english_word}</p> : <br />}
        <Row>
          <Col>
            <div className="d-flex flex-column">
              <ButtonGroup>
                <Button variant="outline-danger" onClick={this.badAnswerHandler}>
                  I don't know
                </Button>
                <Button variant="outline-primary" onClick={this.showWordHandler}>
                  {this.state.showEnglishWord ? "Hide" : "Show"}
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
        <h5>Result</h5>
        <hr />
        <p>Correct answers: {this.state.correct_answers}</p>
        <p>Inrrect answers: {this.state.incorrect_answers}</p>
      </Wrapper>
    );
    return (
      <Wrapper>
        <h1>
          <i className="fab fa-leanpub" /> {this.state.user_wordlist_name}
        </h1>
        {this.state.game_completed ? result : game}
      </Wrapper>
    );
  }
}

export default withErrorHandler(Simple, axios);
