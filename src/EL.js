import { Component } from "react";

class EL extends Component{
	componentWillMount() {
		document.title = "Ngoại Hạng Anh - ILF";
	}

	render(){
		return (
			<div className="container-xl">
				Ngoại Hạng Anh
			</div>
		)
	}
}

export default EL;
