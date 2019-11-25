import React, { Component } from "react";
import axios from "../../axios";
import { Button, Col, Form, Table } from "react-bootstrap";
import classes from "./Classroom.module.css";
import Wrapper from "../../Components/UI/Wrapper/Wrapper";
import { Link } from "react-router-dom";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

class Classroom extends Component {
  render() {
    return (
      <Wrapper>
        <h1>Clasrooms</h1>
        <Wrapper>
          <h5>TODO:</h5>
          <ul>
            <li>Lista Klas z mozliwoscia wejscia do klasy</li>
            <li>
              Lista slowek stworzonych przez nauczyciela z mozliwoscia
              skopiowania do swoich zestawow
            </li>
            <li>Lista Testow klasowych z mozliwoscia rozwiazania testu</li>
            <li>Wyniki z kazdego testu, srednia ocen, wykres postepow</li>
          </ul>
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(Classroom, axios);
