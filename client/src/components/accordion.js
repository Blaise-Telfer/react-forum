import React, { Component, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import Terms from "./termsAndConditions";


export function Chevron(props) {

 return (
   <svg
     className={props.className}
     height={props.height}
     width={props.width}
     viewBox="0 0 32 32"
     xmlns="http://www.w3.org/2000/svg"
   >
     <path
       d="M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z"
       fill={props.fill}
     />
   </svg>
 );
}

function Accordion(props) {
  const [setActive, setActiveState] = useState("");
  const [setHeight, setHeightState] = useState("0px");
  const [setRotate, setRotateState] = useState("accordion__icon");

  const content = useRef(null);

  function toggleAccordion() {
    setActiveState(setActive === "" ? "active" : "");
    setHeightState(
      setActive === "active" ? "0px" : `${content.current.scrollHeight}px`
    );
    setRotateState(
      setActive === "active" ? "accordion__icon" : "accordion__icon rotate"
    );
  }
  
  return (
    <div className="accordion__section">
      <button className={`accordion ${setActive}`} onClick={toggleAccordion}>
		<p className="accordion__title">Terms and Conditions</p>
		<Chevron className={`${setRotate}`} width={40} fill={"#777"} />
      </button>
      <div
        ref={content}
        style={{ maxHeight: `${setHeight}` }}
        className="accordion__content"
      >
		<Terms />
      </div>
    </div>
  );
}


export default Accordion;