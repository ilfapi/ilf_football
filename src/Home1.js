import { Component } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import withRouter from './withRouter';

class Home extends Component{

  constructor(props) {
    super(props);
    this.state = { totalMatch: "" };
  }

  componentWillMount() {
    document.title = "Trang chủ - ILF";
  };

  componentDidMount() {
      this.getData();
  }

  async getData(date){
    try {
      const res = await axios.post('http://localhost:8081/api/matches');
      const totalMatch = JSON.parse(res.data.result);
      this.setState({ totalMatch: totalMatch});
    } catch(e) {
      console.log(e);
      this.setState({ error: e.request.status, message: e.message});
    }
  }

  showMatches(){
    if (typeof this.state.totalMatch.matches !== "undefined") {
      return this.state.totalMatch.matches.map((matchToDay, index) => {
        const { id, matchday, utcDate, competition, group, homeTeam, awayTeam, status, score} = matchToDay
        // console.log(matchToDay);
        var day = (group == null) ? "Vòng " + matchday : group.replace('GROUP_', 'Bảng ');
        var scoreResult = " vs ";
        var statusMatch = "";
        switch (status) {
          case "TIMED":
            scoreResult = " vs ";
            statusMatch = "TIMED";
            break;
          case "IN_PLAY":
            if (score.halfTime.home != null || score.halfTime.away != null) {
              scoreResult = score.halfTime.home + ":" + score.halfTime.away;
            }

            if (score.fullTime.home != null || score.fullTime.away != null) {
              scoreResult = score.fullTime.home + ":" + score.fullTime.away;
            }
            statusMatch = "LIVE";
            break;
          case "FINISHED":
            if (score.halfTime.home != null || score.halfTime.away != null) {
              scoreResult = score.halfTime.home + ":" + score.halfTime.away;
            }

            if (score.fullTime.home != null || score.fullTime.away != null) {
              scoreResult = score.fullTime.home + ":" + score.fullTime.away;
            }
            statusMatch = "FT";
            break;
        }
        var linkTo = 'chi-tiet-tran-dau/'+id.toString();

        return (
          <tr key={id} className="show-match tr-hover" match={id}>
            <td className="td-datetime">{this.formatDate(utcDate)}</td>
            <td className="td-matchday">{ day }</td>
            <td className="td-league">
              <img className="td-img" alt={ competition.name } src={ competition.emblem }/> { competition.name }
            </td>
            <td className="td-homeTeam">
              { homeTeam.shortName } <img className="td-img" alt={  homeTeam.shortName } src={ homeTeam.crest }/>
            </td>
            <td className="td-score">{ scoreResult }</td>
            <td className="td-awayTeam">
              <img className="td-img" src={ awayTeam.crest } alt={ awayTeam.shortName }/> { awayTeam.shortName }
            </td>
            <td className="td-statusMatch">{ statusMatch }</td>
            <td>
               <Link to={`/chi-tiet-tran-dau/${id.toString()}`}>Chi tiết</Link>
            </td>
          </tr>
        )
      })
    }else{
      if (typeof this.state.error !== "undefined") {
        var errorCode = (this.state.error === 0) ? 500 : this.state.error;
        return (
          <tr className="show-match-waiting">
            <td rowSpan="6" className="td-text-center">Lỗi { errorCode }: { this.state.message }</td>
          </tr>
        );
      }else{
        return (
          <tr className="show-match-waiting">
            <td rowSpan="6" className="td-text-center">Vui lòng chờ...</td>
          </tr>
        );
      }
    }
  }

  OnClickDay(date) {
    console.log('jello', date);
    return this.showMatches(date);
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

  getTabsDay(type, value) {
    var temp = (parseInt(value) * 24 * 60 * 60 * 1000);
    var d = "";
    if (type == "-") {
      d = new Date(Date.now() - temp);
    }else if (type == "+") {
      d = new Date(Date.now() + temp);
    }
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();
    if (month.toString().length < 2) month = '0' + month;
    if (day.toString().length < 2) day = '0' + day;
    var dd = [day, month, year].join('/');
    return dd;
  }

  showListMatchDay() {
    return (
      <div id="tsum-tabs">
        <main>
          <input id="tab1" type="radio" name="tabs" onClick={(e) => { this.OnClickDay(this.getTabsDay("-", 2)) }} />
          <label htmlFor="tab1">{ this.getTabsDay("-", 2) }</label>

          <input id="tab2" type="radio" name="tabs" onClick={(e) => { this.OnClickDay(this.getTabsDay("-", 1)) }} />
          <label htmlFor="tab2">{ this.getTabsDay("-", 1) }</label>

          <input id="tab3" type="radio" name="tabs" onClick={(e) => { this.OnClickDay(this.getTabsDay("+", 0)) }} defaultChecked/>
          <label htmlFor="tab3">{ this.getTabsDay("+", 0) }</label>

          <input id="tab4" type="radio" name="tabs" onClick={(e) => { this.OnClickDay(this.getTabsDay("+", 1)) }} />
          <label htmlFor="tab4">{ this.getTabsDay("+", 1) }</label>

          <input id="tab5" type="radio" name="tabs" onClick={(e) => { this.OnClickDay(this.getTabsDay("+", 2)) }} />
          <label htmlFor="tab5">{ this.getTabsDay("+", 2) }</label>
        </main>
    </div>
    );
  }

  labelMatchDay() {
    if (typeof this.state.totalMatch.filters !== "undefined") {
      return (
        <div>
          <label className="label-matchday">
            Lịch thi đấu từ { this.state.totalMatch.filters.dateFrom } đến { this.state.totalMatch.filters.dateTo }
          </label>
          <input type="date" onChange={(e) => { this.OnClickDay(e.target.value) }} />
        </div>
      )
    }else{
      return 
    }
  }

  render(){
    return (
      <div className="container-xl">
        { this.showListMatchDay() }
        <table className='table table-responsive' id="matchDate">
          <tbody>
            { this.showMatches() }
          </tbody>
        </table>
      </div>
    )
  }
}

export default withRouter(Home);