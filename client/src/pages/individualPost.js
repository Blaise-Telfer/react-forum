import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import classnames from "classnames";
import axios from "axios";
import FavoriteAction from "../components/favoriteAction";
import EditPost from "./editPost";
import Loading from "../components/loading";


class IndividualPost extends Component{
	
	constructor(props){
		super(props)
		this.state= {
			loading: true,
			post: "",
			beingEdit: false
		}
	}
	
	componentDidMount(){
		this.setState({ beingEdit: false });
		
		axios.get(`/api/posts/${this.props.match.params.id}`)
		.then(res => {
            this.setState({
                loading: false,
				post: res.data.post
            })
        });
    }
	
	onEditClick() {
		this.setState({
			beingEdit: true
		});
	}
	
	onDeleteClick() {
		const postId  = this.props.match.params.id;
		axios.post(`/api/posts/delete`, {id: postId} )
		.then(res => {
            this.props.history.push("/dashboard")
        })
        .catch(err => {
            console.log(err)
        })
	}

	renderUpdateAndDeleteButton() {
		return (
			<div>
				<button onClick={this.onEditClick.bind(this)}>Edit</button>
				<button className="btn btn-danger" data-toggle="modal" data-target="#deleteConfirmModal">Delete</button>
			</div>
		);
	}
	
	renderDeleteConfirmModal() { 
		return (
		  <div className="modal fade" id="deleteConfirmModal" tabIndex="-1" role="dialog" aria-labelledby="deleteConfirmModalLabel" aria-hidden="true">
			<div className="modal-dialog" role="document">
			  <div className="modal-content">
				<div className="modal-header">
				  <h5 className="modal-title" id="deleteConfirmModalLabel">Confirm Delete</h5>
				  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				  </button>
				</div>
				<div className="modal-body">
				  <p>Are you sure you want to delete this post with its comments? <strong>Attention!</strong> This delete operation cannot be undone.</p>
				</div>
				<div className="modal-footer">
				  <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
				  <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.onDeleteClick.bind(this)}>Delete</button>
				</div>
			  </div>
			</div>
		  </div>
		);
	}

	render(){
		const notUser = this.props.authInfo.user.username !== this.state.post.author;
		const user = this.props.authInfo.user;
		const {post, loading} = this.state;
		const author = post.author;
		const postId = this.props.match.params.id;
		console.log(this.props)
		
		if (this.state.beingEdit) {
			return (
				<EditPost 
					body={post.body}
					postId={post._id}
					userFrom={user.username}
				/>
			);
		}
		
		return(
			<div className="individual-page">
				
				{loading ? 
				(<Loading />)
				:
				(<div>
				
				{notUser ? 
					(null) 
					: 
					(<div>
						{this.renderUpdateAndDeleteButton()}
						{this.renderDeleteConfirmModal()}
					</div>)
				}
				
				<div className="individual-post">
					<p>{post.category}</p>
					<p>{post.city}</p>
					<h2>{post.title}</h2>
					<Link to={`/account/${author}`} ><h3>{post.author}</h3></Link>
					
					{post.body && (
						<div className="body" dangerouslySetInnerHTML={ {__html: post.body} } ></div>
					)}
					
					<hr/>
					<p>{"Posted on " + (new Date(post.date)).toDateString() }</p>
					<a href={`mailto:${post.email}?subject=${post.title}`} >{post.email}</a>
					<p>Bookmark This Post</p>
					<FavoriteAction
						postInfo={post}
						postId={postId}
						userFrom={user.username}
					>
					</FavoriteAction>
				</div>
				
				</div>)}
			</div>
		)
	}
}

const mapStateToProps = state => ({
  authInfo: state.authInfo
});

export default connect(mapStateToProps)(IndividualPost);
