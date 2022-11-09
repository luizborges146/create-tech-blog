const router = require('express').Router();
const { User, Blog, Comment } = require('../../models');
const withAuth = require('../../utils/auth');
const sequelize = require('../../config/connection');

// ################################ Get all users Blog ################################
router.get('/', async (req,res) => {
    try{
        const blogData = await Blog.findAll({
            attributes:['id','title','created_at','content'],
            order:[['created_at','DESC']],
            include:[
                {
                    model:Comment,
                    attributes:['id', 'comment_text','user_id','blog_id','created_at'],
                    include:{
                        model: User,
                        attributes:['username'],
                    }
                },
                {
                    model:User,
                    attributes:['username'],
                }
            ],
        });
        res.status(200).json(blogData);
    } catch (err) {
        res.status(500).json(err);
    }
})
// ################################ Blog comment ################################
router.get('/:id', async (req, res) => {
    try {
      //console.log('############################');
      const blogData = await Blog.findOne({
        where: {
          id: req.params.id,
        },
        attributes: ['id', 'title', 'content', 'created_at'],
        include: [
          {
            model: User,
            attributes: ['username'],
          },
          {
            model: Comment,
            attributes: ['id', 'comment_text','user_id','blog_id','created_at'],
            include: {
              model: User,
              attributes: ['username'],
            },
          },
        ],
      });
      res.status(200).json(blogData);
    } catch (err) {
      res.status(500).json(err);
    }
  });
// ################################ Create a Post ################################
router.post('/', withAuth, async (req, res) => {
    try {
      const newBlog = await Blog.create( {
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id
      });
      res.status(200).json(newBlog);
    } catch (err) {
      res.status(400).json(err);
    }
  });
// ################################ update the post #################################
router.put('/:id', withAuth, async (req, res) => {
    try {
      const blogData = await Blog.update(
        req.body,
        {
          title: req.body.title,
          content: req.body.content,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      if (!blogData) {
        res.status(404).json({ message: 'No blog found with this id' });
      }
      res.status(200).json(blogData);
    } catch (err) {
      res.status(500).json(err);
    }
  });
// ################################ delete the post ################################
router.delete('/:id', withAuth, async (req, res) => {
    try {
      const blogData = await Blog.destroy({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });
      if (!blogData) {
        res.status(404).json({ message: 'No blog found with this id!' });
        return;
      }
      res.status(200).json(blogData);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  module.exports = router;
