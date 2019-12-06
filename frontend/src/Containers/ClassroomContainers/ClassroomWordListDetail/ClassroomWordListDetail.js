import React, { Component } from "react";
import axios from "../../../axios";
import { Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import { Redirect } from "react-router-dom";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import { LinkContainer } from "react-router-bootstrap";

class ClassroomWordListDetail extends Component {
  state = {
    words: [],
    wordlist_id: this.props.match.params.wordlistID,
    classroom_id: this.props.match.params.classroomID,
    classroom_name: "",
    wordlist_name: "",
    redirect: false
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
          classroom_name: res.data.name
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
          wordlist_name: res.data.name
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

    const words = this.state.words.map(word => {
      return (
        <tr key={word.id}>
          <td>{word.polish}</td>
          <td>{word.english}</td>
        </tr>
      );
    });

    return (
      <Wrapper>
        <h1>
          <i className="far fa-edit" /> {this.state.wordlist_name}
        </h1>

        <Breadcrumb>
          <LinkContainer
            to={{
              pathname: "/classrooms/"
            }}
          >
            <BreadcrumbItem>classrooms</BreadcrumbItem>
          </LinkContainer>
          <LinkContainer
            to={{
              pathname: "/classrooms/" + this.state.classroom_id
            }}
          >
            <BreadcrumbItem>{this.state.classroom_name}</BreadcrumbItem>
          </LinkContainer>

          <LinkContainer
            to={{
              pathname: "/classrooms/" + this.state.classroom_id + "/word-lists"
            }}
          >
            <BreadcrumbItem>Word lists</BreadcrumbItem>
          </LinkContainer>

          <BreadcrumbItem active>{this.state.wordlist_name}</BreadcrumbItem>
        </Breadcrumb>

        <Wrapper>
          <h5>Words in list</h5>
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

export default withErrorHandler(ClassroomWordListDetail, axios);
