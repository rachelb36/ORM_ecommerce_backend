const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
  // find all products
  // be sure to include its associated Category and Tag data
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag, through: ProductTag }
      ]
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a single product by it's 'id'.   Include its associated Category and Tag data
router.get('/:id', async (req, res) => {
  try {
      const productData = await Product.findByPk(req.params.id, {
        include:  [
          { model: Category },
          { model: Tag, through: ProductTag }
        ]
    });

    if(!productData)  {
      res.status(404).json({ message: 'No product found with that ID!'});
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
    router.post('/', async (req, res) => {
      try {
        const product = await Product.create(req.body);
        
        if (req.body.tagIds.length) {
          const productTagIdArr = req.body.tagIds.map((tag_id) => {
            return {
              product_id: product.id,
              tag_id,
            };
          });
          const productTags = await ProductTag.bulkCreate(productTagIdArr);
          return res.status(200).json({ product, productTags });
        }
    
        res.status(200).json(product);
      } catch (err) {
        console.log(err);
        res.status(400).json(err);
      }
    });

// update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    let productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });

    if (req.body.tagIds) {
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds.filter((tag_id) => !productTagIds.includes(tag_id)).map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });

      const productTagsToRemove = productTags.filter(({ tag_id }) => !req.body.tagIds.includes(tag_id)).map(({ id }) => id);

      await ProductTag.bulkCreate(newProductTags);
      await ProductTag.destroy({ where: { id: productTagsToRemove } });
    }

    res.json(product);
  } catch (err) {
      res.status(400).json(err);
  }
});
  // delete one product by its `id` value
  router.delete('/:id', async (req, res) => {
    try {
      const productData = await Product.destroy({
        where: {
          id: req.params.id
        }
      });
  
      if (!productData) {
        res.status(404).json({ message: 'No product found with that ID!' });
        return;
      }
  
      res.status(200).json(productData);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

module.exports = router;
