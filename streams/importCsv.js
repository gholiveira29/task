import { parse } from 'csv-parse';
import fs from 'node:fs';

const csvPath = new URL('./tasks.csv', import.meta.url);
const stream = fs.createReadStream(csvPath);
const headers = { 'Content-Type': 'application/json' }
const csvParse = parse({
    delimiter: ',',
    skipEmptyLines: true,
    fromLine: 2
});

async function csv() {
    const linesParse = stream.pipe(csvParse);
    for await (const line of linesParse) {
        const [title, description] = line;
        await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                title,
                description,
            })
        });
    }
}
csv().then(() => {
    console.log('Importação feita com sucesso!!');
}).catch((error) => {
    console.log(error);
});