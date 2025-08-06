// spaNavigation.js
export function enableSpaNavigation() {
  document.addEventListener("DOMContentLoaded", () => {
    const joinLink = document.querySelector('a[href="#Join-Us"]');
    if (joinLink) {
      joinLink.addEventListener("click", function (event) {
        event.preventDefault();
        window.history.pushState({}, "", "/signup");
        window.dispatchEvent(new PopStateEvent("popstate"));
      });
    }

    const homeLink = document.querySelector('a[href="/"]');
    if (homeLink) {
      homeLink.addEventListener("click", function (event) {
        event.preventDefault();
        window.history.pushState({}, "", "/");
        window.dispatchEvent(new PopStateEvent("popstate"));
      });
    }
  });
}

