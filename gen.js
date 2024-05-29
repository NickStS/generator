document.getElementById('fileInput').addEventListener('change', handleFileSelect);

const dropArea = document.getElementById('dropArea');

dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.classList.add('dragover');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragover');
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('dragover');
    const file = event.dataTransfer.files[0];
    handleFile(file);
});

dropArea.addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

function handleFileSelect(event) {
    const file = event.target.files[0];
    handleFile(file);
}

function handleFile(file) {
    if (file) {
        console.log('File selected:', file.name);
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const jsonData = JSON.parse(e.target.result);
                console.log('JSON parsed successfully:', jsonData);
                generateSchedule(jsonData);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Неправильний формат JSON файлу');
            }
        };
        reader.readAsText(file);
    } else {
        console.error('No file selected');
    }
}

function generateSchedule(data) {
    const scheduleContainer = document.getElementById('scheduleContainer');
    scheduleContainer.innerHTML = '';

    if (data.schedule && Array.isArray(data.schedule)) {
        data.schedule.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.classList.add('schedule-day');

            const dateElement = document.createElement('h2');
            dateElement.textContent = day.date;
            dayElement.appendChild(dateElement);

            if (day.lessonList && Array.isArray(day.lessonList)) {
                day.lessonList.forEach((lesson, index) => {
                    const lessonElement = document.createElement('div');
                    lessonElement.classList.add('lesson');
                    lessonElement.classList.add(index % 2 === 0 ? 'blue-background' : 'green-background');

                    const timeElement = document.createElement('div');
                    timeElement.classList.add('lesson-time');
                    timeElement.innerHTML = `<p>${index + 1} пара</p><p>${lesson.time.split(' - ')[0]}</p><p>${lesson.time.split(' - ')[1]}</p>`;
                    lessonElement.appendChild(timeElement);

                    const detailsElement = document.createElement('div');
                    detailsElement.classList.add('lesson-details');
                    detailsElement.innerHTML = `
                        <p>${lesson.subject}</p>
                        <p>ауд. ${lesson.classroom}</p>
                        <p>${lesson.teacher}</p>
                    `;
                    lessonElement.appendChild(detailsElement);

                    dayElement.appendChild(lessonElement);
                });
            }
            scheduleContainer.appendChild(dayElement);
        });
    } else {
        scheduleContainer.textContent = 'Неправильний формат розкладу';
    }
}
