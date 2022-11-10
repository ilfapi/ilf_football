import { useSearchParams, Link } from "react-router-dom";
import { Component } from "react";
import withRouter from './withRouter';
import axios from "axios";

class MatchesDetail extends Component {
	 constructor(props) {
		super(props);
		this.state = { totalMatch: ""};
	}

	componentWillMount() {
		document.title = "Thông tin trận đấu - ILF";
	};

	componentDidMount() {
		this.getData();
	}

	async getData(){
		const matchId = this.props.params.matchId;
		if (typeof matchId !== "undefined") {
			try {
				const res = await axios.get('http://localhost:8081/api/matches/'+matchId);
				const matchInfo = JSON.parse(res.data.result);
				this.setState({ matchInfo: matchInfo});
			} catch(e) {
				console.log(e);
				this.setState({ error: e.request.status, message: e.message});
			}
		}else{

		}
	}

	formatDate(date) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear(),
			hour = d.getHours(),
			minute = d.getMinutes();
		if (month.toString().length < 2) month = '0' + month;
		if (day.toString().length < 2) day = '0' + day;
		if (hour.toString().length < 2) hour = '0' + hour;
		if (minute.toString().length < 2) minute = '0' + minute;
		var dd = [day, month, year].join('/');
		var time = [hour, minute].join('h');
		return dd+" "+time;
	}

	matchDetailInfo(){
		if (typeof this.state.matchInfo !== "undefined") {
			const { competition, utcDate, homeTeam, awayTeam, venue, stage, group, matchday, score, status} = this.state.matchInfo;
			console.log(this.state.matchInfo)
			var matchTournament = competition.name;
			var matchTournamentLogo = competition.emblem;
			var datetime = this.formatDate(utcDate);
			var logoHome = homeTeam.crest;
			var nameHome = homeTeam.shortName;
			var logoAway = awayTeam.crest;
			var nameAway = awayTeam.shortName;
			var day = (competition.type == "CUP") ? "Ngày thi đấu "+matchday+"/6":  "Vòng đấu thứ "+matchday;
			var details = (group == null) ? day : stage + " - " + (group) + " - "+ day;
			var clsMatchDetail = (group == null) ? "match-detail-convert" : 'match-detail';
			var matchReferee = venue;
			var scoreFTHome = (score.fullTime.home !== null) ? score.fullTime.home : "-";
			var scoreFTAway = (score.fullTime.away !== null) ? score.fullTime.away : "-";
			var scoreHTHome = (score.halfTime.home !== null) ? score.halfTime.home : "-";
			var scoreHTAway = (score.halfTime.away !== null) ? score.halfTime.away : "-";
			var classHT = (score.halfTime.home != null || score.halfTime.away != null) ? "match-score-half-time display-match-score" : "match-score-half-time";
			var statusMatch = "Sắp diễn ra";
			var colorClass = "";
			switch (status) {
				case "TIMED":
					statusMatch = "Sắp diễn ra";
					colorClass = "match-status match-begin";
				break;
				case "IN_PLAY":
					statusMatch = "Đang diễn ra";
					colorClass = "match-status";
				break;
				case "FINISHED":
					statusMatch = "Kết thúc";
					colorClass = "match-status match-end";
				break;
			}

			var winnerHome = (score.winner == "HOME_TEAM") ? "match-score-number match-score-number--leading" : "match-score-number";
			var winnerAway = (score.winner == "AWAY_TEAM") ? "match-score-number match-score-number--leading" : "match-score-number";

			return (
				<div>
					<nav aria-label="breadcrumb">
						<ol className="breadcrumb">
							<li className="breadcrumb-item"><Link to={ matchTournament }>{ matchTournament }</Link></li>
							<li className="breadcrumb-item active" aria-current="page">Thông tin trận đấu</li>
						</ol>
					</nav>
					<div className="match">
						<div className="match-header">
							<div className={ colorClass }>{ statusMatch }</div>
							<div className="match-tournament">
								<img className="match-logo" src={ matchTournamentLogo } /> { matchTournament }
							</div>
							<div className="match-actions">
								<button className="btn-icon"><i className="material-icons-outlined">grade</i></button>
								<button className="btn-icon"><i className="material-icons-outlined">add_alert</i></button>
							</div>
						</div>
						<div className="match-content">
							<div className="column">
								<div className="team team--home">
									<div className="team-logo">
										<img src={logoHome} />
									</div>
									<h2 className="team-name">{ nameHome }</h2>
								</div>
							</div>
							<div className="column">
								<div className="match-details">
									<div className="match-date">
										{ datetime }
									</div>
									<div className={ clsMatchDetail }>
										{ details }
									</div>
									<div className="match-score">
										<span className={ winnerHome }>{ scoreFTHome }</span>
										<span className="match-score-divider">:</span>
										<span className={ winnerAway }>{ scoreFTAway }</span>
									</div>
									<div className={ classHT }>
										<span className="match-score-number-half-time">( H1: { scoreHTHome }</span>
										<span className="match-score-divider-half-time">:</span>
										<span className="match-score-number-half-time">{ scoreHTAway } )</span>
									</div>
									<div className="match-time-lapsed">
									</div>
									<div className="match-referee">
										Sân: <strong>{ matchReferee }</strong>
									</div>
								</div>
							</div>
							<div className="column">
								<div className="team team--away">
									<div className="team-logo">
										<img src={ logoAway } />
									</div>
									<h2 className="team-name">{ nameAway }</h2>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}else{
			return <div>KHÔNG CÓ DỮ LIỆU</div>;
		}
	}

	render() {
	    return (
	        <div className="container-xl">
	        	{ this.matchDetailInfo() }
	        </div>
	    )
	  }
}

export default withRouter(MatchesDetail);