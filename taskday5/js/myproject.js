const projectForm = document.getElementById('project-form');
const projectNameInput = document.getElementById('projectname');
const startDateInput = document.getElementById('startdate');
const endDateInput = document.getElementById('enddate');
const descriptionInput = document.getElementById('message');
const imageInput = document.getElementById('input-img');
const projectCards = document.getElementById('project-card');

const projects = [];

projectForm.addEventListener('submit', function (event) {

  const projectName = projectNameInput.value;
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;
  const description = descriptionInput.value;
  const imageFile = imageInput.files[0];

  const reader = new FileReader();
  reader.onload = function () {
    const imageUrl = reader.result;

    const nodejs = document.getElementById('nodejs').checked ? '<i class="fa-brands fa-node-js"></i>' : '';
    const Reactjs = document.getElementById('reactjs').checked ? '<i class="fa-brands fa-react"></i>' : '';
    const nextjs = document.getElementById('nextjs').checked ? '<i class="fa-brands fa-android"></i>' : '';
    const typescript = document.getElementById('typescript').checked ? '<i class="fa-brands fa-java"></i>' : '';

    const newProject = {
      projectName: projectName,
      startDate: startDate,
      endDate: endDate,
      description: description,
      imageUrl: imageUrl,
      technologies: [nodejs, Reactjs, nextjs, typescript].filter(icon => icon !== '')
    };

    projects.push(newProject);

    projectCards.innerHTML = '';
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];

      const startDateObj = new Date(project.startDate);
      const endDateObj = new Date(project.endDate);
      const timeDiff = Math.abs(endDateObj - startDateObj);
      const durationDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      const durationHTML = `<span class="duration">Durasi: ${durationDays} hari</span>`;
      const timeHTML = `<span class="time">${project.startDate} - ${project.endDate}</span>`;

      projectCards.innerHTML += `
        <div class="card-item">
          <div class="project-image">
            <img src="${project.imageUrl}" alt="">
          </div>
          <div class="text-content" style="display: flex; flex-direction:column;">
            <h4 style="padding-left: 20px;"><a style="text-decoration: none; color: black;" href="detail.html">${project.projectName}</a></h4>
            <div class="project-details">
              ${day} / ${bulan[month]} / ${year} ${hour}:${minute}
              ${durationHTML}
              ${timeHTML}
            </div>
            <p>${project.description}</p>
          </div>
          <div class="logo-bahasa">
            ${project.technologies.join('')}
          </div>
          <div class="btn-project">
            <button type="button" class="btn1">edit</button>
            <button type="button" class="btn2">delete</button>
          </div>
        </div>
      `;
    }

    projectNameInput.value = '';
    startDateInput.value = '';
    endDateInput.value = '';
    descriptionInput.value = '';
    imageInput.value = '';

    URL.revokeObjectURL(imageUrl);
  };
  reader.readAsDataURL(imageFile);
  bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let hour = date.getHours();
  let minute = date.getMinutes();

  if (day < 10) day = `0${day}`;
  if (hour < 10) hour = `0${hour}`;
  if (minute < 10) minute = `0${minute}`;


  bulan.forEach((value, index) => {
    console.log(value, index);
  });
  for (let i = 0; i < bulan.length; i++) {
    console.log()
  }
});
