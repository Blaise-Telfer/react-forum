import React, { Component, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import axios from "axios";
import Input from "./Input";
import ListGroup from "./ListGroup";
import ListGroup2 from "./ListGroup";
import ListGroup3 from "./ListGroup";
import _ from "lodash";


function categorize(allPosts, category) {
	if (category === "All") return allPosts;
	else return allPosts.filter((post) => post.category === category);
}
function authorCheck(allPosts, author) {
	if (author === "All") return allPosts;
	else return allPosts.filter((post) => post.author === author);
}
function cityCheck(allPosts, city) {
	if (city === "All") return allPosts;
	else return allPosts.filter((post) => post.city === city);
}

function PostTable({ posts, currentPage, pageSize }) {
  const currentPosts = posts.slice(
    (currentPage - 1) * pageSize,
    pageSize * currentPage
  );
  
  return (
    <div className="grid">
      {!!posts &&
        currentPosts.map((post) => (
          <div key={post.id}> 
			  { (new Date(post.date)).toDateString() }
			  <br/>
			  
			  <Link to={`/post/${post.id}`}> {post.title} </Link>
			  <br/>
			  
			  by {post.author}
			  <br/>
			  
			  
			  {post.city}
			  <br/>
			  
			  {post.category}
			  <hr/>
		  </div>
        ))}
    </div>
  );
}


function Pagination(props) {
	const { itemsCount, pageSize, onPageChange, currentPage } = props;
	
	var pageCount = Math.ceil(itemsCount / pageSize);
	if (itemsCount == 0){
		pageCount = 1
	}
	var startPage, endPage;
    if (pageCount <= 5) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = pageCount;
    } else {
		// more than 10 total pages so calculate start and end pages
		if (currentPage <= 4) {
                startPage = 1;
                endPage = 5;
		} else if (currentPage + 2 >= pageCount) {
                startPage = pageCount - 5;
                endPage = pageCount;
		} else {
                startPage = currentPage - 3;
                endPage = currentPage + 1;
		}
    }
	var pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);
	
	return (
	<div className="pagination-container">
	
	  <ul className="pagination-squares" >
        <li className="page-item" >
			<a className="page-link" onClick={() => onPageChange(1)}>{1}</a>
        </li>
		<li className="page-item">
			{currentPage == 1 ?
			<a className="page-link" onClick={() => onPageChange(1)}> {"<"} </a>
			:
			<a className="page-link" onClick={() => onPageChange(currentPage - 1)}> {"<"} </a>
			}
        </li>
		{pages.map((page, index) => 
			page === currentPage ? 
            <li key={index} className="page-item active">
              <a className="page-link" onClick={() => onPageChange(page)}> {page} </a>
            </li>
			:
			<li key={index} className="page-item">
              <a className="page-link" onClick={() => onPageChange(page)}> {page} </a>
            </li>
		  )}
		  <li className="page-item">
			{currentPage == pageCount ?
			<a className="page-link" onClick={() => onPageChange(pageCount)}> {">"} </a>
			:
			<a className="page-link" onClick={() => onPageChange(currentPage + 1)}> {">"} </a>
			}	
          </li>
          <li className="page-item">
			<a className="page-link" onClick={() => onPageChange(pageCount)}>{pageCount}</a>
          </li>
	  </ul>
	  
	</div>
  );
}

const propTypes = {
	posts: PropTypes.array.isRequired
}

//Main Component
class PropTester extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
			categories: [],
			authors: [],
			cities: [],
			currentCategory: "All",
			currentAuthor: "All",
			currentCity: "All",
			searchFilter: "",
			pageSize: 5,
			currentPage: 1
        };
    }
	
	handleChange = (name, value) => {
		this.setState({ [name]: value });
	};
	
	onPageChange = (page) => {
		this.setState({ currentPage: page });
	};
	
	render() {
		const {currentCategory, currentAuthor, currentCity, searchFilter, pageSize, currentPage} = this.state;
		const {categories, posts, authors, cities} = this.props;
		console.log(this.props);
		let filteredPosts = [];
		
		filteredPosts = categorize(this.props.posts, currentCategory);
		filteredPosts = authorCheck(filteredPosts, currentAuthor);
		filteredPosts = cityCheck(filteredPosts, currentCity);
		
		return (
            <div className="row">
				<div className="col-md-3">
					Category
					<ListGroup
						active={currentCategory}
						onChange={(val) => this.handleChange("currentCategory", val)}
						options={categories}
						onPageChange={this.onPageChange}
					/>
					
					City
					<ListGroup3
						active={currentCity}
						onChange={(val) => this.handleChange("currentCity", val)}
						options={cities}
						onPageChange={this.onPageChange}
					/>
					
					User
					<ListGroup2
						active={currentAuthor}
						onChange={(val) => this.handleChange("currentAuthor", val)}
						options={authors}
						onPageChange={this.onPageChange}
					/>
				</div>
					
				<div className="col-md-8 jobs-container">
				  <Pagination
					itemsCount={filteredPosts.length}
					pageSize={pageSize}
					onPageChange={this.onPageChange}
					currentPage={currentPage}
				  />
				  
				  <p className="text-left text-muted">
					{!!filteredPosts.length ? `${filteredPosts.length} ` : "0 "}
					posts found.
				  </p>
				  
				  <PostTable
					pageSize={pageSize}
					currentPage={currentPage}
					posts={filteredPosts}
				  />
				</div>
            </div>
        );
    }
}

PropTester.propTypes = propTypes;
export default PropTester;