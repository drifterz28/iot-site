import React, { useState } from "react";

const Category = () => {
  const [isOpen, setState] = useState(false);
  return (
    <div className={`category ${isOpen ? "active" : ""}`}>
      <div className="statistic-wrap">
        <div className="head">
          <i className="far fa-moon" /> Night Life
        </div>
        <div className="statistic">
          <div className="count">330</div>
          <div className="title">Followers</div>
        </div>
        <div className="statistic">
          <div className="count">290</div>
          <div className="title">Favourites</div>
        </div>
        <div className="statistic">
          <div className="count">1725</div>
          <div className="title">Views</div>
        </div>
      </div>
      <div className="links-wrap">
        <div className="toggle" onClick={() => setState(!isOpen)}>
          <i className="fa" />
        </div>
        <div className="links">
          <a href="#">
            <i className="fas fa-plus" />
          </a>
          <a href="#">
            <i className="fas fa-star" />
          </a>
          <a href="#">
            <i className="fas fa-redo" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Category;
