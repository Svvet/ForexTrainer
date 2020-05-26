const buttons = document.querySelectorAll("button");
const amounts = document.querySelectorAll("select");
const budget = document.getElementById("budget-amount");
const profit = document.getElementById("profit");
const equity = document.getElementById("equity");
const forward = document.getElementById("forward");
const divPositions = document.querySelector(".positions");
console.log(divPositions);

let price = 100;
let positions = [];
let count = 0;

let Data = [
	{
		date: "10.01.2020",
		price: "1.8883",
	},
	{
		date: "10.01.2020",
		price: "1.8883",
	},
	{
		date: "10.01.2020",
		price: "1.8883",
	},
	{
		date: "10.01.2020",
		price: "1.8883",
	},
	{
		date: "10.01.2020",
		price: "1.8883",
	},
	{
		date: "10.01.2020",
		price: "1.8883",
	},
	{
		date: "10.01.2020",
		price: "1.8883",
	},
];

const array1 = ["a", "b", "c"];
const iterator = array1.values();

for (const value of array1) {
	console.log(value);
}

const newPosition = (id, price, date, amount, type) => {
	let position = {
		id: id,
		date: date,
		price: price,
		amount: amount,
		type: type,
	};

	positions.push(position);
	count++;
};

const deletePosition = (el) => {
	divPositions.removeChild(el);
};
const createButton = (id, posDiv) => {
	let button = document.createElement("button");
	button.innerText = "X";
	button.className = "end-position-btn";
	button.addEventListener("click", () => {
		deletePosition(posDiv);
		positions = positions.filter((val) => val.id != id);
	});
	return button;
};

const addPosition = (id, price, date, amount, type) => {
	newPosition(id, price, date, amount, type);

	let posDiv = document.createElement("div");
	posDiv.className = "position";
	let htmlPosition = document.createElement("p");
	htmlPosition.innerHTML = `ID: ${id}&nbsp&nbsp Date: ${date}&nbsp&nbsp OpenPrice: ${price}&nbsp&nbsp Amount: ${amount}&nbsp&nbsp Type: ${type}`;
	posDiv.appendChild(htmlPosition);
	posDiv.appendChild(createButton(id, posDiv));
	divPositions.appendChild(posDiv);
};

buttons.forEach((val) => {
	val.addEventListener("click", (e) => {
		switch (e.target.id) {
			case "buy-btn":
				addPosition(count, "1.8884", "", amounts[0].value, "buy");
				break;
			case "sell-btn":
				addPosition(count, "1.8884", "", amounts[1].value, "sell");
				break;
		}
		console.log(positions);
	});
});
