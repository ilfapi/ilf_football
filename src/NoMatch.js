import {Link} from 'react-router-dom'
import { Component } from "react";

class NoMatch extends Component{
  componentWillMount() {
    document.title = "Chi tiết trận đấu - ILF";
  }

  render(){
    return (
      <div className="text-center my-5">
        <h1 className="h2 mb-5">
          404 <br />
          Tran không tồn tại
        </h1>
        <p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
        <p>Trở về trang chủ bằng nút bên dưới</p>
        <Link to="/" className="btn btn-outline-primary">Trang chủ</Link>
      </div>
    )
  }
}

export default NoMatch;