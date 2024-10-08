document.addEventListener("DOMContentLoaded", function () {
	// Get code blocks
	const codeblocks = document.querySelectorAll("pre code");

	// Iterate over each to perform modifications
	for (let codeblock of codeblocks) {
		// Create copy button and container element
		const copyButton = document.createElement("button");
		copyButton.className = "copy-button";
		copyButton.setAttribute("aria-label", "code copy button");
		const container = document.createElement("div");
		container.className = "code-container";

		// Copy clicked closure
		copyButton.addEventListener("click", (e) => {
			e.target.className = "copy-success";
			setTimeout(() => {
				e.target.className = "copy-button";
			}, 1000);
			const code = codeblock.textContent;
			navigator.clipboard.writeText(code);
		});

		// Wrap the codeblock with the container
		codeblock.parentNode.insertBefore(container, codeblock);
		container.appendChild(codeblock);

		// Add the copy button to the DOM
		const highlight = codeblock.parentNode.parentNode.parentNode;
		highlight.appendChild(copyButton);
	}
});
