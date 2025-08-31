// spaNavigation.js
// This module enables SPA-style navigation for anchor links without reloading the page.
// It intercepts clicks on specific links and updates the browser history,
// allowing React routing or other front-end routing logic to handle the view change.

export function enableSpaNavigation() {
  // Wait for the DOM to fully load before attaching event listeners
  document.addEventListener("DOMContentLoaded", () => {

    // Handle "Join Us" link navigation
    const joinLink = document.querySelector('a[href="#Join-Us"]');
    if (joinLink) {
      joinLink.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default anchor navigation
        window.history.pushState({}, "", "/signup"); // Update browser URL
        window.dispatchEvent(new PopStateEvent("popstate")); // Trigger SPA routing
      });
    }

    // Handle "Home" link navigation
    const homeLink = document.querySelector('a[href="/"]');
    if (homeLink) {
      homeLink.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default anchor navigation
        window.history.pushState({}, "", "/"); // Update browser URL
        window.dispatchEvent(new PopStateEvent("popstate")); // Trigger SPA routing
      });
    }

  });
}

