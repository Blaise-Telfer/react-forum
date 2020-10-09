import React from 'react';


function CheckClass(category, active) {
	const classButtons = "list-item";
	return category === active ? classButtons + " list-item-active" :  classButtons;
}

const ListGroup = props => {
	let { onChange, active, options, onPageChange } = props; 
	options.sort();
	return ( 
		<div className="search-filters">  
		  <p key='all' className={CheckClass('All', active)} onClick={() => onChange('All')}> All
		  </p>
		  { 
			options &&
			options.map((category, index) => 
			  <p 
				key={`category-${ index }`} 
				className={CheckClass(category, active)}
				onClick={() => {
					onChange(category)
					onPageChange(1)
				}}>
				{category}
			  </p>
			)}
			
		</div>
	);
}
export default ListGroup;
