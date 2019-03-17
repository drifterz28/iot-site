import React, { Fragment } from "react";
import Header from "./header";
import Category from './category';
const App = () => (
  <Fragment>
    <Header />
    <div className="category-wrapper">
      <Category />
      <Category />
      <Category />
      <Category />
      <Category />
      <Category />
    </div>
  </Fragment>
);

export default App;
