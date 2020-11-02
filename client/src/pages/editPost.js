import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import classnames from "classnames";
import axios from "axios";
import ReactQuill from "react-quill";


class EditPost extends Component{
	
	constructor(props){
		super(props)
		this.state= {
			body: ""
		}
		this.submitFormOnClick = this.submitFormOnClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
		
		//module and formats for the React Quill text box
		this.modules = {
			toolbar: [
			  [{ 'font': [] }],
			  [{ 'size': ['small', false, 'large', 'huge'] }],
			  ['bold', 'italic', 'underline'],
			  [{'list': 'ordered'}, {'list': 'bullet'}],
			  [{ 'align': [] }],
			  [{ 'color': [] }, { 'background': [] }],
			  ['clean']
			]
		};
		this.formats = [
			'font',
			'size',
			'bold', 'italic', 'underline',
			'list', 'bullet',
			'align',
			'color', 'background'
		];
	}
	
	componentDidMount(){
		this.setState({
            body: this.props.body
        });
    }
	
	submitFormOnClick(e) {
        e.preventDefault();
        const body = this.state.body;
        const postId = this.props.postId;
		const userFrom = this.props.userFrom;
        
        axios.post(`/api/posts/update`, { postId, userFrom, body })
        .then(response => {
            window.location.reload();
        }).catch(error => {
            console.log(error.response);
        });
    }
	
    handleChange(value) {
        this.setState({ body: value});
    }
	
	render(){
		return(
			<div >
                <form onSubmit={this.submitFormOnClick}>
                    <ReactQuill 
						theme="snow"
						modules={this.modules}
						formats={this.formats}
						onChange={this.handleChange}
						value={this.state.body || ""}
					/>
                    <br />
                    <br />
                    <div className="flex-row">
                        <button type="submit">Update</button>
                    </div>
                </form>
            </div>
		)
	}
}


EditPost.propTypes = {
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps)(EditPost);
