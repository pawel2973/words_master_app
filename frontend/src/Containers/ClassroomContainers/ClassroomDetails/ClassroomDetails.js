import React, { Component } from "react";
import axios from "../../../axios";
import { Button, Row, Col, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import { Redirect } from "react-router-dom";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

class ClassroomDetail extends Component {
  state = {
    classroom_id: this.props.match.params.classroomID,
    classroom_name: ""
  };

  componentDidMount() {
    this.getClassroom();
  }

  getClassroom = () => {
    axios
      .get("/api/word/classroom/" + this.state.classroom_id + "/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        this.setState({ classroom_name: res.data.name });
      })
      .catch(error => {
        this.setState({
          redirect: true
        });
      });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={"/teacher/"} />;
    }

    return (
      <Wrapper>
        <h1>
          <i className="fas fa-chalkboard-teacher" /> {this.state.classroom_name}
        </h1>

        <Breadcrumb>
          <LinkContainer
            to={{
              pathname: "/classrooms/"
            }}
          >
            <BreadcrumbItem>Classrooms</BreadcrumbItem>
          </LinkContainer>
          <BreadcrumbItem active>{this.state.classroom_name}</BreadcrumbItem>
        </Breadcrumb>

        <Wrapper>
          <h5>Manage your classroom</h5>
          <Row>
            <Col>
              <Link to={{ pathname: "/classrooms/" + this.state.classroom_id + "/word-lists" }}>
                <Button variant="primary" block>
                  Word lists
                </Button>
              </Link>
            </Col>

            <Col>
              <Link to={{ pathname: "/classrooms/" + this.state.classroom_id + "/tests" }}>
                <Button variant="secondary" block>
                  Tests
                </Button>
              </Link>
            </Col>

            <Col>
              <Button variant="info" block>
                Statistics
              </Button>
            </Col>
          </Row>
        </Wrapper>

        <Wrapper>
          <h5>Statistics</h5>
          <hr />
          <ul>
            <li>Srednia ocen</li>
            <li>Wykres</li>
          </ul>
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(ClassroomDetail, axios);
