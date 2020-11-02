import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import classnames from "classnames";
import axios from "axios";
import ReactQuill from "react-quill";
import {AiOutlineEdit as EditIcon} from "react-icons/ai";
import { toast } from "react-toastify";


class EditProfile extends Component{
	
	constructor(props){
		super(props)
		this.state= {
			photo: "",
			imagePreviewUrl: "",
			firstname: "",
			lastname: "",
			bio: "",
			city: "",
			errors: ""
		}
		this.submitFormOnClick = this.submitFormOnClick.bind(this);
		this.submitPhotoOnClick = this.submitPhotoOnClick.bind(this);
		this.submitResumeOnClick = this.submitResumeOnClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	
	componentDidMount(){
		this.setState({
            photo: this.props.photo,
			resume: this.props.resume,
			firstname: this.props.firstname,
			lastname: this.props.lastname,
			city: this.props.city,
			bio: this.props.bio
        });
		
		
    }
	
	
	componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({
				errors: nextProps.errors
			});
		}
	}
	
	submitFormOnClick(e) {
		e.preventDefault();
		const {firstname, lastname, city, bio} = this.state;
		const userFrom = this.props.userFrom;
		
		axios.post(`/api/users/update/info`, {firstname, lastname, city, bio, userFrom} )
        .then(response => {
            this.setState({ success: true })
			window.location.reload()
        }).catch(error => {
            this.setState({ success: false })
			console.log(error)
        });
    }
	
	submitPhotoOnClick(e) {
		e.preventDefault();
		const { photo } = this.state;
		const userFrom = this.props.userFrom;
		
		let formData = new FormData();
		formData.append("photo", this.state.photo);
		formData.append("userFrom", this.props.userFrom);
		
		axios.post(`/api/users/update/photo`, formData )
        .then(response => {
            this.setState({ success: true })
			window.location.reload()
        }).catch(error => {
            this.setState({ success: false })
        });
	}
	submitResumeOnClick(e) {
		e.preventDefault();
		const { resume } = this.state;
		const userFrom = this.props.userFrom;
		
		let formData = new FormData();
		formData.append("resume", this.state.resume);
		formData.append("userFrom", this.props.userFrom);
		
		axios.post(`/api/users/update/resume`, formData )
        .then(response => {
            this.setState({ success: true })
			window.location.reload()
        }).catch(error => {
            this.setState({ success: false })
			console.log(error)
        });
	}
	
    handleChange(event){
		const values = this.state;
        values[event.target.name] = event.target.value;
        this.setState(values);
    }
	
    handleImageChange = (e) =>{
        e.preventDefault();
		
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({ photo: file, imagePreviewUrl: reader.result });
        }
        reader.readAsDataURL(file);
    }
	
	handleResumeChange = (e) => {
		e.preventDefault();
		
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({ resume: file });
        }
        reader.readAsDataURL(file);
	}
	
	
	render(){
		const { firstname, lastname, photo, city, bio, errors } = this.state;
		let {imagePreviewUrl} = this.state;
        let $imagePreview = this.state.img;
		console.log(this.props);
		console.log(this.state);
		
		return(
			<div className="profile-editor">
				<form onSubmit={this.submitFormOnClick}>
                    <h2>Personal Info</h2>
					<div className="">
						<input 
						type='text' 
						id='firstname' 
						placeholder = "first name"
						className='form-control' 
						name='firstname' 
						value={firstname} 
						onChange={this.handleChange}
						/>
                    </div>
					<div className="">
						<input 
						type='text' 
						id='lastname' 
						placeholder = "last name"
						className='form-control' 
						name='lastname' 
						value={lastname} 
						onChange={this.handleChange}
						/>
                    </div>
					<div className=''>
						<input 
						type='text' 
						id='city' 
						placeholder = "city"
						className='form-control' 
						name='city' 
						value={city} 
						onChange={this.handleChange}
						/>
                    </div>
					<div className="">
						<input 
						type='text' 
						id='bio' 
						className='form-control' 
						name='bio'						
						placeholder = "fill your bio here..."
						value={bio} 
						onChange={this.handleChange}
						/>
                    </div>
					
                    <div>
                        <button type="submit">Update</button>
                    </div>
                </form>
				<hr/>
				
				<form onSubmit={this.submitPhotoOnClick} className="pic-editor">
					Upload new profile pic here! Jpeg and png files only.
					<br/>
					<input 
					  type="file" 
					  onChange={this.handleImageChange} 
					  error={errors}
					  className={classnames("", {invalid: errors})}
					/>
					<br/>
					{!$imagePreview && <img src={imagePreviewUrl} />}
					<br/>
					<button type="submit">Update</button>
				</form>
				<hr/>
				
				<form onSubmit={this.submitResumeOnClick}>
					Upload your resume here! PDF files only.
					<br/>
					<input 
					  type="file" 
					  onChange={this.handleResumeChange}					
					  error={errors}
					  className={classnames("", {invalid: errors})}
					/>
					<br/>
					<button type="submit">Update</button>
					
				</form>
				
            </div>
		)
	}
}


EditProfile.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(mapStateToProps)(EditProfile);
