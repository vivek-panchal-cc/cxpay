import React from "react";
import { Link, useLocation } from "react-router-dom";

function Breadcrumb(props) {
  const { divider, activelinkcolor, inactivelinkcolor } = props;

  const location = useLocation();
  const urls = location.pathname.split("/");

  const getUrl = (currentIndex) => {
    const urlItems = urls;
    if (currentIndex > 1) {
      const path = urlItems.splice(1, currentIndex).join("/");
      return `/${path}`;
    } else {
      return `/${urls[currentIndex]}`;
    }
  };

  const getCapitalized = (text) => {
    const str = text.split("-");
    const cpt = str.map((itm) => {
      return itm.charAt(0).toUpperCase() + itm.slice(1);
    });
    return cpt.join(" ");
  };

  return (
    <div {...props}>
      <ul className="breadcrumb">
        {urls?.map((elm, i) => {
          return (
            elm && (
              <li key={`breadcrumb-${elm}`}>
                {i !== urls.length - 1 ? (
                  <Link to={`${getUrl(i)}`}>{getCapitalized(elm)}</Link>
                ) : (
                  getCapitalized(elm)
                )}
              </li>
            )
          );
        })}
      </ul>
      <style>
        {`
          .breadcrumb li:not(:last-child)::after{
            content: "${divider ?? ">>"}";
          }
          .breadcrumb li a:hover, .breadcrumb li:last-child {
            color: ${activelinkcolor ?? "#0081c5"};
          }
          .breadcrumb li a {
            color: ${inactivelinkcolor ?? "#bdbdbd"}
          }
        `}
      </style>
    </div>
  );
}

export default Breadcrumb;
