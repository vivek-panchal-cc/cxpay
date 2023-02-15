// import "../../assets/css/bootstrap.min.css";
// import "../../assets/css/style.css";
// import "../../assets/css/responsive.css";

const SplashScreen = () => {
  return (
    <div className="app-bg">
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="logo-content-wrap">
              <div className="logo-image">
                <a href="/">
                  <img src="images/logo-1.png" alt="logo img" />
                </a>
              </div>
              <h4>Innovation Through ePayments</h4>
              <ul className="splash-dots">
                <li>
                  <span></span>
                </li>
                <li>
                  <span></span>
                </li>
                <li>
                  <span></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
