# react-restful-table
react table with restful CRUD


git clone https://github.com/fangj/react-restful-table
cd react-restful-table/examples
node app.js

visit http://localhost:3000

![edit table](./screenshots/edittable.png)


usage:
```
var RestfulTabl=require('react-restful-table');

var selectRowProp = {
          mode: "radio",
          clickToSelect: true,
          bgColor: "rgb(238, 193, 213)"
        };
        
ReactDOM.render(
   <RestfulTable url='/api/post' keyField="_id" 
    insertRow={true} deleteRow={true} selectRow={selectRowProp}>                
	      <TableHeaderColumn dataField="title" >title</TableHeaderColumn>
	      <TableHeaderColumn dataField="content" >content</TableHeaderColumn>
	</RestfulTable>,
  document.getElementById('container')
);
```
