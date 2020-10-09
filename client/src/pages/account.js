import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../authorization/actions";
import FavoriteAction from "../components/favoriteAction";
import axios from "axios";
import {AiOutlineEdit as EditIcon} from "react-icons/ai";
import EditProfile from "./editProfile";
import Loading from "../components/loading";
import pdfFile from "../images/pdfFile.png";


class Account extends Component{
	
	constructor(props){
        super(props)
        this.state = {
            loading: true,
			posts: [],
			user: [],
			favorite: [],
			activeTab: 0,
			beingEdit: false
        }
    }
	
	componentDidMount(){
		const accountName = this.props.match.params.username;
		this.setState({
			beingEdit: false
		});
		
		axios.get(`/api/users/user/${accountName}`).then(res => {
			this.setState({
                loading: false,
				user: res.data.user
            })
			console.log(res.data.user);
		});
		
		axios.get(`/api/users/${accountName}`).then(res => {
            this.setState({
                loading: false,
				posts: res.data.post
            })
		});
		
		axios.get(`/api/favorites/getFavoritedPost/${accountName}`).then(res => {
            this.setState({
                loading: false,
				favorite: res.data.favorite
            })
		});
    }
	
	onEditClick() {
		this.setState({
			beingEdit: true
		});
	}
	renderUpdateButton() {
		return (
			<div>
				<button className="btn btn-primary mr-1" onClick={this.onEditClick.bind(this)}>Edit Profile</button>
				<button className="btn btn-primary"><Link to="/newPost">Make new post</Link></button>
			</div>
		);
	}
	
	render(){
		const accountName = this.props.match.params.username;
		const currentUser = this.props.auth.user.username;
		const notUser = this.props.match.params.username !== this.props.auth.user.username;
		const resumeFalse = this.state.user.resume === "";
		const bioFalse = this.state.user.bio === "";
		const { user, posts, favorite, loading } = this.state;
		const username = user.username;
		
		if (this.state.beingEdit) {
			return (
				<EditProfile 
					userFrom = {username}
					firstname = {user.firstname}
					lastname = {user.lastname}
					img = {user.photo}
					bio = {user.bio}
					resume = {user.resume}
					city = {user.location}
					history = {this.props.history}
				/>
			);
		}
		
		return(
			<div className="profile-page">
			{loading ?
			(<Loading />)
			:
			(<div>
				
				{notUser ? 
					(null)
					: 
					(<div className="profile-header">
						<p>Upload your profile picture and resume, and fill out your bio, here</p>
						<button className="btn btn-primary" onClick={this.onEditClick.bind(this)}>Edit Profile</button>
						<button className="btn btn-primary"><Link to="/newPost">Make new post</Link></button>
						<button className="btn btn-primary"><Link to={`/settings/${currentUser}`}>Settings</Link></button>
					</div>)
				}
				<hr/>
				
				<div className="row profile-info">
					
					<div className="col-sm profile-about">
						<h3>About Me</h3>
						<p>{"Member since " + (new Date(user.date)).toDateString() }</p>
						<p>{"City: " + (user.location)}</p>
						{bioFalse ?
						(<p>(This user hasn't filled out their bio)</p>)
						:
						(<p>{user.bio}</p>)
						}
					</div>
					
					<div className="col-sm profile-pic">
						<h3>{username}</h3>
						<img src={user.photo} />
					</div>
					
					<div className="col-sm profile-resume">
						<h3>{username}'s Resume</h3>
						{resumeFalse ? 
							(<p>(This user hasn't uploaded their resume)</p>) 
							: 
							(<div>
								<img src={pdfFile} />
								<br/>
								<a href={`${user.resume}`} >Download {`${username}'s Resume`}</a>
							</div>)
						}
					</div>
					
				</div>
				
				<div className="contact">
					<h3>Contact this user at</h3>
					<a href={`mailto:${user.email}?subject=Teachmeet`} >{user.email}</a>
				</div>
				<hr/>
				
				<section className="row">
					<div className="personal-posts col-sm-6">
						<h2>{username}'s Posts</h2>
						{posts.map((post) => {
							return (
								<div style={{border:"3px solid #e3e3e3", padding:"10px"}}>
									<p><Link to={`/post/${post._id}`}>{post.title}</Link></p>
									<p>{post.author}</p>
									<p>{post.category}</p>
									<p>{ (new Date(post.date)).toDateString() }</p>
									{post.body && (
										<div dangerouslySetInnerHTML={{__html: post.body}}></div>
									)}
								</div>
							)
						})}
					</div>
					
					<div className="personal-favorites col-sm-6">
						{notUser ? 
							(null)
							: 
							(<div>
								<h2>Your Favorites</h2>
								{favorite.map((fav) => {
									return (
										<div style={{border:"3px solid #e3e3e3", padding:"10px"}}>
											<p><Link to={`/post/${fav.postId}`}>{fav.postTitle}</Link></p>
											<p>{fav.postId}</p>
											
											<FavoriteAction
												postInfo={fav}
												postId={fav.postId}
												userFrom={currentUser}
											>
											</FavoriteAction>
											
										</div>
									)
								})}
							</div>)
						}
					</div>
				</section>
				
				</div>
			)}	
		</div>
		)
	}
}

Account.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {logoutUser})(Account);

