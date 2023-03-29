import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const contentTitles = [
  {
    url: "add-card",
    heading: "add a card",
  },
  {
    url: "link-bank",
    heading: "link a bank",
  },
];

function Breadcrumb(props) {
  const { divider, activelinkcolor, inactivelinkcolor } = props;
  const location = useLocation();
  const [crumbs, setCrumbs] = useState([]);

  useEffect(() => {
    const urls = location.pathname.split("/").splice(1);
    const mutatedUrls = urls.reduce((acc, curr) => {
      const titleObj = contentTitles.find((item) => item.url === curr);
      return [
        ...acc,
        {
          url: acc[acc.length - 1]
            ? `${acc[acc.length - 1].url}/${curr}`
            : `/${curr}`,
          title: titleObj
            ? titleObj.heading
            : curr.toLowerCase().replace(/-/g, " "),
        },
      ];
    }, []);
    setCrumbs(mutatedUrls);
  }, [location.pathname]);

  return (
    <div {...props}>
      <ul className="breadcrumb">
        {crumbs.map((item, index) => (
          <li key={`${item.url}-${index}`} className="text-capitalize">
            {index < crumbs.length - 1 ? (
              <Link to={item.url} replace>
                {item.title}
              </Link>
            ) : (
              <a className="cursor-pointer">{item.title}</a>
            )}
          </li>
        ))}
      </ul>
      <style>
        {`
          .breadcrumb li:not(:last-child)::after{
            content: "${divider ?? ">>"}";
          }
          .breadcrumb li a {
            color: ${inactivelinkcolor ?? "#bdbdbd"}
          }
          .breadcrumb li a:hover, .breadcrumb li:last-child a{
            color: ${activelinkcolor ?? "#0081c5"};
          }
        `}
      </style>
    </div>
  );
}

export default Breadcrumb;
