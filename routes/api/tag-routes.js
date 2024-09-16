const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// GET all tags
router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll({
    attributes: ['id', 'tag_name'], // select tag ID and tag name
    include: [
      {
        model: Product, // include associated products
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'], // select product fields
      },
    ],
  })
    .then((data) => {
      res.json(data); // respond with all found tags and their products
    })
    .catch((err) => {
      res.status(400).json(err); // handle errors and send 400 status code
    });
});

// GET a single tag by id
router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findOne({
    where: {
      id: req.params.id, // get tag id from URL parameters
    },
    attributes: ['id', 'tag_name'], // select tag ID and tag name
    include: [
      {
        model: Product, // include associated products
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'], // select product fields
      },
    ],
  })
    .then((data) => {
      res.json(data); // respond with the tag and its associated products
    })
    .catch((err) => {
      res.status(400).json(err); // handle errors and send 400 status code
    });
});

// POST a new tag
router.post('/', (req, res) => {
  // create a new tag
  Tag.create({ tag_name: req.body.tag_name }) // create a new tag with the name provided in the request body
    .then((data) => {
      res.json(data); // respond with the created tag
    })
    .catch((err) => {
      res.status(400).json(err); // handle errors and send 400 status code
    });
});

// PUT (update) a tag's name by id
router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id, // get the tag id from URL parameters
    },
  })
    .then((data) => {
      res.json(data); // respond with the updated tag
    })
    .catch((err) => {
      res.status(400).json(err); // handle errors and send 400 status code
    });
});

// DELETE a tag by id
router.delete('/:id', (req, res) => {
  // delete one tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id, // get the tag id from URL parameters
    },
  })
    .then((data) => {
      res.json(data); // respond with the result of the deletion
    })
    .catch((err) => {
      res.status(400).json(err); // handle errors and send 400 status code
    });
});

module.exports = router;
