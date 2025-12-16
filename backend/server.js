import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://imdb236.p.rapidapi.com/api/imdb/cast/nm0000190/titles', {
      headers: {
        'x-rapidapi-key': 'e016999978msh57f6410d1a9bd68p1876d8jsn1cf6accb5cb2',
        'x-rapidapi-host': 'imdb236.p.rapidapi.com'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));