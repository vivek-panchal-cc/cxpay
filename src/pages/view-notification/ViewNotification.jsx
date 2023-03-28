import React from "react";
import { useSelector } from "react-redux";
import NotificationListItem from "components/items/NotificationListItem";

function ViewNotification(props) {
  const { notifications } = useSelector((state) => state.userNotification);

  return (
    <div>
      <div className="notification-list-sec">
        <div className="notification-top-sec">
          <div className="title-content-wrap">
            <h3>Notifications</h3>
            <p>Lorem Ipsum Dolor</p>
          </div>
        </div>
        <div className="notification-pg-list-wrap">
          <ul>
            {notifications?.map((item, index) => (
              <NotificationListItem
                notification={item}
                showDeleteButton={true}
                key={index}
              />
            ))}

            {/* <li>
              <div className="notification-pcw">
                <div className="notifi-ic-wrap">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="45"
                    height="45"
                    viewBox="0 0 45 45"
                    fill="none"
                  >
                    <path
                      d="M0.882194 14.8761C2.51093 7.93252 7.93252 2.51093 14.8761 0.882192C19.8906 -0.294063 25.1094 -0.294064 30.1239 0.882191C37.0675 2.51093 42.4891 7.93252 44.1178 14.8761C45.2941 19.8906 45.2941 25.1094 44.1178 30.1239C42.4891 37.0675 37.0675 42.4891 30.1239 44.1178C25.1094 45.2941 19.8906 45.2941 14.8761 44.1178C7.93253 42.4891 2.51093 37.0675 0.882194 30.1239C-0.294065 25.1094 -0.294065 19.8906 0.882194 14.8761Z"
                      fill="#93E06F"
                      fill-opacity="0.25"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M19.4845 24.5155C19.4845 24.5155 6.41773 21.8123 10.9585 19.1911C14.7904 16.9793 27.996 13.1765 29.841 14.159C30.8235 16.004 27.0207 29.2096 24.8089 33.0415C22.1877 37.5823 19.4845 24.5155 19.4845 24.5155Z"
                      stroke="#363853"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M23.776 26.2262C24.1963 24.4343 25.5954 23.0352 27.3873 22.6149C28.6814 22.3113 30.0282 22.3113 31.3223 22.6149C33.1141 23.0352 34.5133 24.4343 34.9336 26.2262C35.2371 27.5203 35.2371 28.867 34.9336 30.1611C34.5133 31.953 33.1141 33.3521 31.3223 33.7724C30.0282 34.076 28.6814 34.076 27.3873 33.7724C25.5954 33.3521 24.1963 31.953 23.776 30.1611C23.4725 28.867 23.4725 27.5203 23.776 26.2262Z"
                      fill="#93E06F"
                    ></path>
                    <path
                      d="M26.7742 27.871L28.475 29.4839L32.5806 26.2581"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M19.6775 24.3226L30.0001 14"
                      stroke="#363853"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>
                <div className="notifi-content">
                  <p>
                    Money sent to (<span>Contact Name</span>)
                  </p>
                  <p className="notifi-tran-idw">
                    Transection ID : <span>Lorem Ipsum</span>
                    <br />
                    Amount : <span>1234</span>
                  </p>
                </div>
              </div>
              <div className="notification-rm-wrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <rect width="48" height="48" rx="8" fill="#F7F7F9" />
                  <path
                    d="M30 18L18 30"
                    stroke="#FF3333"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18 18L30 30"
                    stroke="#FF3333"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </li>
            <li>
              <div className="notification-pcw">
                <div className="notifi-ic-wrap">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="45"
                    height="45"
                    viewBox="0 0 45 45"
                    fill="none"
                  >
                    <path
                      d="M0.882194 14.8761C2.51093 7.93252 7.93252 2.51093 14.8761 0.882192C19.8906 -0.294063 25.1094 -0.294064 30.1239 0.882191C37.0675 2.51093 42.4891 7.93252 44.1178 14.8761C45.2941 19.8906 45.2941 25.1094 44.1178 30.1239C42.4891 37.0675 37.0675 42.4891 30.1239 44.1178C25.1094 45.2941 19.8906 45.2941 14.8761 44.1178C7.93253 42.4891 2.51093 37.0675 0.882194 30.1239C-0.294065 25.1094 -0.294065 19.8906 0.882194 14.8761Z"
                      fill="#FF3333"
                      fill-opacity="0.25"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M19.4845 24.5155C19.4845 24.5155 6.41773 21.8123 10.9585 19.1911C14.7904 16.9793 27.996 13.1765 29.841 14.159C30.8235 16.004 27.0207 29.2096 24.8089 33.0415C22.1877 37.5823 19.4845 24.5155 19.4845 24.5155Z"
                      stroke="#363853"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M23.776 26.2262C24.1963 24.4343 25.5954 23.0352 27.3873 22.6149C28.6814 22.3113 30.0282 22.3113 31.3223 22.6149C33.1141 23.0352 34.5133 24.4343 34.9336 26.2262C35.2371 27.5203 35.2371 28.867 34.9336 30.1611C34.5133 31.953 33.1141 33.3521 31.3223 33.7724C30.0282 34.076 28.6814 34.076 27.3873 33.7724C25.5954 33.3521 24.1963 31.953 23.776 30.1611C23.4725 28.867 23.4725 27.5203 23.776 26.2262Z"
                      fill="#FF3333"
                    ></path>
                    <path
                      d="M27 30L31 26"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M31 30L27 26"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M19.6775 24.3226L30.0001 14"
                      stroke="#363853"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>
                <div className="notifi-content">
                  <p>
                    Money sent failed (<span>Contact Name</span>)
                  </p>
                  <p className="notifi-tran-idw">
                    Transection ID : <span>Lorem Ipsum</span>
                    <br />
                    Amount : <span>1234</span>
                  </p>
                </div>
              </div>
              <div className="notification-rm-wrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <rect width="48" height="48" rx="8" fill="#F7F7F9" />
                  <path
                    d="M30 18L18 30"
                    stroke="#FF3333"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18 18L30 30"
                    stroke="#FF3333"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </li>
            <li>
              <div className="notification-pcw">
                <div className="notifi-ic-wrap">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="45"
                    height="45"
                    viewBox="0 0 45 45"
                    fill="none"
                  >
                    <path
                      d="M0.882194 14.8761C2.51093 7.93252 7.93252 2.51093 14.8761 0.882192C19.8906 -0.294063 25.1094 -0.294064 30.1239 0.882191C37.0675 2.51093 42.4891 7.93252 44.1178 14.8761C45.2941 19.8906 45.2941 25.1094 44.1178 30.1239C42.4891 37.0675 37.0675 42.4891 30.1239 44.1178C25.1094 45.2941 19.8906 45.2941 14.8761 44.1178C7.93253 42.4891 2.51093 37.0675 0.882194 30.1239C-0.294065 25.1094 -0.294065 19.8906 0.882194 14.8761Z"
                      fill="#93E06F"
                      fill-opacity="0.2"
                    ></path>
                    <path
                      d="M29.9051 16.4194C30.5831 17.1458 31.4871 17.8229 31.7602 18.797C32 19.6522 32 20.6015 32 22.5C32 24.3985 32 25.3478 31.7602 26.203C31.4871 27.1771 30.9897 28.0663 30.3117 28.7927C29.7163 29.4305 28.9251 29.8959 27.3425 30.8266L27.1575 30.9355C25.4586 31.9347 24.6091 32.4343 23.7084 32.6301C22.9113 32.8033 22.0887 32.8033 21.2916 32.6301C20.3909 32.4343 19.5414 31.9347 17.8425 30.9355L17.6575 30.8266C16.0749 29.8959 15.2837 29.4305 14.6883 28.7927C14.0103 28.0663 13.5129 27.1771 13.2398 26.203C13 25.3478 13 24.3985 13 22.5C13 20.6015 13 19.6522 13.2398 18.797C13.5129 17.8229 14.0103 16.9337 14.6883 16.2073C15.2837 15.5695 16.0749 15.1041 17.6575 14.1733L17.8425 14.0645C19.5414 13.0653 20.3909 12.5657 21.2916 12.3699C22.0887 12.1967 22.9113 12.1967 23.7084 12.3699C24.6091 12.5657 24.54 12.482 26.2389 13.4812"
                      stroke="#363853"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M29.7199 15.28H25.9199M27.8199 17.56L27.8199 13"
                      stroke="#363853"
                      stroke-linecap="round"
                    ></path>
                    <path
                      d="M17.5601 29.7199C17.5601 28.1392 19.8211 26.6799 22.5001 26.6799C25.1646 26.6799 27.4401 28.125 27.4401 29.7058"
                      stroke="#363853"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M22.5004 24.4001C24.3892 24.4001 25.9201 22.8692 25.9201 20.9804C25.9201 19.0916 24.3892 17.5601 22.5004 17.5601C20.6117 17.5601 19.0801 19.0916 19.0801 20.9804C19.0737 22.8628 20.594 24.3937 22.4763 24.4001C22.4849 24.4001 22.4926 24.4001 22.5004 24.4001Z"
                      stroke="#363853"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>
                <div className="notifi-content">
                  <p>
                    (<span>Contact Name</span>) Invited You
                  </p>
                  <p className="notifi-tran-idw">Lorem Ipsum Dolor</p>
                </div>
              </div>
              <div className="notification-rm-wrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <rect width="48" height="48" rx="8" fill="#F7F7F9" />
                  <path
                    d="M30 18L18 30"
                    stroke="#FF3333"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18 18L30 30"
                    stroke="#FF3333"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </li>
            <li>
              <div className="notification-pcw">
                <div className="notifi-ic-wrap">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="45"
                    height="45"
                    viewBox="0 0 45 45"
                    fill="none"
                  >
                    <path
                      d="M0.882194 14.8761C2.51093 7.93252 7.93252 2.51093 14.8761 0.882192C19.8906 -0.294063 25.1094 -0.294064 30.1239 0.882191C37.0675 2.51093 42.4891 7.93252 44.1178 14.8761C45.2941 19.8906 45.2941 25.1094 44.1178 30.1239C42.4891 37.0675 37.0675 42.4891 30.1239 44.1178C25.1094 45.2941 19.8906 45.2941 14.8761 44.1178C7.93253 42.4891 2.51093 37.0675 0.882194 30.1239C-0.294065 25.1094 -0.294065 19.8906 0.882194 14.8761Z"
                      fill="#93E06F"
                      fill-opacity="0.2"
                    ></path>
                    <path
                      d="M29.9051 16.4194C30.5831 17.1458 31.4871 17.8229 31.7602 18.797C32 19.6522 32 20.6015 32 22.5C32 24.3985 32 25.3478 31.7602 26.203C31.4871 27.1771 30.9897 28.0663 30.3117 28.7927C29.7163 29.4305 28.9251 29.8959 27.3425 30.8266L27.1575 30.9355C25.4586 31.9347 24.6091 32.4343 23.7084 32.6301C22.9113 32.8033 22.0887 32.8033 21.2916 32.6301C20.3909 32.4343 19.5414 31.9347 17.8425 30.9355L17.6575 30.8266C16.0749 29.8959 15.2837 29.4305 14.6883 28.7927C14.0103 28.0663 13.5129 27.1771 13.2398 26.203C13 25.3478 13 24.3985 13 22.5C13 20.6015 13 19.6522 13.2398 18.797C13.5129 17.8229 14.0103 16.9337 14.6883 16.2073C15.2837 15.5695 16.0749 15.1041 17.6575 14.1733L17.8425 14.0645C19.5414 13.0653 20.3909 12.5657 21.2916 12.3699C22.0887 12.1967 22.9113 12.1967 23.7084 12.3699C24.6091 12.5657 24.54 12.482 26.2389 13.4812"
                      stroke="#363853"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M29.7199 15.28H25.9199M27.8199 17.56L27.8199 13"
                      stroke="#363853"
                      stroke-linecap="round"
                    ></path>
                    <path
                      d="M17.5601 29.7199C17.5601 28.1392 19.8211 26.6799 22.5001 26.6799C25.1646 26.6799 27.4401 28.125 27.4401 29.7058"
                      stroke="#363853"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M22.5004 24.4001C24.3892 24.4001 25.9201 22.8692 25.9201 20.9804C25.9201 19.0916 24.3892 17.5601 22.5004 17.5601C20.6117 17.5601 19.0801 19.0916 19.0801 20.9804C19.0737 22.8628 20.594 24.3937 22.4763 24.4001C22.4849 24.4001 22.4926 24.4001 22.5004 24.4001Z"
                      stroke="#363853"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>
                <div className="notifi-content">
                  <p>
                    (<span>Contact Name</span>) Accepted Invitation
                  </p>
                  <p className="notifi-tran-idw">Lorem Ipsum Dolor</p>
                </div>
              </div>
              <div className="notification-rm-wrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <rect width="48" height="48" rx="8" fill="#F7F7F9" />
                  <path
                    d="M30 18L18 30"
                    stroke="#FF3333"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18 18L30 30"
                    stroke="#FF3333"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </li>
            <li>
              <div className="notification-pcw">
                <div className="notifi-ic-wrap">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="45"
                    height="45"
                    viewBox="0 0 45 45"
                    fill="none"
                  >
                    <path
                      d="M0.882194 14.8761C2.51093 7.93252 7.93252 2.51093 14.8761 0.882192C19.8906 -0.294063 25.1094 -0.294064 30.1239 0.882191C37.0675 2.51093 42.4891 7.93252 44.1178 14.8761C45.2941 19.8906 45.2941 25.1094 44.1178 30.1239C42.4891 37.0675 37.0675 42.4891 30.1239 44.1178C25.1094 45.2941 19.8906 45.2941 14.8761 44.1178C7.93253 42.4891 2.51093 37.0675 0.882194 30.1239C-0.294065 25.1094 -0.294065 19.8906 0.882194 14.8761Z"
                      fill="#93E06F"
                      fill-opacity="0.25"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M19.4845 24.5155C19.4845 24.5155 6.41773 21.8123 10.9585 19.1911C14.7904 16.9793 27.996 13.1765 29.841 14.159C30.8235 16.004 27.0207 29.2096 24.8089 33.0415C22.1877 37.5823 19.4845 24.5155 19.4845 24.5155Z"
                      stroke="#363853"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M23.776 26.2262C24.1963 24.4343 25.5954 23.0352 27.3873 22.6149C28.6814 22.3113 30.0282 22.3113 31.3223 22.6149C33.1141 23.0352 34.5133 24.4343 34.9336 26.2262C35.2371 27.5203 35.2371 28.867 34.9336 30.1611C34.5133 31.953 33.1141 33.3521 31.3223 33.7724C30.0282 34.076 28.6814 34.076 27.3873 33.7724C25.5954 33.3521 24.1963 31.953 23.776 30.1611C23.4725 28.867 23.4725 27.5203 23.776 26.2262Z"
                      fill="#93E06F"
                    ></path>
                    <path
                      d="M26.7742 27.871L28.475 29.4839L32.5806 26.2581"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M19.6775 24.3226L30.0001 14"
                      stroke="#363853"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>
                <div className="notifi-content">
                  <p>
                    Money sent to (<span>Group Name</span>)
                  </p>
                  <p className="notifi-tran-idw">
                    Transection ID : <span>Lorem Ipsum</span>
                    <br />
                    Amount : <span>1234</span>
                  </p>
                </div>
              </div>
              <div className="notification-rm-wrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <rect width="48" height="48" rx="8" fill="#F7F7F9" />
                  <path
                    d="M30 18L18 30"
                    stroke="#FF3333"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18 18L30 30"
                    stroke="#FF3333"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ViewNotification;
