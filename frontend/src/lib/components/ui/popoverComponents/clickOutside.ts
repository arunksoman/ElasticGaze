export const clickOutside = (
	node: HTMLElement,
	params?: { callback: (event: MouseEvent) => void }
) => {
	const handleClick = (event: MouseEvent) => {
		if (!node.contains(event.target as Node) && params?.callback) {
			params.callback(event);
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		update(newParams: { callback: (event: MouseEvent) => void } | undefined) {
			params = newParams;
		},
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
};