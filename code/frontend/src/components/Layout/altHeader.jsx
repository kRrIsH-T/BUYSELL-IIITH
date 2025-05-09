import React from "react";
import { NavLink, Link} from "react-router-dom";


const altHeader = () => {
    return(
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <Link to="/" className="navbar-brand">BuySell@IIITH</Link>
          </div>
        </div>
      </nav>
    );
};
export default altHeader;