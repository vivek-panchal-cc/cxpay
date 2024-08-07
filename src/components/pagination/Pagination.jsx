import React from "react";

const Pagination = (props) => {
  const { active, size, siblingCount, onClickHandler } = props;

  const showingNumbers = siblingCount * 2 + 1;
  let startNumber = 2;
  let startArrayNumber = siblingCount;

  let needStartDots = false;
  let needEndDots = false;

  if (active > siblingCount) {
    startArrayNumber = active - siblingCount;
    needStartDots = active > siblingCount + startNumber ? true : false;
  }

  if (size > showingNumbers) {
    needEndDots = size > active + siblingCount + 1 ? true : false;
    if (size < active + siblingCount + 1) {
      startArrayNumber = size - showingNumbers;
    }
  }

  if (active === 1 && size === 1) return null;
  return (
    <div>
      <div className="pagination-wrap contact-pagination">
        <ul>
          {active > 1 && (
            <li
              className="page-item"
              onClick={(e) => onClickHandler(active - 1)}
            >
              <span className="page-link prev">{"<< PREV"}</span>
            </li>
          )}
          {size > showingNumbers + startNumber ? (
            <>
              <li
                onClick={(e) =>
                  onClickHandler(parseInt(e.currentTarget.textContent))
                }
                className="page-item"
              >
                <span className={`page-link ${active === 1 && "current"}`}>
                  1
                </span>
              </li>

              {needStartDots && (
                <li className="page-item">
                  <span className="page-link skip">.....</span>
                </li>
              )}
              {[...Array(showingNumbers + 1).keys()].map((elm, i) => {
                const contentNumber = needStartDots
                  ? startArrayNumber
                  : startNumber;
                startNumber++;
                startArrayNumber++;
                return (
                  <li
                    key={elm}
                    className="page-item"
                    onClick={(e) =>
                      onClickHandler(parseInt(e.currentTarget.textContent))
                    }
                  >
                    <span
                      className={`page-link ${
                        active === contentNumber && "current"
                      }`}
                    >
                      {contentNumber}
                    </span>
                  </li>
                );
              })}
              {needEndDots && (
                <li className="page-item">
                  <span className="page-link skip">.....</span>
                </li>
              )}
              {startArrayNumber <= size && (
              <li
                className="page-item"
                onClick={(e) =>
                  onClickHandler(parseInt(e.currentTarget.textContent))
                }
              >
                <span className={`page-link ${active === size && "current"}`}>
                  {size}
                </span>
              </li>
              )}
            </>
          ) : (
            ((startArrayNumber = 1),
            [...Array(size).keys()].map((elm, i) => (
              <li
                key={elm}
                className="page-item"
                onClick={(e) =>
                  onClickHandler(parseInt(e.currentTarget.textContent))
                }
              >
                <span
                  className={`page-link last ${
                    active === startArrayNumber && "current"
                  }`}
                >
                  {startArrayNumber++}
                </span>
              </li>
            )))
          )}

          {active < size && (
            <li
              className="page-item"
              onClick={(e) => onClickHandler(active + 1)}
            >
              <span className="page-link next">{"NEXT >>"}</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Pagination;
