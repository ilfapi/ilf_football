import BannerHome from './img/i-love-football-sticker.png';
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark" aria-label="Ninth navbar example">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand" aria-current="page">
                    <img alt="icon home" src={BannerHome} width="35" height="35" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample07XL" aria-controls="navbarsExample07XL" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarsExample07XL">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to="/" className="nav-link active" aria-current="page">Trang chủ</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="ngoai-hang-anh" className="nav-link" aria-current="page">Ngoại hạng anh</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;