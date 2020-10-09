import React, { Component } from "react";
import PropTypes from "prop-types";
import LoadScreen from "../images/loading.gif";


class Loading extends Component {
	
    render() {
        return (
            <div className="load-icon">
				<img src={LoadScreen} />
            </div>
        );
    }
}

export default Loading