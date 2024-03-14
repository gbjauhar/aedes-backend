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
    Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiODNhMGM2MGM5MmIxMjcwNDk1M2NhYjY1MjMyNjNmMTljZjQ3MDU3MTI4YTUyMTBhNTk3NDdlNDM2MmM0MzRlNmY3ZjM5YTQzM2IwZTQxYWIiLCJpYXQiOjE3MTA0NTE3MTAuNzc4MzA2LCJuYmYiOjE3MTA0NTE3MTAuNzc4MzA3LCJleHAiOjE3NDE5ODc3MTAuNzU4MzEyLCJzdWIiOiI5YjkwOGM5My1lYjY5LTQzMzQtYmVjYi04YTIwOGU1Yzk0YTgiLCJzY29wZXMiOlsic2hpcHBpbmctY2FsY3VsYXRlIl19.I36cFZcuapffbRsK6lP2on-DW_hEpZO-Ihl04299cCVbs-pbEoZD9Ffj0Lct1ru5P5rvmU4IZK9LmelzXv65hiPv-dBzdUkS0RcgiYVADmpofQF4QqRAanHFSlaJO_IMQV9pN4mRavT4JKx_CpH5fIrQJdzTnGxu0O7MLTMhn9NYRqeXXLCsnNCbV8wcrL2GYNxV0bZCW3M5-69UNkUm680_kL1UVCpfSn4N51daJUdS8yzV6VYFGvKkpiF-teHCEkpv-tWE7UWOlmBDrgW8OuMXiYgRabwY30zsaRjkxdzvy27UoWWAjCaqfkn5_i_u9Io06-XsBdgzQq9J9QYxJjDgdQ14dWLxVd2E18JOJ4BAALExCg9bMwsVV1x5a9194-fzkpG03scMDb0rMuSBy9xP2lhFEEB_FrX5D6DE1F6IdKIhjwbXfEG-Fv7mRyP0vVPXR6kexzc6PqcLx5kjN1mlDfeBWT4J3n1pjn4H5yx8BcuBleXZ0W0EX1I6Q3UpeQXfsSJzKsJgk3pH7bOS2fjFA09MrHjhIXOXHNZr9BiS9UdJIeqGevGtYrZqChs7oYnc8P3Aa9P8WSyfiAoNEJkURR7J1HM07VSi0X42DiiSX3v0WzdL3LDoMz8TZT0yqtAd26zeGQXdowB75BJnB4xifc1joOLYc9fD4FP0wHA',
    'Content-Type': 'application/json'
    }})
    res.send(data.data[0])
  })

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running in port ${port}`));