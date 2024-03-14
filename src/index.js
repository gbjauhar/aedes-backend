import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const app = express();
app.use(express.json());
app.use(cors());

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

app.post("/users", async (req, res) => {
  const { name, email, phone, cpf, address, addressNumber, addressComplement, city, neighbourhood, destinataryName } = req.body;
  const result = await connection.query(
    "INSERT INTO users (name, email, phone, cpf, address, addressNumber, addressComplement, city, neighbourhood, destinataryName) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
    [name, email, phone, cpf, address, addressNumber, addressComplement, city, neighbourhood, destinataryName]
  );

  console.log(result)

  res.send(201);
});

app.get("/users", async (req, res) => {
  const data =  await connection.query(
    "SELECT * FROM users"
  );

  res.send(data)
})

app.post("/frete", async (req, res) => {
  const { cepTo } = req.body
  const data = await axios.post('https://www.melhorenvio.com.br/api/v2/me/shipment/calculate',
    {
      "from": {
        "postal_code": "74371440"
      },
      "to": {
        "postal_code": cepTo
      },
      "package": {
        "height": 18,
        "width": 15,
        "length": 15,
        "weight": 0.4
      }
  }, { headers: {
    Authorization: `Bearer ${process.env.TOKEN}`,
    'Content-Type': 'application/json'
    }})
    res.send(data.data[0])
  })

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running in port ${port}`));