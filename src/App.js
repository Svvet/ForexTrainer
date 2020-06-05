const buttons = document.querySelectorAll("button");
const amounts = document.querySelectorAll("select");
const budget = document.getElementById("budget-amount");
const profit = document.getElementById("profit");
const equity = document.getElementById("equity");
const forward = document.getElementById("forward");
const divPositions = document.querySelector(".positions");
const h3Price = document.querySelector(".actual-price");

let priceNow;
let dataFromJSON;
let currentData;
let endOfData = 8;
let positions = [];
let count = 0;
let idx = endOfData;

const randomIndex = (x) => Math.floor(Math.random() * (x - endOfData + 1));

async function fetchData() {
	let response = await fetch("./Data.json");
	console.log(response);

	data = await response.json();

	data = data.dataArray;

	return data;
}
function randomData() {
	fetchData().then((data) => {
		endOfData = 8;
		idx = endOfData - 1;
		let startIdx = randomIndex(data.length);
		dataFromJSON = data.slice(startIdx);
		currentData = dataFromJSON.slice(0, endOfData);
		priceNow = currentData[idx].close;
		h3Price.innerHTML = `${priceNow}$`;
		chart.data = currentData;
	});
}
randomData();

// let data = dataFromJSON.slice(0, endOfData + 1);
//amChart start
// Themes begin
am4core.useTheme(am4themes_moonrisekingdom);
am4core.useTheme(am4themes_animated);
// Themes end

var chart = am4core.create("chartdiv", am4charts.XYChart);
chart.paddingRight = 20;

chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.grid.template.location = 0;

var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.tooltip.disabled = false;

var series = chart.series.push(new am4charts.CandlestickSeries());
series.dataFields.dateX = "date";
series.dataFields.valueY = "close";
series.dataFields.openValueY = "open";
series.dataFields.lowValueY = "low";
series.dataFields.highValueY = "high";
series.simplifiedProcessing = true;
series.tooltipText =
	"Open:${openValueY.value}\nLow:${lowValueY.value}\nHigh:${highValueY.value}\nClose:${valueY.value}";

chart.cursor = new am4charts.XYCursor();

// a separate series for scrollbar
var lineSeries = chart.series.push(new am4charts.LineSeries());
lineSeries.dataFields.dateX = "date";
lineSeries.dataFields.valueY = "close";
// need to set on default state, as initially series is "show"
lineSeries.defaultState.properties.visible = false;

// hide from legend too (in case there is one)
lineSeries.hiddenInLegend = true;
lineSeries.fillOpacity = 0.5;
lineSeries.strokeOpacity = 0.5;

// var scrollbarX = new am4charts.XYChartScrollbar();
// scrollbarX.series.push(lineSeries);
// chart.scrollbarX = scrollbarX;

//amChart end

let budgetAmount = 10000;
budget.innerText = `${budgetAmount}$`;

let lot = 1000;
// let priceNow = data[idx].close;
// h3Price.innerHTML = `${priceNow}$`;
let profitAmount = 0;
profit.innerText = `${profitAmount}$`;
let equityAmount = 0;
equity.innerText = `${equityAmount}$`;

const updateAtForward = () => {
	endOfData++;
	currentData = dataFromJSON.slice(0, endOfData);
	chart.data = currentData;
	profitAmount = 0;
	idx++;

	priceNow = currentData[idx].close;
	h3Price.innerHTML = `${priceNow}$`;
	const profitSpans = document.querySelectorAll(".profit-span");
	profitSpans.forEach((val, i) => {
		let { price, amount, type } = positions[i];
		let profit;
		amount = amount * lot;
		if (type === "buy") {
			profit = priceNow * amount - price * amount;
		}
		if (type === "sell") {
			profit = price * amount - priceNow * amount;
		}

		profit = profit.toFixed(2);
		positions[i].profit = parseFloat(profit);
		val.innerHTML = profit;
		profitAmount += parseFloat(profit);
	});
	profit.innerText = profitAmount.toFixed(2) + "$";
	updateEquity();
};

const newPosition = (id, price, date, amount, type) => {
	let position = {
		id: id,
		date: date,
		price: price,
		amount: amount,
		type: type,
		profit: 0,
	};

	positions.push(position);
	count++;
};

const deletePosition = (el, id) => {
	divPositions.removeChild(el);
	console.log(
		typeof budgetAmount,
		typeof positions.find((val) => val.id == id).profit
	);

	updateBudget(id);
	updateProfit(id);

	positions = positions.filter((val) => val.id != id);
};

const updateBudget = (id) => {
	budgetAmount += positions.find((val) => val.id == id).profit;
	budgetAmount = parseFloat(budgetAmount.toFixed(2));
	budget.innerText = `${budgetAmount}$`;
};
const updateProfit = (id) => {
	let prof = positions.find((val) => val.id == id).profit;
	profitAmount -= prof;
	profit.innerText = profitAmount.toFixed(2) + "$";
};
const updateEquity = () => {
	equityAmount = budgetAmount + profitAmount;
	equity.innerText = equityAmount.toFixed(2) + "$";
};
const createButton = (id, posDiv) => {
	let button = document.createElement("button");
	button.innerText = "X";
	button.className = "end-position-btn";
	button.addEventListener("click", () => {
		deletePosition(posDiv, id);
	});
	return button;
};

const addPosition = (id, price, date, amount, type) => {
	newPosition(id, price, date, amount, type);

	let posDiv = document.createElement("div");
	posDiv.className = "position";
	let htmlPosition = document.createElement("p");
	htmlPosition.innerHTML = `ID: ${id}&nbsp&nbsp Date: ${date}&nbsp&nbsp Type: ${type}&nbsp&nbsp OpenPrice: ${price}&nbsp&nbsp Amount: ${amount}&nbsp&nbsp Profit: <span class="profit-span">0</span>`;
	posDiv.appendChild(htmlPosition);
	posDiv.appendChild(createButton(id, posDiv));
	divPositions.appendChild(posDiv);
};

buttons.forEach((val) => {
	val.addEventListener("click", (e) => {
		switch (e.target.id) {
			case "buy-btn":
				addPosition(count, priceNow, "", parseInt(amounts[0].value), "buy");

				break;
			case "sell-btn":
				addPosition(count, priceNow, "", parseInt(amounts[1].value), "sell");
				break;
			case "forward-btn":
				updateAtForward();
				break;
			case "random":
				randomData();
				break;
		}
		console.log(positions);
	});
});
