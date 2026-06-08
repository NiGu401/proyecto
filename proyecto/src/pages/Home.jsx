import React from 'react'
import Button from 'react-bootstrap/Button';
import '../css.css';
import Container from 'react-bootstrap/esm/Container';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function Home() {
  return (
    <div>
       <div id='sep'>
       </div>
       <div className="icon">
                <center>
                    <img src="Imagenes/Logo.png" height="100%" width="80%"/>
                </center>
        </div>
        <div id="separatorup">
        </div>
        <div id="separator-ribbon">
            <div className="content bg-ribbon"></div>
        </div>
        <div id="boody">
            <div className="container-md p-5">
                <div className="titulo">
                    Causita prestame 5 pavos
                </div>
            </div>
            <CardGroup>
                <Card>
                    <Card.Img variant="top" src="holder.js/100px160" />
                    <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                        This is a wider card with supporting text below as a natural lead-in
                        to additional content. This content is a little bit longer.
                    </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
                <Card>
                    <Card.Img variant="top" src="holder.js/100px160" />
                    <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                        This card has supporting text below as a natural lead-in to
                        additional content.
                    </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
                <Card>
                    <Card.Img variant="top" src="holder.js/100px160" />
                    <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                        This is a wider card with supporting text below as a natural lead-in
                        to additional content. This card has even longer content than the
                        first to show that equal height action.
                    </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer>
                </Card>
            </CardGroup>
        </div>
    </div>
  )
}

export default Home