import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { reduxForm, Field } from 'redux-form';
import { createPost } from "../authorization/actions";
import axios from "axios";
import classnames from "classnames";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';


class NewPost extends Component {
	
	constructor(props){
        super(props)
        this.state={
            data:{
                title: "",
                body: "",
                author: this.props.auth.user.username,
				email: this.props.auth.user.email,
				category: "",
				salary: "",
				city: "",
            },
            loading: false,
            errors:{},
			success: null,
            response: null,
            authenticated: null
        }
        this.handleChange = this.handleChange.bind(this);
		this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
		
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
	
	componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({
				errors: nextProps.errors
			});
		}
	}
	
	//functions to update the inputes as states
	onChange = (e) => {
        this.setState({
            data: {...this.state.data, [e.target.name]: e.target.value}
        })
    }
	handleChange(value) {
        this.setState({ body: value});
    }
	
	onSubmit = (e) => {
		e.preventDefault();
		const errors = {};
		
        const newPost = {
			title: this.state.data.title,
            body: this.state.body,
			email: this.props.auth.user.email,
			category: this.state.data.category,
            salary: this.state.data.salary,
            city: this.state.data.city,
			author: this.props.auth.user.username
		}
		
		this.props.createPost(newPost, this.props.history);
		
    }
	
	
	render() {
		const input = this.state.data;
		const errors = this.state.errors;
		
		return (
			<div className="new-post">
			<form onSubmit={this.onSubmit} loading={this.state.loading} >
				<h2>New Posting</h2>
				
				<div>
					<input
						name="title" 
						type="text" 
						placeholder="Title"
						value={input.title}
						onChange={this.onChange}
						error={errors.title}
						className={classnames("", {
							invalid: errors.title
						})}
					/>
					<br/>
					<span className="red-text">{errors.title}</span>
				</div>
				
				<ReactQuill 
					theme="snow"
					placeholder="Write your post here..."
					modules={this.modules}
					formats={this.formats}
					onChange={this.handleChange}
					value={this.state.body || ""}
					error={errors.body}
					className={classnames("", {
						invalid: errors.body 
					})}
				/>
				<span className="red-text">{errors.body}</span>
				
				<div>
					<input
						name="salary" 
						type="text" 
						placeholder="salary"
						value={input.salary}
						onChange={this.onChange}
						error={errors.salary}
						className={classnames("", {
							invalid: errors.salary 
						})}
					/>
					<br/>
					<span className="red-text">{errors.salary}</span>
				</div>
				
				<div>
					<input
						name="city" 
						type="text" 
						placeholder="city"
						value={input.city}
						onChange={this.onChange}
						error={errors.city}
						className={classnames("", {
							invalid: errors.city 
						})}
					/>
					<br/>
					<span className="red-text">{errors.city}</span>
				</div>
				
				<div>
					<select 
					className="browser-default"
					name="category" 
					value={input.category}
					onChange={this.onChange}
					>
						<option value="" disabled selected>Select Category</option>
						<option value="Teacher Seeking Pupil">Teacher Seeking Pupil</option>
						<option value="Pupil Seeking Teacher">Pupil Seeking Teacher</option>
					</select>
					<br/>
					<span className="red-text">{errors.category}</span>
				</div>
				
				<button type="submit" className="auth-button"> Post </button>
			</form>
			</div>
		);
	}
}


NewPost = reduxForm({
	form: 'newPost', 
})(NewPost);

NewPost.propTypes = {
	createPost: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(mapStateToProps, { createPost })(NewPost);