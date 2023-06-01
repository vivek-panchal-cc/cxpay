import $ from "jquery";

$(document).ready(function (e) {
  $(".toggle-admin-btn").click(function () {
    $(".dashboard-page > .container-fluid > .row").toggleClass("sidebar-open");
  });
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
  $(".js-clearSearchBox").css("opacity", "0");
  $(".js-searchBox-input").keyup(function () {
    if ($(this).val() !== "") {
      $(this)
        .parent("div")
        .parent("div")
        .children(".js-clearSearchBox")
        .css("opacity", "1");
    } else {
      $(this)
        .parent("div")
        .parent("div")
        .children(".js-clearSearchBox")
        .css("opacity", "0");
    }

    $(window).bind("keydown", function (e) {
      if (e.keyCode === 27) {
        $(".js-searchBox-input").val("");
      }
    });
  });
  // click the button
  $(".js-clearSearchBox").click(function () {
    $(".js-searchBox-input").val("");
    $(".js-searchBox-input").focus();
    $(".js-clearSearchBox").css("opacity", "0");
  });
});

$(document).ready(function () {
  if ($(window).innerWidth() < 991) {
    $(
      ".dashboard-link-wrap > .dashboard-main-links, .dashboard-bottom-links > li > a"
    ).click(function () {
      $(".dashboard-page > .container-fluid > .row").toggleClass(
        "sidebar-open"
      );
      $("body").toggleClass("open-menu");
    });
    $(".toggle-admin-btn").click(function () {
      $("body").toggleClass("open-menu");
    });
  }
});
