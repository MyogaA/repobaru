const express = require('express');
const app = express();
const PORT = 5001;
const path = require('path');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.static('src/assets'));

app.use(express.urlencoded({ extended: false }));

const dataProject = [
    {
        title: "Yoga ganteng",
        content: "Yoga adalah manusia yang ganteng",
        author: "Penggemar",
        postAt: new Date()
    },
    {
        title: "Yoga ganteng bgt",
        content: "Yoga tetaplah ganteng",
        author: "Penggemar Setia",
        postAt: new Date()
    }
];

app.get('/index', home);
app.get('/addmyproject', formMyproject);
app.post('/addmyproject', addMyproject);
app.get('/contact', contact);
app.get('/detail/:id', detail);
app.get('/testimonial', testimonial);
app.get('/edit/:id', edit);
app.get('/delete/:id', deleteProject)
app.post('/edit/:id', updateProject);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

function home(req, res) {
    res.render('index', { dataProject });
}

function formMyproject(req, res) {
    res.render('addmyproject');
}

function contact(req, res) {
    res.render('contact');
}

function detail(req, res) {
    const { id } = req.params;
    
    if (id >= 0 && id < dataProject.length) {
        const data = dataProject[id];
        res.render('detail', { data });
    } else {
        res.send('Invalid ID');
    }
}

function testimonial(req, res) {
    res.render('testimonial');
}
function edit(req, res) {
    const { id } = req.params;

    if (id >= 0 && id < dataProject.length) {
        const data = dataProject[id];
        res.render('/edit', { data });
    } else {
        res.send('Invalid ID');
    }
}

function addMyproject(req, res) {
    const { title, content } = req.body;
    const data = {
        title,
        content,
        image: "image.jpg",
        author: "anonymous",
        postAt: new Date()
    };
    dataProject.push(data);
    res.redirect('/index');
}
function deleteProject(req,res) {
    const { id } = req.params
    dataProject.splice(id, 1);
    res.redirect('/index')
  }
  function updateProject(req, res) {
    const { id } = req.params;
    const { title, content } = req.body;

    if (id >= 0 && id < dataProject.length) {
        dataProject[id].title = title;
        dataProject[id].content = content;
        res.redirect('/index');
    } else {
        res.send('Invalid ID');
    }
}