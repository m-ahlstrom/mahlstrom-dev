const maxWindowSize = window.matchMedia("(max-width: 768px)");
const minWindowSize = window.matchMedia("(min-width: 768px)");

const footerMobile = document.querySelector(".footer-mobile");
const wrapperMobile = document.querySelector(".wrapper");

// Initial state when site is loaded.

if (minWindowSize.matches) {
	footerMobile.remove();
}

if (maxWindowSize.matches) {
	wrapperMobile.appendChild(footerMobile);
}

// Dynamically hide or add the mobile footer element on viewport change.

function removeOrAdddFooter() {
	if (minWindowSize.matches) {
		footerMobile.remove();
	} else if (maxWindowSize.matches) {
		wrapperMobile.appendChild(footerMobile);
	}
}

window.addEventListener("resize", removeOrAdddFooter);
