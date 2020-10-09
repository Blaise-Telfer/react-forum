import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createPost } from "../authorization/actions";


class CreatePost extends Component {
	
	constructor(props){
        super(props)
        this.state={
            data:{
                title: "",
                body: "",
                author: this.props.auth.user.name,
				email: "",
				category: "",
				salary: "",
				city: ""
            },
            loading: false,
            errors:{}
        }
        this.onChange=this.onChange.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
    }
	
	onChange = (e) =>{
        this.setState({
            data:{...this.state.data,[e.target.name]: e.target.value}
        })
    }
	
	onSubmit = (e) =>{
        
		const errors={};
        if(!this.state.data.title){
            errors.title= "title required";
        }
        this.setState({
            errors:errors
        })
		
        this.props.createPost(this.state.data);
    }
	
	render() {
		return (
			<form onSubmit={this.onSubmit} loading={this.state.loading} >
				<h2>Create a new post</h2>
				<form error={!!this.state.errors.title}>
                    <label>Title</label>
                    <input
                        type="title"
                        id="title"
                        name="title"
                        value={this.state.data.title}
                        onChange={this.onChange}
                    />
                </form>
				<form error={!!this.state.errors.body}>
                    <label>Body</label>
                    <input
                        type="body"
                        id="body"
                        name="body"
                        value={this.state.data.body}
                        onChange={this.onChange}
                    />
                </form>
				<form error={!!this.state.errors.email}>
                    <label>Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={this.state.data.email}
                        onChange={this.onChange}
                    />
                </form>
				<form error={!!this.state.errors.category}>
                    <label>Category</label>
                    <input
                        type="category"
                        id="category"
                        name="category"
                        value={this.state.data.category}
                        onChange={this.onChange}
                    />
                </form>
				<form error={!!this.state.errors.salary}>
                    <label>Salary</label>
                    <input
                        type="salary"
                        id="salary"
                        name="salary"
                        value={this.state.data.salary}
                        onChange={this.onChange}
                    />
                </form>
				<form error={!!this.state.errors.city}>
                    <label>City</label>
                    <input
                        type="city"
                        id="city"
                        name="city"
                        value={this.state.data.city}
                        onChange={this.onChange}
                    />
                </form>
				<button type="submit"> Create </button>
			</form>
		);
	}
}

CreatePost.propTypes = {
  createPost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { createPost })(CreatePost);