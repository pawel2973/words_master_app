import React, { Component } from "react";
import axios from "../../../axios";
import { Button, Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import Modal from "../../../Components/UI/Modal/Modal";
import happyLogo from "../../../Assets/happy.png";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import { Redirect } from "react-router-dom";

class ClassroomWordList extends Component {
  state = {
    classroom_id: this.props.match.params.classroomID,
    classroom_name: "",
    wordlists: [],
    wordlist_name: "",
    success: false,
    message: ""
  };

  componentDidMount() {
    this.getClassroom();
    this.getClassWordList();
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

  getClassWordList = () => {
    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/classwordlist/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        const wordlist = [];
        res.data.forEach(element => {
          if (element.visibility) {
            wordlist.push(element);
          }
        });
        this.setState({
          wordlists: wordlist
        });
      })
      .catch(error => {
        this.setState({
          redirect: true
        });
      });
  };

  copyWordListHandler = (e, word_list_name, word_list_id) => {
    e.preventDefault();
    let words = [];
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };

    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/classwordlist/" + word_list_id + "/classwords/", {
        headers
      })
      .then(res => {
        words = res.data;
        return axios
          .post(
            "/api/word/userwordlist/",
            { name: "[" + this.state.classroom_name + "] " + word_list_name },
            { headers }
          )
          .then(res => {
            return axios
              .post("/api/word/userwordlist/" + res.data.id + "/words/", words, { headers })
              .then(res => {
                if (res.status === 201) {
                  this.setState({
                    success: true,
                    message: "Word list copied successfully. Check your word lists."
                  });
                }
              })
              .catch(error => {});
          })
          .catch(error => {});
      })
      .catch(error => {});
  };

  successConfirmedHandler = () => {
    this.setState({
      success: false,
      message: ""
    });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={"/classroom"} />;
    }

    const wordlists = this.state.wordlists.map(wordlist => {
      return (
        <tr key={wordlist.id}>
          <td>{wordlist.name}</td>
          <td>{wordlist.date}</td>
          <td>{wordlist.total_words}</td>
          <td>
            <Link to={{ pathname: "/classrooms/" + this.state.classroom_id + "/word-lists/" + wordlist.id }}>
              <Button variant="secondary" block>
                Details
              </Button>
            </Link>
          </td>
          <td>
            <Link
              to={{
                pathname: "/classrooms/" + this.state.classroom_id + "/word-lists/" + wordlist.id + "/create-test"
              }}
            >
              <Button variant="primary" block onClick={e => this.copyWordListHandler(e, wordlist.name, wordlist.id)}>
                Copy
              </Button>
            </Link>
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
          <i className="fas fa-clipboard-list" /> Word lists
        </h1>

        <Breadcrumb>
          <LinkContainer
            to={{
              pathname: "/classrooms/"
            }}
          >
            <BreadcrumbItem>Classroom</BreadcrumbItem>
          </LinkContainer>
          <LinkContainer
            to={{
              pathname: "/classrooms/" + this.state.classroom_id
            }}
          >
            <BreadcrumbItem>{this.state.classroom_name}</BreadcrumbItem>
          </LinkContainer>
          <BreadcrumbItem active>Word lists</BreadcrumbItem>
        </Breadcrumb>

        <Wrapper>
          <h5>Classroom word lists</h5>
          <hr />
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Created</th>
                <th>Total words</th>
              </tr>
            </thead>
            <tbody>{wordlists}</tbody>
          </Table>
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(ClassroomWordList, axios);
