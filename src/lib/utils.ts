export function stringToCoords(str: string, count = 10) {
	function hash(s: string) {
		let h = 0;
		for (let i = 0; i < s.length; i++) {
			h = ((h << 5) - h + s.charCodeAt(i)) & 0xffffffff;
		}
		return Math.abs(h);
	}

	const coords = [];
	for (let i = 0; i < count; i++) {
		const seed1 = hash(str + i + 'x');
		const seed2 = hash(str + i + 'y');

		const x = (seed1 % 1000) / 10; // 0-99.9
		const y = (seed2 % 1000) / 10; // 0-99.9

		coords.push([x, y]);
	}

	return coords;
}
