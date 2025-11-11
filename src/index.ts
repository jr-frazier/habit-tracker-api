// src/index.ts
import app from './server.ts';
import { env } from '../env.ts'

const port = env.PORT;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});