const router = require('express').Router();
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');
const { Blog, User, Comment} = require('../models');

// ################################ Find all Blogs ################################
router.get('/', async(req,res) => {
    console.log();
    try {
        //console.log(req.session);
        const blogData= await Blog.findAll({
            attributes: ['id','title','content','created_at'],
            include:[
                {
                model:Comment,
                attributes:['id', 'comment_text', 'blog_id', 'user_id', 'created_at'],//changed to created as I check the database

                include: {
                    model:User,
                    attributes:['username']
                }
            },
            {
            model:User,
            attributes:['username'],
            },
        ],
        });
        const blogs = blogData.map(blog => blog.get({ plain:true }));
        res.render('homepage',{
            blogs,
            logginIn:req.session.loggedIn,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});
// ################################ Single Post ################################
router.get('/blogs/:id', async (req, res) => {
    try {
      const blogData = await Blog.findOne({
        where: {
          id: req.params.id,
        },
        attributes: ['id', 'title', 'created_at', 'content', 'user_id'],
        include: [
          {
            model: Comment,
            attributes:['id', 'comment_text', 'blog_id', 'user_id', 'created_at'],
            include: {
              model: User,
              attributes: ['username'],
            },
          },
          {
            model: User,
            attributes: ['username'],
          },
        ],
      });
      if (!blogData) {
        res.status(404).json({ message: 'No blog found with this id' });
        return;
      }
      const blog = blogData.get({ plain: true });
      res.render('single-comment', {
        blog,
        loggedIn: req.session.loggedIn,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

// ################################ Sign Up ################################
router.get('/signup', (req,res) => {
    if (req.sessuib.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
});
// ################################ Log in ################################
router.get('/login', (req,res) => {
    if (req.sessuib.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});
module.exports = router;