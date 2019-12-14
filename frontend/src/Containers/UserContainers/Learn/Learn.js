import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import axios from "axios";
import React, { Component } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import classes from "./Learn.module.css";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";

class Learn extends Component {
  state = {
    wordlist_id: this.props.match.params.wordlistID,
    user_wordlist_name: "",
    error: false
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

        <Wrapper>
          <h5>Choose learning mode</h5>
          <hr />
          <Row>
            <Col>
              <Link to={{ pathname: "/word-lists/" + this.state.wordlist_id + "/learn/simple" }}>
                <Button className={classes.Square} variant="primary">
                  Simple Test
                </Button>
              </Link>
            </Col>
            <Col>
              <Button className={classes.Square} variant="success">
                4 Words
              </Button>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Button className={classes.Square} variant="warning">
                Letter by letter
              </Button>
            </Col>
            <Col>
              <Button className={classes.Square} variant="danger">
                Random letter
              </Button>
            </Col>
          </Row>
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(Learn, axios);
