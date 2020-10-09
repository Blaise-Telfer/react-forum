import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookmark} from "@fortawesome/free-regular-svg-icons";
import {faBookmark as solidFaBookmark} from "@fortawesome/free-solid-svg-icons";


function FavoriteAction({postInfo, postId, userFrom}){
	const user = useSelector((state) => state.auth.user);
	const postTitle = postInfo.title;
	
	const [FavoriteNumber, setFavoriteNumber] = useState(0);
	const [Favorited, setFavorited] = useState(false);
	const [data, setData] = useState([]);
	const [mark, setMark] = useState([]);
	
	const variables = {
		postId: postId,
		postTitle: postTitle,
		userFrom: userFrom
	};
	
	const onClickFavorite = () => {
		if(Favorited == false){
			axios.post(`/api/favorites/addToFavorite`, variables).then((response) => {
				if (response.data.success) {
				  setFavoriteNumber(FavoriteNumber + 1);
				  setFavorited(true);
				} else {
				  alert("Failed to Add To Favorites");
				}
				console.log(response);
			});
		}
	};
	const onClickRemove = () => {
		if(Favorited == true){
			axios.post(`/api/favorites/removeFromFavorite`, variables).then((response) => {
				if (response.data.success) {
					setFavoriteNumber(FavoriteNumber - 1);
					setFavorited(false);
				} else {
					alert("Failed to remove from Favorites");
				}
				console.log(response);
			});
		}
	};
	
	useEffect(() => {
		axios.post(`/api/favorites/favoriteNumber`, variables).then((response) => {
			if (response.data.success) {
				setFavoriteNumber(response.data.subscribeNumber);
			} else {
				alert("Failed to get Favorite Number");
			}
		});
		axios.post(`/api/favorites/favorited`, variables).then((response) => {
			if (response.data.success) {
				setFavorited(true)
			} else {
				alert("Failed to get favorite Information");
			}
		});
		
	}, []);
	
	return(
		<div className="App">
			
			{!Favorited ? 
				(<button onClick={onClickFavorite}>
					{" "}
					<FontAwesomeIcon className="text-primary" icon={faBookmark}/>
				</button>) 
			: 
				(<button onClick={onClickRemove}>
					{" "}
					<FontAwesomeIcon className="text-primary" icon={solidFaBookmark}/>
				</button>)
			}
			{FavoriteNumber}
			
		</div>
	);
}

export default FavoriteAction;
