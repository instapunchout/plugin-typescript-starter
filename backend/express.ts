/** NODEJS EXPRESS */

import express from 'express';
import axios from 'axios';



const app = express();


export interface ProxyResponse {
  email: string;
  punchout_id: string;
}

// will be called by the procurement system
// proxies all requests to punchout.cloud
app.get('/punchout/cxml/:id', async (req, res) => {
  // the req.body is an xml string
  let response = await axios
    .post("https://punchout.cloud/cxml/" + req.params.id, req.body);

  res.setHeader('Content-Type', 'text/xml');
  res.send(response.data);
});


// will be called by the frontend app after the url /punchout/:id is opened in browser
app.post('/punchout/login', async (req, res) => {

  // response fields are snake case
  let response = await axios
    .post<ProxyResponse>("https://punchout.cloud/proxy", {
      headers: {},
      server: {},
      body: "",
      query: { id: req.body.punchoutId },
    });



  const email = response.data.email;
  const punchoutId = response.data.punchout_id;

  const token = 'TODO'; // generate jwt token for that email and punchoutId

  res.json({ token, punchoutId });

});


// will be called by frontend app, the request should contain the cart object
// the cart strucutre is be defined by the shop and communicated to instapunchout for configuration
// returns the data needed to send back to the procurement system 
app.post('/punchout/cart', async (req, res) => {

  let punchoutId = ''// from jwt or from req.query.punchoutId;

  const response = await axios.post('https://punchout.cloud/cart/' + punchoutId, {
    body: req.body,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  res.json(response.data);

});


declare type Order;

// will be called by the instapunchout to create the order
// the order strucutre is be defined by the shop and communicated to instapunchout for configuration
app.post('/punchout/order', async (req, res) => {

  // authenticate that the request came from us
  const response = await axios.post('https://punchout.cloud/authorize', {
    body: { authorization: req.query.authorization },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (response.data.authorized) {

    // TODO:  create order in your system

    let order = createOrder(req.body);

    res.json(order);

  } else {

    throw new Error('Unauthorized');

  }

});
