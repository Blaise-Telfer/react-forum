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
	
	
	render(){
		const accountName = this.props.match.params.username;
		const currentUser = this.props.auth.user.username;
		const notUser = this.props.match.params.username !== this.props.auth.user.username;
		const picFalse = this.state.user.photo === "https://aeealberta.org/wp-content/uploads/2018/10/profile.png";
		const resumeFalse = this.state.user.resume === "";
		const bioFalse = this.state.user.bio === "";
		const { user, posts, favorite, loading } = this.state;
		const username = user.username;
		const postNum = posts.length;
		const favNum = favorite.length;
		
		if (this.state.beingEdit) {
			return (
				<EditProfile 
					userFrom = {currentUser}
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
				
				<div className="row profile-header">
					
					<div className="col-md-4 profile-pic">
						<img src={user.photo} />
						
						<div className="profile-info">
							{notUser ? 
								( null )
								: 
								(<div>
									{(picFalse || resumeFalse || bioFalse) ?
									(<div>
										<Link onClick={this.onEditClick.bind(this)}>
											Your profile is incomplete. Edit it here to add your picture, resume and bio section.
										</Link>
									</div>)
									:
									( null )
									}
								</div>)
							}
							
							<h3>{postNum} {postNum === 1 ? "Post" : "Posts"}</h3>
							<hr/>
							<h3>{favNum} {favNum === 1 ? "Favorite" : "Favorites"}</h3>
							<hr/>
							
						</div>
					</div>
					
					<hr className="mobile-hr" />
					
					<div className="col-md-7 profile-about">
						<div className="profile-name">
							<h1>{username}</h1>
							{notUser ? 
								( null )
								: 
								(<div>
									<button onClick={this.onEditClick.bind(this)} className="icon-button">
										<i class="fa fa-pencil-square-o" aria-hidden="true"></i>
									</button>
									<Link to={`/settings/${currentUser}`}>
										<button className="icon-button"><i class="fa fa-cog"></i></button>
									</Link>
								</div>)
							}
						</div>
						
						<a href={`mailto:${user.email}?subject=Teachmeet`} className="email">{user.email}</a>
						<p>{user.location}</p>
						<p>{"Joined " + (new Date(user.date)).toDateString() }</p>
						
						{bioFalse ?
						(<p>(This user hasn't filled out their bio)</p>)
						:
						(<p>{user.bio}</p>)
						}
						
						<div className="profile-resume">
							{resumeFalse ? 
								(<p>(This user hasn't uploaded their resume)</p>) 
								: 
								(<div>
									<img src={pdfFile} />
									<br/>
									<a href={`${user.resume}`} > Download {`${username}'s Resume`}</a>
								</div>)
							}
						</div>
						
					</div>
				</div>
				
				<hr className="mobile-hr" />
				
				<div className="contact">
					<Link to="/newPost"><button>New Post</button></Link>
				</div>
				
				<ul className="nav nav-tabs">
					<li className="nav-item">
						<a href="#posts" className="nav-link active" data-toggle="tab">Posts</a>
					</li>
					<li className="nav-item">
						<a href="#favorites" className="nav-link" data-toggle="tab">Favorites</a>
					</li>
				</ul>
				
				<div className="tab-content">
					<div className="tab-pane fade show active personal-posts" id="posts">
						{posts.map((post) => {
							return (
								<div className="single-post">
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
					
					<div className="tab-pane fade personal-favorites" id="favorites">
						{notUser ? 
							(null)
							: 
							(<div>
								{favorite.map((fav) => {
									return (
										<div className="single-favorite">
											<p><Link to={`/post/${fav.postId}`}>{fav.postTitle}</Link></p>
											
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
				</div>
				
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

