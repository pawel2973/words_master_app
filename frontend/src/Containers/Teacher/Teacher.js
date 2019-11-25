import React, { Component } from "react";
import axios from "../../axios";
import { Button, Col, Form, Table } from "react-bootstrap";
import classes from "./Teacher.module.css";
import Wrapper from "../../Components/UI/Wrapper/Wrapper";
import { Link } from "react-router-dom";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

class Teacher extends Component {
  render() {
    return (
      <Wrapper>
        <h1>Clasrooms</h1>
        <Wrapper>
          <h5>TODO:</h5>
          <ul>
            <li>Lista klas z ogolnymi informacjami</li>
            <li>Mozliwosc Stworzenia klasy</li>
            <li>
              Mozliwosc dodania uczniow do klasy po adresie e-mail - unikalny
            </li>
            <li>Mozliwosc usuniecia ucznia z klasy</li>
            <li>Mozliwosc tworzenia listy slow dla klasy</li>
            <li>Mozliwosc stworzenia testu dla uczniow</li>
            <li>Mozliwosc sprawdzenia wynikow uczniow</li>
            <li>Mozliwosc sprawdzenia postepu ucznia - oceny + wykres</li>
            <li>
              Mozliwosc sprawdzenia statystyk dla klasy - srednia ocen - wykresy
              sredniej z danych testow
            </li>
          </ul>
        </Wrapper>
      </Wrapper>
    );
  }
}

export default withErrorHandler(Teacher, axios);
