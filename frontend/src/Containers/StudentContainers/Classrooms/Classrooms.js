import React, { Component } from "react";
import axios from "../../../axios";
import { Button, Col, Form, Table, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import classes from "./Classrooms.module.css";
import Wrapper from "../../../Components/UI/Wrapper/Wrapper";
import Modal from "../../../Components/UI/Modal/Modal";
import happyLogo from "../../../Assets/happy.png";
import { Link } from "react-router-dom";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";

class Classroom extends Component {
  state = {
    classrooms: []
  };

  componentDidMount() {
    this.getClasrooms();
  }

  getClasrooms = () => {
    axios
      .get("/api/word/studentclassroom/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        this.setState({
          classrooms: res.data
        });
      })
      .catch(error => {});
  };

  render() {
    const classrooms = this.state.classrooms.map((classroom, index) => {
      return (
        <tr key={classroom.id}>
          <td>{classroom.name}</td>
          <td>
            {classroom.teacher_details.first_name} {classroom.teacher_details.last_name}
            <p className={classes.TeacherEmail}>{classroom.teacher_details.email}</p>
          </td>
          <td>{classroom.students.length}</td>
          <td>
            <Link to={{ pathname: "/classrooms/" + classroom.id }}>
              <Button variant="success" block>
                View
              </Button>
            </Link>
          </td>
        </tr>
      );
    });

    return (
      <Wrapper>
        <h1>
          <i className="fas fa-chalkboard-teacher" /> Classrooms
        </h1>

        <Breadcrumb>
          <BreadcrumbItem active>Classrooms</BreadcrumbItem>
        </Breadcrumb>

        <Wrapper>
          <h5>Your classrooms</h5>
          <hr />
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Teacher</th>
                <th>Students</th>
              </tr>
            </thead>
            <tbody>{classrooms}</tbody>
          </Table>
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(Classroom, axios);
