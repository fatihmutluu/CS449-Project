let images = [
	{ name: 'r-no-loss4.png' },
	{ name: 'r-photo-reward1.png' },
	{ name: 'ai-no-loss4.png' },
	{ name: 'ai-photo-reward5.png' },
	{ name: 'ai-photo-reward6.png' },
	{ name: 'ai-no-loss3.png' },
	{ name: 'r-photo-loss1.png' },
	{ name: 'ai-photo-reward1.png' },
	{ name: 'ai-no-loss2.png' },
	{ name: 'r-photo-reward2.png' },
	{ name: 'ai-no-reward2.png' },
	{ name: 'ai-photo-reward3.png' },
	{ name: 'r-no-reward2.png' },
	{ name: 'r-no-reward3.png' },
	{ name: 'ai-photo-loss2.png' },
	{ name: 'r-no-reward1.png' },
	{ name: 'ai-photo-reward7.png' },
	{ name: 'r-photo-reward4.png' },
	{ name: 'ai-no-reward3.png' },
	{ name: 'r-photo-reward3.png' },
	{ name: 'r-no-reward5.png' },
	{ name: 'ai-photo-loss1.png' },
	{ name: 'ai-no-loss1.png' },
	{ name: 'r-no-reward4.png' },
	{ name: 'r-no-loss3.png' },
	{ name: 'r-photo-reward5.png' },
	{ name: 'r-photo-reward6.png' },
	{ name: 'ai-no-reward1.png' },
	{ name: 'ai-photo-reward4.png' },
	{ name: 'ai-photo-reward2.png' },
	{ name: 'r-no-loss2.png' },
	{ name: 'r-no-loss1.png' },
];

let currentIndex = 0;
let responses = [];
let userInfo = {};
let totalPoints = 0;

document.getElementById('user-form').addEventListener('input', function (event) {
	const isFormValid =
		document.getElementById('name').value &&
		document.getElementById('age').value &&
		document.getElementById('gender').value &&
		document.getElementById('department').value;
	document.getElementById('start-quiz-button').disabled = !isFormValid;
});

document.getElementById('user-form').addEventListener('submit', function (event) {
	event.preventDefault();

	const [firstName, lastName] = document.getElementById('name').value.split(' ');
	userInfo.name =
		firstName.charAt(0).toUpperCase() + firstName.slice(1) + ' ' + lastName.charAt(0).toUpperCase() + lastName.slice(1);
	userInfo.age = document.getElementById('age').value;
	userInfo.gender = document.getElementById('gender').value;
	userInfo.department = document.getElementById('department').value;
	startQuiz();
});

function startQuiz() {
	document.getElementById('user-form-container').style.display = 'none';
	document.getElementById('quiz-container').style.display = 'block';
	loadImage();
}

function loadImage() {
	const imageElement = document.getElementById('quiz-image');
	imageElement.src = 'images/' + images[currentIndex].name;
	updateCounter();
}

function updateCounter() {
	const counterElement = document.getElementById('counter-container');
	counterElement.textContent = `${currentIndex + 1}/${images.length}`;
}

function determineCorrectAnswer(imageName) {
	return imageName.startsWith('r') ? 'Human' : 'AI';
}

function submitAnswer(selectedOption) {
	const correctAnswer = determineCorrectAnswer(images[currentIndex].name);
	let points = 0;

	if (selectedOption === 'Definitely Human' || selectedOption === 'Likely Human') {
		points =
			correctAnswer === 'Human'
				? selectedOption === 'Definitely Human'
					? 2
					: 1
				: selectedOption === 'Definitely Human'
				? -2
				: -1;
	} else if (selectedOption === 'Definitely AI' || selectedOption === 'Likely AI') {
		points =
			correctAnswer === 'AI'
				? selectedOption === 'Definitely AI'
					? 2
					: 1
				: selectedOption === 'Definitely AI'
				? -2
				: -1;
	}

	totalPoints += points;

	const response = {
		question: {
			name: images[currentIndex].name,
			selected: selectedOption,
			answer: correctAnswer,
			points: points,
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
	userInfoElement.textContent = `${userInfo.name}, ${userInfo.age}, ${userInfo.gender}, ${userInfo.department}`;

	const resultsTableBody = document.getElementById('results-table').getElementsByTagName('tbody')[0];
	resultsTableBody.innerHTML = '';

	for (const element of images) {
		const response = responses.find((r) => r.question.name === element.name) || {
			question: {
				name: element.name,
				selected: 'No Answer',
				answer: determineCorrectAnswer(element.name),
				points: 0,
			},
		};

		const row = resultsTableBody.insertRow();
		const cell1 = row.insertCell(0);
		const cell2 = row.insertCell(1);
		const cell3 = row.insertCell(2);
		const cell4 = row.insertCell(3);
		const cell5 = row.insertCell(4);
		const cell6 = row.insertCell(5);

		cell1.innerHTML = `<img src="images/${element.name}" alt="Image" style="width: 50px; height: auto;">`;
		cell2.textContent = response.question.name;
		cell3.textContent = response.question.selected;
		cell4.textContent = response.question.answer;
		cell5.textContent = response.question.points;
		const match =
			(response.question.selected.includes('Human') && response.question.answer === 'Human') ||
			(response.question.selected.includes('AI') && response.question.answer === 'AI');
		cell6.textContent = match ? 'Yes' : 'No';
		row.className = match ? 'correct' : 'wrong';

		if (response.question.points > 0) {
			row.classList.add('correct');
		} else if (response.question.points < 0) {
			row.classList.add('wrong');
		}
	}

	const totalScoreElement = document.getElementById('total-score');
	totalScoreElement.textContent = `Total Points: ${totalPoints}`;

	updateResultsTableColor();
}

function updateResultsTableColor() {
	const resultsTableBody = document.getElementById('results-table').getElementsByTagName('tbody')[0];
	const rows = resultsTableBody.getElementsByTagName('tr');

	for (const row of rows) {
		const pointsCell = row.cells[4];
		const points = parseInt(pointsCell.textContent, 10);

		if (points > 0) {
			row.style.backgroundColor = '#c8e6c9'; // Light green
		} else if (points < 0) {
			row.style.backgroundColor = '#ffcdd2'; // Light red
		} else {
			row.style.backgroundColor = '#fff9c4'; // Light yellow for "Not Sure"
		}
	}
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
			link.download = userInfo.name.replace(/\s/g, '_') + '.png';
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
		['Department', userInfo.department],
		[],
		['Image Name', 'Given Answer', 'Correct Answer', 'Points', 'Match'],
	];
	ws_data.push([]);
	responses.forEach((response) => {
		const match =
			(response.question.selected.includes('Human') && response.question.answer === 'Human') ||
			(response.question.selected.includes('AI') && response.question.answer === 'AI')
				? 'Yes'
				: 'No';
		const row = [
			response.question.name,
			response.question.selected,
			response.question.answer,
			response.question.points,
			match,
		];
		ws_data.push(row);
	});
	ws_data.push([]);
	ws_data.push(['Total Points', totalPoints]);

	const ws = XLSX.utils.aoa_to_sheet(ws_data);

	// Apply styles to the cells based on points
	for (let i = 5; i < ws_data.length - 1; i++) {
		const points = ws_data[i][3];
		let fillColor = 'FFFFFF'; // Default white

		if (points > 0) {
			fillColor = 'C8E6C9'; // Light green for positive points
		} else if (points < 0) {
			fillColor = 'FFCDD2'; // Light red for negative points
		} else {
			fillColor = 'FFF9C4'; // Light yellow for zero points
		}

		for (let j = 0; j < ws_data[i].length; j++) {
			const cellAddress = XLSX.utils.encode_cell({ r: i, c: j });
			if (!ws[cellAddress]) {
				ws[cellAddress] = { t: 's', v: ws_data[i][j] };
			}
			ws[cellAddress].s = {
				fill: {
					patternType: 'solid',
					fgColor: { rgb: fillColor },
				},
			};
		}
	}

	XLSX.utils.book_append_sheet(wb, ws, 'Results');
	XLSX.writeFile(wb, userInfo.name.replace(/\s/g, '_') + '.xlsx');
}
