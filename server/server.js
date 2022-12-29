import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

//Configuração do OpenAIApi
const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);
//Configuração do CORS (usado pra endpoint de API)
const app = express();
app.use(cors());
app.use(express.json());

//Gera uma rota de Post no Index
app.post('/', async (req, res) => { //req = request | res = response
    try {
        //pega o prompt do usuário do frontend
        const prompt = req.body.prompt;
        
        //gera a resposta
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0.9, //Seriedade
            max_tokens: 4000, //Maximo de caracteres de resposta
            top_p: 1,
            frequency_penalty: 1, //Penalidade pra repetir frases
            presence_penalty: 0 //Penalidade pra cada caractere de resposta
        });

        //envia a resposta de volta pro frontend
        res.status(200).send({
            bot: response.data.choices[0].text
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error || 'Something went wrong');
    }
})

//Inicia o server
app.listen(5000, () => console.log('Server is running on https://chatbot-eebe.onrender.com'));