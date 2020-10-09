import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../authorization/actions";
import axios from "axios";
import Loading from "../components/loading";


class PostPage extends Component{
	
	constructor(props){
        super(props)
        this.state= {
            posts: [],
			loading: true
        }
        this.sortChange = this.sortChange.bind(this)
        this.orderChange = this.orderChange.bind(this)
    }
	
	componentDidMount(){
        axios.get("api/posts/").then(res => {
            this.setState({
                loading: false,
				posts: res.data.posts.reverse()
            })
        })
		console.log(this.props)
    }
	
    sortChange(e, data){
        this.setState({
            sortby:data['value']
        })
    }
	
    orderChange(e, data){
        this.setState({
            ascending:data['value']
        })
    }
	
	render(){
		const {loading, posts} = this.state;
		console.log(this.state.posts);
		
		return(
			<div className="App">
				
				{loading ?
					(<Loading />)
					:
					(<div>
					{posts.map((room) => {
						return (
							<div style={{border:"3px solid #000"}}>
								<Link to={`/post/${room._id}`}>link here</Link>
								<p>{room.category}</p>
								<p>{room._id}</p>
								<p>{room.title}</p>
								<p>{room.body && (
								<div dangerouslySetInnerHTML={{__html: room.body}}></div>
								)}</p>
							</div>
						)
					})}
					</div>)
				}
			</div>
		)
	}
}

PostPage.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {logoutUser})(PostPage);