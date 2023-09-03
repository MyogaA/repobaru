const express = require('express');
const app = express();
const PORT = 5000;
const path = require('path');
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')

const config = require('./src/config/config.json')
const { Sequelize, QueryTypes } = require('sequelize')
const sequelize = new Sequelize(config.development)

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.static(path.join(__dirname, 'src', 'assets')));
app.use(express.urlencoded({ extended: false }));

app.use(flash())

app.use(session({
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 1
    },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: false,
    secret: 'secret'
}))

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
const { Query } = require('pg');
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
app.get('/register', formRegister);
app.post('/register', register);
app.get('/login', formLogin);
app.post('/login', login);
app.get('/logout', logout);
app.post('/update/:id', updateProject);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

function home(req, res) {
    res.render('index', {
    isLogin: req.session.isLogin,
    user: req.session.user
    });
}

function formMyproject(req, res) {
    res.render('addmyproject');
}

function contact(req, res) {
    res.render('contact');
}
async function myProject(req, res) {
    try {
        const query = `SELECT blogs.id, title, image, content, blogs."createdAt", users.name AS author, blogs.author AS authorId FROM blogs JOIN users ON blogs.author = users.id ORDER BY blogs.id DESC;`
        let obj = await sequelize.query(query, { type: QueryTypes.SELECT})

        const data = obj.map(res => ({
            ...res,
            isLogin: req.session.isLogin,
        }));

        if (req.session.isLogin) {
            const idUser = req.session.idUser; 
            const userProjects = data.filter(item => item.id === idUser);
            res.render('myproject', { 
                data: userProjects,
                isLogin: req.session.isLogin,
                user: req.session.user
            });
        } else {
            // Jika pengguna belum masuk (belum login), tampilkan semua entri
            res.render('myproject', { 
                data,
                isLogin: req.session.isLogin,
                user: req.session.user
            });
        }
    } catch (error) {
        console.log(error);
    } 
}






async function detail(req, res) {
    try {
        const { id } = req.params
        const query = `SELECT blogs.id, title, image, content, blogs."createdAt", users.name AS author FROM blogs LEFT JOIN users ON blogs.author = users.id WHERE blogs.id=${id}`  
    
        const obj = await sequelize.query(query, {type: QueryTypes.SELECT})
    
        const data = obj.map((res) => ({
          ...res,
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
        const author = req.session.idUser; // Menggunakan ID pengguna yang saat ini masuk

        await sequelize.query(`INSERT INTO blogs(title, content, image, author, "createdAt", "updatedAt") VALUES ('${title}', '${content}', '${image}', ${author}, NOW(), NOW())`);
        res.redirect('/myproject');
    } catch (error) {
        console.log(error);
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
function formRegister (req,res){
    res.render('register')
}
function formLogin (req,res){
    res.render('login')
}
async function register (req,res) {
    try {
        const {name, email, password} = req.body
        const salt = 10
        await bcrypt.hash(password,salt, (err,hashPw)=> {
            const query = `INSERT INTO users (name, email, password, "createdAt", "updatedAt")
            VALUES ('${name}','${email}','${hashPw}',NOW(),NOW())`

            sequelize.query(query)
            res.redirect('login')
        })
    } catch (error) {
        console.log(error)
    }
}
async function login (req,res) {
    try {
        const {email, password} = req.body
        const query = `SELECT * FROM users WHERE email = '${email}'` 
        let obj = await sequelize.query(query, { type: QueryTypes.SELECT })

        if(!obj.length) {
            req.flash('danger', "user has not been registered")
            return res.redirect('/login')
          }

          await bcrypt.compare(password, obj[0].password, (err, result) => {
            if(!result) {
              req.flash('danger', 'password wrong')
              return res.redirect('/login')
            } else {
              req.session.isLogin = true
              req.session.user = obj[0].name
              req.session.idUser = obj[0].id
              req.flash('success', 'login success')
              res.redirect('/index')
            }
          })
    } catch (error) {
        console.log(error)
    }
}
function logout(req,res){
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        res.redirect('/login');
    });
}