const images = [
	{ id: 1, url: 'images/1.jpg', answer: 'real' },
	{ id: 2, url: 'images/2.jpg', answer: 'real' },
	{ id: 3, url: 'images/3.jpg', answer: 'real' },
	{ id: 4, url: 'images/4.jpg', answer: 'phishing' },
	{ id: 5, url: 'images/5.jpg', answer: 'phishing' },
	{ id: 6, url: 'images/6.jpg', answer: 'phishing' },
	{ id: 7, url: 'images/7.jpg', answer: 'phishing' },
	{ id: 8, url: 'images/8.jpg', answer: 'phishing' },
	{ id: 9, url: 'images/9.jpg', answer: 'real' },
	{ id: 10, url: 'images/10.jpg', answer: 'real' },
	{ id: 11, url: 'images/11.jpg', answer: 'real' },
	{ id: 12, url: 'images/12.jpg', answer: 'phishing' },
	{ id: 13, url: 'images/13.jpg', answer: 'real' },
	{ id: 14, url: 'images/14.jpg', answer: 'phishing' },
];

let currentIndex = 0;
let responses = [];
let countdownTimer;
let userInfo = {};

document.getElementById('user-form').addEventListener('submit', function (event) {
	event.preventDefault();
	userInfo.name = document.getElementById('name').value;
	userInfo.age = document.getElementById('age').value;
	userInfo.gender = document.getElementById('gender').value;
	startQuiz();
});

function startQuiz() {
	document.getElementById('user-form-container').style.display = 'none';
	document.getElementById('quiz-container').style.display = 'block';
	loadImage();
}

function loadImage() {
	const imageElement = document.getElementById('quiz-image');
	imageElement.src = images[currentIndex].url;
	startCountdown();
}

function startCountdown() {
	let countdown = 5;
	const countdownElement = document.getElementById('countdown');
	countdownElement.textContent = countdown;
	clearInterval(countdownTimer);
	countdownTimer = setInterval(() => {
		countdown--;
		countdownElement.textContent = countdown;
		if (countdown <= 0) {
			clearInterval(countdownTimer);
			alert('Out of time! Do you want to start again?');
			restartQuiz();
		}
	}, 1000);
}

function submitAnswer(selectedOption) {
	clearInterval(countdownTimer);
	const response = {
		question: {
			id: images[currentIndex].id,
			selected: selectedOption,
			answer: images[currentIndex].answer,
		},
	};
	responses.push(response);

	if (currentIndex < images.length - 1) {
		currentIndex++;
		loadImage();
	} else {
		displayResults();
	}
}

function displayResults() {
	document.getElementById('quiz-container').style.display = 'none';
	const resultsContainer = document.getElementById('results-container');
	resultsContainer.style.display = 'block';

	const userInfoElement = document.getElementById('user-info');
	userInfoElement.textContent = `Name: ${userInfo.name}, Age: ${userInfo.age}, Gender: ${userInfo.gender}`;

	const resultsTableBody = document.getElementById('results-table').getElementsByTagName('tbody')[0];
	resultsTableBody.innerHTML = '';
	let correctCount = 0;
	responses.forEach((response) => {
		const row = resultsTableBody.insertRow();
		const cell1 = row.insertCell(0);
		const cell2 = row.insertCell(1);
		const cell3 = row.insertCell(2);
		const cell4 = row.insertCell(3);
		const cell5 = row.insertCell(4);

		cell1.innerHTML = `<img src="${
			images[response.question.id - 1].url
		}" alt="Image" style="width: 50px; height: auto;">`;
		cell2.textContent = response.question.id;
		cell3.textContent = response.question.selected;
		cell4.textContent = response.question.answer;
		const match = response.question.selected === response.question.answer;
		cell5.textContent = match ? 'Yes' : 'No';
		row.className = match ? 'correct' : 'wrong';
		if (match) correctCount++;
	});

	const totalScoreElement = document.getElementById('total-score');
	totalScoreElement.textContent = `Total Score: ${correctCount} out of ${responses.length}`;
}

function restartQuiz() {
	location.reload();
}

function downloadTableAsImage() {
	const resultsHeader = document.getElementById('results-header');
	resultsHeader.style.display = 'none'; // Hide download buttons

	html2canvas(document.querySelector('#results-container'))
		.then((canvas) => {
			const link = document.createElement('a');
			link.href = canvas.toDataURL('image/png');
			link.download = 'quiz_results.png';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			resultsHeader.style.display = 'flex'; // Show download buttons again
		})
		.catch((error) => {
			resultsHeader.style.display = 'flex'; // Show download buttons again
			console.error('Error capturing image:', error);
		});
}

function downloadTableAsExcel() {
	const wb = XLSX.utils.book_new();
	const ws_data = [
		['Name', userInfo.name],
		['Age', userInfo.age],
		['Gender', userInfo.gender],
		[],
		['Image ID', 'Given Answer', 'Correct Answer', 'Match'],
	];
	responses.forEach((response) => {
		const match = response.question.selected === response.question.answer ? 'Yes' : 'No';
		const row = [response.question.id, response.question.selected, response.question.answer, match];
		ws_data.push(row);
	});
	const correctCount = responses.filter((response) => response.question.selected === response.question.answer).length;
	ws_data.push([]);
	ws_data.push(['Total Score', `${correctCount} out of ${responses.length}`]);

	const ws = XLSX.utils.aoa_to_sheet(ws_data);

	// Apply styles to the cells
	const range = XLSX.utils.decode_range(ws['!ref']);
	for (let rowNum = range.s.r + 5; rowNum <= range.e.r - 2; rowNum++) {
		const matchCell = ws[XLSX.utils.encode_cell({ r: rowNum, c: 3 })];
		const isCorrect = matchCell.v === 'Yes';
		const fillColor = isCorrect ? 'FFC8E6C9' : 'FFFFCDD2'; // Correct: light green, Wrong: light red
		matchCell.s = {
			fill: {
				patternType: 'solid',
				fgColor: { rgb: fillColor },
			},
		};
	}

	XLSX.utils.book_append_sheet(wb, ws, 'Results');
	XLSX.writeFile(wb, 'quiz_results.xlsx');
}
