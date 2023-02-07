/** NODEJS EXPRESS */

import express from 'express';
import axios from 'axios';



const app = express();


export interface ProxyResponse {
  email: string;
}

app.get('/punchout/login', async (req, res) => {

  // response fields are snake case
  let response = await axios
    .post("https://punchout.cloud/proxy", {
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


app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});