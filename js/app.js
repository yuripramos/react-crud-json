import React from "react";
import ReactDOM from "react-dom";
import Reactable from "Reactable";

import Header from "./layout/header";
// import { Router, Route, IndexRoute, hashHistory } from "react-router";

const app = document.getElementById('app');
var Table = Reactable.Table;

class Crud extends React.Component{

	render(){
		return(
			<div className="container">
				<Header/>
				<Table className="table" data={[
					{ "combustivel" : "Flex",
					"imagem" : null,
					"marca" : "Volkswagem",
					"modelo" : "Gol",
					"placa" : "FFF-5498",
					"valor" : "20000"
					},
					{ "combustivel" : "Gasolina",
					"imagem" : null,
					"marca" : "Volkswagem",
					"modelo" : "Fox",
					"placa" : "FOX-4125",
					"valor" : "20000"
					},
					{ "combustivel" : "Alcool",
					"imagem" : "http://carros.ig.com.br/fotos/2010/290_193/Fusca2_290_193.jpg",
					"marca" : "Volkswagen",
					"modelo" : "Fusca",
					"placa" : "PAI-4121",
					"valor" : "20000"
					}
	    		]} itemsPerPage={4} pageButtonLimit={5} />
			</div>
		);
	}
}

ReactDOM.render(
	<Crud/>, app);

