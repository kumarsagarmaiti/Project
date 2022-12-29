let arr = [3, 4, 5, 6];

for (let i = arr.length - 1; i >= 0; i--) {
	if (arr[i] - arr[i - 1] > 1) {
		arr = arr.slice(i);
		break;
	}
}

console.log(arr);
