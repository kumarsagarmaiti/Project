const arr1 = [
	{ a: 1, b: 2 },
	{ a: 1, b: 2 },
	{ a: 2, b: 1 },
];
obj = {};
const arr2=[]
for (arr of arr1) {
	if (obj[arr.a]) obj[arr.a] += arr.b;
	else obj[arr.a] = arr.b;
}
console.log(obj);

for(key in obj){
  arr2.push({a:key,b:obj[key]})
}
console.log(arr2);
