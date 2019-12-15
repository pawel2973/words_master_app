import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Row, Col, Alert, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import classes from "./Learn.module.css";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";

class Learn extends Component {
  state = {
    wordlist_id: this.props.match.params.wordlistID,
    user_wordlist_name: "",
    error: false,
    isEnoughWords: true
  };

  componentDidMount() {
    this.getUserWordsList();
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

          if (res.data.total_words < 4) {
            this.setState({
              isEnoughWords: false
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

  render() {
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
          <BreadcrumbItem active>Learn</BreadcrumbItem>
        </Breadcrumb>

        <Alert variant="warning">
          <i className="fas fa-exclamation-circle" /> All modes require at least <strong>4 words</strong> in the word
          list.
        </Alert>

        {this.state.isEnoughWords ? (
          <Wrapper>
            <h5>Choose learning mode</h5>
            <hr />
            <Row>
              <Col>
                <Link to={{ pathname: "/word-lists/" + this.state.wordlist_id + "/learn/simple" }}>
                  <Button className={classes.Square} variant="primary">
                    Simple
                  </Button>
                </Link>
              </Col>
              <Col>
                <Link to={{ pathname: "/word-lists/" + this.state.wordlist_id + "/learn/four-words" }}>
                  <Button className={classes.Square} variant="success">
                    4 Words
                  </Button>
                </Link>
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <Link to={{ pathname: "/word-lists/" + this.state.wordlist_id + "/learn/letter-by-letter" }}>
                  <Button className={classes.Square} variant="warning">
                    Letter by letter
                  </Button>
                </Link>
              </Col>
              <Col>
                <Link to={{ pathname: "/word-lists/" + this.state.wordlist_id + "/learn/random-letter" }}>
                  <Button className={classes.Square} variant="danger">
                    Random letter
                  </Button>
                </Link>
              </Col>
            </Row>
          </Wrapper>
        ) : null}
      </Wrapper>
    );
  }
}

export default withErrorHandler(Learn, axios);
