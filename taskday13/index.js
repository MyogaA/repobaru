const express = require('express');
const app = express();
const PORT = 5005;
const path = require('path');

const config = require('./src/config/config.json')
const { Sequelize, QueryTypes } = require('sequelize')
const sequelize = new Sequelize(config.development)

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.static(path.join(__dirname, 'src', 'assets')));
app.use(express.urlencoded({ extended: false }));

// const dataProject = [
//     {
//         title: "Yoga atmajaya",
//         content: "mantap",
//         author: "Penggemar",
//         postAt: new Date()
//     },
//     {
//         title: "izma wulan",
//         content: "heehhe",
//         author: "Penggemar Setia",
//         postAt: new Date()
//     }
// ];
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'src', 'assets', 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

app.post('/addmyproject', upload.single('image'), addMyproject);
app.get('/index', home);
app.get('/addmyproject', formMyproject);
app.post('/addmyproject', addMyproject);
app.get('/myproject', myProject);
app.get('/contact', contact);
app.get('/detail/:id', detail);
app.get('/testimonial', testimonial);
app.get('/edit/:id', edit);
app.get('/delete/:id', deleteProject);
app.post('/update/:id', updateProject);

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
async function myProject(req, res) {
    try {
      const query = `SELECT id, title, image, content, "createdAt" FROM blogs;`
      let obj = await sequelize.query(query, { type: QueryTypes.SELECT})
  
      const data = obj.map(res => ({
        ...res,
        author: "Yoga atmajaya"
      }))
  
      console.log(data)
  
      res.render('myproject', { dataProject: data })
    } catch (error) {
      console.log(error)
    } 
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
        res.render('edit', { data, id });
    } else {
        res.send('Invalid ID');
    }
}

function addMyproject(req, res) {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : "img.jpg"; // Ganti "statis-image.jpg" dengan nama default gambar
    const data = {
        title,
        content,
        image,
        author: "anonymous",
        postAt: new Date()
    };
    dataProject.push(data);
    res.redirect('/myproject');
}

function deleteProject(req, res) {
    const { id } = req.params;
    if (id >= 0 && id < dataProject.length) {
        dataProject.splice(id, 1);
        res.redirect('/myproject');
    } else {
        res.send('Invalid ID');
    }
}

function updateProject(req, res) {
    const { id } = req.params;
    const { title, content } = req.body;

    if (id >= 0 && id < dataProject.length) {
        dataProject[id].title = title;
        dataProject[id].content = content;
        res.redirect('/myproject');
    } else {
        res.send('Invalid ID');
    }
}
