const express = require('express');
const shipping = require('./shipping');
const inventory = require('./inventory');
const rating = require('./rating');
const cors = require('cors');
const client = require('./shipping');

const app = express();
app.use(cors());

/**
 * Retorna a lista de produtos da loja via InventoryService
 */
app.get('/products', (req, res, next) => {
    inventory.SearchAllProducts(null, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'something failed :(' });
        } else {
            res.json(data.products);
        }
    });
});

/**
 * Consulta o frete de envio no ShippingService
 */
app.get('/shipping/:cep', (req, res, next) => {
    shipping.GetShippingRate(
        {
            cep: req.params.cep,
        },
        (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send({ error: 'something failed :(' });
            } else {
                res.json({
                    cep: req.params.cep,
                    value: data.value,
                });
            }
        }
    );
});

// Rota: GET /rating/:id
app.get('/rating/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  rating.GetRating({ productId: id }, (err, response) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: 'something failed :(' });
    }

    res.json(response);
  });
});


/**
 * Inicia o router
 */
app.listen(3000, () => {
    console.log('Controller Service running on http://127.0.0.1:3000');
});
