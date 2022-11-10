import { Fragment, Component } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import withRouter from './withRouter';

class Home extends Component{
	constructor(props) {
		super(props);
		this.state = { 
			totalMatch: "",
			totalStanding: "",
			dateNow: this.getDateNow(),
			arr_fixture: null,
			arr_result: null,
			error: null,
			message: null
		};
	}

	componentWillMount() {
		document.title = "Lịch thi đấu, kết quả bóng đá - ILF";
	};

	componentDidMount() {
		this.getFixtureAndResult();
		this.getStanding();
	}

	async getFixtureAndResult(date){
		try {
			const res = await axios.get('https://gw.vnexpress.net/football/fixture/date?league_id=4335,4378');
			const totalMatch = res.data;
			this.setState({ totalMatch: totalMatch});
		} catch(e) {
			console.log(e);
			this.setState({ error: e.request, message: e.message});
		}
	}

	async getStanding(date){
		try {
			const res = await axios.get('https://gw.vnexpress.net/football/standing?league_id=4335,4378');
			const totalStanding = res.data;
			this.setState({ totalStanding: totalStanding});
		} catch(e) {
			console.log(e);
			this.setState({ error: e.request, message: e.message});
		}
	}

	getDateNow() {
		var d = new Date(),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
		if (month.toString().length < 2) month = '0' + month;
		if (day.toString().length < 2) day = '0' + day;
		var dd = [year, month, day].join('/');
		return dd;
	}

	getDayOfWeek(date) {
		const d = new Date(date);
		let day = d.getDay();
		const days = ['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'];
		return days[day];
	}

	formatDDMMYY(date) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
		if (month.toString().length < 2) month = '0' + month;
		if (day.toString().length < 2) day = '0' + day;
		var dd = [day, month, year].join('/');
		return dd;
	}

	formatYYMMDD(date) {
		var arr_str = date.split("/");
		var _year = arr_str[0];
		var _day = arr_str[1];
		var _month = arr_str[2];

		var date_str = [_year, _month, _day].join('/');
		var d = new Date(date_str),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
		if (month.toString().length < 2) month = '0' + month;
		if (day.toString().length < 2) day = '0' + day;
		var dd = [year, month, day].join('/');
		return dd;
	}

	getTimeFromDate(timestamp) {
		var date = new Date(timestamp * 1000);
		var hours = date.getHours();
		var minutes = date.getMinutes();
		if (hours.toString().length < 2) hours = '0' + hours;
		if (minutes.toString().length < 2) minutes = '0' + minutes;
		var hm = [hours, minutes].join('h');
		return hm;
	}

	// formatDataInput(json) {
	// 	var self = this;
	// 	var listMatch = json.data;
	// 	var dateNow = this.state.dateNow;
	// 	var arr_fixture = new Array();
	// 	var arr_result = new Array();
	// 	if (typeof listMatch !== "undefined") {
	// 		Object.keys(listMatch).map(function(key, index) {
	// 			const { league_detail, data } = listMatch[key];
	// 			var a = Object.keys(data).map(function(k, i) {
	// 				let date1 = new Date(k);
	// 				let date2 = new Date(dateNow);
	// 				var tem = {
	// 					datetime: k,
	// 					result: data[k].data
	// 				}

	// 				if (date1 > date2){
	// 					arr_fixture.push(tem);
	// 				}else if (date1 <= date2){
	// 					arr_result.push(tem);
	// 				}
	// 			});
	// 		});

	// 		self.setState({
	// 			arr_fixture: arr_fixture, 
	// 			arr_result: arr_result, 
	// 		});
	// 	}else{
	// 		self.setState({
	// 			arr_fixture: null, 
	// 			arr_result: null 
	// 		});
	// 	}
	// }

	renderHTML() {
		var self = this;
		var listMatch = this.state.totalMatch.data;
		var listStanding = this.state.totalStanding.data;
		var dateNow = this.state.dateNow;
		var arr_fixture = new Array();
		var arr_result = new Array();

		if (typeof listMatch !== "undefined") {
			return Object.keys(listMatch).map(function(key, index) {
				const { league_detail, data } = listMatch[key];
				var round_fixture = Object.entries(data).length + 2;
				var round_result = Object.entries(data).length + 1;

				return (
					
						<div key={key} className="container-xxl px-4 py-0" id="featured-3">
							<div className="header-block pb-2 border-bottom" ref={(node) => 
							        node?.style.setProperty("border-bottom-color","red", "important")
							    } >
						        <Link className="tag-a" to="/" title="{ league_detail.name }">
						        	<span className="icon">
						        		<img src={ league_detail.logo } alt="{ league_detail.name }" />
						        	</span>
						        </Link>
						        <Link className="tag-a" to="/" title="{ league_detail.name }">
						        	<span className="text">{ league_detail.name }</span>
						        </Link>
						    </div>

						    <div className="row g-4 py-1 row-cols-1 row-cols-lg-3">
						    	<Fragment key={key}>
						    		<BoxLichDau data={data} dateNow={dateNow}/>
						        	<BoxKetQua data={data} dateNow={dateNow}/>
						        	<BoxBXH data={listStanding} league_id={key}/>
								</Fragment>
						    </div>
						</div>
				);
			});
		}else {
			if (typeof this.state.error !== "undefined") {
				var errorCode = (this.state.error === 0) ? 500 : this.state.error;
				return (
					<div className="show-match-waiting">
						<div className="td-text-center">Lỗi { errorCode }: { this.state.message }</div>
					</div>
				);
			}else{
				return (
					<div className="show-match-waiting">
						<div className="td-text-center">Vui lòng chờ...</div>
					</div>
				);
			}
		}
	}

	// renderFixture(fixture_data, date_choose) {
	// 	var self = this;
	// 	var date_check = self.state.dateNow;
	// 	var arr_fixture = new Array();
	// 	var htmlFixture = Object.keys(fixture_data).map(function(k, i) {
	// 		let d1 = Date.parse(self.formatYYMMDD(k));
	// 		let d2 = Date.parse(date_check);

	// 		if ( d1 > d2 ) {
	// 			var t = {
	// 				date: self.formatYYMMDD(k),
	// 				result: fixture_data[k]
	// 			}
	// 			arr_fixture.push(t)
	// 		}
	// 	});

	// 	const { date, result } = arr_fixture[0];
	// 	var dow = self.getDayOfWeek(date);
	// 	var dmy = self.formatDDMMYY(date);
	// 	var key_null = Math.floor(Math.random() * 200);
	// 	localStorage.setItem("arr_fixture", JSON.stringify(arr_fixture));
	// 	localStorage.setItem("date_fixture", date);

	// 	return (
	// 		<div key={key_null} className="select-date" data-leagueid="league_id" data-type="lichdau">
 //                <Link to="/" className="choose-date left" data-action="prev">
 //                	<span className="prev disable"></span>
 //                </Link>
 //                <Link to="/" className="choose-date right" data-action="next">
 //                	<span className="next"></span>
 //                </Link>
 //                <span className="date" data-index="0" id="lichdau-league_id">
 //                	<strong>{ dow }</strong> { dmy }
 //                </span>
 //            </div>
	// 	)
	// }

	// renderResult(result_data, date_choose) {
	// 	var self = this;
	// 	var date_check = self.state.dateNow;
	// 	var arr_result = new Array();
	// 	var _arr_result = null;
	// 	var htmlFixture = Object.keys(result_data).map(function(k, i) {
	// 		let d1 = Date.parse(self.formatYYMMDD(k));
	// 		let d2 = Date.parse(date_check);
			
	// 		if ( d1 < d2 ) {
	// 			var t = {
	// 				date: self.formatYYMMDD(k),
	// 				result: result_data[k]
	// 			}
	// 			arr_result.push(t)
	// 		}
	// 	});

	// 	_arr_result = arr_result.sort(function(a, b) { var c = new Date(a.date); var d = new Date(b.date); return c - d; });
	// 	const { date, result } = arr_result[arr_result.length - 1];
	// 	var dow = self.getDayOfWeek(date);
	// 	var dmy = self.formatDDMMYY(date);
	// 	var key_null = Math.floor(Math.random() * 200);
	// 	localStorage.setItem("arr_result", JSON.stringify(arr_result));
	// 	localStorage.setItem("date_result", date);

	// 	return (
	// 		<div key={key_null} className="select-date" data-leagueid="league_id" data-type="lichdau">
 //                <Link to="/" className="choose-date left" data-action="prev">
 //                	<span className="prev"></span>
 //                </Link>
 //                <Link to="/" className="choose-date right" data-action="next">
 //                	<span className="next disable"></span>
 //                </Link>
 //                <span className="date" data-index="0" id="lichdau-league_id">
 //                	<strong>{ dow }</strong> { dmy }
 //                </span>
 //            </div>
	// 	)		
	// }

	// renderMatch(type){
	// 	var self = this;
	// 	if (type == "fixture"){
	// 		var match_data = localStorage.getItem("arr_fixture");
	// 		var date = localStorage.getItem("date_fixture");
	// 	}else{
	// 		var match_data = localStorage.getItem("arr_result");
	// 		var date = localStorage.getItem("date_result");
	// 	}

	// 	var json = JSON.parse(match_data);
	// 	var index = (json.map(function(x){ return x.date; })).indexOf(date);
	// 	let matchDay = json[index].result.data;

	// 	// var avc = matchDay.forEach(function(element, index) {
	// 	// 	var key_null = Math.floor(Math.random() * 200);
	// 	// // 	const { fixture_id, home_team, away_team, score, event_timestamp} = element;
	// 	// // 	var teamIdHome = home_team.team_id;
	// 	// // 	var teamIdAway = away_team.team_id;
	// 	// // 	var teamNameHome = home_team.team_name;
	// 	// // 	var teamNameAway = away_team.team_name;
	// 	// // 	var teamLogoHome = home_team.logo;
	// 	// // 	var teamLogoAway = away_team.logo;
	// 	// // 	var time = self.getTimeFromDate(event_timestamp);
	// 	// // 	console.log(key_null);
	// 	// // 	return (
	// 	// // 		<div key={key_null} className="wvd teamid-35 teamid-63 ">
	// 	// // 	        <Link className="doidau lichdau flexbox tag-a" to="/">
	// 	// // 	            <div className="doibong doi-1 flexbox">
	// 	// // 	                <span className="name">{ teamNameHome }</span>
	// 	// // 	                <span className="avatar">
	// 	// // 	                	<img src={ teamLogoHome } alt={teamNameHome} />
	// 	// // 	                </span>
	// 	// // 	            </div>
	// 	// // 	            <div className="ti-so">
	// 	// // 	                <span className="so">22:00</span>
	// 	// // 	            </div>
	// 	// // 	            <div className="doibong doi-2 flexbox">
	// 	// // 	                <span className="avatar">
	// 	// // 	                	<img src={ teamLogoAway } alt={teamNameAway} />
	// 	// // 	                </span>
	// 	// // 	                <span className="name">{ teamNameAway }</span>
	// 	// // 	            </div>
	// 	// // 	        </Link>
	// 	// // 	    </div>
	// 	// // 	)
	// 	// });

	// 	// console.log(avc);
	// }

	render(){
		return (
			<div className="container-fluid">
				{ this.renderHTML() }
			</div>
		)
	}
}

class BoxLichDau extends Component{
	getDateNow() {
		var d = new Date(),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
		if (month.toString().length < 2) month = '0' + month;
		if (day.toString().length < 2) day = '0' + day;
		var dd = [year, month, day].join('/');
		return dd;
	}

	getDayOfWeek(date) {
		const d = new Date(date);
		let day = d.getDay();
		const days = ['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'];
		return days[day];
	}

	formatDDMMYY(date) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
		if (month.toString().length < 2) month = '0' + month;
		if (day.toString().length < 2) day = '0' + day;
		var dd = [day, month, year].join('/');
		return dd;
	}

	formatYYMMDD(date) {
		var arr_str = date.split("/");
		var _year = arr_str[0];
		var _day = arr_str[1];
		var _month = arr_str[2];

		var date_str = [_year, _month, _day].join('/');
		var d = new Date(date_str),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
		if (month.toString().length < 2) month = '0' + month;
		if (day.toString().length < 2) day = '0' + day;
		var dd = [year, month, day].join('/');
		return dd;
	}

	getTimeFromDate(timestamp) {
		var date = new Date(timestamp * 1000);
		var hours = date.getHours();
		var minutes = date.getMinutes();
		if (hours.toString().length < 2) hours = '0' + hours;
		if (minutes.toString().length < 2) minutes = '0' + minutes;
		var hm = [hours, minutes].join('h');
		return hm;
	}

	renderMatch(type){
		var self = this;
		if (type == "fixture"){
			var match_data = localStorage.getItem("arr_fixture");
			var date = localStorage.getItem("date_fixture");
		}else{
			var match_data = localStorage.getItem("arr_result");
			var date = localStorage.getItem("date_result");
		}

		var json = JSON.parse(match_data);
		var index = (json.map(function(x){ return x.date; })).indexOf(date);
		let matchDay = json[index].result.data;

		return matchDay.map(function(element, index) {
			var key_null = Math.floor(Math.random() * 200);
			const { fixture_id, home_team, away_team, score, event_timestamp} = element;
			var teamIdHome = home_team.team_id;
			var teamIdAway = away_team.team_id;
			var teamNameHome = home_team.team_name;
			var teamNameAway = away_team.team_name;
			var teamLogoHome = home_team.logo;
			var teamLogoAway = away_team.logo;
			var time = self.getTimeFromDate(event_timestamp);
			var clsName = `wvd teamid-${ teamIdHome } teamid-${ teamIdAway }`;

			return (
				<div key={teamIdHome} className={clsName}>
			        <Link className="doidau lichdau flexbox tag-a" to="/">
			            <div className="doibong doi-1 flexbox">
			                <span className="name">{ teamNameHome }</span>
			                <span className="avatar">
			                	<img src={ teamLogoHome } alt={teamNameHome} />
			                </span>
			            </div>
			            <div className="ti-so">
			                <span className="so">{ time }</span>
			            </div>
			            <div className="doibong doi-2 flexbox">
			                <span className="avatar">
			                	<img src={ teamLogoAway } alt={teamNameAway} />
			                </span>
			                <span className="name">{ teamNameAway }</span>
			            </div>
			        </Link>
			    </div>
			);
		});
	}

	renderFixture(fixture_data, date_choose) {
		var self = this;
		var arr_fixture = new Array();
		var htmlFixture = Object.keys(fixture_data).map(function(k, i) {
			let d1 = Date.parse(self.formatYYMMDD(k));
			let d2 = Date.parse(date_choose);

			if ( d1 > d2 ) {
				var t = {
					date: self.formatYYMMDD(k),
					result: fixture_data[k]
				}
				arr_fixture.push(t)
			}
		});

		const { date, result } = arr_fixture[0];
		let round_int = (typeof result.data[0].round_int != "undefined") ? result.data[0].round_int: "";
		let round = (typeof result.data[0].round_int != "undefined") ? "Vòng " + result.data[0].round_int: "";

		var dow = self.getDayOfWeek(date);
		var dmy = self.formatDDMMYY(date);
		var key_null = Math.floor(Math.random() * 200);
		localStorage.setItem("arr_fixture", JSON.stringify(arr_fixture));
		localStorage.setItem("date_fixture", date);
		localStorage.setItem("round_fixture", JSON.stringify({round_int, round}));

		return (
			<div key={key_null} className="select-date" data-leagueid="league_id" data-type="lichdau">
                <Link to="/" className="choose-date left" data-action="prev">
                	<span className="prev disable"></span>
                </Link>
                <Link to="/" className="choose-date right" data-action="next">
                	<span className="next"></span>
                </Link>
                <span className="date" data-index="0" id="lichdau-league_id">
                	<strong>{ dow }</strong> { dmy }
                </span>
            </div>
		)
	}

	getRoundLeague(){
		let round_fixture = JSON.parse(localStorage.getItem("round_fixture"));
		return <div className="wvd text-vongdau is-text-round" data-round={ round_fixture.round_int }>{ round_fixture.round }</div>
	}

	render(){
		let fixture_data = this.props.data;
		let date_choose = this.props.dateNow;
		return (
			<div className="feature col">
	            <div className="block-lichdau" id="box-lichdau">
	            	<div className="inner-block">
	            		<div className="header-content-block">
	            			<div className="left">
	            				<span className="icon">
	            					<i className="ic fa fa-calendar" aria-hidden="true"></i>
	            				</span>
	            				<Link className="tag-a" to="/">Lịch đấu</Link>
	            			</div>
	            		</div>
	            		<div className="header-content-block-date">
	            			{ this.renderFixture(fixture_data, date_choose) }
	        			</div>
			            <div className="vongdau">
						    { this.getRoundLeague() }
						    { this.renderMatch("fixture") }
						</div>
					</div>
	            </div>
	        </div>
		);
	}
}

class BoxKetQua extends Component{
	getDateNow() {
		var d = new Date(),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
		if (month.toString().length < 2) month = '0' + month;
		if (day.toString().length < 2) day = '0' + day;
		var dd = [year, month, day].join('/');
		return dd;
	}

	getDayOfWeek(date) {
		const d = new Date(date);
		let day = d.getDay();
		const days = ['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'];
		return days[day];
	}

	formatDDMMYY(date) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
		if (month.toString().length < 2) month = '0' + month;
		if (day.toString().length < 2) day = '0' + day;
		var dd = [day, month, year].join('/');
		return dd;
	}

	formatYYMMDD(date) {
		var arr_str = date.split("/");
		var _year = arr_str[0];
		var _day = arr_str[1];
		var _month = arr_str[2];

		var date_str = [_year, _month, _day].join('/');
		var d = new Date(date_str),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
		if (month.toString().length < 2) month = '0' + month;
		if (day.toString().length < 2) day = '0' + day;
		var dd = [year, month, day].join('/');
		return dd;
	}

	getTimeFromDate(timestamp) {
		var date = new Date(timestamp * 1000);
		var hours = date.getHours();
		var minutes = date.getMinutes();
		if (hours.toString().length < 2) hours = '0' + hours;
		if (minutes.toString().length < 2) minutes = '0' + minutes;
		var hm = [hours, minutes].join('h');
		return hm;
	}

	getRoundLeague(){
		let round_result = JSON.parse(localStorage.getItem("round_result"));
		return <div className="wvd text-vongdau is-text-round" data-round={ round_result.round_int }>{ round_result.round }</div>
	}

	renderResult(result_data, date_choose) {
		var self = this;
		var arr_result = new Array();
		var _arr_result = null;
		var htmlFixture = Object.keys(result_data).map(function(k, i) {
			let d1 = Date.parse(self.formatYYMMDD(k));
			let d2 = Date.parse(date_choose);
			
			if ( d1 < d2 ) {
				var t = {
					date: self.formatYYMMDD(k),
					result: result_data[k]
				}
				arr_result.push(t)
			}
		});

		_arr_result = arr_result.sort(function(a, b) { var c = new Date(a.date); var d = new Date(b.date); return c - d; });
		const { date, result } = arr_result[arr_result.length - 1];
		var dow = self.getDayOfWeek(date);
		var dmy = self.formatDDMMYY(date);
		var key_null = Math.floor(Math.random() * 200);
		let round_int = (typeof result.data[0].round_int != "undefined") ? result.data[0].round_int: "";
		let round = (typeof result.data[0].round_int != "undefined") ? "Vòng " + result.data[0].round_int: "";
		localStorage.setItem("arr_result", JSON.stringify(arr_result));
		localStorage.setItem("date_result", date);
		localStorage.setItem("round_result", JSON.stringify({round_int, round}));

		return (
			<div key={key_null} className="select-date" data-leagueid="league_id" data-type="lichdau">
                <Link to="/" className="choose-date left" data-action="prev">
                	<span className="prev"></span>
                </Link>
                <Link to="/aaaaa" className="choose-date right" data-action="next">
                	<span className="next disable"></span>
                </Link>
                <span className="date" data-index="0" id="lichdau-league_id">
                	<strong>{ dow }</strong> { dmy }
                </span>
            </div>
		)		
	}

	renderMatch(type){
		var self = this;
		if (type == "fixture"){
			var match_data = localStorage.getItem("arr_fixture");
			var date = localStorage.getItem("date_fixture");
		}else{
			var match_data = localStorage.getItem("arr_result");
			var date = localStorage.getItem("date_result");
		}

		var json = JSON.parse(match_data);
		var index = (json.map(function(x){ return x.date; })).indexOf(date);
		let matchDay = json[index].result.data;

		return matchDay.map(function(element, index) {
			var key_null = Math.floor(Math.random() * 200);
			const { fixture_id, home_team, away_team, score, event_timestamp} = element;
			var teamIdHome = home_team.team_id;
			var teamIdAway = away_team.team_id;
			var teamNameHome = home_team.team_name;
			var teamNameAway = away_team.team_name;
			var teamLogoHome = home_team.logo;
			var teamLogoAway = away_team.logo;
			var time = self.getTimeFromDate(event_timestamp);
			var clsName = `wvd teamid-${ teamIdHome } teamid-${ teamIdAway }`;
			var halftime = score.halftime;
			var fulltime = score.fulltime;

			return (
				<div key={teamIdHome} className={clsName}>
			        <Link className="doidau lichdau flexbox tag-a" to="/">
			            <div className="doibong doi-1 flexbox">
			                <span className="name">{ teamNameHome }</span>
			                <span className="avatar">
			                	<img src={ teamLogoHome } alt={teamNameHome} />
			                </span>
			            </div>
			            <div className="ti-so">
			                <span className="so">1 - 2</span>
			                <span className="text-hiep">H1: 0-2</span>
			            </div>
			            <div className="doibong doi-2 flexbox">
			                <span className="avatar">
			                	<img src={ teamLogoAway } alt={teamNameAway} />
			                </span>
			                <span className="name">{ teamNameAway }</span>
			            </div>
			        </Link>
			    </div>
			);
		});
	}

	render(){
		let result_data = this.props.data;
		let date_choose = this.props.dateNow;
		return (
			<div className="feature col">
	            <div className="block-lichdau" id="box-lichdau">
	            	<div className="inner-block">
	            		<div className="header-content-block">
	            			<div className="left">
	            				<span className="icon">
	            					<i className="fa fa-bullhorn" aria-hidden="true"></i>
	            				</span>
	            				<Link className="tag-a" to="/">Kết quả</Link>
	            			</div>
	            		</div>
	            		<div className="header-content-block-date">
	            			{ this.renderResult(result_data, date_choose) }
	        			</div>
			            <div className="vongdau">
						    { this.getRoundLeague() }
						    { this.renderMatch("result") }
						</div>
					</div>
	            </div>
	        </div>
		);
	}
}

class BoxBXH extends Component{
	renderStanding(data) {
		return data.map(function(element, index){
			console.log(element);
			const { team_id, rank, team_name, all, goals_diff, points, logo} = element;
			return (
				<tr key={index}>
			        <td className="td-stt">{ rank }</td>
			        <td className="td-name">
			            <span className="flexbox">
			                <Link to="/" className="item-team flexbox tag-a">
			                    <img src={logo} alt={ team_name } />
			                    <span className="name">{ team_name }</span>
			                </Link>
			            </span>
			        </td>
			        <td>{ all.matchs_played }</td>
			        <td>{ goals_diff }</td>
			        <td><strong>{ points }</strong></td>
			    </tr>
			);
		})
	}

	render(){
		let listStanding = this.props.data;
		let league_id = this.props.league_id;
		let dataStanding = listStanding[league_id].data;
		let top8 = dataStanding.slice(0,8);
		
		return (
			<div className="feature col">
	            <div className="block-lichdau" id="box-lichdau">
	            	<div className="inner-block">
	            		<div className="header-content-block">
	            			<div className="left">
	            				<span className="icon">
	            					<i className="fa-sharp fa-ranking-star"></i>
	            				</span>
	            				<Link className="tag-a" to="/">Bảng điểm</Link>
	            			</div>
	            		</div>
	            		<table className="tbl-data" cellSpacing="0" cellPadding="0">
	                        <thead>
	                        	<tr>
	                        		<th colSpan="2" className="th-name">Top 8</th>
	                        		<th>Trận</th>
	                        		<th>+/-</th>
	                        		<th>Điểm</th>
	                        	</tr>
	                        </thead>
	                        <tbody>
	                        	{ this.renderStanding(top8) }
	                        </tbody>
	                    </table>
					</div>
	            </div>
	        </div>
		);
	}
}
export default withRouter(Home);