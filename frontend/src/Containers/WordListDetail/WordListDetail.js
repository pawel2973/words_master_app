import React, { Component } from "react";
import axios from "../../axios";
import { Button, Col, Form, Table } from "react-bootstrap";
import classes from "./WordListDetail.module.css";
import Wrapper from "../../Components/UI/Wrapper/Wrapper";
import { Link } from "react-router-dom";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import happyLogo from "../../Assets/happy.png";
import Modal from "../../Components/UI/Modal/Modal";

class WordListDetail extends Component {
  state = {
    words: [],
    name: "",
    wordlist_id: this.props.match.params.wordlistID,
    wordlist_name: this.props.location.state.wordlist_name,
    success: null
  };

  componentDidMount() {
    this.getWordsfromList();
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
    this.setState({ success: null });
  };

  render() {
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
            <Link to={"/start"}>
              <Button className={classes.ButtonCreate} variant="danger" block>
                delete
              </Button>
            </Link>
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
            <h5>Edit word list name</h5>
            <Form.Group controlId="WordListDetail.Title">
              <Form.Row>
                <Col xl={10} lg={9} md={9} sm={8} xs={8}>
                  <Form.Control
                    type="text"
                    placeholder="name"
                    value={this.state.name}
                    onChange={event =>
                      this.setState({ name: event.target.value })
                    }
                  />
                </Col>
                <Col xl={2} lg={3} md={3} sm={4} xs={4}>
                  <Button
                    className={classes.ButtonCreate}
                    variant="primary"
                    onClick={this.createWordListHandler}
                    block
                  >
                    update
                  </Button>
                </Col>
              </Form.Row>
            </Form.Group>
          </Form>
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
// let words = null;
// let tablehead = null;
// if (this.state.update_mode === false) {
//   tablehead = (
//     <thead>
//       <tr>
//         <th>Polish</th>
//         <th>English</th>
//       </tr>
//     </thead>
//   );
//   words = this.state.words.map(word => {
//     return (
//       <tr key={word.id}>
//         <td>{word.polish}</td>
//         <td>{word.english}</td>
//         <td>
//           <Button
//             onClick={this.updateModeHandler}
//             className={classes.ButtonCreate}
//             variant="primary"
//             block
//           >
//             Update
//           </Button>
//         </td>
//         <td>
//           <Link to={"/start"}>
//             <Button className={classes.ButtonCreate} variant="danger" block>
//               Delete
//             </Button>
//           </Link>
//         </td>
//       </tr>
//     );
//   });
// } else if (this.state.update_mode === true) {
//   tablehead = (
//     <thead>
//       <tr>
//         <th>Polish</th>
//         <th>English</th>
//       </tr>
//     </thead>
//   );
//   words = this.state.words.map((word, index) => {
//     return (
//       <tr key={word.id}>
//         <td>
//           <Form.Control
//             type="text"
//             placeholder="Polish"
//             value={this.state.words[index].polish}
//             onChange={this.onUpdateWord.bind(this, index, "pl")}
//           />
//         </td>
//         <td>
//           <Form.Control
//             type="text"
//             placeholder="English"
//             value={this.state.words[index].english}
//             onChange={this.onUpdateWord.bind(this, index, "en")}
//           />
//         </td>
//         <td>
//           <Button className={classes.ButtonCreate} variant="primary" block>
//             Confirm
//           </Button>
//         </td>
//         <td>
//           <Link to={"/start"}>
//             <Button className={classes.ButtonCreate} variant="danger" block>
//               dupa
//             </Button>
//           </Link>
//         </td>
//       </tr>
//     );
//   });
// }
