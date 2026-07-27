(function () {
  function sendEvent(eventName, params) {
    if (typeof window.gtag !== "function") {
      return;
    }

    window.gtag("event", eventName, Object.assign({
      transport_type: "beacon",
      page_location: window.location.href,
      page_path: window.location.pathname
    }, params));
  }

  function eventNameFor(link, configuredEvent) {
    if (configuredEvent === "lead_click") {
      return "generate_lead";
    }

    return configuredEvent || "link_click";
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a");

    if (!link) {
      return;
    }

    var href = link.getAttribute("href") || "";
    var configuredEvent = link.dataset.event;
    var isEmail = href.indexOf("mailto:") === 0;
    var isExternalProfile = /linkedin\.com|github\.com|codementor\.io/.test(href);
    var isServicePage = /freelance-ios-developer-ottawa|ai-automation-consultant-ottawa|web-scraping-services-ottawa|software-developer-orleans/.test(href);
    var isWorkJump = href === "#work" || href === "/#work";

    if (!configuredEvent && !isEmail && !isExternalProfile && !isServicePage && !isWorkJump) {
      return;
    }

    var inferredEvent = configuredEvent;
    if (!inferredEvent && isEmail) inferredEvent = "lead_click";
    if (!inferredEvent && isExternalProfile) inferredEvent = "profile_click";
    if (!inferredEvent && isServicePage) inferredEvent = "service_interest";
    if (!inferredEvent && isWorkJump) inferredEvent = "view_work";

    sendEvent(eventNameFor(link, inferredEvent), {
      event_category: "engagement",
      event_label: link.dataset.eventLabel || link.textContent.trim() || href,
      link_url: link.href,
      link_text: link.textContent.trim(),
      outbound: isExternalProfile
    });
  });
})();
