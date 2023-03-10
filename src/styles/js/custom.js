import $ from "jquery";
import Swiper from "swiper";

$(document).ready(function (e) {
  $(".toggle-admin-btn").click(function () {
    $(".dashboard-page > .container-fluid > .row").toggleClass("sidebar-open");
  });
});
$(document).ready(function (e) {
  function toggleTab(e) {
    var hrefVal = $(e).attr("href");
    $(".nav-tabs li").removeClass("active");
    $('.nav-tabs li[data-active="' + hrefVal + '"]').addClass("active");
  }
});
$(document).ready(function (e) {
  $(".user-profile > .user-image").click(function () {
    $(this).toggleClass("active");
  });
});

$(document).ready(function (e) {
  $(".recent-contact-sec .search-btn").click(function () {
    $(".recent-contact-sec .search-field").toggleClass("active");
  });
});

$(document).ready(function (e) {
  const swiper = new Swiper(".card-slider .swiper", {
    loop: true,
    slidesPerView: 2.2,
    spaceBetween: 8,
    centeredSlides: false,

    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    // And if we need scrollbar
    scrollbar: {
      el: ".swiper-scrollbar",
    },
  });
});

$(document).ready(function (e) {
  const swiper = new Swiper(".send-whom-slider .swiper", {
    loop: true,
    slidesPerView: 6.6,
    spaceBetween: 28,
    centeredSlides: false,

    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    // And if we need scrollbar
    scrollbar: {
      el: ".swiper-scrollbar",
    },
    breakpoints: {
      // when window width is <= 499px
      1200: {
        slidesPerView: 6.5,
        spaceBetween: 28,
      },
      992: {
        slidesPerView: 5.5,
        spaceBetween: 20,
      },
      576: {
        slidesPerView: 4.5,
        spaceBetween: 15,
      },
      // when window width is <= 999px
      0: {
        slidesPerView: 2.5,
        spaceBetween: 15,
      },
    },
  });
});

/* send whom contact slider */
$(document).ready(function (e) {
  const swiper = new Swiper(".recent-contact-slider .swiper", {
    loop: true,
    slidesPerView: 5.5,
    spaceBetween: 16,
    centeredSlides: false,

    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    // And if we need scrollbar
    scrollbar: {
      el: ".swiper-scrollbar",
    },
  });
});

/* Wallet Page Slider*/
$(document).ready(function (e) {
  const swiper = new Swiper(".wallet-slider .swiper", {
    loop: false,
    slidesPerView: 1.15,
    spaceBetween: 0,
    centeredSlides: false,
    effect: "cards",
    grabCursor: true,
    autoResize: false,
    cardsEffect: {
      rotate: 0,
    },
    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    // And if we need scrollbar
    scrollbar: {
      el: ".swiper-scrollbar",
    },
  });
  swiper.on("slideChange", function (s) {
    $(".js-card-section").hide();
    $("#cardId_" + s.activeIndex).show();
  });
  $("#cardId_0").show();
});

/* date picket js */
// $(function () {
//   var start = moment().subtract(29, "days");
//   var end = moment();

//   function cb(start, end) {
//     $("#reportrange span").html(
//       start.format("DD MMM YY") + " - " + end.format("DD MMM YY")
//     );
//   }

//   $("#reportrange").daterangepicker(
//     {
//       startDate: start,
//       endDate: end,
//       ranges: {
//         Today: [moment(), moment()],
//         Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
//         "Last 7 Days": [moment().subtract(6, "days"), moment()],
//         "Last 30 Days": [moment().subtract(29, "days"), moment()],
//         "This Month": [moment().startOf("month"), moment().endOf("month")],
//         "Last Month": [
//           moment().subtract(1, "month").startOf("month"),
//           moment().subtract(1, "month").endOf("month"),
//         ],
//       },
//     },
//     cb
//   );

//   cb(start, end);
// });

/* dashboard graph script starts */
window.onload = function () {
  var options = {
    animationEnabled: true,
    title: {
      text: "Monthly Sales - 2017",
    },
    axisX: {
      valueFormatString: "MMM",
    },
    axisY: {
      title: "Sales (in USD)",
      prefix: "$",
    },
    data: [
      {
        yValueFormatString: "$#,###",
        xValueFormatString: "MMMM",
        type: "spline",
        dataPoints: [
          { x: new Date(2017, 0), y: 25060 },
          { x: new Date(2017, 1), y: 27980 },
          { x: new Date(2017, 2), y: 33800 },
          { x: new Date(2017, 3), y: 49400 },
          { x: new Date(2017, 4), y: 40260 },
          { x: new Date(2017, 5), y: 33900 },
          { x: new Date(2017, 6), y: 48000 },
          { x: new Date(2017, 7), y: 31500 },
          { x: new Date(2017, 8), y: 32300 },
          { x: new Date(2017, 9), y: 42000 },
          { x: new Date(2017, 10), y: 52160 },
          { x: new Date(2017, 11), y: 49400 },
        ],
      },
    ],
  };
};
// $(document).ready(function () {
//   $(function () {
//     $(".date_field").datepicker({
//       minDate: 0,
//     });
//   });
// });
$(document).ready(function () {
  $("select.form-control").css("color", "#BDBDBD");
  $("select.form-control").change(function () {
    var current = $("select.form-control").val();
    if (current !== "null") {
      $(this).css("color", "#363853");
    } else {
      $(this).css("color", "#BDBDBD");
    }
  });
});

$(document).ready(function () {
  if ($(window).innerWidth() <= 991) {
    $(
      ".dashboard-link-wrap > .dashboard-main-links, .dashboard-bottom-links > li > a"
    ).click(function () {
      $(".dashboard-page > .container-fluid > .row").toggleClass(
        "sidebar-open"
      );
      $("body").toggleClass("open-menu");
    });
    $(document).ready(function (e) {
      $(".toggle-admin-btn").click(function () {
        $("body").toggleClass("open-menu");
      });
    });
  }
});
