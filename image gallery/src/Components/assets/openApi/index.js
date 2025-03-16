const OpenAI = require('openai');
const client = new OpenAI({
    baseURL: 'https://api.studio.nebius.com/v1/',
    apiKey: process.env.FLUX_API_KEY,
});

client.images.generate({
  "model": "black-forest-labs/flux-schnell",
  "prompt": "A futuristic cityscape with neon lights and flying cars",
  "size": "1024x1024",
  "n": 1
})
    .then((response) => console.log(response))
    .catch((error) => console.error("Error generating image:", error));
