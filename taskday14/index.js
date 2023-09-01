const express = require('express');
const app = express();
const PORT = 5000;
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

async function detail(req, res) {
    try {
        const { id } = req.params
        const query = `SELECT * FROM "blogs" WHERE id=${id}`  
    
        const obj = await sequelize.query(query, {type: QueryTypes.SELECT})
    
        const data = obj.map((res) => ({
          ...res,
          author: "Eltra"
        }))
    
        res.render('detail', { dataP: data[0] })
      } catch (error) {
        console.log(error)
      }
    }

function testimonial(req, res) {
    res.render('testimonial');
}

async function edit(req, res) {
    try {
        const { id } = req.params;
        const query = `SELECT id, title, content FROM blogs WHERE id=${id}`;
        const result = await sequelize.query(query, { type: QueryTypes.SELECT });

        if (result.length === 0) {
            return res.send('Blog not found');
        }

        const data = result[0];
        res.render('edit', { data, id });
    } catch (error) {
        console.log(error);
    }
}

async function addMyproject(req, res) {
    try {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : "img.jpg";
    await sequelize.query(`INSERT INTO blogs(title, content, image, "createdAt", "updatedAt") VALUES ('${title}', '${content}', '${image}', NOW(), NOW())`)
    res.redirect('/myproject');
} catch (error) {
    console.log(error)
  }
}

async function deleteProject(req, res) {
    try {
        const { id } = req.params
    
        await sequelize.query(`DELETE FROM blogs WHERE id = ${id}`)
        res.redirect('/myproject')
      } catch (error) {
        console.log(error)
      }
}

async function updateProject(req, res) {
    try {
        const { id } = req.params;
        const { title, content } = req.body;


        await sequelize.query(
            `UPDATE blogs SET title = '${title}', content = '${content}', "updatedAt" = NOW() WHERE id = ${id}`
        );

        res.redirect('/myproject');
    } catch (error) {
        console.log(error);
    }

}
